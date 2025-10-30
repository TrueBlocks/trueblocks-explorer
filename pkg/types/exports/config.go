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
			Name:             "Assets",
			Store:            "assets",
			DividerBefore:    false,
			Fields:           getAssetsFields(),
			Actions:          []string{},
			HeaderActions:    []string{"export"},
			RendererTypes:    "panel",
			PanelChartConfig: getAssetsPanelConfig(),
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
		{Section: "Context", Key: "blockNumber", Type: "number"},
		{Section: "Context", Key: "transactionIndex", Type: "number"},
		{Section: "Context", Key: "logIndex", Type: "number"},
		{Section: "Context", Key: "address", Type: "address"},
		{Section: "Context", Key: "timestamp", Type: "datetime", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Type: "hash"},
		{Section: "Details", Key: "topic1", Type: "hash"},
		{Section: "Details", Key: "topic2", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Type: "hash", NoTable: true},
		{Section: "Details", Key: "data", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getApprovaltxsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "number"},
		{Section: "Context", Key: "transactionIndex", Type: "number"},
		{Section: "Overview", Key: "hash", Type: "hash"},
		{Section: "Overview", Key: "from", Type: "address"},
		{Section: "Overview", Key: "to", Type: "address"},
		{Section: "Overview", Key: "value", Type: "wei"},
		{Section: "Gas", Key: "gasUsed"},
		{Section: "Overview", Key: "timestamp", Type: "datetime", NoTable: true},
		{Section: "Overview", Key: "input", NoTable: true},
		{Section: "Overview", Key: "articulatedTx", NoTable: true},
		{Section: "Overview", Key: "isError", NoTable: true},
		{Section: "Overview", Key: "hasToken", NoTable: true},
		{Section: "Gas", Key: "gas", NoTable: true},
		{Section: "Gas", Key: "gasPrice", NoTable: true},
		{Section: "Gas", Key: "maxFeePerGas", NoTable: true},
		{Section: "Gas", Key: "maxPriorityFeePerGas", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "nonce", NoTable: true},
		{Section: "Details", Key: "type", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getAssetsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Asset", Key: "timestamp", Type: "datetime"},
		{Section: "Asset", Key: "accountedFor", Type: "address", NoTable: true},
		{Section: "Asset", Key: "symbol"},
		{Section: "Asset", Key: "asset", Type: "address"},
		{Section: "Asset", Key: "decimals", NoTable: true},
		{Section: "Asset", Key: "priceSource", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.begBalEth", Type: "ether", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.totalInEth", Type: "ether", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.totalOutEth", Type: "ether", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.amountNetEth", Type: "ether", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.endBalEth", Type: "ether"},
		{Section: "Asset", Key: "spotPrice", Type: "number"},
		{Section: "Asset", Key: "statementId", Label: "Count", Type: "number"},
		{Section: "Reconciliation", Key: "calcs.endBalCalcEth", Type: "ether", NoTable: true},
		{Section: "Summary", Key: "date", NoTable: true},
		{Section: "Summary", Key: "gasUsed", NoTable: true},
		{Section: "Summary", Key: "calcs.reconciliationType", NoTable: true},
		{Section: "Summary", Key: "calcs.reconciled", Type: "boolean", NoTable: true},
		{Section: "Inflow", Key: "amountIn", Type: "wei", NoTable: true},
		{Section: "Inflow", Key: "internalIn", Type: "wei", NoTable: true},
		{Section: "Inflow", Key: "selfDestructIn", Type: "wei", NoTable: true},
		{Section: "Inflow", Key: "minerBaseRewardIn", Type: "wei", NoTable: true},
		{Section: "Inflow", Key: "minerTxFeeIn", Type: "wei", NoTable: true},
		{Section: "Inflow", Key: "prefundIn", Type: "wei", NoTable: true},
		{Section: "Outflow", Key: "amountOut", Type: "wei", NoTable: true},
		{Section: "Outflow", Key: "internalOut", Type: "wei", NoTable: true},
		{Section: "Outflow", Key: "selfDestructOut", Type: "wei", NoTable: true},
		{Section: "Outflow", Key: "gasOut", Type: "wei", NoTable: true},
		{Section: "Details", Key: "blockNumber", Type: "number", NoTable: true},
		{Section: "Details", Key: "transactionIndex", Type: "number", NoTable: true},
		{Section: "Details", Key: "logIndex", Type: "number", NoTable: true},
		{Section: "Details", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "sender", Type: "address", NoTable: true},
		{Section: "Details", Key: "recipient", Type: "address", NoTable: true},
		{Section: "Analysis", Key: "prevBal", Type: "wei", NoTable: true},
		{Section: "Analysis", Key: "begBalDiff", Type: "wei", NoTable: true},
		{Section: "Analysis", Key: "endBalDiff", Type: "wei", NoTable: true},
		{Section: "Analysis", Key: "correctingReasons", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalIn", Type: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctAmountIn", Type: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalIn", Type: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalOut", Type: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctAmountOut", Type: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalOut", Type: "wei", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getBalancesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Balance Info", Key: "date"},
		{Section: "Balance Info", Key: "holder", Type: "address"},
		{Section: "Balance Info", Key: "address", Type: "address"},
		{Section: "Balance Info", Key: "symbol"},
		{Section: "Balance Info", Key: "balance", Type: "ether"},
		{Section: "Details", Key: "decimals"},
		{Section: "Details", Key: "priorBalance", Type: "ether", NoTable: true},
		{Section: "Details", Key: "totalSupply", Type: "ether", NoTable: true},
		{Section: "Details", Key: "type", NoTable: true},
		{Section: "Details", Key: "name", NoTable: true},
		{Section: "Context", Key: "blockNumber", Type: "number", NoTable: true},
		{Section: "Context", Key: "transactionIndex", Type: "number", NoTable: true},
		{Section: "Context", Key: "timestamp", Type: "datetime", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "number"},
		{Section: "Context", Key: "transactionIndex", Type: "number"},
		{Section: "Context", Key: "logIndex", Type: "number"},
		{Section: "Context", Key: "address", Type: "address"},
		{Section: "Context", Key: "timestamp", Type: "datetime", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Type: "hash"},
		{Section: "Details", Key: "topic1", Type: "hash"},
		{Section: "Details", Key: "topic2", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Type: "hash", NoTable: true},
		{Section: "Details", Key: "data", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getOpenapprovalsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "timestamp", Type: "datetime", NoTable: true},
		{Section: "Context", Key: "blockNumber", Type: "number", NoTable: true},
		{Section: "Details", Key: "owner", Type: "address"},
		{Section: "Details", Key: "token", Type: "address"},
		{Section: "Details", Key: "spender", Type: "address"},
		{Section: "Details", Key: "allowance", Type: "wei"},
		{Section: "Data", Key: "lastAppBlock", Type: "number", NoTable: true},
		{Section: "Data", Key: "lastAppLogID", Type: "number", NoTable: true},
		{Section: "Data", Key: "lastAppTs", Type: "datetime"},
		{Section: "Data", Key: "lastAppTxID", Type: "number", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getReceiptsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "number"},
		{Section: "Context", Key: "transactionIndex", Type: "number"},
		{Section: "Context", Key: "transactionHash", Type: "hash"},
		{Section: "Context", Key: "from", Type: "address"},
		{Section: "Context", Key: "to", Type: "address"},
		{Section: "Details", Key: "gasUsed"},
		{Section: "Details", Key: "status"},
		{Section: "Details", Key: "isError", NoTable: true},
		{Section: "Details", Key: "contractAddress", Type: "address", NoTable: true},
		{Section: "Details", Key: "cumulativeGasUsed", NoTable: true},
		{Section: "Details", Key: "effectiveGasPrice", NoTable: true},
		{Section: "Details", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "logsBloom", NoTable: true},
		{Section: "Data", Key: "logs", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getStatementsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Asset", Key: "timestamp", Type: "datetime"},
		{Section: "Asset", Key: "asset", Type: "address"},
		{Section: "Asset", Key: "symbol", NoTable: true},
		{Section: "Asset", Key: "decimals", NoTable: true},
		{Section: "Asset", Key: "priceSource", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.begBalEth", Type: "ether"},
		{Section: "Reconciliation", Key: "calcs.totalInEth", Type: "ether"},
		{Section: "Reconciliation", Key: "calcs.totalOutEth", Type: "ether"},
		{Section: "Reconciliation", Key: "calcs.amountNetEth", Type: "ether", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.endBalEth", Type: "ether"},
		{Section: "Asset", Key: "spotPrice", Type: "number", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.endBalCalcEth", Type: "ether"},
		{Section: "Summary", Key: "date", NoTable: true},
		{Section: "Summary", Key: "gasUsed", NoTable: true},
		{Section: "Summary", Key: "calcs.reconciliationType", NoTable: true},
		{Section: "Summary", Key: "accountedFor", Type: "address", NoTable: true},
		{Section: "Summary", Key: "calcs.reconciled", Type: "boolean"},
		{Section: "Inflow", Key: "amountIn", Type: "wei", NoTable: true},
		{Section: "Inflow", Key: "internalIn", Type: "wei", NoTable: true},
		{Section: "Inflow", Key: "selfDestructIn", Type: "wei", NoTable: true},
		{Section: "Inflow", Key: "minerBaseRewardIn", Type: "wei", NoTable: true},
		{Section: "Inflow", Key: "minerTxFeeIn", Type: "wei", NoTable: true},
		{Section: "Inflow", Key: "prefundIn", Type: "wei", NoTable: true},
		{Section: "Outflow", Key: "amountOut", Type: "wei", NoTable: true},
		{Section: "Outflow", Key: "internalOut", Type: "wei", NoTable: true},
		{Section: "Outflow", Key: "selfDestructOut", Type: "wei", NoTable: true},
		{Section: "Outflow", Key: "gasOut", Type: "wei", NoTable: true},
		{Section: "Details", Key: "blockNumber", Type: "number", NoTable: true},
		{Section: "Details", Key: "transactionIndex", Type: "number", NoTable: true},
		{Section: "Details", Key: "logIndex", Type: "number", NoTable: true},
		{Section: "Details", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "sender", Type: "address", NoTable: true},
		{Section: "Details", Key: "recipient", Type: "address", NoTable: true},
		{Section: "Analysis", Key: "prevBal", Type: "wei", NoTable: true},
		{Section: "Analysis", Key: "begBalDiff", Type: "wei", NoTable: true},
		{Section: "Analysis", Key: "endBalDiff", Type: "wei", NoTable: true},
		{Section: "Analysis", Key: "correctingReasons", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalIn", Type: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctAmountIn", Type: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalIn", Type: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalOut", Type: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctAmountOut", Type: "wei", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalOut", Type: "wei", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getTracesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "number"},
		{Section: "Context", Key: "transactionIndex", Type: "number"},
		{Section: "Context", Key: "traceIndex", Type: "number"},
		{Section: "Action", Key: "from", Type: "address"},
		{Section: "Action", Key: "to", Type: "address"},
		{Section: "Action", Key: "value", Type: "wei"},
		{Section: "Overview", Key: "type"},
		{Section: "Overview", Key: "error", NoTable: true},
		{Section: "Overview", Key: "subtraces", Type: "number", NoTable: true},
		{Section: "Overview", Key: "traceAddress", Type: "number", NoTable: true},
		{Section: "Action", Key: "gas", NoTable: true},
		{Section: "Action", Key: "callType", NoTable: true},
		{Section: "Action", Key: "input", NoTable: true},
		{Section: "Result", Key: "gasUsed", NoTable: true},
		{Section: "Result", Key: "output", NoTable: true},
		{Section: "Result", Key: "address", Type: "address", NoTable: true},
		{Section: "Result", Key: "code", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "timestamp", Type: "datetime", NoTable: true},
		{Section: "Articulation", Key: "articulatedTrace", NoTable: true},
		{Section: "Articulation", Key: "compressedTrace", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getTransactionsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "number"},
		{Section: "Context", Key: "transactionIndex", Type: "number"},
		{Section: "Overview", Key: "hash", Type: "hash"},
		{Section: "Overview", Key: "from", Type: "address"},
		{Section: "Overview", Key: "to", Type: "address"},
		{Section: "Overview", Key: "value", Type: "wei"},
		{Section: "Gas", Key: "gasUsed"},
		{Section: "Overview", Key: "timestamp", Type: "datetime", NoTable: true},
		{Section: "Overview", Key: "input", NoTable: true},
		{Section: "Overview", Key: "articulatedTx", NoTable: true},
		{Section: "Overview", Key: "isError", NoTable: true},
		{Section: "Overview", Key: "hasToken", NoTable: true},
		{Section: "Gas", Key: "gas", NoTable: true},
		{Section: "Gas", Key: "gasPrice", NoTable: true},
		{Section: "Gas", Key: "maxFeePerGas", NoTable: true},
		{Section: "Gas", Key: "maxPriorityFeePerGas", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "nonce", NoTable: true},
		{Section: "Details", Key: "type", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getTransfersFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "number"},
		{Section: "Context", Key: "transactionIndex", Type: "number"},
		{Section: "Context", Key: "logIndex", Type: "number"},
		{Section: "Details", Key: "from", Type: "address"},
		{Section: "Details", Key: "to", Type: "address"},
		{Section: "Details", Key: "asset", Type: "address"},
		{Section: "Breakdown", Key: "amount", Type: "wei"},
		{Section: "Details", Key: "sender", Type: "address", NoTable: true},
		{Section: "Details", Key: "recipient", Type: "address", NoTable: true},
		{Section: "Details", Key: "holder", Type: "address", NoTable: true},
		{Section: "Details", Key: "decimals", Type: "number", NoTable: true},
		{Section: "Breakdown", Key: "amountIn", Type: "wei", NoTable: true},
		{Section: "Breakdown", Key: "amountOut", Type: "wei", NoTable: true},
		{Section: "Breakdown", Key: "internalIn", Type: "wei", NoTable: true},
		{Section: "Breakdown", Key: "internalOut", Type: "wei", NoTable: true},
		{Section: "Breakdown", Key: "gasOut", Type: "wei", NoTable: true},
		{Section: "Mining", Key: "minerBaseRewardIn", Type: "wei", NoTable: true},
		{Section: "Mining", Key: "minerNephewRewardIn", Type: "wei", NoTable: true},
		{Section: "Mining", Key: "minerTxFeeIn", Type: "wei", NoTable: true},
		{Section: "Mining", Key: "minerUncleRewardIn", Type: "wei", NoTable: true},
		{Section: "Special", Key: "selfDestructIn", Type: "wei", NoTable: true},
		{Section: "Special", Key: "selfDestructOut", Type: "wei", NoTable: true},
		{Section: "Special", Key: "prefundIn", Type: "wei", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getWithdrawalsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "number"},
		{Section: "Context", Key: "timestamp", Type: "datetime"},
		{Section: "Details", Key: "index"},
		{Section: "Details", Key: "validatorIndex"},
		{Section: "Details", Key: "address", Type: "address"},
		{Section: "Details", Key: "amount", Type: "wei"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
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

func getAssetsPanelConfig() *types.PanelChartConfig {
	return &types.PanelChartConfig{
		Type:          "piechart",
		DefaultMetric: "endBalEth",
		Metrics: []types.MetricConfig{
			{
				Key:          "endBalEth",
				Label:        "End Balance (ETH)",
				BucketsField: "endBalEth",
				Bytes:        false,
			},
			{
				Key:          "totalInEth",
				Label:        "Total Inflow (ETH)",
				BucketsField: "totalInEth",
				Bytes:        false,
			},
			{
				Key:          "totalOutEth",
				Label:        "Total Outflow (ETH)",
				BucketsField: "totalOutEth",
				Bytes:        false,
			},
			{
				Key:          "spotPrice",
				Label:        "Spot Price",
				BucketsField: "spotPrice",
				Bytes:        false,
			},
		},
	}
}

// EXISTING_CODE
