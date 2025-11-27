package rpc

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// GasEstimationResult contains gas estimate and current gas price
type GasEstimationResult struct {
	Success     bool   `json:"success"`
	GasEstimate string `json:"gasEstimate"`
	GasPrice    string `json:"gasPrice"`
	Error       string `json:"error,omitempty"`
}

// EstimateTransactionGas provides universal gas estimation and gas price for any transaction
func EstimateTransactionGas(payload *types.Payload, txPayload TransactionPayload) (*GasEstimationResult, error) {
	chain := payload.ActiveChain
	if chain == "" {
		chain = "mainnet"
	}

	// Get RPC provider for the specified chain
	rpcProvider, err := GetRPCProviderForChain(chain)
	if err != nil {
		return &GasEstimationResult{
			Error: fmt.Sprintf("Failed to get RPC provider for chain %s: %v", chain, err),
		}, nil
	}

	// Estimate gas using eth_estimateGas
	gasEstimate, err := estimateTransactionGas(rpcProvider, txPayload)
	if err != nil {
		logging.LogBEWarning(fmt.Sprintf("Failed to estimate gas: %v", err))
		// Use conservative fallback
		gasEstimate = "0x186a0" // 100000 in hex
	}

	// Get current gas price using eth_gasPrice
	gasPrice, err := getGasPriceForChain(rpcProvider)
	if err != nil {
		logging.LogBEWarning(fmt.Sprintf("Failed to get gas price: %v", err))
		// Use conservative fallback: 15 gwei
		gasPrice = "0x37e11d600" // 15 * 1e9 in hex
	}

	return &GasEstimationResult{
		Success:     true,
		GasEstimate: gasEstimate,
		GasPrice:    gasPrice,
	}, nil
}

// estimateTransactionGas calls eth_estimateGas for any transaction
func estimateTransactionGas(rpcProvider string, payload TransactionPayload) (string, error) {
	request := RPCRequest{
		JSONRPC: "2.0",
		ID:      1,
		Method:  "eth_estimateGas",
		Params: []interface{}{
			map[string]string{
				"from":  payload.From,
				"to":    payload.To,
				"data":  payload.Data,
				"value": payload.Value,
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

	return "0x186a0", nil // Default to 100000 if no result
}

// getGasPriceForChain gets current gas price using eth_gasPrice RPC call
func getGasPriceForChain(rpcProvider string) (string, error) {
	request := RPCRequest{
		JSONRPC: "2.0",
		ID:      2,
		Method:  "eth_gasPrice",
		Params:  []interface{}{},
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

	return "0x37e11d600", nil // Default to 15 gwei if no result
}
