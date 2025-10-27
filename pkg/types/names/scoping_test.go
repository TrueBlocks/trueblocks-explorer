package names

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// TestNamesScopingBehavior validates that Names follows singleton scoping
func TestNamesScopingBehavior(t *testing.T) {
	// Clear any existing stores
	namesStoreMu.Lock()
	namesStore = make(map[string]*store.Store[Name])
	namesStoreMu.Unlock()

	t.Run("PerFacetStoreKeys", func(t *testing.T) {
		// Test that NamesPrefund is chain-scoped
		prefundPl1 := &types.Payload{Collection: "names", DataFacet: NamesPrefund, ActiveChain: "mainnet", ActiveAddress: "0x123"}
		prefundPl2 := &types.Payload{Collection: "names", DataFacet: NamesPrefund, ActiveChain: "polygon", ActiveAddress: "0x123"}

		prefundKey1 := getStoreKey(prefundPl1)
		prefundKey2 := getStoreKey(prefundPl2)

		if prefundKey1 != "mainnet" {
			t.Errorf("NamesPrefund should be chain-scoped: expected 'mainnet', got '%s'", prefundKey1)
		}
		if prefundKey2 != "polygon" {
			t.Errorf("NamesPrefund should be chain-scoped: expected 'polygon', got '%s'", prefundKey2)
		}
		if prefundKey1 == prefundKey2 {
			t.Errorf("NamesPrefund should have different keys per chain: '%s' vs '%s'", prefundKey1, prefundKey2)
		}

		// Test that other facets are singleton
		allPl1 := &types.Payload{Collection: "names", DataFacet: NamesAll, ActiveChain: "mainnet", ActiveAddress: "0x123"}
		allPl2 := &types.Payload{Collection: "names", DataFacet: NamesAll, ActiveChain: "polygon", ActiveAddress: "0x456"}
		customPl := &types.Payload{Collection: "names", DataFacet: NamesCustom, ActiveChain: "mainnet", ActiveAddress: "0x789"}

		allKey1 := getStoreKey(allPl1)
		allKey2 := getStoreKey(allPl2)
		customKey := getStoreKey(customPl)

		expectedSingletonKey := "singleton"
		if allKey1 != expectedSingletonKey || allKey2 != expectedSingletonKey || customKey != expectedSingletonKey {
			t.Errorf("Non-prefund facets should be singleton: got '%s', '%s', '%s'", allKey1, allKey2, customKey)
		}

		t.Logf("✅ Per-facet scoping: NamesPrefund chain-scoped ('%s', '%s'), others singleton ('%s')",
			prefundKey1, prefundKey2, allKey1)
	})

	t.Run("SingletonStoreKeys", func(t *testing.T) {
		pl1 := &types.Payload{Collection: "names", DataFacet: NamesAll, ActiveChain: "mainnet", ActiveAddress: "0x123"}
		pl2 := &types.Payload{Collection: "names", DataFacet: NamesAll, ActiveChain: "polygon", ActiveAddress: "0x456"}
		pl3 := &types.Payload{Collection: "names", DataFacet: NamesAll, ActiveChain: "", ActiveAddress: ""}

		key1 := getStoreKey(pl1)
		key2 := getStoreKey(pl2)
		key3 := getStoreKey(pl3)

		expectedKey := "singleton"
		if key1 != expectedKey {
			t.Errorf("Expected singleton key '%s', got '%s'", expectedKey, key1)
		}
		if key1 != key2 || key2 != key3 {
			t.Errorf("All singleton keys should be identical: '%s', '%s', '%s'", key1, key2, key3)
		}
		t.Logf("✅ Singleton getStoreKey returns consistent key: '%s'", key1)
	})

	t.Run("SingletonStoreMapSize", func(t *testing.T) {
		// Create payloads with different chains and addresses
		payloads := []*types.Payload{
			{Collection: "names", DataFacet: NamesAll, ActiveChain: "mainnet", ActiveAddress: "0x123"},
			{Collection: "names", DataFacet: NamesAll, ActiveChain: "mainnet", ActiveAddress: "0x456"},
			{Collection: "names", DataFacet: NamesAll, ActiveChain: "polygon", ActiveAddress: "0x123"},
			{Collection: "names", DataFacet: NamesAll, ActiveChain: "polygon", ActiveAddress: "0x789"},
		}

		var collections []*NamesCollection
		for _, payload := range payloads {
			coll := GetNamesCollection(payload)
			collections = append(collections, coll)
			// Force store creation by getting a store
			_ = coll.getNamesStore(payload, NamesAll)
		}

		// Check store map size
		namesStoreMu.Lock()
		mapSize := len(namesStore)
		namesStoreMu.Unlock()

		if mapSize != 1 {
			t.Errorf("SINGLETON FAILURE: Expected 1 store, got %d", mapSize)
		} else {
			t.Logf("✅ Singleton: Exactly 1 store in map regardless of %d different payloads", len(payloads))
		}

		// Check all collections are identical
		for i := 1; i < len(collections); i++ {
			if collections[0] != collections[i] {
				t.Errorf("SINGLETON FAILURE: Collections should be identical instances")
			}
		}
		t.Logf("✅ Singleton: All %d collections are same instance", len(collections))
	})
}
