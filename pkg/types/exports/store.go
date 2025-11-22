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
	"sync"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/output"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

type OpenApproval = sdk.Approval
type ApprovalLog = sdk.Log
type ApprovalTx = sdk.Transaction
type Asset = sdk.Statement
type Assetchart = sdk.Statement
type Balance = sdk.Balance
type Log = sdk.Log
type Receipt = sdk.Receipt
type Statement = sdk.Statement
type Trace = sdk.Trace
type Transaction = sdk.Transaction
type Transfer = sdk.Transfer
type Withdrawal = sdk.Withdrawal

// EXISTING_CODE

var (
	approvallogsStore   = make(map[string]*store.Store[ApprovalLog])
	approvallogsStoreMu sync.Mutex

	approvaltxsStore   = make(map[string]*store.Store[ApprovalTx])
	approvaltxsStoreMu sync.Mutex

	assetsStore   = make(map[string]*store.Store[Asset])
	assetsStoreMu sync.Mutex

	balancesStore   = make(map[string]*store.Store[Balance])
	balancesStoreMu sync.Mutex

	logsStore   = make(map[string]*store.Store[Log])
	logsStoreMu sync.Mutex

	openapprovalsStore   = make(map[string]*store.Store[OpenApproval])
	openapprovalsStoreMu sync.Mutex

	receiptsStore   = make(map[string]*store.Store[Receipt])
	receiptsStoreMu sync.Mutex

	statementsStore   = make(map[string]*store.Store[Statement])
	statementsStoreMu sync.Mutex

	tracesStore   = make(map[string]*store.Store[Trace])
	tracesStoreMu sync.Mutex

	transactionsStore   = make(map[string]*store.Store[Transaction])
	transactionsStoreMu sync.Mutex

	transfersStore   = make(map[string]*store.Store[Transfer])
	transfersStoreMu sync.Mutex

	withdrawalsStore   = make(map[string]*store.Store[Withdrawal])
	withdrawalsStoreMu sync.Mutex
)

func (c *ExportsCollection) getApprovalLogsStore(payload *types.Payload, facet types.DataFacet) *store.Store[ApprovalLog] {
	approvallogsStoreMu.Lock()
	defer approvallogsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := approvallogsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx: ctx,
				Addrs:     []string{payload.ActiveAddress},
			}
			if _, _, err := opts.ExportApprovals(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsApprovalLogs, "fetch", err)
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *ApprovalLog {
			if it, ok := item.(*ApprovalLog); ok {
				it.AddressName = names.NameAddress(it.Address)
				// EXISTING_CODE
				if tx, ok := item.(*sdk.Transaction); ok {
					for _, log := range tx.Receipt.Logs {
						if len(log.Topics) > 0 {
							return (*ApprovalLog)(&log)
						}
					}
				}
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *ApprovalLog) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		approvallogsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getApprovalTxsStore(payload *types.Payload, facet types.DataFacet) *store.Store[ApprovalTx] {
	approvaltxsStoreMu.Lock()
	defer approvaltxsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := approvaltxsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx: ctx,
				Addrs:     []string{payload.ActiveAddress},
			}
			if _, _, err := opts.ExportApprovals(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsApprovalTxs, "fetch", err)
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *ApprovalTx {
			if it, ok := item.(*ApprovalTx); ok {
				it.FromName = names.NameAddress(it.From)
				it.ToName = names.NameAddress(it.To)
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *ApprovalTx) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		approvaltxsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getAssetsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Asset] {
	assetsStoreMu.Lock()
	defer assetsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := assetsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx:  ctx,
				Addrs:      []string{payload.ActiveAddress},
				Accounting: true, // Enable accounting for statements
			}
			if _, _, err := opts.ExportStatements(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsStatements, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports statements SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Asset {
			if it, ok := item.(*Asset); ok {
				it.AssetName = names.NameAddress(it.Asset)
				it.AccountedForName = names.NameAddress(it.AccountedFor)
				it.SenderName = names.NameAddress(it.Sender)
				it.RecipientName = names.NameAddress(it.Recipient)
				// EXISTING_CODE
				if existing, ok := theStore.GetItemFromMap(it.Asset.Hex()); ok {
					it.StatementId = existing.StatementId + 1
				} else {
					it.StatementId = 1
				}
				// EXISTING_CODE
				props := &sdk.ModelProps{
					Chain:   payload.ActiveChain,
					Format:  "json",
					Verbose: true,
					ExtraOpts: map[string]any{
						"ether": true,
					},
				}
				if err := it.EnsureCalcs(props, nil); err != nil {
					logging.LogBEError(fmt.Sprintf("Failed to calculate fields during ingestion: %v", err))
				}
				return it
			}
			return nil
		}

		mappingFunc := func(item *Asset) (key string, includeInMap bool) {
			testVal := item.Asset.Hex()
			return testVal, testVal != ""
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		theStore.SetMapSortFunc(func(a, b *Asset) bool {
			if a.StatementId == b.StatementId {
				if a.SpotPrice.Equal(&b.SpotPrice) {
					return a.Asset.Hex() < b.Asset.Hex()
				}
				return a.SpotPrice.GreaterThan(&b.SpotPrice)
			}
			return a.StatementId > b.StatementId
		})
		// EXISTING_CODE

		assetsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getBalancesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Balance] {
	balancesStoreMu.Lock()
	defer balancesStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := balancesStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain, Ether: true},
				RenderCtx: ctx,
				Addrs:     []string{payload.ActiveAddress},
			}
			if _, _, err := opts.ExportBalances(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsBalances, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports balances SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Balance {
			if it, ok := item.(*Balance); ok {
				it.HolderName = names.NameAddress(it.Holder)
				it.AddressName = names.NameAddress(it.Address)
				// EXISTING_CODE
				// EXISTING_CODE
				props := &sdk.ModelProps{
					Chain:   payload.ActiveChain,
					Format:  "json",
					Verbose: true,
					ExtraOpts: map[string]any{
						"ether": true,
					},
				}
				if err := it.EnsureCalcs(props, nil); err != nil {
					logging.LogBEError(fmt.Sprintf("Failed to calculate fields during ingestion: %v", err))
				}
				return it
			}
			return nil
		}

		mappingFunc := func(item *Balance) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		balancesStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getLogsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Log] {
	logsStoreMu.Lock()
	defer logsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := logsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx:  ctx,
				Addrs:      []string{payload.ActiveAddress},
				Articulate: true,
			}
			if _, _, err := opts.ExportLogs(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsLogs, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports logs SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Log {
			if it, ok := item.(*Log); ok {
				it.AddressName = names.NameAddress(it.Address)
				// EXISTING_CODE
				// EXISTING_CODE
				props := &sdk.ModelProps{
					Chain:   payload.ActiveChain,
					Format:  "json",
					Verbose: true,
					ExtraOpts: map[string]any{
						"ether": true,
					},
				}
				if err := it.EnsureCalcs(props, nil); err != nil {
					logging.LogBEError(fmt.Sprintf("Failed to calculate fields during ingestion: %v", err))
				}
				return it
			}
			return nil
		}

		mappingFunc := func(item *Log) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		logsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getOpenApprovalsStore(payload *types.Payload, facet types.DataFacet) *store.Store[OpenApproval] {
	openapprovalsStoreMu.Lock()
	defer openapprovalsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := openapprovalsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			// freshen the list
			listOpts := sdk.ListOptions{
				Globals: sdk.Globals{Chain: payload.ActiveChain},
				Addrs:   []string{payload.ActiveAddress},
			}
			_, _, _ = listOpts.List()

			opts := sdk.TokensOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx: ctx,
				Addrs:     []string{payload.ActiveAddress},
				NoZero:    true,
			}
			if _, _, err := opts.TokensApprovals(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsOpenApprovals, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports openapprovals SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *OpenApproval {
			if it, ok := item.(*OpenApproval); ok {
				it.OwnerName = names.NameAddress(it.Owner)
				it.TokenName = names.NameAddress(it.Token)
				it.SpenderName = names.NameAddress(it.Spender)
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *OpenApproval) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		openapprovalsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getReceiptsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Receipt] {
	receiptsStoreMu.Lock()
	defer receiptsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := receiptsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx:  ctx,
				Addrs:      []string{payload.ActiveAddress},
				Articulate: true,
			}
			if _, _, err := opts.ExportReceipts(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsReceipts, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports receipts SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Receipt {
			if it, ok := item.(*Receipt); ok {
				it.FromName = names.NameAddress(it.From)
				it.ToName = names.NameAddress(it.To)
				it.ContractAddressName = names.NameAddress(it.ContractAddress)
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Receipt) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		receiptsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getStatementsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Statement] {
	statementsStoreMu.Lock()
	defer statementsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := statementsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx:  ctx,
				Addrs:      []string{payload.ActiveAddress},
				Accounting: true, // Enable accounting for statements
			}
			if _, _, err := opts.ExportStatements(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsStatements, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports statements SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Statement {
			if it, ok := item.(*Statement); ok {
				it.AssetName = names.NameAddress(it.Asset)
				it.AccountedForName = names.NameAddress(it.AccountedFor)
				it.SenderName = names.NameAddress(it.Sender)
				it.RecipientName = names.NameAddress(it.Recipient)
				// EXISTING_CODE
				// EXISTING_CODE
				props := &sdk.ModelProps{
					Chain:   payload.ActiveChain,
					Format:  "json",
					Verbose: true,
					ExtraOpts: map[string]any{
						"ether": true,
					},
				}
				if err := it.EnsureCalcs(props, nil); err != nil {
					logging.LogBEError(fmt.Sprintf("Failed to calculate fields during ingestion: %v", err))
				}
				c.updateStatementsBucket(it)
				return it
			}
			return nil
		}

		mappingFunc := func(item *Statement) (key string, includeInMap bool) {
			testVal := item.Asset.Hex()
			return testVal, testVal != ""
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		statementsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getTracesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Trace] {
	tracesStoreMu.Lock()
	defer tracesStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := tracesStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx:  ctx,
				Addrs:      []string{payload.ActiveAddress},
				Articulate: true,
			}
			if _, _, err := opts.ExportTraces(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsTraces, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports traces SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Trace {
			if it, ok := item.(*Trace); ok {
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Trace) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		tracesStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getTransactionsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Transaction] {
	transactionsStoreMu.Lock()
	defer transactionsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := transactionsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx:  ctx,
				Addrs:      []string{payload.ActiveAddress},
				Articulate: true,
			}
			if _, _, err := opts.Export(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsTransactions, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports transactions SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Transaction {
			if it, ok := item.(*Transaction); ok {
				it.FromName = names.NameAddress(it.From)
				it.ToName = names.NameAddress(it.To)
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Transaction) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		transactionsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getTransfersStore(payload *types.Payload, facet types.DataFacet) *store.Store[Transfer] {
	transfersStoreMu.Lock()
	defer transfersStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := transfersStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx:  ctx,
				Addrs:      []string{payload.ActiveAddress},
				Accounting: true, // Enable accounting for transfers
			}
			if _, _, err := opts.ExportTransfers(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsTransfers, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports transfers SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Transfer {
			if it, ok := item.(*Transfer); ok {
				it.AssetName = names.NameAddress(it.Asset)
				it.SenderName = names.NameAddress(it.Sender)
				it.RecipientName = names.NameAddress(it.Recipient)
				it.HolderName = names.NameAddress(it.Holder)
				// EXISTING_CODE
				// EXISTING_CODE
				props := &sdk.ModelProps{
					Chain:   payload.ActiveChain,
					Format:  "json",
					Verbose: true,
					ExtraOpts: map[string]any{
						"ether": true,
					},
				}
				if err := it.EnsureCalcs(props, nil); err != nil {
					logging.LogBEError(fmt.Sprintf("Failed to calculate fields during ingestion: %v", err))
				}
				return it
			}
			return nil
		}

		mappingFunc := func(item *Transfer) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		transfersStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getWithdrawalsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Withdrawal] {
	withdrawalsStoreMu.Lock()
	defer withdrawalsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := withdrawalsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx: ctx,
				Addrs:     []string{payload.ActiveAddress},
			}
			if _, _, err := opts.ExportWithdrawals(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsTransfers, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports transfers SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Withdrawal {
			if it, ok := item.(*Withdrawal); ok {
				it.AddressName = names.NameAddress(it.Address)
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Withdrawal) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		withdrawalsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) getStoreName(payload *types.Payload, facet types.DataFacet) string {
	name := ""

	// EXISTING_CODE
	// EXISTING_CODE

	switch facet {
	case ExportsStatements:
		name = "exports-statements"
	case ExportsBalances:
		name = "exports-balances"
	case ExportsTransfers:
		name = "exports-transfers"
	case ExportsTransactions:
		name = "exports-transactions"
	case ExportsOpenApprovals:
		name = "exports-openapprovals"
	case ExportsApprovalLogs:
		name = "exports-approvallogs"
	case ExportsApprovalTxs:
		name = "exports-approvaltxs"
	case ExportsWithdrawals:
		name = "exports-withdrawals"
	case ExportsAssets:
		name = "exports-assets"
	case ExportsAssetCharts:
		name = "exports-statements"
	case ExportsLogs:
		name = "exports-logs"
	case ExportsTraces:
		name = "exports-traces"
	case ExportsReceipts:
		name = "exports-receipts"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, payload.ActiveChain, payload.ActiveAddress)
	return name
}

var (
	collections   = make(map[string]*ExportsCollection)
	collectionsMu sync.Mutex
)

func GetExportsCollection(payload *types.Payload) *ExportsCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	key := getStoreKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewExportsCollection(payload)
	collections[key] = collection
	return collection
}

func getStoreKey(payload *types.Payload) string {
	// EXISTING_CODE
	if payload.DataFacet == ExportsAssets {
		key := payload.ActiveChain
		return key
	}
	// EXISTING_CODE
	return fmt.Sprintf("%s_%s", payload.ActiveChain, payload.ActiveAddress)
}

// EXISTING_CODE
// EXISTING_CODE
