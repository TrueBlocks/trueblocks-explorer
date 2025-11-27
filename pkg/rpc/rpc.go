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

// TransactionPayload contains transaction data with chain context for preparation operations
type TransactionPayload struct {
	Chain string `json:"chain"`
	From  string `json:"from"`
	To    string `json:"to"`
	Data  string `json:"data"`
	Value string `json:"value"`
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

func GetRPCProvider() (string, error) {
	return GetRPCProviderForChain("mainnet")
}

func GetRPCProviderForChain(chainIdentifier string) (string, error) {
	userPrefs, err := preferences.GetUserPreferences()
	if err != nil {
		return "", fmt.Errorf("failed to get user preferences: %w", err)
	}

	if len(userPrefs.Chains) == 0 {
		return "", fmt.Errorf("no chains configured")
	}

	// Find matching chain by identifier
	for _, chain := range userPrefs.Chains {
		// Match by chain name or chainId
		if chain.Chain == chainIdentifier ||
			(chainIdentifier == "mainnet" && chain.ChainId == 1) ||
			(chainIdentifier == "polygon" && chain.ChainId == 137) ||
			(chainIdentifier == "arbitrum" && chain.ChainId == 42161) {
			for _, rpcUrl := range chain.RpcProviders {
				// Test RPC connectivity
				result, err := rpc.PingRpc(rpcUrl)
				if err == nil && result.OK {
					return rpcUrl, nil
				}
			}
		}
	}

	// Fallback to LlamaRPC for mainnet only
	if chainIdentifier == "mainnet" {
		logging.LogBEWarning("No working RPC found in user preferences, falling back to LlamaRPC")
		return "https://eth.llamarpc.com", nil
	}

	return "", fmt.Errorf("no valid RPC endpoints found for chain: %s", chainIdentifier)
}

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
