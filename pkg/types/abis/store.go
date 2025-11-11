// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package abis

// EXISTING_CODE
import (
	"fmt"
	"sync"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/output"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

type Parameter = sdk.Parameter
type Abi = sdk.Abi
type Function = sdk.Function

// EXISTING_CODE

var (
	abisStore   = make(map[string]*store.Store[Abi])
	abisStoreMu sync.Mutex

	functionsStore   = make(map[string]*store.Store[Function])
	functionsStoreMu sync.Mutex
)

func (c *AbisCollection) getAbisStore(payload *types.Payload, facet types.DataFacet) *store.Store[Abi] {
	abisStoreMu.Lock()
	defer abisStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := abisStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			listOpts := sdk.AbisOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx: ctx,
			}
			if _, _, err := listOpts.AbisList(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("abis", AbisDownloaded, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Abis SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Abi {
			if it, ok := item.(*Abi); ok {
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Abi) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		abisStore[storeKey] = theStore
	}

	return theStore
}

func (c *AbisCollection) getFunctionsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Function] {
	functionsStoreMu.Lock()
	defer functionsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := functionsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			detailOpts := sdk.AbisOptions{
				Globals:   sdk.Globals{Cache: true, Chain: payload.ActiveChain},
				RenderCtx: ctx,
			}
			if _, _, err := detailOpts.AbisDetails(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("abis", AbisFunctions, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Abis detail SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Function {
			if it, ok := item.(*Function); ok {
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Function) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		functionsStore[storeKey] = theStore
	}

	return theStore
}

func (c *AbisCollection) getStoreName(payload *types.Payload, facet types.DataFacet) string {
	name := ""

	// EXISTING_CODE
	// EXISTING_CODE

	switch facet {
	case AbisDownloaded:
		name = "abis-abis"
	case AbisKnown:
		name = "abis-abis"
	case AbisFunctions:
		name = "abis-functions"
	case AbisEvents:
		name = "abis-functions"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, payload.ActiveChain, payload.ActiveAddress)
	return name
}

var (
	collections   = make(map[string]*AbisCollection)
	collectionsMu sync.Mutex
)

func GetAbisCollection(payload *types.Payload) *AbisCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	key := getStoreKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewAbisCollection(payload)
	collections[key] = collection
	return collection
}

func getStoreKey(payload *types.Payload) string {
	// EXISTING_CODE
	if payload.DataFacet == AbisKnown {
		return "singleton"
	}
	// EXISTING_CODE
	return payload.ActiveChain
}

// EXISTING_CODE
// EXISTING_CODE
