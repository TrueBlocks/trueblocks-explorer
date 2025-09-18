// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package abis

import (
	"fmt"
	"sync"

	// EXISTING_CODE
	// EXISTING_CODE
	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// EXISTING_CODE
type Parameter = sdk.Parameter

// EXISTING_CODE

type Abi = sdk.Abi
type Function = sdk.Function

var (
	abisStore   *store.Store[Abi]
	abisStoreMu sync.Mutex

	functionsStore   *store.Store[Function]
	functionsStoreMu sync.Mutex
)

func (c *AbisCollection) getAbisStore(payload *types.Payload, facet types.DataFacet) *store.Store[Abi] {
	abisStoreMu.Lock()
	defer abisStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.Chain
	address := payload.Address
	theStore := abisStore
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			listOpts := sdk.AbisOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: chain},
				RenderCtx: ctx,
			}
			if _, _, err := listOpts.AbisList(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("abis", AbisDownloaded, "fetch", err)
				logging.LogBackend(fmt.Sprintf("Abis SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Abi {
			if it, ok := item.(*Abi); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Abi) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		abisStore = theStore
	}

	return theStore
}

func (c *AbisCollection) getFunctionsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Function] {
	functionsStoreMu.Lock()
	defer functionsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.Chain
	address := payload.Address
	theStore := functionsStore
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			detailOpts := sdk.AbisOptions{
				Globals:   sdk.Globals{Cache: true, Chain: chain},
				RenderCtx: ctx,
			}
			if _, _, err := detailOpts.AbisDetails(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("abis", AbisFunctions, "fetch", err)
				logging.LogBackend(fmt.Sprintf("Abis detail SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Function {
			if it, ok := item.(*Function); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Function) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		functionsStore = theStore
	}

	return theStore
}

func (c *AbisCollection) GetStoreName(dataFacet types.DataFacet, chain, address string) string {
	_ = chain
	_ = address
	name := ""
	switch dataFacet {
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
	return name
}

var (
	collections   = make(map[store.CollectionKey]*AbisCollection)
	collectionsMu sync.Mutex
)

func GetAbisCollection(payload *types.Payload) *AbisCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	pl.Address = ""

	key := store.GetCollectionKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewAbisCollection(payload)
	collections[key] = collection
	return collection
}

// EXISTING_CODE
// EXISTING_CODE
