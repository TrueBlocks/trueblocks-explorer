// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package status

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// TestStatusScopingBehavior validates that Status follows chain-scoped sharing
func TestStatusScopingBehavior(t *testing.T) {
	// Clear any existing stores
	statusStoreMu.Lock()
	statusStore = make(map[string]*store.Store[Status])
	statusStoreMu.Unlock()

	chainsStoreMu.Lock()
	chainsStore = make(map[string]*store.Store[Chain])
	chainsStoreMu.Unlock()

	t.Run("PerFacetStoreKeys", func(t *testing.T) {
		// Test that StatusChains is singleton
		chainsPl1 := &types.Payload{Collection: "status", DataFacet: StatusChains, ActiveChain: "mainnet", ActiveAddress: "0x123"}
		chainsPl2 := &types.Payload{Collection: "status", DataFacet: StatusChains, ActiveChain: "polygon", ActiveAddress: "0x456"}

		chainsKey1 := getStoreKey(chainsPl1)
		chainsKey2 := getStoreKey(chainsPl2)

		expectedSingletonKey := "singleton"
		if chainsKey1 != expectedSingletonKey {
			t.Errorf("StatusChains should be singleton: expected '%s', got '%s'", expectedSingletonKey, chainsKey1)
		}
		if chainsKey2 != expectedSingletonKey {
			t.Errorf("StatusChains should be singleton: expected '%s', got '%s'", expectedSingletonKey, chainsKey2)
		}
		if chainsKey1 != chainsKey2 {
			t.Errorf("StatusChains should have same singleton key: '%s' vs '%s'", chainsKey1, chainsKey2)
		}

		// Test that other facets are chain-scoped
		statusPl1 := &types.Payload{Collection: "status", DataFacet: StatusStatus, ActiveChain: "mainnet", ActiveAddress: "0x123"}
		statusPl2 := &types.Payload{Collection: "status", DataFacet: StatusStatus, ActiveChain: "polygon", ActiveAddress: "0x123"}
		cachesPl1 := &types.Payload{Collection: "status", DataFacet: StatusCaches, ActiveChain: "mainnet", ActiveAddress: "0x456"}

		statusKey1 := getStoreKey(statusPl1)
		statusKey2 := getStoreKey(statusPl2)
		cachesKey1 := getStoreKey(cachesPl1)

		if statusKey1 != "mainnet" {
			t.Errorf("StatusStatus should be chain-scoped: expected 'mainnet', got '%s'", statusKey1)
		}
		if statusKey2 != "polygon" {
			t.Errorf("StatusStatus should be chain-scoped: expected 'polygon', got '%s'", statusKey2)
		}
		if cachesKey1 != "mainnet" {
			t.Errorf("StatusCaches should be chain-scoped: expected 'mainnet', got '%s'", cachesKey1)
		}

		t.Logf("✅ Per-facet scoping: StatusChains singleton ('%s'), others chain-scoped ('%s', '%s')",
			chainsKey1, statusKey1, statusKey2)
	})

	t.Run("ChainScopedStoreKeys", func(t *testing.T) {
		pl1 := &types.Payload{Collection: "status", DataFacet: StatusStatus, ActiveChain: "mainnet", ActiveAddress: "0x123"}
		pl2 := &types.Payload{Collection: "status", DataFacet: StatusStatus, ActiveChain: "mainnet", ActiveAddress: "0x456"}
		pl3 := &types.Payload{Collection: "status", DataFacet: StatusStatus, ActiveChain: "polygon", ActiveAddress: "0x123"}
		pl4 := &types.Payload{Collection: "status", DataFacet: StatusStatus, ActiveChain: "polygon", ActiveAddress: "0x456"}
		key1 := getStoreKey(pl1)
		key2 := getStoreKey(pl2)
		key3 := getStoreKey(pl3)
		key4 := getStoreKey(pl4)

		// Same chain should have same key regardless of address
		if key1 != key2 {
			t.Errorf("Same chain should have same key: '%s' vs '%s'", key1, key2)
		}
		if key3 != key4 {
			t.Errorf("Same chain should have same key: '%s' vs '%s'", key3, key4)
		}

		// Different chains should have different keys
		if key1 == key3 {
			t.Errorf("Different chains should have different keys: '%s' vs '%s'", key1, key3)
		}

		if key1 != "mainnet" {
			t.Errorf("Expected mainnet key 'mainnet', got '%s'", key1)
		}
		if key3 != "polygon" {
			t.Errorf("Expected polygon key 'polygon', got '%s'", key3)
		}

		t.Logf("✅ Chain-scoped getStoreKey: mainnet='%s', polygon='%s'", key1, key3)
	})

	t.Run("ChainScopedStoreMapSize", func(t *testing.T) {
		// Create payloads with 2 chains, 2 addresses each = 4 total payloads
		payloads := []*types.Payload{
			{Collection: "status", DataFacet: StatusStatus, ActiveChain: "mainnet", ActiveAddress: "0x123"},
			{Collection: "status", DataFacet: StatusStatus, ActiveChain: "mainnet", ActiveAddress: "0x456"},
			{Collection: "status", DataFacet: StatusStatus, ActiveChain: "polygon", ActiveAddress: "0x123"},
			{Collection: "status", DataFacet: StatusStatus, ActiveChain: "polygon", ActiveAddress: "0x789"},
		}

		var collections []*StatusCollection
		for _, payload := range payloads {
			coll := GetStatusCollection(payload)
			collections = append(collections, coll)
			// Force store creation by getting a store
			_ = coll.getStatusStore(payload, StatusStatus)
		}

		// Check store map size - should be 2 (one per chain)
		statusStoreMu.Lock()
		mapSize := len(statusStore)
		statusStoreMu.Unlock()

		if mapSize != 2 {
			t.Errorf("CHAIN-SCOPED FAILURE: Expected 2 stores (one per chain), got %d", mapSize)
		} else {
			t.Logf("✅ Chain-scoped: Exactly 2 stores for 2 chains across %d payloads", len(payloads))
		}

		// Collections are scoped by chain+address, so they will be different instances
		// But they should share the same underlying stores (which are chain-scoped)
		// We can verify this by checking that stores with same chain use same instance
		store1 := collections[0].getStatusStore(payloads[0], StatusStatus)
		store2 := collections[1].getStatusStore(payloads[1], StatusStatus)
		store3 := collections[2].getStatusStore(payloads[2], StatusStatus)
		store4 := collections[3].getStatusStore(payloads[3], StatusStatus)

		// Same chain stores should be identical
		if store1 != store2 {
			t.Errorf("CHAIN-SCOPED FAILURE: Same chain should share stores (mainnet)")
		}
		if store3 != store4 {
			t.Errorf("CHAIN-SCOPED FAILURE: Same chain should share stores (polygon)")
		}

		// Different chain stores should be different
		if store1 == store3 {
			t.Errorf("CHAIN-SCOPED FAILURE: Different chains should have different stores")
		}

		t.Logf("✅ Chain-scoped: Stores properly shared within chain, isolated across chains")
	})

	t.Run("MultipleStoreTypes", func(t *testing.T) {
		// Test that multiple store types (Status, Caches) follow same scoping
		payload1 := &types.Payload{Collection: "status", DataFacet: StatusStatus, ActiveChain: "mainnet", ActiveAddress: "0x123"}
		payload2 := &types.Payload{Collection: "status", DataFacet: StatusCaches, ActiveChain: "mainnet", ActiveAddress: "0x456"}
		payload3 := &types.Payload{Collection: "status", DataFacet: StatusStatus, ActiveChain: "polygon", ActiveAddress: "0x123"}
		payload4 := &types.Payload{Collection: "status", DataFacet: StatusCaches, ActiveChain: "polygon", ActiveAddress: "0x456"}

		coll1 := GetStatusCollection(payload1)
		coll2 := GetStatusCollection(payload2)
		coll3 := GetStatusCollection(payload3)
		coll4 := GetStatusCollection(payload4)

		// Force creation of different store types
		_ = coll1.getStatusStore(payload1, StatusStatus)
		_ = coll2.getCachesStore(payload2, StatusCaches)
		_ = coll3.getStatusStore(payload3, StatusStatus)
		_ = coll4.getCachesStore(payload4, StatusCaches)

		// Check both store maps
		statusStoreMu.Lock()
		statusMapSize := len(statusStore)
		statusStoreMu.Unlock()

		cachesStoreMu.Lock()
		cachesMapSize := len(cachesStore)
		cachesStoreMu.Unlock()

		if statusMapSize != 2 {
			t.Errorf("Status stores: Expected 2 (mainnet+polygon), got %d", statusMapSize)
		}
		if cachesMapSize != 2 {
			t.Errorf("Caches stores: Expected 2 (mainnet+polygon), got %d", cachesMapSize)
		}

		t.Logf("✅ Multiple store types follow chain scoping: Status=%d, Caches=%d", statusMapSize, cachesMapSize)
	})
}
