// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package exports

// EXISTING_CODE
import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
	storePkg "github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

// EXISTING_CODE

type ExportsPage struct {
	Facet         types.DataFacet  `json:"facet"`
	ApprovalLogs  []ApprovalLog    `json:"approvallogs"`
	ApprovalTxs   []ApprovalTx     `json:"approvaltxs"`
	Assets        []Asset          `json:"assets"`
	Balances      []Balance        `json:"balances"`
	Logs          []Log            `json:"logs"`
	OpenApprovals []OpenApproval   `json:"openapprovals"`
	Receipts      []Receipt        `json:"receipts"`
	Statements    []Statement      `json:"statements"`
	Traces        []Trace          `json:"traces"`
	Transactions  []Transaction    `json:"transactions"`
	Transfers     []Transfer       `json:"transfers"`
	Withdrawals   []Withdrawal     `json:"withdrawals"`
	TotalItems    int              `json:"totalItems"`
	ExpectedTotal int              `json:"expectedTotal"`
	State         types.StoreState `json:"state"`
	// EXISTING_CODE
	// EXISTING_CODE
}

func (p *ExportsPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *ExportsPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *ExportsPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *ExportsPage) GetState() types.StoreState {
	return p.State
}

func (c *ExportsCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	filter = strings.ToLower(filter)
	dataFacet := payload.DataFacet
	page := &ExportsPage{
		Facet: dataFacet,
	}
	_ = preprocessPage(c, page, payload, first, pageSize, sortSpec)

	if c.shouldSummarize(payload) {
		return c.getSummaryPage(payload, first, pageSize, sortSpec, filter)
	}

	switch dataFacet {

	case ExportsStatements:
		facet := c.statementsFacet
		var filterFunc func(*Statement) bool
		if filter != "" {
			filterFunc = func(item *Statement) bool {
				return c.matchesStatementFilter(item, filter)
			}
		}
		sortFunc := func(items []Statement, sort sdk.SortSpec) error {
			return sdk.SortStatements(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Statements = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsAssets:
		facet := c.assetsFacet
		var filterFunc func(*Asset) bool
		if filter != "" {
			filterFunc = func(item *Asset) bool {
				return c.matchesAssetFilter(item, filter)
			}
		}
		sortFunc := func(items []Asset, sort sdk.SortSpec) error {
			return sdk.SortAssets(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Assets = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsAssetCharts:
		facet := c.assetchartsFacet
		var filterFunc func(*Statement) bool
		if filter != "" {
			filterFunc = func(item *Statement) bool {
				return c.matchesAssetChartFilter(item, filter)
			}
		}
		sortFunc := func(items []Statement, sort sdk.SortSpec) error {
			return sdk.SortStatements(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Statements = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsBalances:
		facet := c.balancesFacet
		var filterFunc func(*Balance) bool
		if filter != "" {
			filterFunc = func(item *Balance) bool {
				return c.matchesBalanceFilter(item, filter)
			}
		}
		sortFunc := func(items []Balance, sort sdk.SortSpec) error {
			return sdk.SortBalances(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Balances = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsTransfers:
		facet := c.transfersFacet
		var filterFunc func(*Transfer) bool
		if filter != "" {
			filterFunc = func(item *Transfer) bool {
				return c.matchesTransferFilter(item, filter)
			}
		}
		sortFunc := func(items []Transfer, sort sdk.SortSpec) error {
			return sdk.SortTransfers(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Transfers = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsOpenApprovals:
		facet := c.openapprovalsFacet
		var filterFunc func(*OpenApproval) bool
		if filter != "" {
			filterFunc = func(item *OpenApproval) bool {
				return c.matchesOpenApprovalFilter(item, filter)
			}
		}
		sortFunc := func(items []OpenApproval, sort sdk.SortSpec) error {
			return sdk.SortOpenApprovals(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.OpenApprovals = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsApprovalTxs:
		facet := c.approvaltxsFacet
		var filterFunc func(*ApprovalTx) bool
		if filter != "" {
			filterFunc = func(item *ApprovalTx) bool {
				return c.matchesApprovalTxFilter(item, filter)
			}
		}
		sortFunc := func(items []ApprovalTx, sort sdk.SortSpec) error {
			return sdk.SortApprovalTxs(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.ApprovalTxs = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsApprovalLogs:
		facet := c.approvallogsFacet
		var filterFunc func(*ApprovalLog) bool
		if filter != "" {
			filterFunc = func(item *ApprovalLog) bool {
				return c.matchesApprovalLogFilter(item, filter)
			}
		}
		sortFunc := func(items []ApprovalLog, sort sdk.SortSpec) error {
			return sdk.SortApprovalLogs(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.ApprovalLogs = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsTransactions:
		facet := c.transactionsFacet
		var filterFunc func(*Transaction) bool
		if filter != "" {
			filterFunc = func(item *Transaction) bool {
				return c.matchesTransactionFilter(item, filter)
			}
		}
		sortFunc := func(items []Transaction, sort sdk.SortSpec) error {
			return sdk.SortTransactions(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Transactions = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsWithdrawals:
		facet := c.withdrawalsFacet
		var filterFunc func(*Withdrawal) bool
		if filter != "" {
			filterFunc = func(item *Withdrawal) bool {
				return c.matchesWithdrawalFilter(item, filter)
			}
		}
		sortFunc := func(items []Withdrawal, sort sdk.SortSpec) error {
			return sdk.SortWithdrawals(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Withdrawals = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsReceipts:
		facet := c.receiptsFacet
		var filterFunc func(*Receipt) bool
		if filter != "" {
			filterFunc = func(item *Receipt) bool {
				return c.matchesReceiptFilter(item, filter)
			}
		}
		sortFunc := func(items []Receipt, sort sdk.SortSpec) error {
			return sdk.SortReceipts(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Receipts = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsLogs:
		facet := c.logsFacet
		var filterFunc func(*Log) bool
		if filter != "" {
			filterFunc = func(item *Log) bool {
				return c.matchesLogFilter(item, filter)
			}
		}
		sortFunc := func(items []Log, sort sdk.SortSpec) error {
			return sdk.SortLogs(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Logs = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ExportsTraces:
		facet := c.tracesFacet
		var filterFunc func(*Trace) bool
		if filter != "" {
			filterFunc = func(item *Trace) bool {
				return c.matchesTraceFilter(item, filter)
			}
		}
		sortFunc := func(items []Trace, sort sdk.SortSpec) error {
			return sdk.SortTraces(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "GetPage", err)
		} else {
			page.Traces = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("exports", payload.DataFacet, "GetPage",
			fmt.Errorf("[GetPage] unsupported dataFacet: %v", payload.DataFacet))
	}

	return page, nil
}

// shouldSummarize returns true if the current facet can be simmarized by period
func (c *ExportsCollection) shouldSummarize(payload *types.Payload) bool {
	if !payload.ShouldSummarize() {
		return false
	}
	// EXISTING_CODE
	if payload.DataFacet != ExportsAssets {
		return true
	}
	// EXISTING_CODE
	return false
}

// getSummaryPage returns paginated summary data for a given period
func (c *ExportsCollection) getSummaryPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	// TODO: Use these
	dataFacet := payload.DataFacet
	period := payload.ActivePeriod
	_ = first
	_ = pageSize
	_ = sortSpec
	_ = filter
	// CRITICAL: Ensure underlying raw data is loaded before generating summaries
	// For summary periods, we need the blockly (raw) data to be loaded first
	c.FetchByFacet(payload)
	if err := c.generateSummariesForPeriod(dataFacet, period); err != nil {
		return nil, types.NewStoreError("exports", dataFacet, "getSummaryPage", err)
	}

	page := &ExportsPage{
		Facet: dataFacet,
	}

	switch dataFacet {
	// EXISTING_CODE
	case ExportsStatements:
		summaries := c.statementsFacet.GetStore().GetSummaries(period)

		// Apply filtering if needed
		var filtered []*Statement
		if filter != "" {
			for _, item := range summaries {
				if c.matchesStatementFilter(item, filter) {
					filtered = append(filtered, item)
				}
			}
		} else {
			filtered = summaries
		}

		// Convert to value slice for sorting
		valueSlice := make([]Statement, len(filtered))
		for i, ptr := range filtered {
			valueSlice[i] = *ptr
		}

		// Apply sorting
		if err := sdk.SortStatements(valueSlice, sortSpec); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "getSummaryPage", err)
		}

		// Apply pagination
		total := len(valueSlice)
		end := first + pageSize
		if end > total {
			end = total
		}
		if first >= total {
			valueSlice = []Statement{}
		} else {
			valueSlice = valueSlice[first:end]
		}
		page.Statements = valueSlice
		page.TotalItems = total
		return page, nil

	case ExportsBalances:
		summaries := c.balancesFacet.GetStore().GetSummaries(period)

		// Apply filtering if needed
		var filtered []*Balance
		if filter != "" {
			for _, item := range summaries {
				if c.matchesBalanceFilter(item, filter) {
					filtered = append(filtered, item)
				}
			}
		} else {
			filtered = summaries
		}

		// Convert to sdk.Balance slice for sorting
		valueSlice := make([]sdk.Balance, len(filtered))
		for i, item := range filtered {
			valueSlice[i] = *item
		}

		// Apply sorting
		if err := sdk.SortBalances(valueSlice, sortSpec); err != nil {
			return nil, types.NewStoreError("exports", dataFacet, "getSummaryPage", err)
		}

		// Apply pagination
		total := len(valueSlice)
		end := first + pageSize
		if end > total {
			end = total
		}
		if first >= total {
			valueSlice = []sdk.Balance{}
		} else {
			valueSlice = valueSlice[first:end]
		}

		page.Balances = valueSlice
		page.TotalItems = total
		return page, nil

	// EXISTING_CODE
	default:
		return nil, types.NewValidationError("exports", dataFacet, "getSummaryPage",
			fmt.Errorf("[getSummaryPage] unsupported dataFacet: %v %v", dataFacet, page.Facet))
	}
}

// generateSummariesForPeriod ensures summaries are generated for the given period
func (c *ExportsCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period types.Period) error {
	// TODO: Use this
	_ = period
	switch dataFacet {
	// EXISTING_CODE
	case ExportsStatements:
		store := c.statementsFacet.GetStore()
		data := store.GetItems(false)

		// Clear existing summaries for this period
		store.GetSummaryManager().Reset()

		// For statements, we need to create aggregated summary statements per period
		// Group statements by normalized timestamp and create one summary per period
		periodGroups := make(map[int64][]*Statement)

		for _, statement := range data {
			normalizedTime := storePkg.NormalizeToPeriod(int64(statement.Timestamp), period)
			periodGroups[normalizedTime] = append(periodGroups[normalizedTime], statement)
		}

		// Create one summary statement per period
		for normalizedTime, statements := range periodGroups {
			if len(statements) == 0 {
				continue
			}

			// Create a representative summary statement for this period
			// Use the latest transaction as the base and aggregate key metrics
			latestStatement := statements[len(statements)-1]
			summaryStatement := &Statement{
				AccountedFor:    latestStatement.AccountedFor,
				Asset:           latestStatement.Asset,
				BlockNumber:     latestStatement.BlockNumber,
				Timestamp:       base.Timestamp(normalizedTime), // Use normalized timestamp as base.Timestamp
				Symbol:          latestStatement.Symbol,
				Decimals:        latestStatement.Decimals,
				TransactionHash: latestStatement.TransactionHash,

				// Aggregate counts or amounts if needed
				// For now, just use the latest values
				EndBal:    latestStatement.EndBal,
				AmountIn:  latestStatement.AmountIn,
				AmountOut: latestStatement.AmountOut,
			}

			// Add the summary statement as a single-item group
			store.GetSummaryManager().Add([]*Statement{summaryStatement}, period)
		}
		return nil

	case ExportsBalances:
		statementsStore := c.statementsFacet.GetStore()
		balancesStore := c.balancesFacet.GetStore()
		statements := statementsStore.GetItems(false)

		// Clear existing balance summaries for this period
		balancesStore.GetSummaryManager().Reset()

		// Generate balance summaries using asset-aware logic
		for _, statement := range statements {
			// Create a balance record for this statement (same logic as BalanceObserver)
			balance := &Balance{
				Address:          statement.Asset,
				Holder:           statement.AccountedFor,
				Balance:          statement.EndBal,
				BlockNumber:      statement.BlockNumber,
				Timestamp:        statement.Timestamp,
				TransactionIndex: statement.TransactionIndex,
				Decimals:         uint64(statement.Decimals),
				Symbol:           statement.Symbol,
			}

			// Use AddBalance for asset-aware summarization (keeps latest balance per period per asset)
			balancesStore.GetSummaryManager().AddBalance(balance, period)
		}
		return nil
	// EXISTING_CODE
	default:
		return fmt.Errorf("[generateSummariesForPeriod] unsupported dataFacet for summary: %v", dataFacet)
	}
}

func preprocessPage(
	c *ExportsCollection,
	page *ExportsPage,
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
) error {
	_ = page
	_ = c
	_ = payload
	_ = first
	_ = pageSize
	_ = sortSpec
	// EXISTING_CODE
	// EXISTING_CODE
	return nil
}

// EXISTING_CODE
func (c *ExportsCollection) matchesStatementFilter(item *Statement, filter string) bool {
	return strings.Contains(strings.ToLower(item.AccountedFor.Hex()), filter) || strings.Contains(strings.ToLower(item.Asset.Hex()), filter)
}

func (c *ExportsCollection) matchesBalanceFilter(item *Balance, filter string) bool {
	return strings.Contains(strings.ToLower(item.Address.Hex()), filter)
}

func (c *ExportsCollection) matchesTransferFilter(item *Transfer, filter string) bool {
	return strings.Contains(strings.ToLower(item.Asset.Hex()), filter) ||
		strings.Contains(strings.ToLower(item.Sender.Hex()), filter) ||
		strings.Contains(strings.ToLower(item.Recipient.Hex()), filter)
}

func (c *ExportsCollection) matchesTransactionFilter(item *Transaction, filter string) bool {
	return strings.Contains(strings.ToLower(item.Hash.Hex()), filter)
}

func (c *ExportsCollection) matchesWithdrawalFilter(item *Withdrawal, filter string) bool {
	_ = item // delint
	return strings.Contains(strings.ToLower("item.Hash.Hex()"), filter)
}

func (c *ExportsCollection) matchesAssetFilter(item *Asset, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.Address.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.Name), filter) ||
	// strings.Contains(strings.ToLower(item.Symbol), filter)
}

func (c *ExportsCollection) matchesAssetChartFilter(item *Statement, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.Address.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.Name), filter) ||
	// strings.Contains(strings.ToLower(item.Symbol), filter)
}

func (c *ExportsCollection) matchesLogFilter(item *Log, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.Address.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.Topics[0].Hex()), filter)
}

func (c *ExportsCollection) matchesTraceFilter(item *Trace, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.BlockHash.Hex()), filter)
}

func (c *ExportsCollection) matchesReceiptFilter(item *Receipt, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.TransactionHash.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.ContractAddress.Hex()), filter)
}

func (c *ExportsCollection) matchesOpenApprovalFilter(item *OpenApproval, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.TransactionHash.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.ContractAddress.Hex()), filter)
}

func (c *ExportsCollection) matchesApprovalLogFilter(item *ApprovalLog, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.TransactionHash.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.ContractAddress.Hex()), filter)
}

func (c *ExportsCollection) matchesApprovalTxFilter(item *ApprovalTx, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.TransactionHash.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.ContractAddress.Hex()), filter)
}

// EXISTING_CODE
