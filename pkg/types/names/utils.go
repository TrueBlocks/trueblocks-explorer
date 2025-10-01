package names

import (
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

func (c *NamesCollection) NameFromAddress(address base.Address) (*Name, bool) {
	if !c.ensureLoadedSync("mainnet") {
		return nil, false
	}
	name, found := namesStore.GetItemFromMap(address)
	return name, found
}

// loadNamesSync synchronously loads names using a non-streaming context
// This blocks until the names are fully loaded or an error occurs
func (c *NamesCollection) loadNamesSync(chain string) error {
	// Lock to prevent race conditions during loading
	namesStoreMu.Lock()
	defer namesStoreMu.Unlock()

	// Double-check if store is already loaded after acquiring lock
	if namesStore != nil && namesStore.GetState() == store.StateLoaded {
		return nil
	}

	// Use the same options as the store but without RenderCtx (SDK will use non-streaming)
	namesOpts := sdk.NamesOptions{
		Globals: sdk.Globals{Verbose: true, Chain: chain},
		All:     true,
	}

	names, _, err := namesOpts.Names()
	if err != nil {
		return err
	}

	// Now we need to populate the store directly with the loaded names
	if namesStore != nil {
		// Reset the store to clear any existing state
		namesStore.Reset()

		// Add each name to the store - this will populate both data slice and dataMap
		for i, name := range names {
			namePtr := &name
			namesStore.AddItem(namePtr, i)
		}

		// Mark the store as loaded
		namesStore.ChangeState(0, store.StateLoaded, "Synchronously loaded names")
	}

	return nil
}

// ensureLoadedSync ensures the names store is loaded synchronously
// This will block until names are loaded or an error occurs
func (c *NamesCollection) ensureLoadedSync(chain string) bool {
	if namesStore == nil {
		return false
	}

	// Quick check without lock first (optimization)
	if namesStore.GetState() == store.StateLoaded {
		return true
	}

	// Load names synchronously (this will acquire lock internally)
	if err := c.loadNamesSync(chain); err != nil {
		return false
	}

	// Verify the store is now loaded
	return namesStore.GetState() == store.StateLoaded
}
