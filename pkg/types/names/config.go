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
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{"autoname", "update"},
			HeaderActions: []string{"create", "export"},
			RendererTypes: "",
		},
		"custom": {
			Name:          "Custom",
			Store:         "names",
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{"autoname", "delete", "remove", "update"},
			HeaderActions: []string{"create", "export", "pin", "publish"},
			RendererTypes: "",
		},
		"prefund": {
			Name:          "Prefund",
			Store:         "names",
			DividerBefore: true,
			Fields:        getNamesFields(),
			Actions:       []string{"update"},
			HeaderActions: []string{"create", "export"},
			RendererTypes: "",
		},
		"regular": {
			Name:          "Regular",
			Store:         "names",
			DividerBefore: false,
			Fields:        getNamesFields(),
			Actions:       []string{"autoname", "update"},
			HeaderActions: []string{"create", "export"},
			RendererTypes: "",
		},
		"baddress": {
			Name:          "Baddress",
			Store:         "names",
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
		{Section: "Identity", Key: "address", Formatter: "address"},
		{Section: "Identity", Key: "name"},
		{Section: "Identity", Key: "symbol"},
		{Section: "Identity", Key: "decimals", Formatter: "number"},
		{Section: "Classification", Key: "source"},
		{Section: "Classification", Key: "tags"},
		{Section: "Classification", Key: "deleted", Formatter: "boolean", NoTable: true},
		{Section: "Properties", Key: "isContract", NoTable: true},
		{Section: "Properties", Key: "isCustom", NoTable: true},
		{Section: "Properties", Key: "isErc20", NoTable: true},
		{Section: "Properties", Key: "isErc721", NoTable: true},
		{Section: "Properties", Key: "isPrefund", NoTable: true},
		{Section: "Data", Key: "prefund", Formatter: "wei", NoTable: true},
		{Section: "Data", Key: "parts", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
