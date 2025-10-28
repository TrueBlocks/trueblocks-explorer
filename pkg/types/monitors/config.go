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
			DividerBefore: false,
			Fields:        getMonitorsFields(),
			Actions:       []string{"autoname", "delete", "remove"},
			HeaderActions: []string{"export"},
			RendererTypes: "",
			RowAction:     types.NewRowActionNavigation("exports", "<latest>", "address", "address"),
		},
	}

	cfg := &types.ViewConfig{
		ViewName:   "monitors",
		Facets:     facets,
		FacetOrder: []string{"monitors"},
		Actions: map[string]types.ActionConfig{
			"autoname": {Name: "autoname", Label: "Autoname", Icon: "Autoname"},
			"delete":   {Name: "delete", Label: "Delete", Icon: "Delete"},
			"export":   {Name: "export", Label: "Export", Icon: "Export"},
			"remove":   {Name: "remove", Label: "Remove", Icon: "Remove"},
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
		{Section: "Overview", Key: "address", Formatter: "address"},
		{Section: "Overview", Key: "name"},
		{Section: "Overview", Key: "deleted", Formatter: "boolean", NoTable: true},
		{Section: "Overview", Key: "isStaged", NoTable: true},
		{Section: "Statistics", Key: "nRecords"},
		{Section: "Statistics", Key: "fileSize"},
		{Section: "Statistics", Key: "isEmpty", NoTable: true},
		{Section: "Statistics", Key: "lastScanned", Formatter: "number"},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
