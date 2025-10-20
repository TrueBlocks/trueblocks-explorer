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

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

type OpenApproval = sdk.Approval
type ApprovalLog = sdk.Log
type ApprovalTx = sdk.Transaction
type Asset = sdk.Asset
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := approvallogsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Addrs:     []string{address},
				// Articulate: true,
			}
			if _, _, err := exportOpts.ExportApprovals(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsApprovalLogs, "fetch", err)
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *ApprovalLog {
			// EXISTING_CODE
			if tx, ok := item.(*sdk.Transaction); ok {
				for _, log := range tx.Receipt.Logs {
					if len(log.Topics) > 0 {
						return (*ApprovalLog)(&log)
					}
				}
			}
			// EXISTING_CODE
			if it, ok := item.(*ApprovalLog); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *ApprovalLog) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := approvaltxsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Addrs:     []string{address},
				// Articulate: true,
			}
			if _, _, err := exportOpts.ExportApprovals(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsApprovalTxs, "fetch", err)
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *ApprovalTx {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*ApprovalTx); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *ApprovalTx) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := assetsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Addrs:     []string{address},
			}
			if _, _, err := exportOpts.ExportAssets(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsAssets, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports assets SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Asset {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Asset); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Asset) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := balancesStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Addrs:     []string{address},
			}
			if _, _, err := exportOpts.ExportBalances(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsBalances, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports balances SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Balance {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Balance); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Balance) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := logsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx:  ctx,
				Addrs:      []string{address},
				Articulate: true,
			}
			if _, _, err := exportOpts.ExportLogs(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsLogs, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports logs SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Log {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Log); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Log) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := openapprovalsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			tokensOpts := sdk.TokensOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Addrs:     []string{address},
				NoZero:    true,
			}
			if _, _, err := tokensOpts.TokensApprovals(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsOpenApprovals, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports openapprovals SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *OpenApproval {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*OpenApproval); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *OpenApproval) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := receiptsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Addrs:     []string{address},
				// Articulate: true,
			}
			if _, _, err := exportOpts.ExportReceipts(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsReceipts, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports receipts SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Receipt {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Receipt); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Receipt) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := statementsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx:  ctx,
				Addrs:      []string{address},
				Accounting: true, // Enable accounting for statements
			}
			if _, _, err := exportOpts.ExportStatements(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsStatements, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports statements SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Statement {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Statement); ok {
				c.updateAssetChartsBucket(it)
				return it
			}
			return nil
		}

		mappingFunc := func(item *Statement) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := tracesStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Addrs:     []string{address},
				// Articulate: true,
			}
			if _, _, err := exportOpts.ExportTraces(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsTraces, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports traces SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Trace {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Trace); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Trace) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := transactionsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Addrs:     []string{address},
			}
			if _, _, err := exportOpts.Export(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsTransactions, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports transactions SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Transaction {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Transaction); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Transaction) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := transfersStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:    sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx:  ctx,
				Addrs:      []string{address},
				Accounting: true, // Enable accounting for transfers
			}
			if _, _, err := exportOpts.ExportTransfers(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsTransfers, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports transfers SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Transfer {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Transfer); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Transfer) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := withdrawalsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			exportOpts := sdk.ExportOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
				Addrs:     []string{address},
			}
			if _, _, err := exportOpts.ExportWithdrawals(); err != nil {
				wrappedErr := types.NewSDKError("exports", ExportsTransfers, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Exports transfers SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Withdrawal {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Withdrawal); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Withdrawal) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		withdrawalsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ExportsCollection) GetStoreName(dataFacet types.DataFacet, chain, address string) string {
	name := ""
	switch dataFacet {
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
	name = fmt.Sprintf("%s-%s-%s", name, chain, address)
	return name
}

var (
	collections   = make(map[store.CollectionKey]*ExportsCollection)
	collectionsMu sync.Mutex
)

func GetExportsCollection(payload *types.Payload) *ExportsCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload

	key := store.GetCollectionKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewExportsCollection(payload)
	collections[key] = collection
	return collection
}

func getStoreKey(chain, address string) string {
	return fmt.Sprintf("%s_%s", chain, address)
}

// EXISTING_CODE
// EXISTING_CODE
