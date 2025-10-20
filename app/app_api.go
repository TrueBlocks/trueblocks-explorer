// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package app

// EXISTING_CODE
import (
	"fmt"
	"strconv"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/abis"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/chunks"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/comparitoor"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/contracts"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/dresses"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/exports"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/monitors"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/status"
)

// EXISTING_CODE

// Reload dispatches reload requests to the appropriate view-specific reload function
func (a *App) Reload(payload *types.Payload) (err error) {
	defer func() {
		if err == nil {
			msgs.EmitReloaded(*payload)
		}
	}()

	switch a.GetLastView() {
	case "exports":
		err = a.ReloadExports(payload)
	case "monitors":
		err = a.ReloadMonitors(payload)
	case "abis":
		err = a.ReloadAbis(payload)
	case "names":
		err = a.ReloadNames(payload)
	case "chunks":
		err = a.ReloadChunks(payload)
	case "contracts":
		err = a.ReloadContracts(payload)
	case "status":
		err = a.ReloadStatus(payload)
	case "dresses":
		err = a.ReloadDresses(payload)
	case "comparitoor":
		err = a.ReloadComparitoor(payload)
	default:
		panic("unknown view in Reload" + a.GetLastView())
	}

	return err
}

// GetRegisteredViews returns all registered view names
func (a *App) GetRegisteredViews() []string {
	return []string{
		"exports",
		"monitors",
		"abis",
		"names",
		"chunks",
		"contracts",
		"status",
		"dresses",
		"comparitoor",
	}
}

func getCollection(payload *types.Payload, missingOk bool) types.Collection {
	switch payload.Collection {
	case "exports":
		return exports.GetExportsCollection(payload)
	case "monitors":
		return monitors.GetMonitorsCollection(payload)
	case "abis":
		return abis.GetAbisCollection(payload)
	case "names":
		return names.GetNamesCollection(payload)
	case "chunks":
		return chunks.GetChunksCollection(payload)
	case "contracts":
		return contracts.GetContractsCollection(payload)
	case "status":
		return status.GetStatusCollection(payload)
	case "dresses":
		return dresses.GetDressesCollection(payload)
	case "comparitoor":
		return comparitoor.GetComparitoorCollection(payload)
	default:
		if !missingOk {
			logging.LogBEWarning(fmt.Sprintf("Unknown collection type: %s", payload.Collection))
		}
		return nil
	}
}

// IsDisabled returns true if the collection is disable or if all of its facets are disabled
func (a *App) IsDisabled(viewName string) bool {
	payload := &types.Payload{
		Collection: viewName,
	}
	collection := getCollection(payload, true)
	if collection == nil {
		return false // not disabled if not found
	}
	if cfg, err := collection.GetConfig(); err == nil {
		return cfg.IsDisabled()
	} else {
		return false // not disabled if not found
	}
}

// EXISTING_CODE
// NavigateToRow triggers navigation to a specific row in a facet by record ID
func (a *App) NavigateToRow(payload *types.NavigationPayload) {
	// For now, convert recordId directly to rowIndex (will be replaced with database search later)
	payload.RowIndex, _ = strconv.Atoi(payload.RecordId)
	msgs.EmitNavigateToRow(payload)
}

// EXISTING_CODE
