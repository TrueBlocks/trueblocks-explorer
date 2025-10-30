// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package chunks

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

type Bloom = sdk.Bloom
type Index = sdk.Index
type Manifest = sdk.Manifest
type Stats = sdk.Stats

// EXISTING_CODE

var (
	bloomsStore   = make(map[string]*store.Store[Bloom])
	bloomsStoreMu sync.Mutex

	indexStore   = make(map[string]*store.Store[Index])
	indexStoreMu sync.Mutex

	manifestStore   = make(map[string]*store.Store[Manifest])
	manifestStoreMu sync.Mutex

	statsStore   = make(map[string]*store.Store[Stats])
	statsStoreMu sync.Mutex
)

func (c *ChunksCollection) getBloomsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Bloom] {
	bloomsStoreMu.Lock()
	defer bloomsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := bloomsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ChunksOptions{
				Globals: sdk.Globals{
					Verbose: false, // Set to false to avoid weird output issues
					Chain:   payload.ActiveChain,
				},
				RenderCtx: ctx,
			}

			if _, _, err := opts.ChunksBlooms(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("chunks", ChunksBlooms, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Chunks blooms SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Bloom {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Bloom); ok {
				c.updateBloomsBucket(it)
				return it
			}
			return nil
		}

		mappingFunc := func(item *Bloom) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		bloomsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ChunksCollection) getIndexStore(payload *types.Payload, facet types.DataFacet) *store.Store[Index] {
	indexStoreMu.Lock()
	defer indexStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := indexStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ChunksOptions{
				Globals: sdk.Globals{
					Verbose: true,
					Chain:   payload.ActiveChain,
				},
				RenderCtx: ctx,
			}

			if _, _, err := opts.ChunksIndex(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("chunks", ChunksIndex, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Chunks index SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Index {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Index); ok {
				c.updateIndexBucket(it)
				return it
			}
			return nil
		}

		mappingFunc := func(item *Index) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		indexStore[storeKey] = theStore
	}

	return theStore
}

func (c *ChunksCollection) getManifestStore(payload *types.Payload, facet types.DataFacet) *store.Store[Manifest] {
	manifestStoreMu.Lock()
	defer manifestStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := manifestStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ChunksOptions{
				Globals: sdk.Globals{
					Verbose: true,
					Chain:   payload.ActiveChain,
				},
				RenderCtx: ctx,
			}

			if _, _, err := opts.ChunksManifest(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("chunks", ChunksManifest, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Chunks manifest SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Manifest {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Manifest); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Manifest) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		manifestStore[storeKey] = theStore
	}

	return theStore
}

func (c *ChunksCollection) getStatsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Stats] {
	statsStoreMu.Lock()
	defer statsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := statsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			opts := sdk.ChunksOptions{
				Globals: sdk.Globals{
					Verbose: true,
					Chain:   payload.ActiveChain,
				},
				RenderCtx: ctx,
			}

			if _, _, err := opts.ChunksStats(); err != nil {
				// Create structured error with proper context
				wrappedErr := types.NewSDKError("chunks", ChunksStats, "fetch", err)
				logging.LogBEWarning(fmt.Sprintf("Chunks stats SDK query error: %v", wrappedErr))
				return wrappedErr
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Stats {
			// EXISTING_CODE
			// EXISTING_CODE
			if it, ok := item.(*Stats); ok {
				c.updateStatsBucket(it)
				return it
			}
			return nil
		}

		mappingFunc := func(item *Stats) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		statsStore[storeKey] = theStore
	}

	return theStore
}

func (c *ChunksCollection) getStoreName(payload *types.Payload, facet types.DataFacet) string {
	name := ""
	switch facet {
	case ChunksStats:
		name = "chunks-stats"
	case ChunksIndex:
		name = "chunks-index"
	case ChunksBlooms:
		name = "chunks-blooms"
	case ChunksManifest:
		name = "chunks-manifest"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, payload.ActiveChain, payload.ActiveAddress)
	return name
}

var (
	collections   = make(map[string]*ChunksCollection)
	collectionsMu sync.Mutex
)

func GetChunksCollection(payload *types.Payload) *ChunksCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	key := getStoreKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewChunksCollection(payload)
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
