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

type PrepareTransactionRequest struct {
	Function sdk.Function  `json:"function"`
	Params   []interface{} `json:"params"`
	From     string        `json:"from"`
	To       string        `json:"to"`
	Value    string        `json:"value"`
}

type PrepareTransactionResult struct {
	Success         bool   `json:"success"`
	TransactionData string `json:"transactionData"`
	GasEstimate     string `json:"gasEstimate"`
	GasPrice        string `json:"gasPrice"`
	Error           string `json:"error,omitempty"`
}

func (a *App) PrepareTransaction(payload *types.Payload, req PrepareTransactionRequest) (*PrepareTransactionResult, error) {
	logging.LogBackend(fmt.Sprintf("PrepareTransaction CALLED - Function: %s, To: %s, From: %s",
		req.Function.Name, req.To, req.From))

	result := &PrepareTransactionResult{}

	chain := payload.ActiveChain
	if chain == "" {
		chain = "mainnet"
	}

	// Step 1: Convert parameters to proper types for ABI encoding
	abiMethod, err := req.Function.GetAbiMethod()
	if err != nil {
		logging.LogBEError(fmt.Sprintf("Failed to get ABI method: %v", err))
		result.Error = fmt.Sprintf("Failed to get ABI method: %v", err)
		return result, nil
	}

	if len(abiMethod.Inputs) != len(req.Params) {
		err := fmt.Sprintf("Expected %d parameters, got %d", len(abiMethod.Inputs), len(req.Params))
		logging.LogBEError(err)
		result.Error = err
		return result, nil
	}

	// Convert each parameter using Parameter.AbiType()
	convertedParams := make([]interface{}, len(req.Params))
	for i, param := range req.Params {
		// Convert param to string
		paramStr := fmt.Sprintf("%v", param)

		// Use Parameter.AbiType() to convert to proper Go type
		parameter := sdk.Parameter{
			ParameterType: abiMethod.Inputs[i].Type.String(),
			Value:         paramStr,
		}

		converted, err := parameter.AbiType(&abiMethod.Inputs[i].Type)
		if err != nil {
			logging.LogBEError(fmt.Sprintf("Failed to convert parameter %d (%s): %v", i, paramStr, err))
			result.Error = fmt.Sprintf("Failed to convert parameter %d: %v", i, err)
			return result, nil
		}
		convertedParams[i] = converted
	}

	// Step 2: Encode the function call with converted parameters
	packed, err := req.Function.Pack(convertedParams)
	if err != nil {
		logging.LogBEError(fmt.Sprintf("Failed to pack function call: %v", err))
		result.Error = fmt.Sprintf("Failed to encode function call: %v", err)
		return result, nil
	}
	transactionData := "0x" + fmt.Sprintf("%x", packed)
	result.TransactionData = transactionData
	logging.LogBackend(fmt.Sprintf("Transaction data encoded: %s", transactionData))

	// Step 3: Estimate gas
	fromAddr := base.HexToAddress(req.From)
	toAddr := base.HexToAddress(req.To)

	var valueWei *base.Wei
	if req.Value == "" || req.Value == "0" || req.Value == "0x0" {
		valueWei = base.NewWei(0)
	} else {
		wei := base.MustParseWei(req.Value)
		valueWei = &wei
	}

	logging.LogBackend(fmt.Sprintf("Estimating gas - Chain: %s, From: %s, To: %s, Value: %s",
		chain, fromAddr.Hex(), toAddr.Hex(), valueWei.String()))

	estimatedGas, gasPrice, err := sdk.EstimateGasAndPrice(chain, fromAddr, toAddr, transactionData, valueWei)
	if err != nil {
		logging.LogBEError(fmt.Sprintf("SDK.EstimateGasAndPrice FAILED: %v", err))
		result.Error = fmt.Sprintf("Failed to estimate gas: %v. Please check your RPC connection and try again.", err)
		return result, nil
	}

	result.GasEstimate = fmt.Sprintf("0x%x", estimatedGas)
	result.GasPrice = fmt.Sprintf("0x%x", gasPrice)
	result.Success = true

	logging.LogBackend(fmt.Sprintf("Transaction prepared successfully - Gas: %s, Price: %s",
		result.GasEstimate, result.GasPrice))

	return result, nil
}
