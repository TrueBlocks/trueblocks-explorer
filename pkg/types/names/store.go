// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package names

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

type Name = sdk.Name

// EXISTING_CODE

var (
	namesStore   = make(map[string]*store.Store[Name])
	namesStoreMu sync.Mutex
)

func (c *NamesCollection) getNamesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Name] {
	namesStoreMu.Lock()
	defer namesStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := namesStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			listOpts := sdk.NamesOptions{
				Globals:   sdk.Globals{Verbose: true, Chain: payload.ActiveChain},
				RenderCtx: ctx,
				All:       true,
			}
			if _, _, err := listOpts.Names(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("names", types.DataFacet("NamesAll"), "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Names SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Name {
			if it, ok := item.(*Name); ok {
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Name) (key string, includeInMap bool) {
			testVal := item.Address.Hex()
			return testVal, testVal != ""
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		namesStore[storeKey] = theStore
	}

	return theStore
}

func (c *NamesCollection) getStoreName(payload *types.Payload, facet types.DataFacet) string {
	name := ""

	// EXISTING_CODE
	// EXISTING_CODE

	switch facet {
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
	name = fmt.Sprintf("%s-%s-%s", name, payload.ActiveChain, payload.ActiveAddress)
	return name
}

var (
	collections   = make(map[string]*NamesCollection)
	collectionsMu sync.Mutex
)

func GetNamesCollection(payload *types.Payload) *NamesCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	pl.ActiveAddress = ""
	pl.ActiveChain = ""

	key := getStoreKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewNamesCollection(payload)
	collections[key] = collection
	return collection
}

func getStoreKey(payload *types.Payload) string {
	// EXISTING_CODE
	if payload.DataFacet == NamesPrefund {
		return payload.ActiveChain
	}
	// EXISTING_CODE
	_ = payload
	return "singleton"
}

// EXISTING_CODE
// EXISTING_CODE
