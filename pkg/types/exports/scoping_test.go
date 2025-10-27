package exports

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// TestExportsScopingBehavior validates that Exports follows address-scoped isolation
func TestExportsScopingBehavior(t *testing.T) {
	// Clear any existing stores
	transactionsStoreMu.Lock()
	transactionsStore = make(map[string]*store.Store[Transaction])
	transactionsStoreMu.Unlock()

	balancesStoreMu.Lock()
	balancesStore = make(map[string]*store.Store[Balance])
	balancesStoreMu.Unlock()

	t.Run("AddressScopedStoreKeys", func(t *testing.T) {
		pl1 := &types.Payload{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "mainnet", ActiveAddress: "0x123"}
		pl2 := &types.Payload{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "mainnet", ActiveAddress: "0x456"}
		pl3 := &types.Payload{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "polygon", ActiveAddress: "0x123"}
		pl4 := &types.Payload{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "polygon", ActiveAddress: "0x456"}

		key1 := getStoreKey(pl1)
		key2 := getStoreKey(pl2)
		key3 := getStoreKey(pl3)
		key4 := getStoreKey(pl4)
		// All combinations should be unique
		keys := []string{key1, key2, key3, key4}
		for i := 0; i < len(keys); i++ {
			for j := i + 1; j < len(keys); j++ {
				if keys[i] == keys[j] {
					t.Errorf("All keys should be unique: %s == %s", keys[i], keys[j])
				}
			}
		}

		expectedKeys := map[string]string{
			"mainnet_0x123": key1,
			"mainnet_0x456": key2,
			"polygon_0x123": key3,
			"polygon_0x456": key4,
		}

		for expected, actual := range expectedKeys {
			if actual != expected {
				t.Errorf("Expected key '%s', got '%s'", expected, actual)
			}
		}

		t.Logf("✅ Address-scoped getStoreKey generates unique keys: %v", keys)
	})

	t.Run("AddressScopedStoreMapSize", func(t *testing.T) {
		// Create payloads with 2 chains, 2 addresses each = 4 unique combinations
		payloads := []*types.Payload{
			{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "mainnet", ActiveAddress: "0x123"},
			{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "mainnet", ActiveAddress: "0x456"},
			{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "polygon", ActiveAddress: "0x123"},
			{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "polygon", ActiveAddress: "0x789"},
		}

		var collections []*ExportsCollection
		for _, payload := range payloads {
			coll := GetExportsCollection(payload)
			collections = append(collections, coll)
			// Force store creation by getting a store
			_ = coll.getTransactionsStore(payload, ExportsTransactions)
		}

		// Check store map size - should be 4 (one per chain+address combination)
		transactionsStoreMu.Lock()
		mapSize := len(transactionsStore)
		transactionsStoreMu.Unlock()

		if mapSize != 4 {
			t.Errorf("ADDRESS-SCOPED FAILURE: Expected 4 stores (one per chain+address), got %d", mapSize)
		} else {
			t.Logf("✅ Address-scoped: Exactly 4 stores for 4 chain+address combinations")
		}

		// All collections should be different (each has unique chain+address)
		for i := 0; i < len(collections); i++ {
			for j := i + 1; j < len(collections); j++ {
				if collections[i] == collections[j] {
					t.Errorf("ADDRESS-SCOPED FAILURE: All collections should be unique instances")
				}
			}
		}

		// All stores should be different
		stores := make([]*store.Store[Transaction], len(payloads))
		for i, payload := range payloads {
			stores[i] = collections[i].getTransactionsStore(payload, ExportsTransactions)
		}

		for i := 0; i < len(stores); i++ {
			for j := i + 1; j < len(stores); j++ {
				if stores[i] == stores[j] {
					t.Errorf("ADDRESS-SCOPED FAILURE: All stores should be unique instances")
				}
			}
		}

		t.Logf("✅ Address-scoped: All collections and stores are isolated")
	})

	t.Run("MultipleStoreTypes", func(t *testing.T) {
		// Clear stores first to avoid interference from previous tests
		transactionsStoreMu.Lock()
		transactionsStore = make(map[string]*store.Store[Transaction])
		transactionsStoreMu.Unlock()

		balancesStoreMu.Lock()
		balancesStore = make(map[string]*store.Store[Balance])
		balancesStoreMu.Unlock()

		// Test that multiple store types (Transactions, Balances) follow same scoping
		payloads := []*types.Payload{
			{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "mainnet", ActiveAddress: "0x123"},
			{Collection: "exports", DataFacet: ExportsBalances, ActiveChain: "mainnet", ActiveAddress: "0x123"},
			{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "polygon", ActiveAddress: "0x456"},
			{Collection: "exports", DataFacet: ExportsBalances, ActiveChain: "polygon", ActiveAddress: "0x456"},
		}

		collections := make([]*ExportsCollection, len(payloads))
		for i, payload := range payloads {
			collections[i] = GetExportsCollection(payload)
		}

		// Force creation of different store types
		_ = collections[0].getTransactionsStore(payloads[0], ExportsTransactions)
		_ = collections[1].getBalancesStore(payloads[1], ExportsBalances)
		_ = collections[2].getTransactionsStore(payloads[2], ExportsTransactions)
		_ = collections[3].getBalancesStore(payloads[3], ExportsBalances)

		// Check both store maps
		transactionsStoreMu.Lock()
		transactionsMapSize := len(transactionsStore)
		transactionsStoreMu.Unlock()

		balancesStoreMu.Lock()
		balancesMapSize := len(balancesStore)
		balancesStoreMu.Unlock()

		if transactionsMapSize != 2 {
			t.Errorf("Transactions stores: Expected 2 (mainnet_0x123, polygon_0x456), got %d", transactionsMapSize)
		}
		if balancesMapSize != 2 {
			t.Errorf("Balances stores: Expected 2 (mainnet_0x123, polygon_0x456), got %d", balancesMapSize)
		}

		t.Logf("✅ Multiple store types follow address scoping: Transactions=%d, Balances=%d", transactionsMapSize, balancesMapSize)
	})

	t.Run("SameChainDifferentAddresses", func(t *testing.T) {
		// Clear stores first to avoid interference from previous tests
		transactionsStoreMu.Lock()
		transactionsStore = make(map[string]*store.Store[Transaction])
		transactionsStoreMu.Unlock()

		// Verify that same chain but different addresses create separate stores
		payload1 := &types.Payload{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "mainnet", ActiveAddress: "0xabc"}
		payload2 := &types.Payload{Collection: "exports", DataFacet: ExportsTransactions, ActiveChain: "mainnet", ActiveAddress: "0xdef"}

		coll1 := GetExportsCollection(payload1)
		coll2 := GetExportsCollection(payload2)

		store1 := coll1.getTransactionsStore(payload1, ExportsTransactions)
		store2 := coll2.getTransactionsStore(payload2, ExportsTransactions)

		if store1 == store2 {
			t.Errorf("ADDRESS-SCOPED FAILURE: Same chain, different addresses should have different stores")
		}

		if coll1 == coll2 {
			t.Errorf("ADDRESS-SCOPED FAILURE: Same chain, different addresses should have different collections")
		}

		t.Logf("✅ Address-scoped: Same chain, different addresses properly isolated")
	})
}
