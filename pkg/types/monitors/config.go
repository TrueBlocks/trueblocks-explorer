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
		{Key: "address", Formatter: "address", Section: "Monitor Overview", Sortable: true},
		{Key: "name", Section: "Monitor Overview", Sortable: true},
		{Key: "deleted", Formatter: "boolean", Section: "Monitor Overview", NoTable: true},
		{Key: "isStaged", Formatter: "boolean", Section: "Monitor Overview", NoTable: true},
		{Key: "nRecords", Formatter: "number", Section: "File Statistics", Sortable: true},
		{Key: "fileSize", Formatter: "fileSize", Section: "File Statistics", Sortable: true},
		{Key: "isEmpty", Formatter: "boolean", Section: "File Statistics", Sortable: true},
		{Key: "lastScanned", Formatter: "timestamp", Section: "Scanning Information", Sortable: true},
		{Key: "actions", Section: "", NoDetail: true, Sortable: false},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
