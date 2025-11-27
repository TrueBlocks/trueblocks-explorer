// Package rpc provides utilities for RPC availability, status checking, and wallet operations
package rpc

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/rpc"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
)

// RPCRequest represents a JSON-RPC request
type RPCRequest struct {
	JSONRPC string        `json:"jsonrpc"`
	ID      int           `json:"id"`
	Method  string        `json:"method"`
	Params  []interface{} `json:"params"`
}

// RPCResponse represents a JSON-RPC response
type RPCResponse struct {
	JSONRPC string      `json:"jsonrpc"`
	ID      int         `json:"id"`
	Result  interface{} `json:"result,omitempty"`
	Error   *RPCError   `json:"error,omitempty"`
}

// RPCError represents a JSON-RPC error
type RPCError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Data    string `json:"data,omitempty"`
}

// ApprovalTransactionData contains the data needed to prepare an approval transaction
type ApprovalTransactionData struct {
	TokenAddress   string `json:"tokenAddress"`
	SpenderAddress string `json:"spenderAddress"`
	OwnerAddress   string `json:"ownerAddress"`
	Amount         string `json:"amount"` // "0" for revokes
}

// ApprovalTransactionResult contains the prepared transaction data and simulation results
type ApprovalTransactionResult struct {
	Success          bool   `json:"success"`
	TransactionData  string `json:"transactionData"`
	GasEstimate      string `json:"gasEstimate"`
	CurrentAllowance string `json:"currentAllowance"`
	NewAllowance     string `json:"newAllowance"`
	Error            string `json:"error,omitempty"`
}

func CheckRpc() error {
	_, err := CheckRPCStatus()
	if err != nil {
		logging.LogError("RPC unavailable", err)
		return fmt.Errorf("RPC unavailable: %w", err)
	}
	return nil
}

func CheckRPCStatus() (string, error) {
	if userPrefs, err := preferences.GetUserPreferences(); err != nil {
		return "", fmt.Errorf("failed to get user preferences: %w", err)
	} else {
		if len(userPrefs.Chains) == 0 {
			return "", fmt.Errorf("no chains configured")
		}

		var workingRPCs []string
		var failedChains []string

		for _, chain := range userPrefs.Chains {
			chainHasWorkingRPC := false
			for _, rpcUrl := range chain.RpcProviders {
				result, err := rpc.PingRpc(rpcUrl)
				if err == nil && result.OK {
					workingRPCs = append(workingRPCs, rpcUrl)
					chainHasWorkingRPC = true
					break // Found working RPC for this chain, move to next chain
				}
			}
			if !chainHasWorkingRPC {
				failedChains = append(failedChains, chain.Chain)
			}
		}

		if len(failedChains) > 0 {
			err := fmt.Errorf("chains without valid RPC: %v", failedChains)
			logging.LogError("Some chains have no valid RPC endpoints", err)
			return "", err
		}

		if len(workingRPCs) > 0 {
			return workingRPCs[0], nil
		}

		return "", fmt.Errorf("no valid RPC endpoints found")
	}
}

// PrepareApprovalTransaction prepares an ERC20 approval transaction by calling RPC methods
func PrepareApprovalTransaction(data ApprovalTransactionData) (*ApprovalTransactionResult, error) {
	// Get RPC endpoint from user preferences
	rpcProvider, err := GetRPCProvider()
	if err != nil {
		logging.LogBEWarning(fmt.Sprintf("Failed to get RPC provider: %v", err))
		return &ApprovalTransactionResult{
			Error: fmt.Sprintf("Failed to get RPC provider: %v", err),
		}, nil
	}

	logging.LogBackend(fmt.Sprintf("Wallet API: Using RPC provider: %s", rpcProvider))

	result := &ApprovalTransactionResult{
		NewAllowance: data.Amount,
	}

	// Get current allowance
	currentAllowance, err := getCurrentAllowance(rpcProvider, data.TokenAddress, data.OwnerAddress, data.SpenderAddress)
	if err != nil {
		logging.LogBEWarning(fmt.Sprintf("Failed to get current allowance: %v", err))
		result.Error = fmt.Sprintf("Failed to get current allowance: %v", err)
		return result, nil // Return result with error instead of failing
	}
	result.CurrentAllowance = currentAllowance

	// Create transaction data
	transactionData, err := createApprovalTransactionData(data.SpenderAddress, data.Amount)
	if err != nil {
		result.Error = fmt.Sprintf("Failed to create transaction data: %v", err)
		return result, nil
	}
	result.TransactionData = transactionData

	// Estimate gas
	gasEstimate, err := estimateApprovalGas(rpcProvider, data.TokenAddress, data.OwnerAddress, transactionData)
	if err != nil {
		logging.LogBEWarning(fmt.Sprintf("Failed to estimate gas: %v", err))
		// Gas estimation failure is not critical - use default
		result.GasEstimate = "0xea60" // 60000 in hex
	} else {
		result.GasEstimate = gasEstimate
	}

	result.Success = true
	return result, nil
}

// GetRPCProvider returns the RPC endpoint URL for the current chain
func GetRPCProvider() (string, error) {
	userPrefs, err := preferences.GetUserPreferences()
	if err != nil {
		return "", fmt.Errorf("failed to get user preferences: %w", err)
	}

	if len(userPrefs.Chains) == 0 {
		return "", fmt.Errorf("no chains configured")
	}

	// Find the first working RPC provider
	for _, chain := range userPrefs.Chains {
		// For now, assume we want Ethereum mainnet (chainId 1)
		// TODO: Make this configurable based on the target chain
		if chain.ChainId == 1 {
			for _, rpcUrl := range chain.RpcProviders {
				// Test RPC connectivity
				result, err := rpc.PingRpc(rpcUrl)
				if err == nil && result.OK {
					return rpcUrl, nil
				}
			}
		}
	}

	// Fallback to LlamaRPC if no configured RPC works
	logging.LogBEWarning("No working RPC found in user preferences, falling back to LlamaRPC")
	return "https://eth.llamarpc.com", nil
}

// getCurrentAllowance calls eth_call to get the current ERC20 allowance
func getCurrentAllowance(rpcProvider, tokenAddress, ownerAddress, spenderAddress string) (string, error) {
	// ERC20 allowance(owner, spender) function selector: 0xdd62ed3e
	// Pad addresses to 32 bytes each
	ownerPadded := padLeft(removeHexPrefix(ownerAddress), 64)
	spenderPadded := padLeft(removeHexPrefix(spenderAddress), 64)
	data := "0xdd62ed3e" + ownerPadded + spenderPadded

	request := RPCRequest{
		JSONRPC: "2.0",
		ID:      1,
		Method:  "eth_call",
		Params: []interface{}{
			map[string]string{
				"to":   tokenAddress,
				"data": data,
			},
			"latest",
		},
	}

	response, err := makeRPCRequest(rpcProvider, request)
	if err != nil {
		return "", err
	}

	if response.Error != nil {
		return "", fmt.Errorf("RPC error: %s", response.Error.Message)
	}

	if result, ok := response.Result.(string); ok {
		return result, nil
	}

	return "0x0", nil
}

// createApprovalTransactionData creates the transaction data for an ERC20 approve call
func createApprovalTransactionData(spenderAddress, amount string) (string, error) {
	// ERC20 approve(spender, amount) function selector: 0x095ea7b3
	functionSelector := "095ea7b3"

	// Pad spender address to 32 bytes
	spenderPadded := padLeft(removeHexPrefix(spenderAddress), 64)

	// Convert amount to wei (assume 18 decimals) and pad to 32 bytes
	amountWei, err := convertToWei(amount)
	if err != nil {
		return "", err
	}
	amountPadded := padLeft(amountWei, 64)

	return "0x" + functionSelector + spenderPadded + amountPadded, nil
}

// estimateApprovalGas calls eth_estimateGas for the approval transaction
func estimateApprovalGas(rpcProvider, tokenAddress, fromAddress, data string) (string, error) {
	request := RPCRequest{
		JSONRPC: "2.0",
		ID:      2,
		Method:  "eth_estimateGas",
		Params: []interface{}{
			map[string]string{
				"from": fromAddress,
				"to":   tokenAddress,
				"data": data,
			},
		},
	}

	response, err := makeRPCRequest(rpcProvider, request)
	if err != nil {
		return "", err
	}

	if response.Error != nil {
		return "", fmt.Errorf("RPC error: %s", response.Error.Message)
	}

	if result, ok := response.Result.(string); ok {
		return result, nil
	}

	return "0xea60", nil // Default to 60000 if no result
}

// makeRPCRequest makes a JSON-RPC request to the provider
func makeRPCRequest(rpcProvider string, request RPCRequest) (*RPCResponse, error) {
	jsonData, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(rpcProvider, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var response RPCResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, err
	}

	return &response, nil
}

// convertToWei converts a decimal amount to wei (assumes 18 decimals)
func convertToWei(amount string) (string, error) {
	if amount == "0" || amount == "" {
		return "0", nil
	}

	// For now, assume amount is already in wei format or handle simple cases
	// TODO: Implement proper decimal conversion if needed
	if amount == "0" {
		return "0", nil
	}

	// Return as-is for now, proper decimal handling can be added later
	return amount, nil
}

// Helper functions

func removeHexPrefix(hex string) string {
	if len(hex) >= 2 && hex[:2] == "0x" {
		return hex[2:]
	}
	return hex
}

func padLeft(str string, length int) string {
	if len(str) >= length {
		return str[len(str)-length:]
	}

	padding := make([]byte, length-len(str))
	for i := range padding {
		padding[i] = '0'
	}

	return string(padding) + str
}
