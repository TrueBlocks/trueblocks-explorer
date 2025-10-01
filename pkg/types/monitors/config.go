// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package monitors

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// GetConfig returns the ViewConfig for the Monitors view
func (c *MonitorsCollection) GetConfig() (*types.ViewConfig, error) {
	facets := map[string]types.FacetConfig{
		"monitors": {
			Name:          "Monitors",
			Store:         "monitors",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getMonitorsFields(),
			Actions:       []string{"delete", "remove"},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
	}

	cfg := &types.ViewConfig{
		ViewName:   "monitors",
		Facets:     facets,
		FacetOrder: []string{"monitors"},
		Actions: map[string]types.ActionConfig{
			"delete":   {Name: "delete", Label: "Delete", Icon: "Delete"},
			"export":   {Name: "export", Label: "Export", Icon: "Export"},
			"remove":   {Name: "remove", Label: "Remove", Icon: "Remove", Confirmation: true},
			"undelete": {Name: "undelete", Label: "Undelete", Icon: "Undelete"},
		},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getMonitorsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "address", Label: "Address", ColumnLabel: "Address", DetailLabel: "Address", Formatter: "address", Section: "Monitor Overview", Width: 340, Sortable: true, Filterable: true, Order: 1, DetailOrder: 2},
		{Key: "name", Label: "Name", ColumnLabel: "Name", DetailLabel: "Name", Section: "Monitor Overview", Width: 200, Sortable: true, Filterable: true, Order: 2, DetailOrder: 1},
		{Key: "deleted", Label: "Deleted", ColumnLabel: "Deleted", DetailLabel: "Deleted", Formatter: "boolean", Section: "Monitor Overview", NoTable: true, DetailOrder: 3},
		{Key: "isStaged", Label: "Staged", ColumnLabel: "Staged", DetailLabel: "Staged", Formatter: "boolean", Section: "Monitor Overview", NoTable: true, DetailOrder: 4},
		{Key: "nRecords", Label: "Records", ColumnLabel: "Records", DetailLabel: "Total Records", Formatter: "number", Section: "File Statistics", Width: 120, Sortable: true, Filterable: false, Order: 3, DetailOrder: 5},
		{Key: "fileSize", Label: "File Size", ColumnLabel: "File Size", DetailLabel: "File Size", Formatter: "fileSize", Section: "File Statistics", Width: 120, Sortable: true, Filterable: false, Order: 4, DetailOrder: 6},
		{Key: "isEmpty", Label: "Empty", ColumnLabel: "Empty", DetailLabel: "Is Empty", Formatter: "boolean", Section: "File Statistics", Width: 80, Sortable: true, Filterable: false, Order: 5, DetailOrder: 7},
		{Key: "lastScanned", Label: "Last Scanned", ColumnLabel: "Last Scanned", DetailLabel: "Last Scanned", Formatter: "timestamp", Section: "Scanning Information", Width: 120, Sortable: true, Filterable: false, Order: 6, DetailOrder: 8},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Sortable: false, Filterable: false, Order: 7},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
