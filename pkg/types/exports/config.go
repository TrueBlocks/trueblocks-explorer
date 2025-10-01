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
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getAssetsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "address", Label: "Address", ColumnLabel: "Address", DetailLabel: "Contract Address", Formatter: "address", Section: "Asset Information", Width: 340, Order: 1, DetailOrder: 1},
		{Key: "holder", Label: "Holder", ColumnLabel: "Holder", DetailLabel: "Holder", Formatter: "address", Section: "Asset Information", Width: 340, Order: 2, DetailOrder: 2},
		{Key: "symbol", Label: "Symbol", ColumnLabel: "Symbol", DetailLabel: "Symbol", Section: "Asset Information", Width: 100, Order: 3, DetailOrder: 4},
		{Key: "name", Label: "Name", ColumnLabel: "Name", DetailLabel: "Token Name", Section: "Asset Information", Width: 200, Order: 4, DetailOrder: 3},
		{Key: "decimals", Label: "Decimals", ColumnLabel: "Decimals", DetailLabel: "Decimals", Section: "Asset Information", Width: 100, Order: 5, DetailOrder: 5},
		{Key: "totalSupply", Label: "Total Supply", ColumnLabel: "Total Supply", DetailLabel: "Total Supply", Formatter: "wei", Section: "Asset Information", Width: 150, Order: 6, DetailOrder: 6},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Order: 7},
		{Key: "source", Label: "Source", DetailLabel: "Source", Section: "Asset Classification", NoTable: true, DetailOrder: 7},
		{Key: "tags", Label: "Tags", DetailLabel: "Tags", Section: "Asset Classification", NoTable: true, DetailOrder: 8},
		{Key: "isContract", Label: "Is Contract", DetailLabel: "Is Contract", Section: "Asset Classification", NoTable: true, DetailOrder: 9},
		{Key: "isCustom", Label: "Is Custom", DetailLabel: "Is Custom", Section: "Asset Classification", NoTable: true, DetailOrder: 10},
		{Key: "isErc20", Label: "Is ERC20", DetailLabel: "Is ERC20", Section: "Asset Classification", NoTable: true, DetailOrder: 11},
		{Key: "isErc721", Label: "Is ERC721", DetailLabel: "Is ERC721", Section: "Asset Classification", NoTable: true, DetailOrder: 12},
		{Key: "isPrefund", Label: "Is Prefund", DetailLabel: "Is Prefund", Section: "Asset Classification", NoTable: true, DetailOrder: 13},
		{Key: "deleted", Label: "Deleted", DetailLabel: "Deleted", Section: "Asset Classification", NoTable: true, DetailOrder: 14},
		{Key: "parts", Label: "Parts", DetailLabel: "Parts", Section: "Additional Data", NoTable: true, DetailOrder: 15},
		{Key: "prefund", Label: "Prefund Amount", DetailLabel: "Prefund Amount", Formatter: "wei", Section: "Additional Data", NoTable: true, DetailOrder: 16},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getBalancesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "date", Label: "Date", ColumnLabel: "Date", DetailLabel: "Date", Formatter: "datetime", Section: "Balance Information", Width: 120, Order: 1, DetailOrder: 1},
		{Key: "holder", Label: "Holder", ColumnLabel: "Holder", DetailLabel: "Holder", Formatter: "address", Section: "Token Details", Width: 340, Order: 2, DetailOrder: 7},
		{Key: "address", Label: "Address", ColumnLabel: "Address", DetailLabel: "Token Address", Formatter: "address", Section: "Token Details", Width: 340, Order: 3, DetailOrder: 6},
		{Key: "symbol", Label: "Symbol", ColumnLabel: "Symbol", DetailLabel: "Symbol", Section: "Token Details", Width: 100, Order: 4, DetailOrder: 8},
		{Key: "balance", Label: "Balance", ColumnLabel: "Balance", DetailLabel: "Balance", Formatter: "wei", Section: "Balance Information", Width: 150, Order: 5, DetailOrder: 2},
		{Key: "decimals", Label: "Decimals", ColumnLabel: "Decimals", DetailLabel: "Decimals", Section: "Token Details", Width: 100, Order: 6, DetailOrder: 10},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Order: 7},
		{Key: "priorBalance", Label: "Prior Balance", DetailLabel: "Prior Balance", Formatter: "wei", Section: "Balance Information", NoTable: true, DetailOrder: 3},
		{Key: "totalSupply", Label: "Total Supply", DetailLabel: "Total Supply", Formatter: "wei", Section: "Balance Information", NoTable: true, DetailOrder: 4},
		{Key: "type", Label: "Token Type", DetailLabel: "Token Type", Section: "Balance Information", NoTable: true, DetailOrder: 5},
		{Key: "name", Label: "Token Name", DetailLabel: "Token Name", Section: "Token Details", NoTable: true, DetailOrder: 9},
		{Key: "blockNumber", Label: "Block Number", DetailLabel: "Block Number", Section: "Transaction Context", NoTable: true, DetailOrder: 11},
		{Key: "transactionIndex", Label: "Transaction Index", DetailLabel: "Transaction Index", Section: "Transaction Context", NoTable: true, DetailOrder: 12},
		{Key: "timestamp", Label: "Timestamp", DetailLabel: "Timestamp", Formatter: "datetime", Section: "Transaction Context", NoTable: true, DetailOrder: 13},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Label: "Block", ColumnLabel: "Block", DetailLabel: "Block Number", Section: "Transaction Context", Width: 100, Order: 1, DetailOrder: 8},
		{Key: "transactionIndex", Label: "Tx Index", ColumnLabel: "Tx Index", DetailLabel: "Transaction Index", Section: "Transaction Context", Width: 80, Order: 2, DetailOrder: 11},
		{Key: "logIndex", Label: "Log Index", ColumnLabel: "Log Index", DetailLabel: "Log Index", Section: "Log Overview", Width: 80, Order: 3, DetailOrder: 3},
		{Key: "address", Label: "Address", ColumnLabel: "Address", DetailLabel: "Contract Address", Formatter: "address", Section: "Log Overview", Width: 340, Order: 4, DetailOrder: 1},
		{Key: "topic0", Label: "Topic0", ColumnLabel: "Topic0", DetailLabel: "Topic 0 (Event Signature)", Formatter: "hash", Section: "Topics", Width: 340, Order: 5, DetailOrder: 4},
		{Key: "topic1", Label: "Topic1", ColumnLabel: "Topic1", DetailLabel: "Topic 1", Formatter: "hash", Section: "Topics", Width: 340, Order: 6, DetailOrder: 5},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Order: 7},
		{Key: "data", Label: "Data", DetailLabel: "Data", Section: "Log Overview", NoTable: true, DetailOrder: 2},
		{Key: "topic2", Label: "Topic 2", DetailLabel: "Topic 2", Formatter: "hash", Section: "Topics", NoTable: true, DetailOrder: 6},
		{Key: "topic3", Label: "Topic 3", DetailLabel: "Topic 3", Formatter: "hash", Section: "Topics", NoTable: true, DetailOrder: 7},
		{Key: "blockHash", Label: "Block Hash", DetailLabel: "Block Hash", Formatter: "hash", Section: "Transaction Context", NoTable: true, DetailOrder: 9},
		{Key: "transactionHash", Label: "Transaction Hash", DetailLabel: "Transaction Hash", Formatter: "hash", Section: "Transaction Context", NoTable: true, DetailOrder: 10},
		{Key: "timestamp", Label: "Timestamp", DetailLabel: "Timestamp", Formatter: "datetime", Section: "Transaction Context", NoTable: true, DetailOrder: 12},
		{Key: "articulatedLog", Label: "Articulated Log", DetailLabel: "Articulated Log", Formatter: "json", Section: "Articulated Information", NoTable: true, DetailOrder: 13},
		{Key: "compressedLog", Label: "Compressed Log", DetailLabel: "Compressed Log", Section: "Articulated Information", NoTable: true, DetailOrder: 14},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getReceiptsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Label: "Block", ColumnLabel: "Block", DetailLabel: "Block Number", Section: "Block Context", Width: 100, Order: 1, DetailOrder: 11},
		{Key: "transactionIndex", Label: "Index", ColumnLabel: "Index", DetailLabel: "Transaction Index", Section: "Transaction Details", Width: 80, Order: 2, DetailOrder: 7},
		{Key: "transactionHash", Label: "Tx Hash", ColumnLabel: "Tx Hash", DetailLabel: "Transaction Hash", Formatter: "hash", Section: "Receipt Overview", Width: 340, Order: 3, DetailOrder: 1},
		{Key: "from", Label: "From", ColumnLabel: "From", DetailLabel: "From", Formatter: "address", Section: "Transaction Details", Width: 340, Order: 4, DetailOrder: 5},
		{Key: "to", Label: "To", ColumnLabel: "To", DetailLabel: "To", Formatter: "address", Section: "Transaction Details", Width: 340, Order: 5, DetailOrder: 6},
		{Key: "gasUsed", Label: "Gas Used", ColumnLabel: "Gas Used", DetailLabel: "Gas Used", Formatter: "gas", Section: "Gas Information", Width: 120, Order: 6, DetailOrder: 8},
		{Key: "status", Label: "Status", ColumnLabel: "Status", DetailLabel: "Status", Section: "Receipt Overview", Width: 80, Order: 7, DetailOrder: 2},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Order: 8},
		{Key: "isError", Label: "Is Error", DetailLabel: "Is Error", Section: "Receipt Overview", NoTable: true, DetailOrder: 3},
		{Key: "contractAddress", Label: "Contract Address", DetailLabel: "Contract Address", Formatter: "address", Section: "Receipt Overview", NoTable: true, DetailOrder: 4},
		{Key: "cumulativeGasUsed", Label: "Cumulative Gas Used", DetailLabel: "Cumulative Gas Used", Formatter: "gas", Section: "Gas Information", NoTable: true, DetailOrder: 9},
		{Key: "effectiveGasPrice", Label: "Effective Gas Price", DetailLabel: "Effective Gas Price", Formatter: "gas", Section: "Gas Information", NoTable: true, DetailOrder: 10},
		{Key: "blockHash", Label: "Block Hash", DetailLabel: "Block Hash", Formatter: "hash", Section: "Block Context", NoTable: true, DetailOrder: 12},
		{Key: "logsBloom", Label: "Logs Bloom", DetailLabel: "Logs Bloom", Section: "Additional Information", NoTable: true, DetailOrder: 13},
		{Key: "logs", Label: "Log Count", DetailLabel: "Log Count", Section: "Additional Information", NoTable: true, DetailOrder: 14},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getStatementsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "date", Label: "Date", ColumnLabel: "Date", DetailLabel: "Date", Formatter: "datetime", Section: "Statement Summary", Width: 120, Order: 1, DetailOrder: 1},
		{Key: "asset", Label: "Asset", ColumnLabel: "Asset", DetailLabel: "Asset", Formatter: "address", Section: "Asset Information", Width: 340, Order: 2, DetailOrder: 6},
		{Key: "symbol", Label: "Symbol", ColumnLabel: "Symbol", DetailLabel: "Symbol", Section: "Asset Information", Width: 200, Order: 3, DetailOrder: 7},
		{Key: "decimals", Label: "Decimals", ColumnLabel: "Decimals", DetailLabel: "Decimals", Section: "Asset Information", Width: 100, Order: 4, DetailOrder: 8},
		{Key: "begBal", Label: "Begin Balance", ColumnLabel: "Begin Balance", DetailLabel: "Begin Balance", Formatter: "wei", Section: "Balance Reconciliation", Width: 150, Order: 5, DetailOrder: 11},
		{Key: "amountIn", Label: "Amount In", ColumnLabel: "In", DetailLabel: "Amount In", Formatter: "wei", Section: "Inflow Details", Width: 150, Order: 6, DetailOrder: 17},
		{Key: "amountOut", Label: "Amount Out", ColumnLabel: "Out", DetailLabel: "Amount Out", Formatter: "wei", Section: "Outflow Details", Width: 150, Order: 7, DetailOrder: 23},
		{Key: "endBal", Label: "End Balance", ColumnLabel: "End Balance", DetailLabel: "End Balance", Formatter: "wei", Section: "Balance Reconciliation", Width: 150, Order: 8, DetailOrder: 15},
		{Key: "gasUsed", Label: "Gas Used", ColumnLabel: "Gas Used", DetailLabel: "Gas Used", Formatter: "gas", Section: "Statement Summary", Width: 120, Order: 9, DetailOrder: 5},
		{Key: "reconciliationType", Label: "Type", ColumnLabel: "Type", DetailLabel: "Type", Section: "Statement Summary", Width: 100, Order: 10, DetailOrder: 4},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Order: 11},
		{Key: "accountedFor", Label: "Account", DetailLabel: "Account", Formatter: "address", Section: "Statement Summary", NoTable: true, DetailOrder: 2},
		{Key: "reconciled", Label: "Reconciled", DetailLabel: "Reconciled", Section: "Statement Summary", NoTable: true, DetailOrder: 3},
		{Key: "spotPrice", Label: "Spot Price", DetailLabel: "Spot Price", Section: "Asset Information", NoTable: true, DetailOrder: 9},
		{Key: "priceSource", Label: "Price Source", DetailLabel: "Price Source", Section: "Asset Information", NoTable: true, DetailOrder: 10},
		{Key: "totalIn", Label: "Total In", DetailLabel: "Total In", Formatter: "wei", Section: "Balance Reconciliation", NoTable: true, DetailOrder: 12},
		{Key: "totalOut", Label: "Total Out", DetailLabel: "Total Out", Formatter: "wei", Section: "Balance Reconciliation", NoTable: true, DetailOrder: 13},
		{Key: "amountNet", Label: "Net Amount", DetailLabel: "Net Amount", Formatter: "wei", Section: "Balance Reconciliation", NoTable: true, DetailOrder: 14},
		{Key: "endBalCalc", Label: "Calculated End Balance", DetailLabel: "Calculated End Balance", Formatter: "wei", Section: "Balance Reconciliation", NoTable: true, DetailOrder: 16},
		{Key: "internalIn", Label: "Internal In", DetailLabel: "Internal In", Formatter: "wei", Section: "Inflow Details", NoTable: true, DetailOrder: 18},
		{Key: "selfDestructIn", Label: "Self Destruct In", DetailLabel: "Self Destruct In", Formatter: "wei", Section: "Inflow Details", NoTable: true, DetailOrder: 19},
		{Key: "minerBaseRewardIn", Label: "Base Reward In", DetailLabel: "Base Reward In", Formatter: "wei", Section: "Inflow Details", NoTable: true, DetailOrder: 20},
		{Key: "minerTxFeeIn", Label: "Tx Fee In", DetailLabel: "Tx Fee In", Formatter: "wei", Section: "Inflow Details", NoTable: true, DetailOrder: 21},
		{Key: "prefundIn", Label: "Prefund In", DetailLabel: "Prefund In", Formatter: "wei", Section: "Inflow Details", NoTable: true, DetailOrder: 22},
		{Key: "internalOut", Label: "Internal Out", DetailLabel: "Internal Out", Formatter: "wei", Section: "Outflow Details", NoTable: true, DetailOrder: 24},
		{Key: "selfDestructOut", Label: "Self Destruct Out", DetailLabel: "Self Destruct Out", Formatter: "wei", Section: "Outflow Details", NoTable: true, DetailOrder: 25},
		{Key: "gasOut", Label: "Gas Out", DetailLabel: "Gas Out", Formatter: "wei", Section: "Outflow Details", NoTable: true, DetailOrder: 26},
		{Key: "blockNumber", Label: "Block Number", DetailLabel: "Block Number", Section: "Transaction Details", NoTable: true, DetailOrder: 27},
		{Key: "transactionIndex", Label: "Transaction Index", DetailLabel: "Transaction Index", Section: "Transaction Details", NoTable: true, DetailOrder: 28},
		{Key: "logIndex", Label: "Log Index", DetailLabel: "Log Index", Section: "Transaction Details", NoTable: true, DetailOrder: 29},
		{Key: "transactionHash", Label: "Transaction Hash", DetailLabel: "Transaction Hash", Formatter: "hash", Section: "Transaction Details", NoTable: true, DetailOrder: 30},
		{Key: "sender", Label: "Sender", DetailLabel: "Sender", Formatter: "address", Section: "Transaction Details", NoTable: true, DetailOrder: 31},
		{Key: "recipient", Label: "Recipient", DetailLabel: "Recipient", Formatter: "address", Section: "Transaction Details", NoTable: true, DetailOrder: 32},
		{Key: "prevBal", Label: "Previous Balance", DetailLabel: "Previous Balance", Formatter: "wei", Section: "Reconciliation Analysis", NoTable: true, DetailOrder: 33},
		{Key: "begBalDiff", Label: "Begin Balance Diff", DetailLabel: "Begin Balance Diff", Formatter: "wei", Section: "Reconciliation Analysis", NoTable: true, DetailOrder: 34},
		{Key: "endBalDiff", Label: "End Balance Diff", DetailLabel: "End Balance Diff", Formatter: "wei", Section: "Reconciliation Analysis", NoTable: true, DetailOrder: 35},
		{Key: "correctingReasons", Label: "Correcting Reasons", DetailLabel: "Correcting Reasons", Section: "Reconciliation Analysis", NoTable: true, DetailOrder: 36},
		{Key: "correctBegBalIn", Label: "Correct Begin Bal In", DetailLabel: "Correct Begin Bal In", Formatter: "wei", Section: "Correction Entries", NoTable: true, DetailOrder: 37},
		{Key: "correctAmountIn", Label: "Correct Amount In", DetailLabel: "Correct Amount In", Formatter: "wei", Section: "Correction Entries", NoTable: true, DetailOrder: 38},
		{Key: "correctEndBalIn", Label: "Correct End Bal In", DetailLabel: "Correct End Bal In", Formatter: "wei", Section: "Correction Entries", NoTable: true, DetailOrder: 39},
		{Key: "correctBegBalOut", Label: "Correct Begin Bal Out", DetailLabel: "Correct Begin Bal Out", Formatter: "wei", Section: "Correction Entries", NoTable: true, DetailOrder: 40},
		{Key: "correctAmountOut", Label: "Correct Amount Out", DetailLabel: "Correct Amount Out", Formatter: "wei", Section: "Correction Entries", NoTable: true, DetailOrder: 41},
		{Key: "correctEndBalOut", Label: "Correct End Bal Out", DetailLabel: "Correct End Bal Out", Formatter: "wei", Section: "Correction Entries", NoTable: true, DetailOrder: 42},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getTracesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Label: "Block", ColumnLabel: "Block", DetailLabel: "Block Number", Section: "Transaction Context", Width: 100, Order: 1, DetailOrder: 15},
		{Key: "transactionIndex", Label: "Tx Index", ColumnLabel: "Tx Index", DetailLabel: "Transaction Index", Section: "Transaction Context", Width: 80, Order: 2, DetailOrder: 18},
		{Key: "traceIndex", Label: "Trace Index", ColumnLabel: "Trace Index", DetailLabel: "Trace Index", Section: "Transaction Context", Width: 80, Order: 3, DetailOrder: 20},
		{Key: "from", Label: "From", ColumnLabel: "From", DetailLabel: "From", Formatter: "address", Section: "Trace Action", Width: 340, Order: 4, DetailOrder: 5},
		{Key: "to", Label: "To", ColumnLabel: "To", DetailLabel: "To", Formatter: "address", Section: "Trace Action", Width: 340, Order: 5, DetailOrder: 6},
		{Key: "value", Label: "Value", ColumnLabel: "Value", DetailLabel: "Value", Formatter: "wei", Section: "Trace Action", Width: 150, Order: 6, DetailOrder: 7},
		{Key: "type", Label: "Type", ColumnLabel: "Type", DetailLabel: "Trace Type", Section: "Trace Overview", Width: 100, Order: 7, DetailOrder: 1},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Order: 8},
		{Key: "error", Label: "Error", DetailLabel: "Error", Section: "Trace Overview", NoTable: true, DetailOrder: 2},
		{Key: "subtraces", Label: "Subtraces Count", DetailLabel: "Subtraces Count", Section: "Trace Overview", NoTable: true, DetailOrder: 3},
		{Key: "traceAddress", Label: "Trace Address", DetailLabel: "Trace Address", Section: "Trace Overview", NoTable: true, DetailOrder: 4},
		{Key: "gas", Label: "Gas Limit", DetailLabel: "Gas Limit", Section: "Trace Action", NoTable: true, DetailOrder: 8},
		{Key: "callType", Label: "Call Type", DetailLabel: "Call Type", Section: "Trace Action", NoTable: true, DetailOrder: 9},
		{Key: "input", Label: "Input Data", DetailLabel: "Input Data", Section: "Trace Action", NoTable: true, DetailOrder: 10},
		{Key: "gasUsed", Label: "Gas Used", DetailLabel: "Gas Used", Formatter: "gas", Section: "Trace Result", NoTable: true, DetailOrder: 11},
		{Key: "output", Label: "Output", DetailLabel: "Output", Section: "Trace Result", NoTable: true, DetailOrder: 12},
		{Key: "address", Label: "Created Address", DetailLabel: "Created Address", Formatter: "address", Section: "Trace Result", NoTable: true, DetailOrder: 13},
		{Key: "code", Label: "Code", DetailLabel: "Code", Section: "Trace Result", NoTable: true, DetailOrder: 14},
		{Key: "blockHash", Label: "Block Hash", DetailLabel: "Block Hash", Formatter: "hash", Section: "Transaction Context", NoTable: true, DetailOrder: 16},
		{Key: "transactionHash", Label: "Transaction Hash", DetailLabel: "Transaction Hash", Formatter: "hash", Section: "Transaction Context", NoTable: true, DetailOrder: 17},
		{Key: "timestamp", Label: "Timestamp", DetailLabel: "Timestamp", Formatter: "datetime", Section: "Transaction Context", NoTable: true, DetailOrder: 19},
		{Key: "articulatedTrace", Label: "Articulated Trace", DetailLabel: "Articulated Trace", Formatter: "json", Section: "Articulated Information", NoTable: true, DetailOrder: 21},
		{Key: "compressedTrace", Label: "Compressed Trace", DetailLabel: "Compressed Trace", Section: "Articulated Information", NoTable: true, DetailOrder: 22},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getTransactionsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Label: "Block", ColumnLabel: "Block", DetailLabel: "Block Number", Section: "Block Context", Width: 100, Order: 1, DetailOrder: 15},
		{Key: "transactionIndex", Label: "Index", ColumnLabel: "Index", DetailLabel: "Transaction Index", Section: "Block Context", Width: 80, Order: 2, DetailOrder: 17},
		{Key: "hash", Label: "Hash", ColumnLabel: "Hash", DetailLabel: "Hash", Formatter: "hash", Section: "Transaction Overview", Width: 340, Order: 3, DetailOrder: 1},
		{Key: "from", Label: "From", ColumnLabel: "From", DetailLabel: "From", Formatter: "address", Section: "Transaction Overview", Width: 340, Order: 4, DetailOrder: 2},
		{Key: "to", Label: "To", ColumnLabel: "To", DetailLabel: "To", Formatter: "address", Section: "Transaction Overview", Width: 340, Order: 5, DetailOrder: 3},
		{Key: "value", Label: "Value", ColumnLabel: "Value", DetailLabel: "Value", Formatter: "wei", Section: "Transaction Overview", Width: 150, Order: 6, DetailOrder: 4},
		{Key: "gasUsed", Label: "Gas Used", ColumnLabel: "Gas Used", DetailLabel: "Gas Used", Formatter: "gas", Section: "Gas Information", Width: 120, Order: 7, DetailOrder: 11},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Order: 8},
		{Key: "timestamp", Label: "Timestamp", DetailLabel: "Timestamp", Formatter: "datetime", Section: "Transaction Overview", NoTable: true, DetailOrder: 5},
		{Key: "input", Label: "Input Data", DetailLabel: "Input Data", Section: "Transaction Overview", NoTable: true, DetailOrder: 6},
		{Key: "articulatedTx", Label: "Articulated Transaction", DetailLabel: "Articulated Transaction", Formatter: "json", Section: "Transaction Overview", NoTable: true, DetailOrder: 7},
		{Key: "isError", Label: "Error Status", DetailLabel: "Error Status", Section: "Transaction Overview", NoTable: true, DetailOrder: 8},
		{Key: "hasToken", Label: "Has Token", DetailLabel: "Has Token", Section: "Transaction Overview", NoTable: true, DetailOrder: 9},
		{Key: "gas", Label: "Gas Limit", DetailLabel: "Gas Limit", Section: "Gas Information", NoTable: true, DetailOrder: 10},
		{Key: "gasPrice", Label: "Gas Price", DetailLabel: "Gas Price", Formatter: "gas", Section: "Gas Information", NoTable: true, DetailOrder: 12},
		{Key: "maxFeePerGas", Label: "Max Fee Per Gas", DetailLabel: "Max Fee Per Gas", Formatter: "gas", Section: "Gas Information", NoTable: true, DetailOrder: 13},
		{Key: "maxPriorityFeePerGas", Label: "Max Priority Fee", DetailLabel: "Max Priority Fee", Formatter: "gas", Section: "Gas Information", NoTable: true, DetailOrder: 14},
		{Key: "blockHash", Label: "Block Hash", DetailLabel: "Block Hash", Formatter: "hash", Section: "Block Context", NoTable: true, DetailOrder: 16},
		{Key: "nonce", Label: "Nonce", DetailLabel: "Nonce", Section: "Transaction Details", NoTable: true, DetailOrder: 18},
		{Key: "type", Label: "Transaction Type", DetailLabel: "Transaction Type", Section: "Transaction Details", NoTable: true, DetailOrder: 19},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getTransfersFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Section: "Transaction Info", Order: 1, DetailOrder: 18},
		{Key: "transactionIndex", Section: "Transaction Info", Order: 2, DetailOrder: 19},
		{Key: "logIndex", Section: "Transaction Info", Order: 3, DetailOrder: 20},
		{Key: "from", Formatter: "address", Section: "Transfer Details", Order: 4, DetailOrder: 1},
		{Key: "to", Formatter: "address", Section: "Transfer Details", Order: 5, DetailOrder: 2},
		{Key: "asset", Formatter: "address", Section: "Transfer Details", Order: 6, DetailOrder: 4},
		{Key: "amount", Formatter: "wei", Section: "Amount Breakdown", Order: 7, DetailOrder: 6},
		{Key: "sender", Formatter: "address", Section: "Transfer Details", NoTable: true, DetailOrder: 3},
		{Key: "recipient", Formatter: "address", Section: "Transfer Details", NoTable: true, DetailOrder: 4},
		{Key: "holder", Formatter: "address", Section: "Transfer Details", NoTable: true, DetailOrder: 3},
		{Key: "decimals", Section: "Transfer Details", NoTable: true, DetailOrder: 5},
		{Key: "amountIn", Formatter: "wei", Section: "Amount Breakdown", NoTable: true, DetailOrder: 7},
		{Key: "amountOut", Formatter: "wei", Section: "Amount Breakdown", NoTable: true, DetailOrder: 8},
		{Key: "internalIn", Formatter: "wei", Section: "Amount Breakdown", NoTable: true, DetailOrder: 8},
		{Key: "internalOut", Formatter: "wei", Section: "Amount Breakdown", NoTable: true, DetailOrder: 9},
		{Key: "gasOut", Formatter: "wei", Section: "Amount Breakdown", NoTable: true, DetailOrder: 10},
		{Key: "minerBaseRewardIn", Formatter: "wei", Section: "Mining Rewards", NoTable: true, DetailOrder: 11},
		{Key: "minerNephewRewardIn", Formatter: "wei", Section: "Mining Rewards", NoTable: true, DetailOrder: 12},
		{Key: "minerTxFeeIn", Formatter: "wei", Section: "Mining Rewards", NoTable: true, DetailOrder: 13},
		{Key: "minerUncleRewardIn", Formatter: "wei", Section: "Mining Rewards", NoTable: true, DetailOrder: 14},
		{Key: "selfDestructIn", Formatter: "wei", Section: "Special Transfers", NoTable: true, DetailOrder: 15},
		{Key: "selfDestructOut", Formatter: "wei", Section: "Special Transfers", NoTable: true, DetailOrder: 16},
		{Key: "prefundIn", Formatter: "wei", Section: "Special Transfers", NoTable: true, DetailOrder: 17},
		{Key: "actions", Section: "", NoDetail: true, Order: 8},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getWithdrawalsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Label: "Block", ColumnLabel: "Block", DetailLabel: "Block Number", Section: "Block Information", Width: 100, Order: 1, DetailOrder: 5},
		{Key: "index", Label: "Index", ColumnLabel: "Index", DetailLabel: "Withdrawal Index", Section: "Withdrawal Details", Width: 80, Order: 2, DetailOrder: 4},
		{Key: "validatorIndex", Label: "Validator", ColumnLabel: "Validator", DetailLabel: "Validator Index", Section: "Withdrawal Details", Width: 100, Order: 3, DetailOrder: 3},
		{Key: "address", Label: "Address", ColumnLabel: "Address", DetailLabel: "Recipient Address", Formatter: "address", Section: "Withdrawal Details", Width: 340, Order: 4, DetailOrder: 1},
		{Key: "amount", Label: "Amount", ColumnLabel: "Amount", DetailLabel: "Amount", Formatter: "ether", Section: "Withdrawal Details", Width: 150, Order: 5, DetailOrder: 2},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Order: 6},
		{Key: "timestamp", Label: "Timestamp", DetailLabel: "Timestamp", Formatter: "datetime", Section: "Block Information", NoTable: true, DetailOrder: 6},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
