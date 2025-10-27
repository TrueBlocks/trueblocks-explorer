package abis

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// TestAbisScopingBehavior validates that Abis follows per-facet scoping
func TestAbisScopingBehavior(t *testing.T) {
	// Clear any existing stores
	abisStoreMu.Lock()
	abisStore = make(map[string]*store.Store[Abi])
	abisStoreMu.Unlock()

	functionsStoreMu.Lock()
	functionsStore = make(map[string]*store.Store[Function])
	functionsStoreMu.Unlock()

	t.Run("PerFacetStoreKeys", func(t *testing.T) {
		// Test that AbisKnown is singleton
		knownPl1 := &types.Payload{Collection: "abis", DataFacet: AbisKnown, ActiveChain: "mainnet", ActiveAddress: "0x123"}
		knownPl2 := &types.Payload{Collection: "abis", DataFacet: AbisKnown, ActiveChain: "polygon", ActiveAddress: "0x456"}

		knownKey1 := getStoreKey(knownPl1)
		knownKey2 := getStoreKey(knownPl2)

		if knownKey1 != "singleton" {
			t.Errorf("AbisKnown should be singleton: expected 'singleton', got '%s'", knownKey1)
		}
		if knownKey2 != "singleton" {
			t.Errorf("AbisKnown should be singleton: expected 'singleton', got '%s'", knownKey2)
		}
		if knownKey1 != knownKey2 {
			t.Errorf("AbisKnown should have same singleton key: '%s' vs '%s'", knownKey1, knownKey2)
		}

		// Test that other facets are chain-scoped
		downloadedPl1 := &types.Payload{Collection: "abis", DataFacet: AbisDownloaded, ActiveChain: "mainnet", ActiveAddress: "0x123"}
		downloadedPl2 := &types.Payload{Collection: "abis", DataFacet: AbisDownloaded, ActiveChain: "polygon", ActiveAddress: "0x123"}
		functionsPl1 := &types.Payload{Collection: "abis", DataFacet: AbisFunctions, ActiveChain: "mainnet", ActiveAddress: "0x456"}
		eventsPl1 := &types.Payload{Collection: "abis", DataFacet: AbisEvents, ActiveChain: "polygon", ActiveAddress: "0x789"}

		downloadedKey1 := getStoreKey(downloadedPl1)
		downloadedKey2 := getStoreKey(downloadedPl2)
		functionsKey1 := getStoreKey(functionsPl1)
		eventsKey1 := getStoreKey(eventsPl1)

		if downloadedKey1 != "mainnet" {
			t.Errorf("AbisDownloaded should be chain-scoped: expected 'mainnet', got '%s'", downloadedKey1)
		}
		if downloadedKey2 != "polygon" {
			t.Errorf("AbisDownloaded should be chain-scoped: expected 'polygon', got '%s'", downloadedKey2)
		}
		if functionsKey1 != "mainnet" {
			t.Errorf("AbisFunctions should be chain-scoped: expected 'mainnet', got '%s'", functionsKey1)
		}
		if eventsKey1 != "polygon" {
			t.Errorf("AbisEvents should be chain-scoped: expected 'polygon', got '%s'", eventsKey1)
		}

		t.Logf("✅ Per-facet scoping: AbisKnown singleton ('%s'), others chain-scoped ('%s', '%s')",
			knownKey1, downloadedKey1, downloadedKey2)
	})

	t.Run("ChainScopedStoreMapSize", func(t *testing.T) {
		// Clear stores first
		abisStoreMu.Lock()
		abisStore = make(map[string]*store.Store[Abi])
		abisStoreMu.Unlock()

		// Create payloads with 2 chains for chain-scoped facets (using AbisDownloaded)
		payloads := []*types.Payload{
			{Collection: "abis", DataFacet: AbisDownloaded, ActiveChain: "mainnet", ActiveAddress: "0x123"},
			{Collection: "abis", DataFacet: AbisDownloaded, ActiveChain: "mainnet", ActiveAddress: "0x456"},
			{Collection: "abis", DataFacet: AbisDownloaded, ActiveChain: "polygon", ActiveAddress: "0x123"},
			{Collection: "abis", DataFacet: AbisDownloaded, ActiveChain: "polygon", ActiveAddress: "0x789"},
		}

		for _, payload := range payloads {
			coll := GetAbisCollection(payload)
			// Force store creation by getting a store
			_ = coll.getAbisStore(payload, AbisDownloaded)
		}

		// Check store map size - should be 2 (one per chain)
		abisStoreMu.Lock()
		mapSize := len(abisStore)
		abisStoreMu.Unlock()

		if mapSize != 2 {
			t.Errorf("CHAIN-SCOPED FAILURE: Expected 2 stores (one per chain), got %d", mapSize)
		} else {
			t.Logf("✅ Chain-scoped: Exactly 2 stores for 2 chains across %d payloads", len(payloads))
		}

		t.Logf("✅ Chain-scoped stores properly shared within chain, isolated across chains")
	})

	t.Run("SingletonStoreMapSize", func(t *testing.T) {
		// Clear stores first
		abisStoreMu.Lock()
		abisStore = make(map[string]*store.Store[Abi])
		abisStoreMu.Unlock()

		// Create payloads with different chains and addresses for singleton facet
		payloads := []*types.Payload{
			{Collection: "abis", DataFacet: AbisKnown, ActiveChain: "mainnet", ActiveAddress: "0x123"},
			{Collection: "abis", DataFacet: AbisKnown, ActiveChain: "mainnet", ActiveAddress: "0x456"},
			{Collection: "abis", DataFacet: AbisKnown, ActiveChain: "polygon", ActiveAddress: "0x123"},
			{Collection: "abis", DataFacet: AbisKnown, ActiveChain: "polygon", ActiveAddress: "0x789"},
		}

		for _, payload := range payloads {
			coll := GetAbisCollection(payload)
			// Force store creation by getting a store (using getAbisStore for AbisKnown)
			_ = coll.getAbisStore(payload, AbisKnown)
		}

		// Check store map size - should be 1 (singleton)
		abisStoreMu.Lock()
		mapSize := len(abisStore)
		abisStoreMu.Unlock()

		if mapSize != 1 {
			t.Errorf("SINGLETON FAILURE: Expected 1 store, got %d", mapSize)
		} else {
			t.Logf("✅ Singleton: Exactly 1 store regardless of %d different payloads", len(payloads))
		}

		t.Logf("✅ Singleton: AbisKnown properly shared globally")
	})
}
