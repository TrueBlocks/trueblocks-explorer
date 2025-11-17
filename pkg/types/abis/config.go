// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package abis

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

// GetConfig returns the ViewConfig for the Abis view
func (c *AbisCollection) GetConfig() (*types.ViewConfig, error) {
	facets := c.buildStaticFacets()
	facetOrder := c.buildFacetOrder()

	cfg := &types.ViewConfig{
		ViewName:   "abis",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions:    c.buildActions(),
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func (c *AbisCollection) buildStaticFacets() map[string]types.FacetConfig {
	return map[string]types.FacetConfig{
		"downloaded": {
			Name:          "Downloaded",
			Store:         "abis",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getAbisFields(),
			Actions:       []string{"autoname", "remove"},
			HeaderActions: []string{"export"},
		},
		"known": {
			Name:          "Known",
			Store:         "abis",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getAbisFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"functions": {
			Name:          "Functions",
			Store:         "functions",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getFunctionsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"events": {
			Name:          "Events",
			Store:         "functions",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getFunctionsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
	}
}

func (c *AbisCollection) buildFacetOrder() []string {
	return []string{
		"downloaded",
		"known",
		"functions",
		"events",
	}
}

func (c *AbisCollection) buildActions() map[string]types.ActionConfig {
	return map[string]types.ActionConfig{
		"autoname": {Name: "autoname", Label: "Autoname", Icon: "Autoname"},
		"export":   {Name: "export", Label: "Export", Icon: "Export"},
		"remove":   {Name: "remove", Label: "Remove", Icon: "Remove"},
	}
}

func getAbisFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Identity", Key: "address", Type: "address"},
		{Section: "Identity", Key: "addressName", Type: "string"},
		{Section: "Identity", Key: "path", Type: "path", NoTable: true},
		{Section: "Statistics", Key: "nFunctions", Type: "uint64"},
		{Section: "Statistics", Key: "nEvents", Type: "uint64"},
		{Section: "Statistics", Key: "fileSize", Type: "fileSize"},
		{Section: "Properties", Key: "isEmpty", Type: "boolean", NoTable: true},
		{Section: "Properties", Key: "isKnown", Type: "boolean", NoTable: true},
		{Section: "Properties", Key: "hasConstructor", Type: "boolean", NoTable: true},
		{Section: "Properties", Key: "hasFallback", Type: "boolean", NoTable: true},
		{Section: "Metadata", Key: "lastModDate", Type: "datetime"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getFunctionsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Overview", Key: "name", Type: "string"},
		{Section: "Overview", Key: "type", Type: "string", NoTable: true},
		{Section: "Overview", Key: "encoding", Type: "string"},
		{Section: "Overview", Key: "signature", Type: "string"},
		{Section: "Properties", Key: "stateMutability", Type: "string"},
		{Section: "Properties", Key: "constant", Type: "boolean"},
		{Section: "Properties", Key: "anonymous", Type: "boolean", NoTable: true},
		{Section: "Parameters", Key: "inputs", NoTable: true},
		{Section: "Parameters", Key: "outputs", NoTable: true},
		{Section: "Parameters", Key: "message", Type: "string", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
