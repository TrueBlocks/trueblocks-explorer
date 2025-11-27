package rpc

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// ApprovalTransactionData contains the data needed to prepare an approval transaction
type ApprovalTransactionData struct {
	TokenAddress   string `json:"tokenAddress"`
	SpenderAddress string `json:"spenderAddress"`
	OwnerAddress   string `json:"ownerAddress"`
	Amount         string `json:"amount"`
}

// ApprovalTransactionResult contains the prepared transaction data and simulation results
type ApprovalTransactionResult struct {
	Success         bool   `json:"success"`
	TransactionData string `json:"transactionData"`
	GasEstimate     string `json:"gasEstimate"`
	GasPrice        string `json:"gasPrice"`
	GasUsed         string `json:"gasUsed"`
	NewAllowance    string `json:"newAllowance"`
	Error           string `json:"error,omitempty"`
}

func PrepareApprovalTransaction(payload *types.Payload, data ApprovalTransactionData) (*ApprovalTransactionResult, error) {
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

	transactionData, err := createApprovalTransactionData(data.SpenderAddress, data.Amount)
	if err != nil {
		result.Error = fmt.Sprintf("Failed to create transaction data: %v", err)
		return result, nil
	}
	result.TransactionData = transactionData

	chain := payload.ActiveChain
	if chain == "" {
		chain = "mainnet" // Default to mainnet if not specified
	}
	txPayload := TransactionPayload{
		Chain: chain,
		From:  data.OwnerAddress,
		To:    data.TokenAddress,
		Data:  transactionData,
		Value: "0x0",
	}
	gasResult, err := EstimateTransactionGas(payload, txPayload)
	if err != nil || !gasResult.Success {
		logging.LogBEWarning(fmt.Sprintf("Failed to estimate gas: %v", err))
		// Gas estimation failure is not critical - use defaults
		result.GasEstimate = "0xea60"   // 60000 in hex
		result.GasPrice = "0x4a817c800" // 20 gwei converted to wei in hex
	} else {
		result.GasEstimate = gasResult.GasEstimate
		result.GasPrice = gasResult.GasPrice
	}

	result.Success = true
	return result, nil
}

func createApprovalTransactionData(spender, amount string) (string, error) {
	if amountWei, err := convertToWei(amount); err == nil {
		selector := "0x095ea7b3"
		spenderPadded := padLeft(removeHexPrefix(spender), 64)
		amountPadded := padLeft(amountWei, 64)
		return selector + spenderPadded + amountPadded, nil
	} else {
		return "", err
	}
}
