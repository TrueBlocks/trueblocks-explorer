// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package contracts

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

type Contract = sdk.Contract
type Log = sdk.Log

// EXISTING_CODE

var (
	contractsStore   = make(map[string]*store.Store[Contract])
	contractsStoreMu sync.Mutex

	logsStore   = make(map[string]*store.Store[Log])
	logsStoreMu sync.Mutex
)

func (c *ContractsCollection) getContractsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Contract] {
	contractsStoreMu.Lock()
	defer contractsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.ActiveChain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
	theStore := contractsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			// Real SDK calls would go here
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Contract {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Contract); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Contract) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// TODO: BOGUS Fix this mocking
		// Add mock data to store
		mockContracts := sdk.CreateContracts()
		for i, c := range mockContracts {
			theStore.AddItem(c, i)
		}
		theStore.ChangeState(types.StateLoaded, "Mock data loaded")
		// EXISTING_CODE

		contractsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ContractsCollection) getLogsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Log] {
	logsStoreMu.Lock()
	defer logsStoreMu.Unlock()

	// EXISTING_CODE
	// TODO: BOGUS WE NEED THIS ON THE PAYLOAD
	// contract := payload.Contract
	contract := "0x8fbea07446ddf4518b1a7ba2b4f11bd140a8df41"
	// EXISTING_CODE

	chain := payload.ActiveChain
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
				Emitter:    []string{contract},
				Articulate: true,
			}
			if _, _, err := exportOpts.ExportLogs(); err != nil {
				wrappedErr := types.NewSDKError("exports", ContractsEvents, "fetch", err)
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

func (c *ContractsCollection) GetStoreName(dataFacet types.DataFacet, chain, address string) string {
	name := ""
	switch dataFacet {
	case ContractsDashboard:
		name = "contracts-contracts"
	case ContractsExecute:
		name = "contracts-contracts"
	case ContractsEvents:
		name = "contracts-logs"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, chain, address)
	return name
}

var (
	collections   = make(map[store.CollectionKey]*ContractsCollection)
	collectionsMu sync.Mutex
)

func GetContractsCollection(payload *types.Payload) *ContractsCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	key := store.GetCollectionKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewContractsCollection(payload)
	collections[key] = collection
	return collection
}

func getStoreKey(chain, address string) string {
	return fmt.Sprintf("%s_%s", chain, address)
}

// EXISTING_CODE
// EXISTING_CODE
