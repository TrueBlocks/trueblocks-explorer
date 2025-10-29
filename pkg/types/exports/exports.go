// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package exports

import (
	"fmt"
	"sync"
	"time"

	// EXISTING_CODE
	// EXISTING_CODE
	"github.com/TrueBlocks/trueblocks-explorer/pkg/facets"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

const (
	ExportsStatements    types.DataFacet = "statements"
	ExportsBalances      types.DataFacet = "balances"
	ExportsTransfers     types.DataFacet = "transfers"
	ExportsTransactions  types.DataFacet = "transactions"
	ExportsOpenApprovals types.DataFacet = "openapprovals"
	ExportsApprovalLogs  types.DataFacet = "approvallogs"
	ExportsApprovalTxs   types.DataFacet = "approvaltxs"
	ExportsWithdrawals   types.DataFacet = "withdrawals"
	ExportsAssets        types.DataFacet = "assets"
	ExportsAssetCharts   types.DataFacet = "assetcharts"
	ExportsLogs          types.DataFacet = "logs"
	ExportsTraces        types.DataFacet = "traces"
	ExportsReceipts      types.DataFacet = "receipts"
)

func init() {
	types.RegisterDataFacet(ExportsStatements)
	types.RegisterDataFacet(ExportsBalances)
	types.RegisterDataFacet(ExportsTransfers)
	types.RegisterDataFacet(ExportsTransactions)
	types.RegisterDataFacet(ExportsOpenApprovals)
	types.RegisterDataFacet(ExportsApprovalLogs)
	types.RegisterDataFacet(ExportsApprovalTxs)
	types.RegisterDataFacet(ExportsWithdrawals)
	types.RegisterDataFacet(ExportsAssets)
	types.RegisterDataFacet(ExportsAssetCharts)
	types.RegisterDataFacet(ExportsLogs)
	types.RegisterDataFacet(ExportsTraces)
	types.RegisterDataFacet(ExportsReceipts)
}

type ExportsCollection struct {
	statementsFacet    *facets.Facet[Statement]
	balancesFacet      *facets.Facet[Balance]
	transfersFacet     *facets.Facet[Transfer]
	transactionsFacet  *facets.Facet[Transaction]
	openapprovalsFacet *facets.Facet[OpenApproval]
	approvallogsFacet  *facets.Facet[ApprovalLog]
	approvaltxsFacet   *facets.Facet[ApprovalTx]
	withdrawalsFacet   *facets.Facet[Withdrawal]
	assetsFacet        *facets.Facet[Asset]
	assetchartsFacet   *facets.Facet[Statement]
	logsFacet          *facets.Facet[Log]
	tracesFacet        *facets.Facet[Trace]
	receiptsFacet      *facets.Facet[Receipt]
	summary            types.Summary
	summaryMutex       sync.RWMutex
}

func NewExportsCollection(payload *types.Payload) *ExportsCollection {
	c := &ExportsCollection{}
	c.ResetSummary()
	c.initializeFacets(payload)
	return c
}

func (c *ExportsCollection) initializeFacets(payload *types.Payload) {
	c.statementsFacet = facets.NewFacet(
		ExportsStatements,
		isStatement,
		isDupStatement(),
		c.getStatementsStore(payload, ExportsStatements),
		"exports",
		c,
	)

	c.balancesFacet = facets.NewFacet(
		ExportsBalances,
		isBalance,
		isDupBalance(),
		c.getBalancesStore(payload, ExportsBalances),
		"exports",
		c,
	)

	c.transfersFacet = facets.NewFacet(
		ExportsTransfers,
		isTransfer,
		isDupTransfer(),
		c.getTransfersStore(payload, ExportsTransfers),
		"exports",
		c,
	)

	c.transactionsFacet = facets.NewFacet(
		ExportsTransactions,
		isTransaction,
		isDupTransaction(),
		c.getTransactionsStore(payload, ExportsTransactions),
		"exports",
		c,
	)

	c.openapprovalsFacet = facets.NewFacet(
		ExportsOpenApprovals,
		isOpenApproval,
		isDupOpenApproval(),
		c.getOpenApprovalsStore(payload, ExportsOpenApprovals),
		"exports",
		c,
	)

	c.approvallogsFacet = facets.NewFacet(
		ExportsApprovalLogs,
		isApprovalLog,
		isDupApprovalLog(),
		c.getApprovalLogsStore(payload, ExportsApprovalLogs),
		"exports",
		c,
	)

	c.approvaltxsFacet = facets.NewFacet(
		ExportsApprovalTxs,
		isApprovalTx,
		isDupApprovalTx(),
		c.getApprovalTxsStore(payload, ExportsApprovalTxs),
		"exports",
		c,
	)

	c.withdrawalsFacet = facets.NewFacet(
		ExportsWithdrawals,
		isWithdrawal,
		isDupWithdrawal(),
		c.getWithdrawalsStore(payload, ExportsWithdrawals),
		"exports",
		c,
	)

	c.assetsFacet = facets.NewFacet(
		ExportsAssets,
		isAsset,
		isDupAsset(),
		c.getAssetsStore(payload, ExportsAssets),
		"exports",
		c,
	)

	c.assetchartsFacet = facets.NewFacet(
		ExportsAssetCharts,
		isAssetChart,
		isDupStatement(),
		c.getStatementsStore(payload, ExportsAssetCharts),
		"exports",
		c,
	)

	c.logsFacet = facets.NewFacet(
		ExportsLogs,
		isLog,
		isDupLog(),
		c.getLogsStore(payload, ExportsLogs),
		"exports",
		c,
	)

	c.tracesFacet = facets.NewFacet(
		ExportsTraces,
		isTrace,
		isDupTrace(),
		c.getTracesStore(payload, ExportsTraces),
		"exports",
		c,
	)

	c.receiptsFacet = facets.NewFacet(
		ExportsReceipts,
		isReceipt,
		isDupReceipt(),
		c.getReceiptsStore(payload, ExportsReceipts),
		"exports",
		c,
	)
}

func isStatement(item *Statement) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isBalance(item *Balance) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isTransfer(item *Transfer) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isTransaction(item *Transaction) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isOpenApproval(item *OpenApproval) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isApprovalLog(item *ApprovalLog) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isApprovalTx(item *ApprovalTx) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isWithdrawal(item *Withdrawal) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isAsset(item *Asset) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isAssetChart(item *Statement) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isLog(item *Log) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isTrace(item *Trace) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isReceipt(item *Receipt) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isDupApprovalLog() func(existing []*ApprovalLog, newItem *ApprovalLog) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupApprovalTx() func(existing []*ApprovalTx, newItem *ApprovalTx) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupAsset() func(existing []*Asset, newItem *Asset) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupBalance() func(existing []*Balance, newItem *Balance) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupLog() func(existing []*Log, newItem *Log) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupOpenApproval() func(existing []*OpenApproval, newItem *OpenApproval) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupReceipt() func(existing []*Receipt, newItem *Receipt) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupStatement() func(existing []*Statement, newItem *Statement) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupTrace() func(existing []*Trace, newItem *Trace) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupTransaction() func(existing []*Transaction, newItem *Transaction) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupTransfer() func(existing []*Transfer, newItem *Transfer) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupWithdrawal() func(existing []*Withdrawal, newItem *Withdrawal) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func (c *ExportsCollection) FetchByFacet(dataFacet types.DataFacet) {
	if !c.NeedsUpdate(dataFacet) {
		return
	}

	go func() {
		switch dataFacet {
		case ExportsStatements:
			if err := c.statementsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsBalances:
			if err := c.balancesFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsTransfers:
			if err := c.transfersFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsTransactions:
			if err := c.transactionsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsOpenApprovals:
			if err := c.openapprovalsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsApprovalLogs:
			if err := c.approvallogsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsApprovalTxs:
			if err := c.approvaltxsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsWithdrawals:
			if err := c.withdrawalsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsAssets:
			if err := c.assetsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsAssetCharts:
			if err := c.assetchartsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsLogs:
			if err := c.logsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsTraces:
			if err := c.tracesFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ExportsReceipts:
			if err := c.receiptsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		default:
			logging.LogError("LoadData: unexpected dataFacet: %v", fmt.Errorf("invalid dataFacet: %s", dataFacet), nil)
			return
		}
	}()
}

func (c *ExportsCollection) Reset(dataFacet types.DataFacet) {
	switch dataFacet {
	case ExportsStatements:
		c.statementsFacet.Reset()
	case ExportsBalances:
		c.balancesFacet.Reset()
	case ExportsTransfers:
		c.transfersFacet.Reset()
	case ExportsTransactions:
		c.transactionsFacet.Reset()
	case ExportsOpenApprovals:
		c.openapprovalsFacet.Reset()
	case ExportsApprovalLogs:
		c.approvallogsFacet.Reset()
	case ExportsApprovalTxs:
		c.approvaltxsFacet.Reset()
	case ExportsWithdrawals:
		c.withdrawalsFacet.Reset()
	case ExportsAssets:
		c.assetsFacet.Reset()
	case ExportsAssetCharts:
		c.assetchartsFacet.Reset()
	case ExportsLogs:
		c.logsFacet.Reset()
	case ExportsTraces:
		c.tracesFacet.Reset()
	case ExportsReceipts:
		c.receiptsFacet.Reset()
	default:
		return
	}
}

func (c *ExportsCollection) NeedsUpdate(dataFacet types.DataFacet) bool {
	switch dataFacet {
	case ExportsStatements:
		return c.statementsFacet.NeedsUpdate()
	case ExportsBalances:
		return c.balancesFacet.NeedsUpdate()
	case ExportsTransfers:
		return c.transfersFacet.NeedsUpdate()
	case ExportsTransactions:
		return c.transactionsFacet.NeedsUpdate()
	case ExportsOpenApprovals:
		return c.openapprovalsFacet.NeedsUpdate()
	case ExportsApprovalLogs:
		return c.approvallogsFacet.NeedsUpdate()
	case ExportsApprovalTxs:
		return c.approvaltxsFacet.NeedsUpdate()
	case ExportsWithdrawals:
		return c.withdrawalsFacet.NeedsUpdate()
	case ExportsAssets:
		return c.assetsFacet.NeedsUpdate()
	case ExportsAssetCharts:
		return c.assetchartsFacet.NeedsUpdate()
	case ExportsLogs:
		return c.logsFacet.NeedsUpdate()
	case ExportsTraces:
		return c.tracesFacet.NeedsUpdate()
	case ExportsReceipts:
		return c.receiptsFacet.NeedsUpdate()
	default:
		return false
	}
}

func (c *ExportsCollection) AccumulateItem(item interface{}, summary *types.Summary) {
	// EXISTING_CODE
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()

	if summary == nil {
		logging.LogError("AccumulateItem called with nil summary", nil, nil)
		return
	}

	if summary.FacetCounts == nil {
		summary.FacetCounts = make(map[types.DataFacet]int)
	}

	switch v := item.(type) {
	case *Statement:
		summary.TotalCount++
		summary.FacetCounts[ExportsStatements]++
		if summary.CustomData == nil {
			summary.CustomData = make(map[string]interface{})
		}

		stmtCount, _ := summary.CustomData["statementsCount"].(int)
		stmtCount++
		summary.CustomData["statementsCount"] = stmtCount

		// Update AssetCharts buckets when Statement data changes
		c.updateStatementsBucket(v)

	case *Transfer:
		summary.TotalCount++
		summary.FacetCounts[ExportsTransfers]++
		if summary.CustomData == nil {
			summary.CustomData = make(map[string]interface{})
		}

		transferCount, _ := summary.CustomData["transfersCount"].(int)
		transferCount++
		summary.CustomData["transfersCount"] = transferCount

	case *Balance:
		summary.TotalCount++
		summary.FacetCounts[ExportsBalances]++
		if summary.CustomData == nil {
			summary.CustomData = make(map[string]interface{})
		}

		balanceCount, _ := summary.CustomData["balancesCount"].(int)
		balanceCount++
		summary.CustomData["balancesCount"] = balanceCount

	case *Asset:
		summary.TotalCount++
		summary.FacetCounts[ExportsAssets]++
		if summary.CustomData == nil {
			summary.CustomData = make(map[string]interface{})
		}

		assetCount, _ := summary.CustomData["assetsCount"].(int)
		assetCount++
		summary.CustomData["assetsCount"] = assetCount

	case *Transaction:
		summary.TotalCount++
		summary.FacetCounts[ExportsTransactions]++
		if summary.CustomData == nil {
			summary.CustomData = make(map[string]interface{})
		}

		txCount, _ := summary.CustomData["transactionsCount"].(int)
		totalValue, _ := summary.CustomData["totalValue"].(int64)
		totalGasUsed, _ := summary.CustomData["totalGasUsed"].(int64)

		txCount++
		totalValue += int64(v.Value.Uint64())
		if v.Receipt != nil {
			totalGasUsed += int64(v.Receipt.GasUsed)
		}

		summary.CustomData["transactionsCount"] = txCount
		summary.CustomData["totalValue"] = totalValue
		summary.CustomData["totalGasUsed"] = totalGasUsed

	case *Withdrawal:
		summary.TotalCount++
		summary.FacetCounts[ExportsWithdrawals]++
		if summary.CustomData == nil {
			summary.CustomData = make(map[string]interface{})
		}

		withdrawalCount, _ := summary.CustomData["withdrawalsCount"].(int)
		withdrawalCount++
		summary.CustomData["withdrawalsCount"] = withdrawalCount

	}
	// EXISTING_CODE
}

func (c *ExportsCollection) GetSummary() types.Summary {
	c.summaryMutex.RLock()
	defer c.summaryMutex.RUnlock()

	summary := c.summary
	summary.FacetCounts = make(map[types.DataFacet]int)
	for k, v := range c.summary.FacetCounts {
		summary.FacetCounts[k] = v
	}

	if c.summary.CustomData != nil {
		summary.CustomData = make(map[string]interface{})
		for k, v := range c.summary.CustomData {
			summary.CustomData[k] = v
		}
	}

	return summary
}

func (c *ExportsCollection) ResetSummary() {
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()
	c.summary = types.Summary{
		TotalCount:  0,
		FacetCounts: make(map[types.DataFacet]int),
		CustomData:  make(map[string]interface{}),
		LastUpdated: time.Now().Unix(),
	}
}

func (c *ExportsCollection) ExportData(payload *types.Payload) (string, error) {
	switch payload.DataFacet {
	case ExportsStatements:
		return c.statementsFacet.ExportData(payload, string(ExportsStatements))
	case ExportsBalances:
		return c.balancesFacet.ExportData(payload, string(ExportsBalances))
	case ExportsTransfers:
		return c.transfersFacet.ExportData(payload, string(ExportsTransfers))
	case ExportsTransactions:
		return c.transactionsFacet.ExportData(payload, string(ExportsTransactions))
	case ExportsOpenApprovals:
		return c.openapprovalsFacet.ExportData(payload, string(ExportsOpenApprovals))
	case ExportsApprovalLogs:
		return c.approvallogsFacet.ExportData(payload, string(ExportsApprovalLogs))
	case ExportsApprovalTxs:
		return c.approvaltxsFacet.ExportData(payload, string(ExportsApprovalTxs))
	case ExportsWithdrawals:
		return c.withdrawalsFacet.ExportData(payload, string(ExportsWithdrawals))
	case ExportsAssets:
		return c.assetsFacet.ExportData(payload, string(ExportsAssets))
	case ExportsAssetCharts:
		return c.assetchartsFacet.ExportData(payload, string(ExportsAssetCharts))
	case ExportsLogs:
		return c.logsFacet.ExportData(payload, string(ExportsLogs))
	case ExportsTraces:
		return c.tracesFacet.ExportData(payload, string(ExportsTraces))
	case ExportsReceipts:
		return c.receiptsFacet.ExportData(payload, string(ExportsReceipts))
	default:
		return "", fmt.Errorf("[ExportData] unsupported exports facet: %s", payload.DataFacet)
	}
}

// EXISTING_CODE
var collectionMutex sync.RWMutex

// EXISTING_CODE
