// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package monitors

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

type Monitor = sdk.Monitor

// EXISTING_CODE

var (
	monitorsStore   = make(map[string]*store.Store[Monitor])
	monitorsStoreMu sync.Mutex
)

func (c *MonitorsCollection) getMonitorsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Monitor] {
	monitorsStoreMu.Lock()
	defer monitorsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := monitorsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			listOpts := sdk.MonitorsOptions{
				Globals:   sdk.Globals{Cache: true, Verbose: true, Chain: payload.ActiveChain},
				RenderCtx: ctx,
			}
			if _, _, err := listOpts.MonitorsList(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("monitors", MonitorsMonitors, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Monitors SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Monitor {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Monitor); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Monitor) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		monitorsStore[storeKey] = theStore
	}

	return theStore
}

func (c *MonitorsCollection) getStoreName(payload *types.Payload, facet types.DataFacet) string {
	name := ""
	switch facet {
	case MonitorsMonitors:
		name = "monitors-monitors"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, payload.ActiveChain, payload.ActiveAddress)
	return name
}

var (
	collections   = make(map[string]*MonitorsCollection)
	collectionsMu sync.Mutex
)

func GetMonitorsCollection(payload *types.Payload) *MonitorsCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	key := getStoreKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewMonitorsCollection(payload)
	collections[key] = collection
	return collection
}

func getStoreKey(payload *types.Payload) string {
	// EXISTING_CODE
	// EXISTING_CODE
	return payload.ActiveChain
}

// EXISTING_CODE
// EXISTING_CODE
