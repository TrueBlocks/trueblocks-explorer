package names

import "github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"

func (c *NamesCollection) NameFromAddress(address base.Address) (*Name, bool) {
	return namesStore.GetItemFromMap(address)
}
