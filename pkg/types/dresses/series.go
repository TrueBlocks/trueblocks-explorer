package dresses

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/crud"
	dalle "github.com/TrueBlocks/trueblocks-dalle/v6"
	"github.com/TrueBlocks/trueblocks-dalle/v6/pkg/storage"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// seriesCrud handles create, update, remove for series facet
func (c *DressesCollection) seriesCrud(
	payload *types.Payload,
	op crud.Operation,
	item *Series,
) error {
	if payload.DataFacet != DressesSeries {
		return fmt.Errorf("seriesCrud invalid facet: %s", payload.DataFacet)
	}
	if item == nil {
		return fmt.Errorf("seriesCrud missing item")
	}
	seriesDir := filepath.Join(storage.DataDir(), "series")
	// Support a pseudo duplicate operation encoded by passing an item whose Suffix ends with "-copy" pattern AND op == crud.Create with a source indicated in item.Last (temporary convention) is overkill.
	// Instead, frontend will call Create with full cloned object; so duplicate maps to plain Create here.
	switch op {
	case crud.Create, crud.Update:
		if op == crud.Create {
			// uniqueness check
			for _, existing := range c.seriesFacet.GetStore().GetItems(false) {
				if existing != nil && existing.Suffix == item.Suffix {
					return fmt.Errorf("series suffix already exists: %s", item.Suffix)
				}
			}
		}
		item.SaveSeries(item.Suffix, item.Last)
		// update ModifiedAt from file system
		if fi, err := os.Stat(seriesDir + "/" + item.Suffix + ".json"); err == nil {
			item.ModifiedAt = fi.ModTime().UTC().Format(time.RFC3339)
		}
	case crud.Remove:
		err := dalle.RemoveSeries(seriesDir, item.Suffix)
		if err != nil {
			return err
		}
	case crud.Delete:
		err := dalle.DeleteSeries(seriesDir, item.Suffix)
		if err != nil {
			return err
		}
		if data, err := os.ReadFile(filepath.Join(seriesDir, item.Suffix+".json")); err == nil {
			var updatedSeries dalle.Series
			if err := json.Unmarshal(data, &updatedSeries); err == nil {
				item.Deleted = updatedSeries.Deleted
			}
		}
	case crud.Undelete:
		_ = dalle.UndeleteSeries(seriesDir, item.Suffix)
		if data, err := os.ReadFile(filepath.Join(seriesDir, item.Suffix+".json")); err == nil {
			var updatedSeries dalle.Series
			if err := json.Unmarshal(data, &updatedSeries); err == nil {
				item.Deleted = updatedSeries.Deleted
			}
		}
	case crud.Autoname:
		// not applicable
	default:
		return fmt.Errorf("unsupported op %v", op)
	}
	store := c.seriesFacet.GetStore()
	store.UpdateData(func(data []*Series) []*Series {
		switch op {
		case crud.Remove:
			out := make([]*Series, 0, len(data))
			for _, s := range data {
				if s.Suffix != item.Suffix {
					out = append(out, s)
				}
			}
			return out
		case crud.Create:
			for _, s := range data {
				if s.Suffix == item.Suffix {
					*s = *item
					return data
				}
			}
			return append(data, item)
		case crud.Update, crud.Delete, crud.Undelete:
			for _, s := range data {
				if s.Suffix == item.Suffix {
					*s = *item
					break
				}
			}
			return data
		}
		return data
	})
	c.seriesFacet.SyncWithStore()
	// emit enriched event so frontend refreshes with context
	currentItems := c.seriesFacet.GetStore().GetItems(false)
	currentCount := len(currentItems)
	payloadSummary := types.Summary{TotalCount: currentCount, FacetCounts: map[types.DataFacet]int{DressesSeries: currentCount}, LastUpdated: time.Now().Unix()}
	operation := "update"
	switch op {
	case crud.Create:
		operation = "create"
	case crud.Update:
		operation = "update"
	case crud.Delete:
		operation = "delete"
	case crud.Undelete:
		operation = "undelete"
	case crud.Remove:
		operation = "remove"
	}
	msgs.EmitLoaded(types.DataLoadedPayload{
		Payload:       types.Payload{Collection: "dresses", DataFacet: DressesSeries},
		CurrentCount:  currentCount,
		ExpectedTotal: currentCount,
		State:         types.StateLoaded,
		Summary:       payloadSummary,
		Timestamp:     time.Now().Unix(),
		EventPhase:    "complete",
		Operation:     operation,
	})
	return nil
}
