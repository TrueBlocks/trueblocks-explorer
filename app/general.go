package app

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
)

// NameFromAddress resolves an Ethereum address to a named entity if one exists
func (a *App) NameFromAddress(address string) (*names.Name, bool) {
	return names.NameFromAddress(base.HexToAddress(address))
}

// CancelFetch cancels an active data fetch operation for a specific data facet
func (a *App) CancelFetch(dataFacet types.DataFacet) {
	for _, collection := range a.collections {
		supportedFacets := collection.GetSupportedFacets()
		for _, facet := range supportedFacets {
			if facet == dataFacet {
				// TODO: BOGUS - this does not reset export which requires chain and address to find the collection
				storeName := collection.GetStoreName(facet, "", "")
				store.CancelFetch(storeName)
				return
			}
		}
	}
}

// CancelAllFetches cancels all active fetch operations and returns the count of cancelled operations
func (a *App) CancelAllFetches() int {
	return store.CancelAllFetches()
}

// ResetStore resets the data store for all collections matching the given store name
func (a *App) ResetStore(storeName string) {
	for _, collection := range a.collections {
		for _, facet := range collection.GetSupportedFacets() {
			// TODO: BOGUS - this does not reset export which requires chain and address to find the collection
			if collection.GetStoreName(facet, "", "") == storeName {
				collection.Reset(facet)
			}
		}
	}
}
