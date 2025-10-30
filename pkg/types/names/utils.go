package names

import (
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

func NameFromAddress(address base.Address) (*Name, bool) {
	if !ensureLoadedSync() {
		return nil, false
	}
	pl := &types.Payload{}
	storeKey := getStoreKey(pl) // singleton store anyway
	store := namesStore[storeKey]
	if store == nil {
		return nil, false
	}
	name, found := store.GetItemFromMap(address.Hex())
	return name, found
}

// loadNamesSync synchronously loads names using a non-streaming context
// This blocks until the names are fully loaded or an error occurs
func loadNamesSync() error {
	// Lock to prevent race conditions during loading
	namesStoreMu.Lock()
	defer namesStoreMu.Unlock()

	pl := &types.Payload{}
	storeKey := getStoreKey(pl) // singleton store anyway
	store := namesStore[storeKey]

	// Double-check if store is already loaded after acquiring lock
	if store != nil && store.GetState() == types.StateLoaded {
		return nil
	}

	// Use the same options as the store but without RenderCtx (SDK will use non-streaming)
	namesOpts := sdk.NamesOptions{
		Globals: sdk.Globals{Verbose: true, Chain: "mainnet"},
		All:     true,
	}

	names, _, err := namesOpts.Names()
	if err != nil {
		return err
	}

	// Now we need to populate the store directly with the loaded names
	if store != nil {
		// Reset the store to clear any existing state
		store.Reset()

		// Add each name to the store - this will populate both data slice and dataMap
		for i, name := range names {
			namePtr := &name
			store.AddItem(namePtr, i)
		}

		// Mark the store as loaded
		store.ChangeState(types.StateLoaded, "Synchronously loaded names")
	}

	return nil
}

// ensureLoadedSync ensures the names store is loaded synchronously
// This will block until names are loaded or an error occurs
func ensureLoadedSync() bool {
	pl := &types.Payload{}
	storeKey := getStoreKey(pl) // singleton store anyway
	store := namesStore[storeKey]
	if store == nil {
		return false
	}

	// Quick check without lock first (optimization)
	if store.GetState() == types.StateLoaded {
		return true
	}

	// Load names synchronously (this will acquire lock internally)
	if err := loadNamesSync(); err != nil {
		return false
	}

	// Verify the store is now loaded
	updatedStore := namesStore[storeKey]
	return updatedStore != nil && updatedStore.GetState() == types.StateLoaded
}
