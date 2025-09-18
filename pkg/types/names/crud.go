package names

import (
	"fmt"
	"sync/atomic"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/crud"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

var namesLock atomic.Int32

func (c *NamesCollection) Crud(
	payload *types.Payload,
	op crud.Operation,
	item interface{},
) error {
	dataFacet := payload.DataFacet

	var name = &Name{Address: base.HexToAddress(payload.Address)}
	if item != nil {
		if n, ok := item.(*Name); ok {
			name = n
		} else {
			return fmt.Errorf("item is not of type *Name")
		}
	}

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

	// Special handling for Autoname - it can modify many names unpredictably, so we need to reload
	if op == crud.Autoname {
		c.Reset(dataFacet)
		msgs.EmitStatus(fmt.Sprintf("completed %s operation for name: %s", op, name.Address))
		return nil
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
