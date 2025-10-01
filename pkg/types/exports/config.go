// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package exports

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// GetConfig returns the ViewConfig for the Exports view
func (c *ExportsCollection) GetConfig() (*types.ViewConfig, error) {
	facets := map[string]types.FacetConfig{
		"statements": {
			Name:          "Statements",
			Store:         "statements",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getStatementsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "panel",
		},
		"balances": {
			Name:          "Balances",
			Store:         "balances",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getBalancesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"transfers": {
			Name:          "Transfers",
			Store:         "transfers",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getTransfersFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"transactions": {
			Name:          "Transactions",
			Store:         "transactions",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getTransactionsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"approvals": {
			Name:          "Approvals",
			Store:         "approvals",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getApprovalsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"withdrawals": {
			Name:          "Withdrawals",
			Store:         "withdrawals",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getWithdrawalsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"assets": {
			Name:          "Assets",
			Store:         "assets",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getAssetsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"logs": {
			Name:          "Logs",
			Store:         "logs",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getLogsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"traces": {
			Name:          "Traces",
			Store:         "traces",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getTracesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"receipts": {
			Name:          "Receipts",
			Store:         "receipts",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getReceiptsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
	}

	cfg := &types.ViewConfig{
		ViewName:   "exports",
		Facets:     facets,
		FacetOrder: []string{"statements", "balances", "transfers", "transactions", "approvals", "withdrawals", "assets", "logs", "traces", "receipts"},
		Actions: map[string]types.ActionConfig{
			"export": {Name: "export", Label: "Export", Icon: "Export"},
		},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getApprovalsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "timestamp", Section: "Transaction Context"},
		{Key: "blockNumber", Formatter: "number", Section: "Transaction Context"},
		{Key: "owner", Formatter: "address", Section: "Approval Details"},
		{Key: "spender", Formatter: "address", Section: "Approval Details"},
		{Key: "token", Formatter: "address", Section: "Token Details"},
		{Key: "allowance", Formatter: "wei", Section: "Approval Details"},
		{Key: "lastAppBlock", Formatter: "number", Section: "Additional Data", NoTable: true},
		{Key: "lastAppLogID", Formatter: "number", Section: "Additional Data", NoTable: true},
		{Key: "lastAppTs", Formatter: "timestamp", Section: "Additional Data", NoTable: true},
		{Key: "lastAppTxID", Formatter: "number", Section: "Additional Data", NoTable: true},
		{Key: "actions", Formatter: "actions", Section: "", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getAssetsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "address", Formatter: "address", Section: "Asset Information"},
		{Key: "holder", Formatter: "address", Section: "Asset Information"},
		{Key: "symbol", Section: "Asset Information"},
		{Key: "name", Section: "Asset Information"},
		{Key: "decimals", Section: "Asset Information"},
		{Key: "totalSupply", Formatter: "wei", Section: "Asset Information"},
		{Key: "actions", Section: "", NoDetail: true},
		{Key: "source", Section: "Asset Classification", NoTable: true},
		{Key: "tags", Section: "Asset Classification", NoTable: true},
		{Key: "isContract", Section: "Asset Classification", NoTable: true},
		{Key: "isCustom", Section: "Asset Classification", NoTable: true},
		{Key: "isErc20", Section: "Asset Classification", NoTable: true},
		{Key: "isErc721", Section: "Asset Classification", NoTable: true},
		{Key: "isPrefund", Section: "Asset Classification", NoTable: true},
		{Key: "deleted", Section: "Asset Classification", NoTable: true},
		{Key: "parts", Section: "Additional Data", NoTable: true},
		{Key: "prefund", Formatter: "wei", Section: "Additional Data", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getBalancesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "date", Formatter: "datetime", Section: "Balance Information"},
		{Key: "holder", Formatter: "address", Section: "Token Details"},
		{Key: "address", Formatter: "address", Section: "Token Details"},
		{Key: "symbol", Section: "Token Details"},
		{Key: "balance", Formatter: "wei", Section: "Balance Information"},
		{Key: "decimals", Section: "Token Details"},
		{Key: "priorBalance", Formatter: "wei", Section: "Balance Information", NoTable: true},
		{Key: "totalSupply", Formatter: "wei", Section: "Balance Information", NoTable: true},
		{Key: "type", Section: "Balance Information", NoTable: true},
		{Key: "name", Section: "Token Details", NoTable: true},
		{Key: "blockNumber", Section: "Transaction Context", NoTable: true},
		{Key: "transactionIndex", Section: "Transaction Context", NoTable: true},
		{Key: "timestamp", Formatter: "datetime", Section: "Transaction Context", NoTable: true},
		{Key: "actions", Formatter: "actions", Section: "", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Section: "Transaction Context"},
		{Key: "transactionIndex", Section: "Transaction Context"},
		{Key: "logIndex", Section: "Log Overview"},
		{Key: "address", Formatter: "address", Section: "Log Overview"},
		{Key: "topic0", Formatter: "hash", Section: "Topics"},
		{Key: "topic1", Formatter: "hash", Section: "Topics"},
		{Key: "actions", Section: "", NoDetail: true},
		{Key: "data", Section: "Log Overview", NoTable: true},
		{Key: "topic2", Formatter: "hash", Section: "Topics", NoTable: true},
		{Key: "topic3", Formatter: "hash", Section: "Topics", NoTable: true},
		{Key: "blockHash", Formatter: "hash", Section: "Transaction Context", NoTable: true},
		{Key: "transactionHash", Formatter: "hash", Section: "Transaction Context", NoTable: true},
		{Key: "timestamp", Formatter: "datetime", Section: "Transaction Context", NoTable: true},
		{Key: "articulatedLog", Formatter: "json", Section: "Articulated Information", NoTable: true},
		{Key: "compressedLog", Section: "Articulated Information", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getReceiptsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Section: "Block Context"},
		{Key: "transactionIndex", Section: "Transaction Details"},
		{Key: "transactionHash", Section: "Receipt Overview"},
		{Key: "from", Section: "Transaction Details"},
		{Key: "to", Section: "Transaction Details"},
		{Key: "gasUsed", Section: "Gas Information"},
		{Key: "status", Section: "Receipt Overview"},
		{Key: "actions", Section: "", NoDetail: true},
		{Key: "isError", Section: "Receipt Overview", NoTable: true},
		{Key: "contractAddress", Section: "Receipt Overview", NoTable: true},
		{Key: "cumulativeGasUsed", Section: "Gas Information", NoTable: true},
		{Key: "effectiveGasPrice", Section: "Gas Information", NoTable: true},
		{Key: "blockHash", Section: "Block Context", NoTable: true},
		{Key: "logsBloom", Section: "Additional Information", NoTable: true},
		{Key: "logs", Section: "Additional Information", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getStatementsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "date", Section: "Statement Summary"},
		{Key: "asset", Section: "Asset Information"},
		{Key: "symbol", Section: "Asset Information"},
		{Key: "decimals", Section: "Asset Information"},
		{Key: "begBal", Section: "Balance Reconciliation"},
		{Key: "amountIn", Section: "Inflow Details"},
		{Key: "amountOut", Section: "Outflow Details"},
		{Key: "endBal", Section: "Balance Reconciliation"},
		{Key: "gasUsed", Section: "Statement Summary"},
		{Key: "reconciliationType", Section: "Statement Summary"},
		{Key: "actions", Section: "", NoDetail: true},
		{Key: "accountedFor", Section: "Statement Summary", NoTable: true},
		{Key: "reconciled", Section: "Statement Summary", NoTable: true},
		{Key: "spotPrice", Section: "Asset Information", NoTable: true},
		{Key: "priceSource", Section: "Asset Information", NoTable: true},
		{Key: "totalIn", Section: "Balance Reconciliation", NoTable: true},
		{Key: "totalOut", Section: "Balance Reconciliation", NoTable: true},
		{Key: "amountNet", Section: "Balance Reconciliation", NoTable: true},
		{Key: "endBalCalc", Section: "Balance Reconciliation", NoTable: true},
		{Key: "internalIn", Section: "Inflow Details", NoTable: true},
		{Key: "selfDestructIn", Section: "Inflow Details", NoTable: true},
		{Key: "minerBaseRewardIn", Section: "Inflow Details", NoTable: true},
		{Key: "minerTxFeeIn", Section: "Inflow Details", NoTable: true},
		{Key: "prefundIn", Section: "Inflow Details", NoTable: true},
		{Key: "internalOut", Section: "Outflow Details", NoTable: true},
		{Key: "selfDestructOut", Section: "Outflow Details", NoTable: true},
		{Key: "gasOut", Section: "Outflow Details", NoTable: true},
		{Key: "blockNumber", Section: "Transaction Details", NoTable: true},
		{Key: "transactionIndex", Section: "Transaction Details", NoTable: true},
		{Key: "logIndex", Section: "Transaction Details", NoTable: true},
		{Key: "transactionHash", Section: "Transaction Details", NoTable: true},
		{Key: "sender", Section: "Transaction Details", NoTable: true},
		{Key: "recipient", Section: "Transaction Details", NoTable: true},
		{Key: "prevBal", Section: "Reconciliation Analysis", NoTable: true},
		{Key: "begBalDiff", Section: "Reconciliation Analysis", NoTable: true},
		{Key: "endBalDiff", Section: "Reconciliation Analysis", NoTable: true},
		{Key: "correctingReasons", Section: "Reconciliation Analysis", NoTable: true},
		{Key: "correctBegBalIn", Section: "Correction Entries", NoTable: true},
		{Key: "correctAmountIn", Section: "Correction Entries", NoTable: true},
		{Key: "correctEndBalIn", Section: "Correction Entries", NoTable: true},
		{Key: "correctBegBalOut", Section: "Correction Entries", NoTable: true},
		{Key: "correctAmountOut", Section: "Correction Entries", NoTable: true},
		{Key: "correctEndBalOut", Section: "Correction Entries", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getTracesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Section: "Transaction Context"},
		{Key: "transactionIndex", Section: "Transaction Context"},
		{Key: "traceIndex", Section: "Transaction Context"},
		{Key: "from", Section: "Trace Action"},
		{Key: "to", Section: "Trace Action"},
		{Key: "value", Section: "Trace Action"},
		{Key: "type", Section: "Trace Overview"},
		{Key: "actions", Section: "", NoDetail: true},
		{Key: "error", Section: "Trace Overview", NoTable: true},
		{Key: "subtraces", Section: "Trace Overview", NoTable: true},
		{Key: "traceAddress", Section: "Trace Overview", NoTable: true},
		{Key: "gas", Section: "Trace Action", NoTable: true},
		{Key: "callType", Section: "Trace Action", NoTable: true},
		{Key: "input", Section: "Trace Action", NoTable: true},
		{Key: "gasUsed", Section: "Trace Result", NoTable: true},
		{Key: "output", Section: "Trace Result", NoTable: true},
		{Key: "address", Section: "Trace Result", NoTable: true},
		{Key: "code", Section: "Trace Result", NoTable: true},
		{Key: "blockHash", Section: "Transaction Context", NoTable: true},
		{Key: "transactionHash", Section: "Transaction Context", NoTable: true},
		{Key: "timestamp", Section: "Transaction Context", NoTable: true},
		{Key: "articulatedTrace", Section: "Articulated Information", NoTable: true},
		{Key: "compressedTrace", Section: "Articulated Information", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getTransactionsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Section: "Block Context"},
		{Key: "transactionIndex", Section: "Block Context"},
		{Key: "hash", Section: "Transaction Overview"},
		{Key: "from", Section: "Transaction Overview"},
		{Key: "to", Section: "Transaction Overview"},
		{Key: "value", Section: "Transaction Overview"},
		{Key: "gasUsed", Section: "Gas Information"},
		{Key: "actions", Section: "", NoDetail: true},
		{Key: "timestamp", Section: "Transaction Overview", NoTable: true},
		{Key: "input", Section: "Transaction Overview", NoTable: true},
		{Key: "articulatedTx", Section: "Transaction Overview", NoTable: true},
		{Key: "isError", Section: "Transaction Overview", NoTable: true},
		{Key: "hasToken", Section: "Transaction Overview", NoTable: true},
		{Key: "gas", Section: "Gas Information", NoTable: true},
		{Key: "gasPrice", Section: "Gas Information", NoTable: true},
		{Key: "maxFeePerGas", Section: "Gas Information", NoTable: true},
		{Key: "maxPriorityFeePerGas", Section: "Gas Information", NoTable: true},
		{Key: "blockHash", Section: "Block Context", NoTable: true},
		{Key: "nonce", Section: "Transaction Details", NoTable: true},
		{Key: "type", Section: "Transaction Details", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getTransfersFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Section: "Transaction Info"},
		{Key: "transactionIndex", Section: "Transaction Info"},
		{Key: "logIndex", Section: "Transaction Info"},
		{Key: "from", Formatter: "address", Section: "Transfer Details"},
		{Key: "to", Formatter: "address", Section: "Transfer Details"},
		{Key: "asset", Formatter: "address", Section: "Transfer Details"},
		{Key: "amount", Formatter: "wei", Section: "Amount Breakdown"},
		{Key: "sender", Formatter: "address", Section: "Transfer Details", NoTable: true},
		{Key: "recipient", Formatter: "address", Section: "Transfer Details", NoTable: true},
		{Key: "holder", Formatter: "address", Section: "Transfer Details", NoTable: true},
		{Key: "decimals", Section: "Transfer Details", NoTable: true},
		{Key: "amountIn", Formatter: "wei", Section: "Amount Breakdown", NoTable: true},
		{Key: "amountOut", Formatter: "wei", Section: "Amount Breakdown", NoTable: true},
		{Key: "internalIn", Formatter: "wei", Section: "Amount Breakdown", NoTable: true},
		{Key: "internalOut", Formatter: "wei", Section: "Amount Breakdown", NoTable: true},
		{Key: "gasOut", Formatter: "wei", Section: "Amount Breakdown", NoTable: true},
		{Key: "minerBaseRewardIn", Formatter: "wei", Section: "Mining Rewards", NoTable: true},
		{Key: "minerNephewRewardIn", Formatter: "wei", Section: "Mining Rewards", NoTable: true},
		{Key: "minerTxFeeIn", Formatter: "wei", Section: "Mining Rewards", NoTable: true},
		{Key: "minerUncleRewardIn", Formatter: "wei", Section: "Mining Rewards", NoTable: true},
		{Key: "selfDestructIn", Formatter: "wei", Section: "Special Transfers", NoTable: true},
		{Key: "selfDestructOut", Formatter: "wei", Section: "Special Transfers", NoTable: true},
		{Key: "prefundIn", Formatter: "wei", Section: "Special Transfers", NoTable: true},
		{Key: "actions", Section: "", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getWithdrawalsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Section: "Block Information"},
		{Key: "index", Section: "Withdrawal Details"},
		{Key: "validatorIndex", Section: "Withdrawal Details"},
		{Key: "address", Section: "Withdrawal Details"},
		{Key: "amount", Section: "Withdrawal Details"},
		{Key: "actions", Section: "", NoDetail: true},
		{Key: "timestamp", Section: "Block Information", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
