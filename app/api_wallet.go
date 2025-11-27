// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package app

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/rpc"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// PrepareApprovalTransaction prepares an ERC20 approval transaction by calling RPC methods
func (a *App) PrepareApprovalTransaction(payload *types.Payload, data rpc.ApprovalTransactionData) (*rpc.ApprovalTransactionResult, error) {
	return rpc.PrepareApprovalTransaction(payload, data)
}

// EstimateTransactionGas estimates gas and gas price for any transaction
func (a *App) EstimateTransactionGas(payload *types.Payload, txPayload rpc.TransactionPayload) (*rpc.GasEstimationResult, error) {
	return rpc.EstimateTransactionGas(payload, txPayload)
}
