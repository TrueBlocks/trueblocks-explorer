// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package names

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// GetConfig returns the ViewConfig for the Names view
func (c *NamesCollection) GetConfig() (*types.ViewConfig, error) {
	facets := map[string]types.FacetConfig{
		"all": {
			Name:          "All",
			Store:         "names",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{"autoname", "update"},
			HeaderActions: []string{"create", "export"},
			RendererTypes: "",
		},
		"custom": {
			Name:          "Custom",
			Store:         "names",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{"autoname", "delete", "remove", "update"},
			HeaderActions: []string{"create", "export", "pin", "publish"},
			RendererTypes: "",
		},
		"prefund": {
			Name:          "Prefund",
			Store:         "names",
			IsForm:        false,
			DividerBefore: true,
			Fields:        getNamesFields(),
			Actions:       []string{"update"},
			HeaderActions: []string{"create", "export"},
			RendererTypes: "",
		},
		"regular": {
			Name:          "Regular",
			Store:         "names",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{"autoname", "update"},
			HeaderActions: []string{"create", "export"},
			RendererTypes: "",
		},
		"baddress": {
			Name:          "Baddress",
			Store:         "names",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{},
			HeaderActions: []string{"create", "export"},
			RendererTypes: "",
		},
	}

	cfg := &types.ViewConfig{
		ViewName:   "names",
		Facets:     facets,
		FacetOrder: []string{"all", "custom", "prefund", "regular", "baddress"},
		Actions: map[string]types.ActionConfig{
			"autoname": {Name: "autoname", Label: "Autoname", Icon: "Autoname"},
			"create":   {Name: "create", Label: "Create", Icon: "Create"},
			"delete":   {Name: "delete", Label: "Delete", Icon: "Delete"},
			"export":   {Name: "export", Label: "Export", Icon: "Export"},
			"pin":      {Name: "pin", Label: "Pin", Icon: "Pin"},
			"publish":  {Name: "publish", Label: "Publish", Icon: "Publish"},
			"remove":   {Name: "remove", Label: "Remove", Icon: "Remove"},
			"undelete": {Name: "undelete", Label: "Undelete", Icon: "Undelete"},
			"update":   {Name: "update", Label: "Update", Icon: "Update"},
		},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getNamesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "address", Label: "Address", Section: "Name Identity", Width: 340, Formatter: "address", Order: 1, DetailOrder: 1},
		{Key: "name", Label: "Name", Section: "Name Identity", Width: 200, Order: 2, DetailOrder: 2},
		{Key: "symbol", Label: "Symbol", Section: "Name Identity", Width: 100, Order: 5, DetailOrder: 3},
		{Key: "decimals", Label: "Decimals", Section: "Name Identity", Width: 100, Order: 6, DetailOrder: 4},
		{Key: "source", Label: "Source", Section: "Classification", Width: 120, Order: 4, DetailOrder: 5},
		{Key: "tags", Label: "Tags", Section: "Classification", Width: 150, Order: 3, DetailOrder: 6},
		{Key: "deleted", Label: "Deleted", Section: "Classification", NoTable: true, Formatter: "boolean", DetailOrder: 7},
		{Key: "isContract", Label: "Is Contract", Section: "Contract Properties", NoTable: true, Formatter: "boolean", DetailOrder: 8},
		{Key: "isCustom", Label: "Is Custom", Section: "Contract Properties", NoTable: true, Formatter: "boolean", DetailOrder: 9},
		{Key: "isErc20", Label: "Is ERC20", Section: "Contract Properties", NoTable: true, Formatter: "boolean", DetailOrder: 10},
		{Key: "isErc721", Label: "Is ERC721", Section: "Contract Properties", NoTable: true, Formatter: "boolean", DetailOrder: 11},
		{Key: "isPrefund", Label: "Is Prefund", Section: "Contract Properties", NoTable: true, Formatter: "boolean", DetailOrder: 12},
		{Key: "prefund", Label: "Prefund Amount", Section: "Prefund Information", NoTable: true, Formatter: "wei", DetailOrder: 13},
		{Key: "parts", Label: "Parts", Section: "Prefund Information", NoTable: true, DetailOrder: 14},
		{Key: "actions", Label: "Actions", Section: "Name Identity", NoDetail: true, Width: 80, Order: 7},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
