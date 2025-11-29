// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package app

import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

type ApprovalTransactionData struct {
	TokenAddress   string `json:"tokenAddress"`
	SpenderAddress string `json:"spenderAddress"`
	OwnerAddress   string `json:"ownerAddress"`
	Amount         string `json:"amount"`
}

type ApprovalTransactionResult struct {
	Success         bool   `json:"success"`
	TransactionData string `json:"transactionData"`
	GasEstimate     string `json:"gasEstimate"`
	GasPrice        string `json:"gasPrice"`
	GasUsed         string `json:"gasUsed"`
	NewAllowance    string `json:"newAllowance"`
	Error           string `json:"error,omitempty"`
}

type TransactionPayload struct {
	Chain string `json:"chain"`
	From  string `json:"from"`
	To    string `json:"to"`
	Data  string `json:"data"`
	Value string `json:"value"`
}

type GasEstimationResult struct {
	Success     bool   `json:"success"`
	GasEstimate string `json:"gasEstimate"`
	GasPrice    string `json:"gasPrice"`
	Error       string `json:"error,omitempty"`
}

func (a *App) PrepareApprovalTransaction(payload *types.Payload, data ApprovalTransactionData) (*ApprovalTransactionResult, error) {
	logging.LogBackend(fmt.Sprintf("PrepareApprovalTransaction CALLED - Token: %s, Spender: %s, Owner: %s, Amount: %s",
		data.TokenAddress, data.SpenderAddress, data.OwnerAddress, data.Amount))

	result := &ApprovalTransactionResult{
		NewAllowance: data.Amount,
	}

	chain := payload.ActiveChain
	if chain == "" {
		chain = "mainnet"
	}

	transactionData, err := createApprovalTransactionData(chain, data.TokenAddress, data.SpenderAddress, data.Amount)
	if err != nil {
		logging.LogBEError(fmt.Sprintf("Failed to create transaction data: %v", err))
		result.Error = fmt.Sprintf("Failed to create transaction data: %v", err)
		return result, nil
	}
	result.TransactionData = transactionData
	logging.LogBackend(fmt.Sprintf("Transaction data created: %s", transactionData))

	fromAddr := base.HexToAddress(data.OwnerAddress)
	toAddr := base.HexToAddress(data.TokenAddress)
	valueWei := base.NewWei(0)

	logging.LogBackend("=== GAS ESTIMATION DEBUG ===")
	logging.LogBackend(fmt.Sprintf("Chain: %s", chain))
	logging.LogBackend(fmt.Sprintf("From (owner): %s", fromAddr.Hex()))
	logging.LogBackend(fmt.Sprintf("To (token): %s", toAddr.Hex()))
	logging.LogBackend(fmt.Sprintf("Data: %s", transactionData))
	logging.LogBackend(fmt.Sprintf("Value: %s", valueWei.String()))
	logging.LogBackend(fmt.Sprintf("Data length: %d bytes", len(transactionData)))
	logging.LogBackend("Expected gas for ERC20 approve: 46000-50000")
	logging.LogBackend("Calling eth_estimateGas via SDK...")

	estimatedGas, gasPrice, err := sdk.EstimateGasAndPrice(chain, fromAddr, toAddr, transactionData, valueWei)
	if err != nil {
		logging.LogBEError(fmt.Sprintf("SDK.EstimateGasAndPrice FAILED: %v", err))
		result.Success = false
		result.Error = fmt.Sprintf("Failed to estimate gas for approval transaction: %v. Please check your RPC connection and try again.", err)
		return result, nil
	}

	logging.LogBackend(fmt.Sprintf("RPC RESPONSE: estimatedGas=%d (0x%x), gasPrice=%d (0x%x)",
		estimatedGas, estimatedGas, gasPrice, gasPrice))

	gasDeficit := int64(46000) - int64(estimatedGas)
	deficitPercent := (float64(gasDeficit) / 46000.0) * 100.0
	logging.LogBackend(fmt.Sprintf("GAS ANALYSIS: Expected ~46K, got %d - deficit: %d gas (%.1f%% too low)",
		estimatedGas, gasDeficit, deficitPercent))

	// Add 20% safety buffer to gas estimate - RPC nodes often underestimate token operations
	bufferedGas := estimatedGas * 120 / 100
	bufferAdded := bufferedGas - estimatedGas
	result.GasEstimate = fmt.Sprintf("0x%x", bufferedGas)
	result.GasPrice = fmt.Sprintf("0x%x", gasPrice)
	logging.LogBackend(fmt.Sprintf("BUFFERED GAS: raw=%d, buffer=+%d (+20%%), final=%d (0x%x)",
		estimatedGas, bufferAdded, bufferedGas, bufferedGas))
	logging.LogBackend("=== END GAS ESTIMATION DEBUG ===")

	result.Success = true
	return result, nil
}

func (a *App) EstimateGasAndPrice(payload *types.Payload, txPayload TransactionPayload) (*GasEstimationResult, error) {
	logging.LogBackend(fmt.Sprintf("EstimateGasAndPrice CALLED - From: %s, To: %s, Data length: %d",
		txPayload.From, txPayload.To, len(txPayload.Data)))

	chain := payload.ActiveChain
	if chain == "" {
		chain = "mainnet"
	}
	logging.LogBackend(fmt.Sprintf("Using chain: %s", chain))

	fromAddr := base.HexToAddress(txPayload.From)
	toAddr := base.HexToAddress(txPayload.To)

	var valueWei *base.Wei
	if txPayload.Value == "" || txPayload.Value == "0" || txPayload.Value == "0x0" {
		valueWei = base.NewWei(0)
	} else {
		wei := base.MustParseWei(txPayload.Value)
		valueWei = &wei
	}

	logging.LogBackend("Calling SDK.EstimateGasAndPrice for transaction")
	estimatedGas, gasPrice, err := sdk.EstimateGasAndPrice(chain, fromAddr, toAddr, txPayload.Data, valueWei)
	if err != nil {
		logging.LogBEError(fmt.Sprintf("SDK.EstimateGasAndPrice FAILED: %v", err))
		return &GasEstimationResult{
			Success: false,
			Error:   fmt.Sprintf("Failed to estimate gas: %v. Please check your RPC connection and try again.", err),
		}, nil
	}

	result := &GasEstimationResult{
		Success:     true,
		GasEstimate: fmt.Sprintf("0x%x", estimatedGas),
		GasPrice:    fmt.Sprintf("0x%x", gasPrice),
	}
	logging.LogBackend(fmt.Sprintf("SDK.EstimateGasAndPrice SUCCESS - Gas: %s, Price: %s", result.GasEstimate, result.GasPrice))

	return result, nil
}

func createApprovalTransactionData(chain, tokenAddress, spender, amount string) (string, error) {
	amountWei, err := convertToWei(chain, tokenAddress, amount)
	if err != nil {
		return "", err
	}

	selector := "0x095ea7b3"
	spenderPadded := padLeft(removeHexPrefix(spender), 64)
	amountPadded := padLeft(amountWei, 64)
	return selector + spenderPadded + amountPadded, nil
}

func convertToWei(chain, tokenAddress, amount string) (string, error) {
	if amount == "0" || amount == "" {
		return "0", nil
	}

	// Get token decimals from SDK (with caching)
	opts := &sdk.TokensOptions{
		Addrs: []string{tokenAddress},
		Parts: sdk.TPDecimals,
	}
	opts.Chain = chain

	tokens, _, err := opts.Tokens()
	decimals := uint64(18) // ERC20 spec default
	if err == nil && len(tokens) > 0 && tokens[0].Decimals > 0 {
		decimals = tokens[0].Decimals
	}

	logging.LogBackend(fmt.Sprintf("Token %s decimals: %d, converting amount: %s", tokenAddress, decimals, amount))

	// Convert using base package
	wei, err := base.WeiFromFloatString(amount, int(decimals))
	if err != nil {
		return "", fmt.Errorf("failed to convert amount to wei: %w", err)
	}

	// Return as hex string without 0x prefix
	hexResult := wei.Text(16)
	logging.LogBackend(fmt.Sprintf("Converted %s (decimals=%d) to wei: %s (hex: %s)", amount, decimals, wei.String(), hexResult))
	return hexResult, nil
}

func removeHexPrefix(hex string) string {
	if len(hex) >= 2 && hex[:2] == "0x" {
		return hex[2:]
	}
	return hex
}

func padLeft(str string, length int) string {
	str = strings.TrimPrefix(str, "0x")
	if len(str) >= length {
		return str[len(str)-length:]
	}

	padding := make([]byte, length-len(str))
	for i := range padding {
		padding[i] = '0'
	}

	return string(padding) + str
}
