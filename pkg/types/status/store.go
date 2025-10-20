// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package status

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

type Cache = sdk.Cache
type Chain = sdk.Chain
type Status = sdk.Status

// EXISTING_CODE

var (
	cachesStore   *store.Store[Cache]
	cachesStoreMu sync.Mutex

	chainsStore   *store.Store[Chain]
	chainsStoreMu sync.Mutex

	statusStore   *store.Store[Status]
	statusStoreMu sync.Mutex
)

func (c *StatusCollection) getCachesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Cache] {
	cachesStoreMu.Lock()
	defer cachesStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.Chain
	address := payload.Address
	theStore := cachesStore
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.StatusOptions{
				Globals:   sdk.Globals{Chain: chain},
				RenderCtx: ctx,
			}
			if _, _, err := opts.StatusCaches(); err != nil {
				wrappedErr := types.NewSDKError("status", StatusCaches, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Status Caches SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Cache {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Cache); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Cache) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		cachesStore = theStore
	}

	return theStore
}

func (c *StatusCollection) getChainsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Chain] {
	chainsStoreMu.Lock()
	defer chainsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.Chain
	address := payload.Address
	theStore := chainsStore
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.StatusOptions{
				Globals:   sdk.Globals{Chain: chain},
				RenderCtx: ctx,
			}
			if _, _, err := opts.StatusChains(); err != nil {
				wrappedErr := types.NewSDKError("status", StatusChains, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Status Chains SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Chain {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Chain); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Chain) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		chainsStore = theStore
	}

	return theStore
}

func (c *StatusCollection) getStatusStore(payload *types.Payload, facet types.DataFacet) *store.Store[Status] {
	statusStoreMu.Lock()
	defer statusStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.Chain
	address := payload.Address
	theStore := statusStore
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.StatusOptions{
				Globals:   sdk.Globals{Chain: chain},
				RenderCtx: ctx,
			}
			if _, _, err := opts.StatusHealthcheck(); err != nil {
				wrappedErr := types.NewSDKError("status", StatusStatus, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Status Healthcheck SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Status {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Status); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Status) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		statusStore = theStore
	}

	return theStore
}

func (c *StatusCollection) GetStoreName(dataFacet types.DataFacet, chain, address string) string {
	_ = chain
	_ = address
	name := ""
	switch dataFacet {
	case StatusStatus:
		name = "status-status"
	case StatusCaches:
		name = "status-caches"
	case StatusChains:
		name = "status-chains"
	default:
		return ""
	}
	return name
}

var (
	collections   = make(map[store.CollectionKey]*StatusCollection)
	collectionsMu sync.Mutex
)

func GetStatusCollection(payload *types.Payload) *StatusCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	pl.Address = ""

	key := store.GetCollectionKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewStatusCollection(payload)
	collections[key] = collection
	return collection
}

// EXISTING_CODE
// EXISTING_CODE
