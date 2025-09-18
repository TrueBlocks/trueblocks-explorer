// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package names

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
// EXISTING_CODE

type Name = sdk.Name

var (
	namesStore   *store.Store[Name]
	namesStoreMu sync.Mutex
)

func (c *NamesCollection) getNamesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Name] {
	namesStoreMu.Lock()
	defer namesStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.Chain
	address := payload.Address
	theStore := namesStore
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			listOpts := sdk.NamesOptions{
				Globals:   sdk.Globals{Verbose: true, Chain: chain},
				RenderCtx: ctx,
				All:       true,
			}
			if _, _, err := listOpts.Names(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("names", types.DataFacet("NamesAll"), "fetch", err)
				logging.LogBackend(fmt.Sprintf("Names SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Name {
			if it, ok := item.(*Name); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Name) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			if item != nil && !item.Address.IsZero() {
				return item.Address, true
			}
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		namesStore = theStore
	}

	return theStore
}

func (c *NamesCollection) GetStoreName(dataFacet types.DataFacet, chain, address string) string {
	_ = chain
	_ = address
	name := ""
	switch dataFacet {
	case NamesAll:
		name = "names-names"
	case NamesCustom:
		name = "names-names"
	case NamesPrefund:
		name = "names-names"
	case NamesRegular:
		name = "names-names"
	case NamesBaddress:
		name = "names-names"
	default:
		return ""
	}
	return name
}

var (
	collections   = make(map[store.CollectionKey]*NamesCollection)
	collectionsMu sync.Mutex
)

func GetNamesCollection(payload *types.Payload) *NamesCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	pl.Address = ""
	pl.Chain = ""

	key := store.GetCollectionKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewNamesCollection(payload)
	collections[key] = collection
	return collection
}

// EXISTING_CODE
// EXISTING_CODE
