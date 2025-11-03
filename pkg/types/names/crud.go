package names

import (
	"fmt"
	"sync/atomic"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/crud"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

var namesLock atomic.Int32

// AutonameAddress performs autoname operation for a given address using the SDK.
// This function can be called from other collections for cross-collection autoname support.
func AutonameAddress(address string) error {
	// Acquire lock to prevent concurrent autoname operations
	if !namesLock.CompareAndSwap(0, 1) {
		return fmt.Errorf("autoname operation already in progress")
	}
	defer namesLock.Store(0)

	// Create name object for the address
	name := &Name{
		Address:  base.HexToAddress(address),
		IsCustom: true,
	}

	// Prepare SDK options and CRUD data
	cd := crud.CrudFromName(*name)
	opts := sdk.NamesOptions{
		Globals: sdk.Globals{
			Chain: "mainnet",
		},
	}

	// Execute autoname operation via SDK
	if _, _, err := opts.ModifyName(crud.Autoname, cd); err != nil {
		msgs.EmitError("AutonameAddress", err)
		return err
	}

	// Reset Names collection cache to ensure fresh data is loaded
	// Create a minimal payload to get the Names collection instance
	payload := &types.Payload{
		Collection: "names",
		DataFacet:  NamesCustom, // Use custom facet as it's most commonly used for autoname
	}
	collection := GetNamesCollection(payload)

	// Reset all facets to ensure consistency across all Names views
	collection.Reset(NamesAll)
	collection.Reset(NamesCustom)
	collection.Reset(NamesRegular)
	// Note: Prefund and Baddress typically don't change with autoname, but reset for consistency
	collection.Reset(NamesPrefund)
	collection.Reset(NamesBaddress)

	msgs.EmitStatus(fmt.Sprintf("completed autoname operation for address: %s", address))
	return nil
}

func (c *NamesCollection) Crud(
	payload *types.Payload,
	op crud.Operation,
	item interface{},
) error {
	dataFacet := payload.DataFacet

	var name = &Name{Address: base.HexToAddress(payload.TargetAddress)}
	if item != nil {
		if n, ok := item.(*Name); ok {
			name = n
		} else {
			return fmt.Errorf("item is not of type *Name")
		}
	}

	// Special handling for Autoname - delegate to public function
	if op == crud.Autoname {
		if err := AutonameAddress(name.Address.Hex()); err != nil {
			return err
		}
		c.Reset(dataFacet)
		return nil
	}

	// For all other operations, use the standard lock/SDK pattern
	if !namesLock.CompareAndSwap(0, 1) {
		return nil
	}
	defer namesLock.Store(0)

	name.IsCustom = true

	cd := crud.CrudFromName(*name)
	opts := sdk.NamesOptions{
		Globals: sdk.Globals{
			Chain: "mainnet",
		},
	}

	if _, _, err := opts.ModifyName(op, cd); err != nil {
		msgs.EmitError("Crud", err)
		return err
	}

	// After successful SDK call, update the appropriate facet's store and sync
	switch dataFacet {
	case NamesAll:
		store := c.allFacet.GetStore()
		store.UpdateData(func(data []*Name) []*Name {
			return c.updateNameInData(data, name, op)
		})
		c.allFacet.SyncWithStore()
	case NamesCustom:
		store := c.customFacet.GetStore()
		store.UpdateData(func(data []*Name) []*Name {
			return c.updateNameInData(data, name, op)
		})
		c.customFacet.SyncWithStore()
	case NamesPrefund:
		store := c.prefundFacet.GetStore()
		store.UpdateData(func(data []*Name) []*Name {
			return c.updateNameInData(data, name, op)
		})
		c.prefundFacet.SyncWithStore()
	case NamesRegular:
		store := c.regularFacet.GetStore()
		store.UpdateData(func(data []*Name) []*Name {
			return c.updateNameInData(data, name, op)
		})
		c.regularFacet.SyncWithStore()
	case NamesBaddress:
		store := c.baddressFacet.GetStore()
		store.UpdateData(func(data []*Name) []*Name {
			return c.updateNameInData(data, name, op)
		})
		c.baddressFacet.SyncWithStore()
	}

	msgs.EmitStatus(fmt.Sprintf("completed %s operation for name: %s", op, name.Address))
	return nil
}

// updateNameInData handles the in-memory data update logic for all CRUD operations
func (c *NamesCollection) updateNameInData(data []*Name, name *Name, op crud.Operation) []*Name {
	switch op {
	case crud.Remove:
		result := make([]*Name, 0, len(data))
		for _, n := range data {
			if n.Address != name.Address {
				result = append(result, n)
			}
		}
		return result
	case crud.Create:
		for _, n := range data {
			if n.Address == name.Address {
				*n = *name
				return data
			}
		}
		return append(data, name)
	case crud.Update:
		for _, n := range data {
			if n.Address == name.Address {
				*n = *name
				break
			}
		}
		return data
	case crud.Delete:
		for _, n := range data {
			if n.Address == name.Address {
				n.Deleted = true
				break
			}
		}
		return data
	case crud.Undelete:
		for _, n := range data {
			if n.Address == name.Address {
				n.Deleted = false
				break
			}
		}
		return data
	default:
		return data
	}
}

// TODO: Consider adding batch operations for Names, similar to MonitorsCollection.Clean (e.g., batch delete).
