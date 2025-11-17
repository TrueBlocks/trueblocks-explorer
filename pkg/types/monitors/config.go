// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package monitors

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

// GetConfig returns the ViewConfig for the Monitors view
func (c *MonitorsCollection) GetConfig() (*types.ViewConfig, error) {
	facets := c.buildStaticFacets()
	facetOrder := c.buildFacetOrder()

	cfg := &types.ViewConfig{
		ViewName:   "monitors",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions:    c.buildActions(),
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func (c *MonitorsCollection) buildStaticFacets() map[string]types.FacetConfig {
	return map[string]types.FacetConfig{
		"monitors": {
			Name:          "Monitors",
			Store:         "monitors",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getMonitorsFields(),
			Actions:       []string{"autoname", "delete", "remove"},
			HeaderActions: []string{"export"},
			RowAction:     types.NewRowActionNavigation("exports", "<latest>", "address", "address"),
		},
	}
}

func (c *MonitorsCollection) buildFacetOrder() []string {
	return []string{
		"monitors",
	}
}

func (c *MonitorsCollection) buildActions() map[string]types.ActionConfig {
	return map[string]types.ActionConfig{
		"autoname": {Name: "autoname", Label: "Autoname", Icon: "Autoname"},
		"delete":   {Name: "delete", Label: "Delete", Icon: "Delete"},
		"export":   {Name: "export", Label: "Export", Icon: "Export"},
		"remove":   {Name: "remove", Label: "Remove", Icon: "Remove"},
		"undelete": {Name: "undelete", Label: "Undelete", Icon: "Undelete"},
	}
}

func getMonitorsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Overview", Key: "address", Type: "address"},
		{Section: "Overview", Key: "addressName", Type: "string"},
		{Section: "Overview", Key: "deleted", Type: "boolean", NoTable: true},
		{Section: "Overview", Key: "isStaged", Type: "boolean", NoTable: true},
		{Section: "Statistics", Key: "nRecords", Type: "uint64"},
		{Section: "Statistics", Key: "fileSize", Type: "fileSize"},
		{Section: "Statistics", Key: "isEmpty", Type: "boolean", NoTable: true},
		{Section: "Statistics", Key: "lastScanned", Type: "blknum"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
