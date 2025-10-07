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
		{Section: "Context", Key: "timestamp"},
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Details", Key: "owner", Formatter: "address"},
		{Section: "Details", Key: "spender", Formatter: "address"},
		{Section: "Details", Key: "token", Formatter: "address"},
		{Section: "Details", Key: "allowance", Formatter: "wei"},
		{Section: "Data", Key: "lastAppBlock", Formatter: "number", NoTable: true},
		{Section: "Data", Key: "lastAppLogID", Formatter: "number", NoTable: true},
		{Section: "Data", Key: "lastAppTs", Formatter: "timestamp", NoTable: true},
		{Section: "Data", Key: "lastAppTxID", Formatter: "number", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getAssetsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Asset Info", Key: "address", Formatter: "address"},
		{Section: "Asset Info", Key: "holder", Formatter: "address"},
		{Section: "Asset Info", Key: "symbol"},
		{Section: "Asset Info", Key: "name"},
		{Section: "Asset Info", Key: "decimals"},
		{Section: "Asset Info", Key: "totalSupply", Formatter: "wei"},
		{Section: "Classification", Key: "source", NoTable: true},
		{Section: "Classification", Key: "tags", NoTable: true},
		{Section: "Classification", Key: "isContract", NoTable: true},
		{Section: "Classification", Key: "isCustom", NoTable: true},
		{Section: "Classification", Key: "isErc20", NoTable: true},
		{Section: "Classification", Key: "isErc721", NoTable: true},
		{Section: "Classification", Key: "isPrefund", NoTable: true},
		{Section: "Classification", Key: "deleted", NoTable: true},
		{Section: "Data", Key: "parts", NoTable: true},
		{Section: "Data", Key: "prefund", Formatter: "wei", NoTable: true},
		{Section: "", Key: "actions", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getBalancesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Balance Info", Key: "date", Formatter: "datetime"},
		{Section: "Balance Info", Key: "holder", Formatter: "address"},
		{Section: "Balance Info", Key: "address", Formatter: "address"},
		{Section: "Balance Info", Key: "symbol"},
		{Section: "Balance Info", Key: "balance", Formatter: "wei"},
		{Section: "Details", Key: "decimals"},
		{Section: "Details", Key: "priorBalance", Formatter: "wei", NoTable: true},
		{Section: "Details", Key: "totalSupply", Formatter: "wei", NoTable: true},
		{Section: "Details", Key: "type", NoTable: true},
		{Section: "Details", Key: "name", NoTable: true},
		{Section: "Context", Key: "blockNumber", NoTable: true},
		{Section: "Context", Key: "transactionIndex", NoTable: true},
		{Section: "Context", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Context", Key: "blockNumber"},
		{Section: "Context", Key: "transactionIndex"},
		{Section: "Context", Key: "logIndex"},
		{Section: "Context", Key: "address", Formatter: "address"},
		{Section: "Context", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "Context", Key: "blockHash", Formatter: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Formatter: "hash"},
		{Section: "Details", Key: "topic1", Formatter: "hash"},
		{Section: "Details", Key: "topic2", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "data", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", Formatter: "json", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", NoTable: true},
		{Section: "", Key: "actions", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getReceiptsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Context", Key: "blockNumber"},
		{Section: "Context", Key: "transactionIndex"},
		{Section: "Context", Key: "transactionHash"},
		{Section: "Context", Key: "from"},
		{Section: "Context", Key: "to"},
		{Section: "Details", Key: "gasUsed"},
		{Section: "Details", Key: "status"},
		{Section: "Details", Key: "isError", NoTable: true},
		{Section: "Details", Key: "contractAddress", NoTable: true},
		{Section: "Details", Key: "cumulativeGasUsed", NoTable: true},
		{Section: "Details", Key: "effectiveGasPrice", NoTable: true},
		{Section: "Details", Key: "blockHash", NoTable: true},
		{Section: "Details", Key: "logsBloom", NoTable: true},
		{Section: "Data", Key: "logs", NoTable: true},
		{Section: "", Key: "actions", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getStatementsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Asset", Key: "timestamp", Formatter: "timestamp"},
		{Section: "Asset", Key: "asset"},
		{Section: "Asset", Key: "symbol", NoTable: true},
		{Section: "Asset", Key: "decimals", NoTable: true},
		{Section: "Asset", Key: "priceSource", NoTable: true},

		{Section: "Reconciliation", Key: "begBal"},
		{Section: "Reconciliation", Key: "totalIn", NoTable: true},
		{Section: "Reconciliation", Key: "totalOut", NoTable: true},
		{Section: "Reconciliation", Key: "amountNet"},
		{Section: "Reconciliation", Key: "endBal"},
		{Section: "Asset", Key: "spotPrice", Formatter: "float64", NoTable: true},
		{Section: "Reconciliation", Key: "endBalCalc", NoTable: true},

		{Section: "Summary", Key: "date", NoTable: true},
		{Section: "Summary", Key: "gasUsed", NoTable: true},
		{Section: "Summary", Key: "reconciliationType", NoTable: true},
		{Section: "Summary", Key: "accountedFor", NoTable: true},
		{Section: "Summary", Key: "reconciled", Formatter: "boolean"},

		{Section: "Inflow", Key: "amountIn", NoTable: true},
		{Section: "Inflow", Key: "internalIn", NoTable: true},
		{Section: "Inflow", Key: "selfDestructIn", NoTable: true},
		{Section: "Inflow", Key: "minerBaseRewardIn", NoTable: true},
		{Section: "Inflow", Key: "minerTxFeeIn", NoTable: true},
		{Section: "Inflow", Key: "prefundIn", NoTable: true},

		{Section: "Outflow", Key: "amountOut", NoTable: true},
		{Section: "Outflow", Key: "internalOut", NoTable: true},
		{Section: "Outflow", Key: "selfDestructOut", NoTable: true},
		{Section: "Outflow", Key: "gasOut", NoTable: true},

		{Section: "Details", Key: "blockNumber", NoTable: true},
		{Section: "Details", Key: "transactionIndex", NoTable: true},
		{Section: "Details", Key: "logIndex", NoTable: true},
		{Section: "Details", Key: "transactionHash", NoTable: true},
		{Section: "Details", Key: "sender", NoTable: true},
		{Section: "Details", Key: "recipient", NoTable: true},

		{Section: "Analysis", Key: "prevBal", NoTable: true},
		{Section: "Analysis", Key: "begBalDiff", NoTable: true},
		{Section: "Analysis", Key: "endBalDiff", NoTable: true},
		{Section: "Analysis", Key: "correctingReasons", NoTable: true},

		{Section: "Corrections", Key: "correctBegBalIn", NoTable: true},
		{Section: "Corrections", Key: "correctAmountIn", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalIn", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalOut", NoTable: true},
		{Section: "Corrections", Key: "correctAmountOut", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalOut", NoTable: true},

		{Section: "", Key: "actions", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getTracesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Context", Key: "blockNumber"},
		{Section: "Context", Key: "transactionIndex"},
		{Section: "Context", Key: "traceIndex"},
		{Section: "Action", Key: "from"},
		{Section: "Action", Key: "to"},
		{Section: "Action", Key: "value"},
		{Section: "Overview", Key: "type"},
		{Section: "Overview", Key: "error", NoTable: true},
		{Section: "Overview", Key: "subtraces", NoTable: true},
		{Section: "Overview", Key: "traceAddress", NoTable: true},
		{Section: "Action", Key: "gas", NoTable: true},
		{Section: "Action", Key: "callType", NoTable: true},
		{Section: "Action", Key: "input", NoTable: true},
		{Section: "Result", Key: "gasUsed", NoTable: true},
		{Section: "Result", Key: "output", NoTable: true},
		{Section: "Result", Key: "address", NoTable: true},
		{Section: "Result", Key: "code", NoTable: true},
		{Section: "Context", Key: "blockHash", NoTable: true},
		{Section: "Context", Key: "transactionHash", NoTable: true},
		{Section: "Context", Key: "timestamp", NoTable: true},
		{Section: "Articulation", Key: "articulatedTrace", NoTable: true},
		{Section: "Articulation", Key: "compressedTrace", NoTable: true},
		{Section: "", Key: "actions", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getTransactionsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Context", Key: "blockNumber"},
		{Section: "Context", Key: "transactionIndex"},
		{Section: "Overview", Key: "hash"},
		{Section: "Overview", Key: "from"},
		{Section: "Overview", Key: "to"},
		{Section: "Overview", Key: "value"},
		{Section: "Gas", Key: "gasUsed"},
		{Section: "", Key: "actions", NoDetail: true},
		{Section: "Overview", Key: "timestamp", NoTable: true},
		{Section: "Overview", Key: "input", NoTable: true},
		{Section: "Overview", Key: "articulatedTx", NoTable: true},
		{Section: "Overview", Key: "isError", NoTable: true},
		{Section: "Overview", Key: "hasToken", NoTable: true},
		{Section: "Gas", Key: "gas", NoTable: true},
		{Section: "Gas", Key: "gasPrice", NoTable: true},
		{Section: "Gas", Key: "maxFeePerGas", NoTable: true},
		{Section: "Gas", Key: "maxPriorityFeePerGas", NoTable: true},
		{Section: "Context", Key: "blockHash", NoTable: true},
		{Section: "Details", Key: "nonce", NoTable: true},
		{Section: "Details", Key: "type", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getTransfersFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Context", Key: "blockNumber"},
		{Section: "Context", Key: "transactionIndex"},
		{Section: "Context", Key: "logIndex"},
		{Section: "Details", Key: "from", Formatter: "address"},
		{Section: "Details", Key: "to", Formatter: "address"},
		{Section: "Details", Key: "asset", Formatter: "address"},
		{Section: "Breakdown", Key: "amount", Formatter: "wei"},
		{Section: "Details", Key: "sender", Formatter: "address", NoTable: true},
		{Section: "Details", Key: "recipient", Formatter: "address", NoTable: true},
		{Section: "Details", Key: "holder", Formatter: "address", NoTable: true},
		{Section: "Details", Key: "decimals", NoTable: true},
		{Section: "Breakdown", Key: "amountIn", Formatter: "wei", NoTable: true},
		{Section: "Breakdown", Key: "amountOut", Formatter: "wei", NoTable: true},
		{Section: "Breakdown", Key: "internalIn", Formatter: "wei", NoTable: true},
		{Section: "Breakdown", Key: "internalOut", Formatter: "wei", NoTable: true},
		{Section: "Breakdown", Key: "gasOut", Formatter: "wei", NoTable: true},
		{Section: "Mining", Key: "minerBaseRewardIn", Formatter: "wei", NoTable: true},
		{Section: "Mining", Key: "minerNephewRewardIn", Formatter: "wei", NoTable: true},
		{Section: "Mining", Key: "minerTxFeeIn", Formatter: "wei", NoTable: true},
		{Section: "Mining", Key: "minerUncleRewardIn", Formatter: "wei", NoTable: true},
		{Section: "Special", Key: "selfDestructIn", Formatter: "wei", NoTable: true},
		{Section: "Special", Key: "selfDestructOut", Formatter: "wei", NoTable: true},
		{Section: "Special", Key: "prefundIn", Formatter: "wei", NoTable: true},
		{Section: "", Key: "actions", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getWithdrawalsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Context", Key: "blockNumber"},
		{Section: "Context", Key: "timestamp"},
		{Section: "Details", Key: "index"},
		{Section: "Details", Key: "validatorIndex"},
		{Section: "Details", Key: "address"},
		{Section: "Details", Key: "amount"},
		{Section: "", Key: "actions", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
