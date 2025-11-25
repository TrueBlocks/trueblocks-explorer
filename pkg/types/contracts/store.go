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
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/output"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
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

	storeKey := getStoreKey(payload)
	theStore := contractsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			// Real SDK calls would go here
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Contract {
			if it, ok := item.(*Contract); ok {
				it.AddressName = names.NameAddress(it.Address)
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Contract) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
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
				Emitter:    []string{payload.TargetAddress},
				Articulate: true,
			}
			if _, _, err := opts.ExportLogs(); err != nil {
				wrappedErr := types.NewSDKError("exports", ContractsEvents, "fetch", err)
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

func (c *ContractsCollection) getStoreName(payload *types.Payload, facet types.DataFacet) string {
	name := ""

	// EXISTING_CODE
	// EXISTING_CODE

	switch facet {
	case ContractsDashboard:
		name = "contracts-contracts"
	case ContractsExecute:
		name = "contracts-contracts"
	case ContractsEvents:
		name = "contracts-logs"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, payload.ActiveChain, payload.ActiveAddress)
	return name
}

var (
	collections   = make(map[string]*ContractsCollection)
	collectionsMu sync.Mutex
)

func GetContractsCollection(payload *types.Payload) *ContractsCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	key := getStoreKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewContractsCollection(payload)
	collections[key] = collection
	return collection
}

func getStoreKey(payload *types.Payload) string {
	// EXISTING_CODE
	// EXISTING_CODE
	return fmt.Sprintf("%s_%s", payload.ActiveChain, payload.ActiveAddress)
}

// EXISTING_CODE
// EXISTING_CODE
