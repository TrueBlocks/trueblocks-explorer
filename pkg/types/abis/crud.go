package abis

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/crud"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

func (c *AbisCollection) Crud(
	payload *types.Payload,
	op crud.Operation,
	item interface{},
) error {
	var abi = &Abi{Address: base.HexToAddress(payload.TargetAddress)}
	if cast, ok := item.(*Abi); ok && cast != nil {
		abi = cast
	}

	var err error
	switch op {
	case crud.Autoname:
		if err = names.AutonameAddress(abi.Address.Hex()); err != nil {
			msgs.EmitError("Abis.Crud.Autoname", err)
			return err
		}
		msgs.EmitStatus(fmt.Sprintf("completed autoname operation for address: %s", abi.Address))
		return nil
	case crud.Remove:
		opts := sdk.AbisOptions{
			Addrs:   []string{abi.Address.Hex()},
			Globals: sdk.Globals{Decache: true},
		}
		_, _, err = opts.Abis()
	default:
		return fmt.Errorf("operation %s not yet implemented for Abis", op)
	}

	if err != nil {
		return err
	}

	store := c.downloadedFacet.GetStore()
	removedCount := 0
	store.UpdateData(func(data []*Abi) []*Abi {
		result, count := c.updateAbiInData(data, abi, op)
		removedCount = count
		return result
	})
	c.downloadedFacet.SyncWithStore()
	switch op {
	case crud.Remove:
		if removedCount > 0 {
			msgs.EmitStatus(fmt.Sprintf("deleted ABI for address: %s", abi.Address))
		} else {
			msgs.EmitStatus(fmt.Sprintf("ABI for address %s was not found in cache", abi.Address))
		}
	}

	return nil
}

func (c *AbisCollection) updateAbiInData(data []*Abi, abi *Abi, op crud.Operation) ([]*Abi, int) {
	count := 0
	switch op {
	case crud.Remove:
		result := make([]*Abi, 0, len(data))
		for _, existing := range data {
			if existing.Address == abi.Address {
				count++
			} else {
				result = append(result, existing)
			}
		}
		return result, count
	case crud.Create:
		for _, existing := range data {
			if existing.Address == abi.Address {
				// Already exists, just update it
				*existing = *abi
				return data, 1
			}
		}
		return append(data, abi), 1
	case crud.Update:
		for _, existing := range data {
			if existing.Address == abi.Address {
				*existing = *abi
				count = 1
				break
			}
		}
		return data, count
	default:
		return data, 0
	}
}

// TODO: Consider adding batch operations for Abis, similar to MonitorsCollection.Clean (e.g., batch remove).
