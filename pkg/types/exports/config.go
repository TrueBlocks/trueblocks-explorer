// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package exports

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

// GetConfig returns the ViewConfig for the Exports view
func (c *ExportsCollection) GetConfig() (*types.ViewConfig, error) {
	facets := c.buildStaticFacets()
	facetOrder := c.buildFacetOrder()

	cfg := &types.ViewConfig{
		ViewName:   "exports",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions:    c.buildActions(),
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func (c *ExportsCollection) buildStaticFacets() map[string]types.FacetConfig {
	return map[string]types.FacetConfig{
		"statements": {
			Name:          "Statements",
			Store:         "statements",
			ViewType:      "table",
			Panel:         "custom",
			DividerBefore: false,
			Fields:        getStatementsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"balances": {
			Name:          "Balances",
			Store:         "balances",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getBalancesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"transfers": {
			Name:          "Transfers",
			Store:         "transfers",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getTransfersFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"transactions": {
			Name:          "Transactions",
			Store:         "transactions",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getTransactionsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"openapprovals": {
			Name:          "Open Approvals",
			Store:         "openapprovals",
			ViewType:      "table",
			Panel:         "custom",
			DividerBefore: false,
			Fields:        getOpenapprovalsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"approvallogs": {
			Name:          "Approval Logs",
			Store:         "approvallogs",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getApprovallogsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"approvaltxs": {
			Name:          "Approval Txs",
			Store:         "approvaltxs",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getApprovaltxsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"withdrawals": {
			Name:          "Withdrawals",
			Store:         "withdrawals",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getWithdrawalsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"assets": {
			Name:             "Assets",
			Store:            "assets",
			ViewType:         "table",
			Panel:            "custom",
			DividerBefore:    false,
			Fields:           getAssetsFields(),
			Actions:          []string{},
			HeaderActions:    []string{"export"},
			PanelChartConfig: getAssetsPanelConfig(),
		},
		"assetcharts": {
			Name:             "Asset Charts",
			Store:            "statements",
			ViewType:         "custom",
			DividerBefore:    false,
			Fields:           getStatementsFields(),
			Actions:          []string{},
			HeaderActions:    []string{"export"},
			FacetChartConfig: getAssetChartsFacetConfig(),
		},
		"logs": {
			Name:          "Logs",
			Store:         "logs",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getLogsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"traces": {
			Name:          "Traces",
			Store:         "traces",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getTracesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"receipts": {
			Name:          "Receipts",
			Store:         "receipts",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getReceiptsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
	}
}

func (c *ExportsCollection) buildFacetOrder() []string {
	return []string{
		"statements",
		"balances",
		"transfers",
		"transactions",
		"openapprovals",
		"approvallogs",
		"approvaltxs",
		"withdrawals",
		"assets",
		"assetcharts",
		"logs",
		"traces",
		"receipts",
	}
}

func (c *ExportsCollection) buildActions() map[string]types.ActionConfig {
	return map[string]types.ActionConfig{
		"export": {Name: "export", Label: "Export", Icon: "Export"},
	}
}

func getApprovallogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "blknum"},
		{Section: "Context", Key: "transactionIndex", Type: "txnum"},
		{Section: "Context", Key: "logIndex", Type: "lognum"},
		{Section: "Context", Key: "address", Type: "address"},
		{Section: "Context", Key: "timestamp", Type: "timestamp", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Type: "hash"},
		{Section: "Details", Key: "topic1", Type: "hash"},
		{Section: "Details", Key: "topic2", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Type: "hash", NoTable: true},
		{Section: "Details", Key: "data", Type: "bytes", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", Type: "string", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getApprovaltxsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "blknum"},
		{Section: "Context", Key: "transactionIndex", Type: "txnum"},
		{Section: "Overview", Key: "hash", Type: "hash"},
		{Section: "Overview", Key: "from", Type: "address"},
		{Section: "Overview", Key: "to", Type: "address"},
		{Section: "Overview", Key: "value", Type: "wei"},
		{Section: "Gas", Key: "gasUsed", Type: "gas"},
		{Section: "Overview", Key: "timestamp", Type: "timestamp", NoTable: true},
		{Section: "Overview", Key: "input", Type: "bytes", NoTable: true},
		{Section: "Overview", Key: "articulatedTx", NoTable: true},
		{Section: "Overview", Key: "isError", Type: "boolean", NoTable: true},
		{Section: "Overview", Key: "hasToken", Type: "boolean", NoTable: true},
		{Section: "Gas", Key: "gas", Type: "gas", NoTable: true},
		{Section: "Gas", Key: "gasPrice", Type: "gas", NoTable: true},
		{Section: "Gas", Key: "maxFeePerGas", Type: "gas", NoTable: true},
		{Section: "Gas", Key: "maxPriorityFeePerGas", Type: "gas", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "nonce", Type: "value", NoTable: true},
		{Section: "Details", Key: "type", Type: "string", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getAssetsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Asset", Key: "timestamp", Type: "timestamp"},
		{Section: "Asset", Key: "asset", Type: "address"},
		{Section: "Asset", Key: "symbol", Type: "string"},
		{Section: "Asset", Key: "decimals", Type: "value", NoTable: true},
		{Section: "Asset", Key: "priceSource", Type: "string", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.begBalEth", Type: "ether"},
		{Section: "Reconciliation", Key: "calcs.totalInEth", Type: "ether"},
		{Section: "Reconciliation", Key: "calcs.totalOutEth", Type: "ether"},
		{Section: "Reconciliation", Key: "calcs.amountNetEth", Type: "ether", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.endBalEth", Type: "ether"},
		{Section: "Asset", Key: "spotPrice", Type: "float64"},
		{Section: "Asset", Key: "statementId", Type: "uint64"},
		{Section: "Reconciliation", Key: "calcs.endBalCalcEth", Type: "ether", NoTable: true},
		{Section: "Summary", Key: "date", Type: "datetime", NoTable: true},
		{Section: "Summary", Key: "gasUsed", Type: "gas", NoTable: true},
		{Section: "Summary", Key: "calcs.reconciliationType", Type: "string", NoTable: true},
		{Section: "Asset", Key: "accountedFor", Type: "address", NoTable: true},
		{Section: "Summary", Key: "calcs.reconciled", Type: "boolean"},
		{Section: "Inflow", Key: "amountIn", Type: "int256", NoTable: true},
		{Section: "Inflow", Key: "internalIn", Type: "int256", NoTable: true},
		{Section: "Inflow", Key: "selfDestructIn", Type: "int256", NoTable: true},
		{Section: "Inflow", Key: "minerBaseRewardIn", Type: "int256", NoTable: true},
		{Section: "Inflow", Key: "minerTxFeeIn", Type: "int256", NoTable: true},
		{Section: "Inflow", Key: "prefundIn", Type: "int256", NoTable: true},
		{Section: "Outflow", Key: "amountOut", Type: "int256", NoTable: true},
		{Section: "Outflow", Key: "internalOut", Type: "int256", NoTable: true},
		{Section: "Outflow", Key: "selfDestructOut", Type: "int256", NoTable: true},
		{Section: "Outflow", Key: "gasOut", Type: "int256", NoTable: true},
		{Section: "Details", Key: "blockNumber", Type: "blknum", NoTable: true},
		{Section: "Details", Key: "transactionIndex", Type: "txnum", NoTable: true},
		{Section: "Details", Key: "logIndex", Type: "lognum", NoTable: true},
		{Section: "Details", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "sender", Type: "address", NoTable: true},
		{Section: "Details", Key: "recipient", Type: "address", NoTable: true},
		{Section: "Analysis", Key: "prevBal", Type: "int256", NoTable: true},
		{Section: "Analysis", Key: "begBalDiff", Type: "int256", NoTable: true},
		{Section: "Analysis", Key: "endBalDiff", Type: "int256", NoTable: true},
		{Section: "Analysis", Key: "correctingReasons", Type: "string", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalIn", Type: "int256", NoTable: true},
		{Section: "Corrections", Key: "correctAmountIn", Type: "int256", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalIn", Type: "int256", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalOut", Type: "int256", NoTable: true},
		{Section: "Corrections", Key: "correctAmountOut", Type: "int256", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalOut", Type: "int256", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getBalancesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Balance Info", Key: "holder", Type: "address"},
		{Section: "Details", Key: "name", Type: "string", NoTable: true},
		{Section: "Balance Info", Key: "address", Type: "address"},
		{Section: "Balance Info", Key: "symbol", Type: "string"},
		{Section: "Balance Info", Key: "balance", Type: "ether"},
		{Section: "Details", Key: "decimals", Type: "int64"},
		{Section: "Details", Key: "priorBalance", Type: "ether", NoTable: true},
		{Section: "Details", Key: "totalSupply", Type: "ether", NoTable: true},
		{Section: "Details", Key: "type", Type: "string", NoTable: true},
		{Section: "Context", Key: "blockNumber", Type: "blknum", NoTable: true},
		{Section: "Context", Key: "transactionIndex", Type: "txnum", NoTable: true},
		{Section: "Context", Key: "timestamp", Type: "timestamp", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "blknum"},
		{Section: "Context", Key: "transactionIndex", Type: "txnum"},
		{Section: "Context", Key: "logIndex", Type: "lognum"},
		{Section: "Context", Key: "address", Type: "address"},
		{Section: "Context", Key: "timestamp", Type: "timestamp", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Type: "hash"},
		{Section: "Details", Key: "topic1", Type: "hash"},
		{Section: "Details", Key: "topic2", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Type: "hash", NoTable: true},
		{Section: "Details", Key: "data", Type: "bytes", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", Type: "string", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getOpenapprovalsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "timestamp", Type: "timestamp", NoTable: true},
		{Section: "Context", Key: "blockNumber", Type: "blknum", NoTable: true},
		{Section: "Details", Key: "owner", Type: "address"},
		{Section: "Details", Key: "token", Type: "address"},
		{Section: "Details", Key: "spender", Type: "address"},
		{Section: "Details", Key: "allowance", Type: "wei"},
		{Section: "Data", Key: "lastAppBlock", Type: "blknum", NoTable: true},
		{Section: "Data", Key: "lastAppLogID", Type: "lognum", NoTable: true},
		{Section: "Data", Key: "lastAppTs", Type: "timestamp"},
		{Section: "Data", Key: "lastAppTxID", Type: "txnum", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getReceiptsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "blknum"},
		{Section: "Context", Key: "transactionIndex", Type: "txnum"},
		{Section: "Context", Key: "transactionHash", Type: "hash"},
		{Section: "Context", Key: "from", Type: "address"},
		{Section: "Context", Key: "to", Type: "address"},
		{Section: "Details", Key: "gasUsed", Type: "gas"},
		{Section: "Details", Key: "status", Type: "value"},
		{Section: "Details", Key: "isError", Type: "boolean", NoTable: true},
		{Section: "Details", Key: "contractAddress", Type: "address", NoTable: true},
		{Section: "Details", Key: "cumulativeGasUsed", Type: "gas", NoTable: true},
		{Section: "Details", Key: "effectiveGasPrice", Type: "gas", NoTable: true},
		{Section: "Details", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "logsBloom", Type: "string", NoTable: true},
		{Section: "Data", Key: "logs", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getStatementsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Asset", Key: "timestamp", Type: "timestamp"},
		{Section: "Asset", Key: "asset", Type: "address"},
		{Section: "Asset", Key: "symbol", Type: "string", NoTable: true},
		{Section: "Asset", Key: "decimals", Type: "value", NoTable: true},
		{Section: "Asset", Key: "priceSource", Type: "string", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.begBalEth", Type: "ether"},
		{Section: "Reconciliation", Key: "calcs.totalInEth", Type: "ether"},
		{Section: "Reconciliation", Key: "calcs.totalOutEth", Type: "ether"},
		{Section: "Reconciliation", Key: "calcs.amountNetEth", Type: "ether", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.endBalEth", Type: "ether"},
		{Section: "Asset", Key: "spotPrice", Type: "float64", NoTable: true},
		{Section: "Reconciliation", Key: "calcs.endBalCalcEth", Type: "ether", NoTable: true},
		{Section: "Summary", Key: "date", Type: "datetime", NoTable: true},
		{Section: "Summary", Key: "gasUsed", Type: "gas", NoTable: true},
		{Section: "Summary", Key: "calcs.reconciliationType", Type: "string", NoTable: true},
		{Section: "Summary", Key: "accountedFor", Type: "address", NoTable: true},
		{Section: "Summary", Key: "calcs.reconciled", Type: "boolean"},
		{Section: "Inflow", Key: "amountIn", Type: "int256", NoTable: true},
		{Section: "Inflow", Key: "internalIn", Type: "int256", NoTable: true},
		{Section: "Inflow", Key: "selfDestructIn", Type: "int256", NoTable: true},
		{Section: "Inflow", Key: "minerBaseRewardIn", Type: "int256", NoTable: true},
		{Section: "Inflow", Key: "minerTxFeeIn", Type: "int256", NoTable: true},
		{Section: "Inflow", Key: "prefundIn", Type: "int256", NoTable: true},
		{Section: "Outflow", Key: "amountOut", Type: "int256", NoTable: true},
		{Section: "Outflow", Key: "internalOut", Type: "int256", NoTable: true},
		{Section: "Outflow", Key: "selfDestructOut", Type: "int256", NoTable: true},
		{Section: "Outflow", Key: "gasOut", Type: "int256", NoTable: true},
		{Section: "Details", Key: "blockNumber", Type: "blknum", NoTable: true},
		{Section: "Details", Key: "transactionIndex", Type: "txnum", NoTable: true},
		{Section: "Details", Key: "logIndex", Type: "lognum", NoTable: true},
		{Section: "Details", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "sender", Type: "address", NoTable: true},
		{Section: "Details", Key: "recipient", Type: "address", NoTable: true},
		{Section: "Analysis", Key: "prevBal", Type: "int256", NoTable: true},
		{Section: "Analysis", Key: "begBalDiff", Type: "int256", NoTable: true},
		{Section: "Analysis", Key: "endBalDiff", Type: "int256", NoTable: true},
		{Section: "Analysis", Key: "correctingReasons", Type: "string", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalIn", Type: "int256", NoTable: true},
		{Section: "Corrections", Key: "correctAmountIn", Type: "int256", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalIn", Type: "int256", NoTable: true},
		{Section: "Corrections", Key: "correctBegBalOut", Type: "int256", NoTable: true},
		{Section: "Corrections", Key: "correctAmountOut", Type: "int256", NoTable: true},
		{Section: "Corrections", Key: "correctEndBalOut", Type: "int256", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getTracesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "blknum"},
		{Section: "Context", Key: "transactionIndex", Type: "txnum"},
		{Section: "Context", Key: "traceIndex", Type: "uint64"},
		{Section: "Action", Key: "from", Type: "address"},
		{Section: "Action", Key: "to", Type: "address"},
		{Section: "Action", Key: "value", Type: "wei"},
		{Section: "Overview", Key: "type", Type: "string"},
		{Section: "Overview", Key: "error", Type: "string", NoTable: true},
		{Section: "Overview", Key: "subtraces", Type: "uint64", NoTable: true},
		{Section: "Overview", Key: "traceAddress", Type: "uint64", NoTable: true},
		{Section: "Action", Key: "gas", Type: "gas", NoTable: true},
		{Section: "Action", Key: "callType", Type: "string", NoTable: true},
		{Section: "Action", Key: "input", Type: "bytes", NoTable: true},
		{Section: "Result", Key: "gasUsed", Type: "gas", NoTable: true},
		{Section: "Result", Key: "output", Type: "bytes", NoTable: true},
		{Section: "Result", Key: "address", Type: "address", NoTable: true},
		{Section: "Result", Key: "code", Type: "bytes", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "timestamp", Type: "timestamp", NoTable: true},
		{Section: "Articulation", Key: "articulatedTrace", NoTable: true},
		{Section: "Articulation", Key: "compressedTrace", Type: "string", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getTransactionsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "blknum"},
		{Section: "Context", Key: "transactionIndex", Type: "txnum"},
		{Section: "Overview", Key: "hash", Type: "hash"},
		{Section: "Overview", Key: "from", Type: "address"},
		{Section: "Overview", Key: "to", Type: "address"},
		{Section: "Overview", Key: "value", Type: "wei"},
		{Section: "Gas", Key: "gasUsed", Type: "gas"},
		{Section: "Overview", Key: "timestamp", Type: "timestamp", NoTable: true},
		{Section: "Overview", Key: "input", Type: "bytes", NoTable: true},
		{Section: "Overview", Key: "articulatedTx", NoTable: true},
		{Section: "Overview", Key: "isError", Type: "boolean", NoTable: true},
		{Section: "Overview", Key: "hasToken", Type: "boolean", NoTable: true},
		{Section: "Gas", Key: "gas", Type: "gas", NoTable: true},
		{Section: "Gas", Key: "gasPrice", Type: "gas", NoTable: true},
		{Section: "Gas", Key: "maxFeePerGas", Type: "gas", NoTable: true},
		{Section: "Gas", Key: "maxPriorityFeePerGas", Type: "gas", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "nonce", Type: "value", NoTable: true},
		{Section: "Details", Key: "type", Type: "string", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getTransfersFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "blockNumber", Type: "blknum"},
		{Section: "General", Key: "transactionIndex", Type: "txnum"},
		{Section: "General", Key: "logIndex", Type: "lognum"},
		{Section: "General", Key: "asset", Type: "address"},
		{Section: "General", Key: "sender", Type: "address"},
		{Section: "General", Key: "recipient", Type: "address"},
		{Section: "General", Key: "amountIn", Type: "int256"},
		{Section: "General", Key: "amountOut", Type: "int256"},
		{Section: "General", Key: "holder", Type: "address", NoTable: true},
		{Section: "General", Key: "decimals", Type: "uint64", NoTable: true},
		{Section: "General", Key: "internalIn", Type: "int256"},
		{Section: "General", Key: "minerBaseRewardIn", Type: "int256"},
		{Section: "General", Key: "minerNephewRewardIn", Type: "int256"},
		{Section: "General", Key: "minerTxFeeIn", Type: "int256"},
		{Section: "General", Key: "minerUncleRewardIn", Type: "int256"},
		{Section: "General", Key: "prefundIn", Type: "int256"},
		{Section: "General", Key: "selfDestructIn", Type: "int256"},
		{Section: "General", Key: "internalOut", Type: "int256"},
		{Section: "General", Key: "gasOut", Type: "int256"},
		{Section: "General", Key: "selfDestructOut", Type: "int256"},
		{Section: "General", Key: "transaction"},
		{Section: "General", Key: "log"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getWithdrawalsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "blknum"},
		{Section: "Context", Key: "timestamp", Type: "timestamp"},
		{Section: "Details", Key: "index", Type: "uint64"},
		{Section: "Details", Key: "validatorIndex", Type: "uint64"},
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
