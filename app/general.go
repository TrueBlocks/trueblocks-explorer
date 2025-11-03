package app

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
)

// NameFromAddress resolves an Ethereum address to a named entity if one exists
func (a *App) NameFromAddress(address string) (*names.Name, bool) {
	return names.NameFromAddress(base.HexToAddress(address))
}

// CancelFetches cancels all active fetch operations and returns the count of cancelled operations
func (a *App) CancelFetches() int {
	return store.CancelFetches()
}
