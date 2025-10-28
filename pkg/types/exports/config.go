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
			DividerBefore: false,
			Fields:        getStatementsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "panel",
		},
		"balances": {
			Name:          "Balances",
			Store:         "balances",
			DividerBefore: false,
			Fields:        getBalancesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"transfers": {
			Name:          "Transfers",
			Store:         "transfers",
			DividerBefore: false,
			Fields:        getTransfersFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"transactions": {
			Name:          "Transactions",
			Store:         "transactions",
			DividerBefore: false,
			Fields:        getTransactionsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"openapprovals": {
			Name:          "Open Approvals",
			Store:         "openapprovals",
			DividerBefore: false,
			Fields:        getOpenapprovalsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "panel",
		},
		"approvallogs": {
			Name:          "Approval Logs",
			Store:         "approvallogs",
			DividerBefore: false,
			Fields:        getApprovallogsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"approvaltxs": {
			Name:          "Approval Txs",
			Store:         "approvaltxs",
			DividerBefore: false,
			Fields:        getApprovaltxsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"withdrawals": {
			Name:          "Withdrawals",
			Store:         "withdrawals",
			DividerBefore: false,
			Fields:        getWithdrawalsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"assets": {
			Name:          "Assets",
			Store:         "assets",
			DividerBefore: false,
			Fields:        getAssetsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"assetcharts": {
			Name:             "Asset Charts",
			Store:            "statements",
			ViewType:         "canvas",
			DividerBefore:    false,
			Fields:           getStatementsFields(),
			Actions:          []string{},
			HeaderActions:    []string{"export"},
			RendererTypes:    "facet",
			FacetChartConfig: getAssetChartsFacetConfig(),
		},
		"logs": {
			Name:          "Logs",
			Store:         "logs",
			DividerBefore: false,
			Fields:        getLogsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"traces": {
			Name:          "Traces",
			Store:         "traces",
			DividerBefore: false,
			Fields:        getTracesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"receipts": {
			Name:          "Receipts",
			Store:         "receipts",
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
		FacetOrder: []string{"statements", "balances", "transfers", "transactions", "openapprovals", "approvallogs", "approvaltxs", "withdrawals", "assets", "assetcharts", "logs", "traces", "receipts"},
		Actions: map[string]types.ActionConfig{
			"export": {Name: "export", Label: "Export", Icon: "Export"},
		},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getApprovallogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Context", Key: "transactionIndex", Formatter: "number"},
		{Section: "Context", Key: "logIndex", Formatter: "number"},
		{Section: "Context", Key: "address", Formatter: "address"},
		{Section: "Context", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "Context", Key: "blockHash", Formatter: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Formatter: "hash"},
		{Section: "Details", Key: "topic1", Formatter: "hash"},
		{Section: "Details", Key: "topic2", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "data", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getApprovaltxsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Context", Key: "transactionIndex", Formatter: "number"},
		{Section: "Overview", Key: "hash", Formatter: "hash"},
		{Section: "Overview", Key: "from", Formatter: "address"},
		{Section: "Overview", Key: "to", Formatter: "address"},
		{Section: "Overview", Key: "value", Formatter: "wei"},
		{Section: "Gas", Key: "gasUsed"},
		{Section: "Overview", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "Overview", Key: "input", NoTable: true},
		{Section: "Overview", Key: "articulatedTx", NoTable: true},
		{Section: "Overview", Key: "isError", NoTable: true},
		{Section: "Overview", Key: "hasToken", NoTable: true},
		{Section: "Gas", Key: "gas", NoTable: true},
		{Section: "Gas", Key: "gasPrice", NoTable: true},
		{Section: "Gas", Key: "maxFeePerGas", NoTable: true},
		{Section: "Gas", Key: "maxPriorityFeePerGas", NoTable: true},
		{Section: "Context", Key: "blockHash", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "nonce", NoTable: true},
		{Section: "Details", Key: "type", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getAssetsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
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
		{Section: "Classification", Key: "deleted", Formatter: "boolean", NoTable: true},
		{Section: "Data", Key: "prefund", Formatter: "wei", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getBalancesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Balance Info", Key: "date"},
		{Section: "Balance Info", Key: "holder", Formatter: "address"},
		{Section: "Balance Info", Key: "address", Formatter: "address"},
		{Section: "Balance Info", Key: "symbol"},
		{Section: "Balance Info", Key: "balance", Formatter: "ether"},
		{Section: "Details", Key: "decimals"},
		{Section: "Details", Key: "priorBalance", Formatter: "ether", NoTable: true},
		{Section: "Details", Key: "totalSupply", Formatter: "ether", NoTable: true},
		{Section: "Details", Key: "type", NoTable: true},
		{Section: "Details", Key: "name", NoTable: true},
		{Section: "Context", Key: "blockNumber", Formatter: "number", NoTable: true},
		{Section: "Context", Key: "transactionIndex", Formatter: "number", NoTable: true},
		{Section: "Context", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Context", Key: "transactionIndex", Formatter: "number"},
		{Section: "Context", Key: "logIndex", Formatter: "number"},
		{Section: "Context", Key: "address", Formatter: "address"},
		{Section: "Context", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "Context", Key: "blockHash", Formatter: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Formatter: "hash"},
		{Section: "Details", Key: "topic1", Formatter: "hash"},
		{Section: "Details", Key: "topic2", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "data", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getOpenapprovalsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "Context", Key: "blockNumber", Formatter: "number", NoTable: true},
		{Section: "Details", Key: "owner", Formatter: "address"},
		{Section: "Details", Key: "token", Formatter: "address"},
		{Section: "Details", Key: "spender", Formatter: "address"},
		{Section: "Details", Key: "allowance", Formatter: "wei"},
		{Section: "Data", Key: "lastAppBlock", Formatter: "number", NoTable: true},
		{Section: "Data", Key: "lastAppLogID", Formatter: "number", NoTable: true},
		{Section: "Data", Key: "lastAppTs", Formatter: "datetime"},
		{Section: "Data", Key: "lastAppTxID", Formatter: "number", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getReceiptsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Context", Key: "transactionIndex", Formatter: "number"},
		{Section: "Context", Key: "transactionHash", Formatter: "hash"},
		{Section: "Context", Key: "from", Formatter: "address"},
		{Section: "Context", Key: "to", Formatter: "address"},
		{Section: "Details", Key: "gasUsed"},
		{Section: "Details", Key: "status"},
		{Section: "Details", Key: "isError", NoTable: true},
		{Section: "Details", Key: "contractAddress", Formatter: "address", NoTable: true},
		{Section: "Details", Key: "cumulativeGasUsed", NoTable: true},
		{Section: "Details", Key: "effectiveGasPrice", NoTable: true},
		{Section: "Details", Key: "blockHash", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "logsBloom", NoTable: true},
		{Section: "Data", Key: "logs", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getStatementsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Asset", Key: "timestamp", Formatter: "datetime"},
		{Section: "Asset", Key: "asset", Formatter: "address"},
		{Section: "Asset", Key: "symbol", NoTable: true},
		{Section: "Asset", Key: "decimals", NoTable: true},
		{Section: "Asset", Key: "priceSource", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.begBalEth", Formatter: "ether"},
		{Section: "Reconciliation", Key: "calcs.totalInEth", Formatter: "ether"},
		{Section: "Reconciliation", Key: "calcs.totalOutEth", Formatter: "ether"},
		{Section: "Reconciliation", Key: "calcs.amountNetEth", Formatter: "ether", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.endBalEth", Formatter: "ether"},
		{Section: "Asset", Key: "spotPrice", Formatter: "number", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.endBalCalcEth", Formatter: "ether", NoTable: true},
		{Section: "Summary", Key: "date", NoTable: true},
		{Section: "Summary", Key: "gasUsed", NoTable: true},
		{Section: "Summary", Key: "calcs.reconciliationType", NoTable: true},
		{Section: "Summary", Key: "accountedFor", Formatter: "address", NoTable: true},
		{Section: "Summary", Key: "calcs.reconciled", Formatter: "boolean"},
		{Section: "Inflow", Key: "amountIn", Formatter: "wei", NoTable: true},
		{Section: "Inflow", Key: "internalIn", Formatter: "wei", NoTable: true},
		{Section: "Inflow", Key: "selfDestructIn", Formatter: "wei", NoTable: true},
		{Section: "Inflow", Key: "minerBaseRewardIn", Formatter: "wei", NoTable: true},
		{Section: "Inflow", Key: "minerTxFeeIn", Formatter: "wei", NoTable: true},
		{Section: "Inflow", Key: "prefundIn", Formatter: "wei", NoTable: true},
		{Section: "Outflow", Key: "amountOut", Formatter: "wei", NoTable: true},
		{Section: "Outflow", Key: "internalOut", Formatter: "wei", NoTable: true},
		{Section: "Outflow", Key: "selfDestructOut", Formatter: "wei", NoTable: true},
		{Section: "Outflow", Key: "gasOut", Formatter: "wei", NoTable: true},
		{Section: "Details", Key: "blockNumber", Formatter: "number", NoTable: true},
		{Section: "Details", Key: "transactionIndex", Formatter: "number", NoTable: true},
		{Section: "Details", Key: "logIndex", Formatter: "number", NoTable: true},
		{Section: "Details", Key: "transactionHash", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "sender", Formatter: "address", NoTable: true},
		{Section: "Details", Key: "recipient", Formatter: "address", NoTable: true},
		{Section: "Analysis", Key: "prevBal", Formatter: "wei", NoTable: true},
		{Section: "Analysis", Key: "begBalDiff", Formatter: "wei", NoTable: true},
		{Section: "Analysis", Key: "endBalDiff", Formatter: "wei", NoTable: true},
		{Section: "Analysis", Key: "correctingReasons", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalIn", Formatter: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctAmountIn", Formatter: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalIn", Formatter: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalOut", Formatter: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctAmountOut", Formatter: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalOut", Formatter: "wei", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getTracesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Context", Key: "transactionIndex", Formatter: "number"},
		{Section: "Context", Key: "traceIndex", Formatter: "number"},
		{Section: "Action", Key: "from", Formatter: "address"},
		{Section: "Action", Key: "to", Formatter: "address"},
		{Section: "Action", Key: "value", Formatter: "wei"},
		{Section: "Overview", Key: "type"},
		{Section: "Overview", Key: "error", NoTable: true},
		{Section: "Overview", Key: "subtraces", Formatter: "number", NoTable: true},
		{Section: "Overview", Key: "traceAddress", Formatter: "number", NoTable: true},
		{Section: "Action", Key: "gas", NoTable: true},
		{Section: "Action", Key: "callType", NoTable: true},
		{Section: "Action", Key: "input", NoTable: true},
		{Section: "Result", Key: "gasUsed", NoTable: true},
		{Section: "Result", Key: "output", NoTable: true},
		{Section: "Result", Key: "address", Formatter: "address", NoTable: true},
		{Section: "Result", Key: "code", NoTable: true},
		{Section: "Context", Key: "blockHash", Formatter: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Formatter: "hash", NoTable: true},
		{Section: "Context", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "Articulation", Key: "articulatedTrace", NoTable: true},
		{Section: "Articulation", Key: "compressedTrace", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getTransactionsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Context", Key: "transactionIndex", Formatter: "number"},
		{Section: "Overview", Key: "hash", Formatter: "hash"},
		{Section: "Overview", Key: "from", Formatter: "address"},
		{Section: "Overview", Key: "to", Formatter: "address"},
		{Section: "Overview", Key: "value", Formatter: "wei"},
		{Section: "Gas", Key: "gasUsed"},
		{Section: "Overview", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "Overview", Key: "input", NoTable: true},
		{Section: "Overview", Key: "articulatedTx", NoTable: true},
		{Section: "Overview", Key: "isError", NoTable: true},
		{Section: "Overview", Key: "hasToken", NoTable: true},
		{Section: "Gas", Key: "gas", NoTable: true},
		{Section: "Gas", Key: "gasPrice", NoTable: true},
		{Section: "Gas", Key: "maxFeePerGas", NoTable: true},
		{Section: "Gas", Key: "maxPriorityFeePerGas", NoTable: true},
		{Section: "Context", Key: "blockHash", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "nonce", NoTable: true},
		{Section: "Details", Key: "type", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getTransfersFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Context", Key: "transactionIndex", Formatter: "number"},
		{Section: "Context", Key: "logIndex", Formatter: "number"},
		{Section: "Details", Key: "from", Formatter: "address"},
		{Section: "Details", Key: "to", Formatter: "address"},
		{Section: "Details", Key: "asset", Formatter: "address"},
		{Section: "Breakdown", Key: "amount", Formatter: "wei"},
		{Section: "Details", Key: "sender", Formatter: "address", NoTable: true},
		{Section: "Details", Key: "recipient", Formatter: "address", NoTable: true},
		{Section: "Details", Key: "holder", Formatter: "address", NoTable: true},
		{Section: "Details", Key: "decimals", Formatter: "number", NoTable: true},
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
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getWithdrawalsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Context", Key: "timestamp", Formatter: "datetime"},
		{Section: "Details", Key: "index"},
		{Section: "Details", Key: "validatorIndex"},
		{Section: "Details", Key: "address", Formatter: "address"},
		{Section: "Details", Key: "amount", Formatter: "wei"},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
func getAssetChartsFacetConfig() *types.FacetChartConfig {
	return &types.FacetChartConfig{
		SeriesStrategy:  "address+symbol",
		SeriesPrefixLen: 12,
	}
}

// EXISTING_CODE
