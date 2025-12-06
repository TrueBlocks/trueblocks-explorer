// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package names

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

// GetConfig returns the ViewConfig for the Names view
func (c *NamesCollection) GetConfig() (*types.ViewConfig, error) {
	facets := c.buildStaticFacets()
	facetOrder := c.buildFacetOrder()

	cfg := &types.ViewConfig{
		ViewName:   "names",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions:    c.buildActions(),
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func (c *NamesCollection) buildStaticFacets() map[string]types.FacetConfig {
	return map[string]types.FacetConfig{
		"all": {
			Name:          "All",
			Store:         "names",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{"autoname", "update"},
			HeaderActions: []string{"create", "export"},
		},
		"custom": {
			Name:          "Custom",
			Store:         "names",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{"autoname", "delete", "remove", "update"},
			HeaderActions: []string{"create", "export", "pin", "publish"},
		},
		"prefund": {
			Name:          "Prefund",
			Store:         "names",
			ViewType:      "table",
			DividerBefore: true,
			Fields:        getNamesFields(),
			Actions:       []string{"update"},
			HeaderActions: []string{"create", "export"},
		},
		"regular": {
			Name:          "Regular",
			Store:         "names",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{"autoname", "update"},
			HeaderActions: []string{"create", "export"},
		},
		"baddress": {
			Name:          "Baddress",
			Store:         "names",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{},
			HeaderActions: []string{"create", "export"},
		},
	}
}

func (c *NamesCollection) buildFacetOrder() []string {
	return []string{
		"all",
		"custom",
		"prefund",
		"regular",
		"baddress",
	}
}

func (c *NamesCollection) buildActions() map[string]types.ActionConfig {
	return map[string]types.ActionConfig{
		"autoname": {Name: "autoname", Label: "Autoname", Icon: "Autoname"},
		"create":   {Name: "create", Label: "Create", Icon: "Create"},
		"delete":   {Name: "delete", Label: "Delete", Icon: "Delete"},
		"export":   {Name: "export", Label: "Export", Icon: "Export"},
		"pin":      {Name: "pin", Label: "Pin", Icon: "Pin"},
		"publish":  {Name: "publish", Label: "Publish", Icon: "Publish"},
		"remove":   {Name: "remove", Label: "Remove", Icon: "Remove"},
		"undelete": {Name: "undelete", Label: "Undelete", Icon: "Undelete"},
		"update":   {Name: "update", Label: "Update", Icon: "Update"},
	}
}

func getNamesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Identity", Key: "address", Type: "address"},
		{Section: "Identity", Key: "addressName", Type: "string"},
		{Section: "Identity", Key: "name", Type: "string"},
		{Section: "Identity", Key: "symbol", Type: "string", NoTable: true},
		{Section: "Identity", Key: "decimals", Type: "uint64"},
		{Section: "Classification", Key: "source", Type: "string"},
		{Section: "Classification", Key: "tags", Type: "string"},
		{Section: "Classification", Key: "deleted", Type: "boolean", NoTable: true},
		{Section: "Properties", Key: "isContract", Type: "boolean", NoTable: true},
		{Section: "Properties", Key: "isCustom", Type: "boolean", NoTable: true},
		{Section: "Properties", Key: "isErc20", Type: "boolean", NoTable: true},
		{Section: "Properties", Key: "isErc721", Type: "boolean", NoTable: true},
		{Section: "Properties", Key: "isPrefund", Type: "boolean", NoTable: true},
		{Section: "Data", Key: "prefund", Type: "wei", NoTable: true},
		{Section: "Data", Key: "parts", Type: "string", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
