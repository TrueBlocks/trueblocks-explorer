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

type EncodeTransactionRequest struct {
	ContractAddress string   `json:"contractAddress"`
	Signature       string   `json:"signature"`
	Arguments       []string `json:"arguments"`
}

type EncodeTransactionResult struct {
	Success bool   `json:"success"`
	Data    string `json:"data"`
	Error   string `json:"error,omitempty"`
}

type ConvertTokenAmountRequest struct {
	TokenAddress string `json:"tokenAddress"`
	Amount       string `json:"amount"`
}

type ConvertTokenAmountResult struct {
	Success   bool   `json:"success"`
	WeiAmount string `json:"weiAmount"`
	Decimals  uint64 `json:"decimals"`
	Error     string `json:"error,omitempty"`
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

func (a *App) EncodeTransaction(payload *types.Payload, req EncodeTransactionRequest) (*EncodeTransactionResult, error) {
	logging.LogBackend(fmt.Sprintf("EncodeTransaction CALLED - Contract: %s, Signature: %s, Args: %v",
		req.ContractAddress, req.Signature, req.Arguments))

	chain := payload.ActiveChain
	if chain == "" {
		chain = "mainnet"
	}

	// Use SDK to encode transaction
	data, err := sdk.EncodeTransaction(sdk.TransactionEncodeRequest{
		Chain:           chain,
		ContractAddress: req.ContractAddress,
		Signature:       req.Signature,
		Arguments:       req.Arguments,
	})
	if err != nil {
		logging.LogBEError(fmt.Sprintf("Failed to encode transaction: %v", err))
		return &EncodeTransactionResult{
			Success: false,
			Error:   fmt.Sprintf("Failed to encode transaction: %v", err),
		}, nil
	}

	logging.LogBackend(fmt.Sprintf("Transaction encoded successfully: %s", data))
	return &EncodeTransactionResult{
		Success: true,
		Data:    data,
	}, nil
}

func (a *App) ConvertTokenAmount(payload *types.Payload, req ConvertTokenAmountRequest) (*ConvertTokenAmountResult, error) {
	logging.LogBackend(fmt.Sprintf("ConvertTokenAmount CALLED - Token: %s, Amount: %s",
		req.TokenAddress, req.Amount))

	chain := payload.ActiveChain
	if chain == "" {
		chain = "mainnet"
	}

	// Query token decimals - MUST succeed, no fallbacks
	opts := &sdk.TokensOptions{
		Addrs: []string{req.TokenAddress},
		Parts: sdk.TPDecimals,
	}
	opts.Chain = chain

	tokens, _, err := opts.Tokens()
	if err != nil {
		logging.LogBEError(fmt.Sprintf("Failed to query token decimals: %v", err))
		return &ConvertTokenAmountResult{
			Success: false,
			Error:   fmt.Sprintf("Failed to query token decimals: %v", err),
		}, nil
	}
	if len(tokens) == 0 {
		logging.LogBEError("No token data returned")
		return &ConvertTokenAmountResult{
			Success: false,
			Error:   "No token data returned - invalid token address?",
		}, nil
	}
	if tokens[0].Decimals == 0 {
		logging.LogBEError("Token decimals is 0")
		return &ConvertTokenAmountResult{
			Success: false,
			Error:   "Token decimals is 0 - invalid or non-standard token",
		}, nil
	}

	decimals := tokens[0].Decimals
	logging.LogBackend(fmt.Sprintf("Token decimals: %d", decimals))

	// Convert human-readable amount to wei using chifra's WeiFromFloatString
	weiAmount, err := base.WeiFromFloatString(req.Amount, int(decimals))
	if err != nil {
		logging.LogBEError(fmt.Sprintf("Failed to convert amount to wei: %v", err))
		return &ConvertTokenAmountResult{
			Success: false,
			Error:   fmt.Sprintf("Failed to convert amount to wei: %v", err),
		}, nil
	}

	result := &ConvertTokenAmountResult{
		Success:   true,
		WeiAmount: weiAmount.String(),
		Decimals:  decimals,
	}
	logging.LogBackend(fmt.Sprintf("Converted %s to wei: %s (decimals=%d)", req.Amount, result.WeiAmount, decimals))

	return result, nil
}
