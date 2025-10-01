// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package abis

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// GetConfig returns the ViewConfig for the Abis view
func (c *AbisCollection) GetConfig() (*types.ViewConfig, error) {
	facets := map[string]types.FacetConfig{
		"downloaded": {
			Name:          "Downloaded",
			Store:         "abis",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getAbisFields(),
			Actions:       []string{"remove"},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"known": {
			Name:          "Known",
			Store:         "abis",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getAbisFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"functions": {
			Name:          "Functions",
			Store:         "functions",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getFunctionsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"events": {
			Name:          "Events",
			Store:         "functions",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getFunctionsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
	}

	cfg := &types.ViewConfig{
		ViewName:   "abis",
		Facets:     facets,
		FacetOrder: []string{"downloaded", "known", "functions", "events"},
		Actions: map[string]types.ActionConfig{
			"export": {Name: "export", Label: "Export", Icon: "Export"},
			"remove": {Name: "remove", Label: "Remove", Icon: "Remove"},
		},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getAbisFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Identity", Key: "address", Formatter: "address"},
		{Section: "Identity", Key: "name"},
		{Section: "Identity", Key: "path", NoTable: true, Formatter: "path"},
		{Section: "Statistics", Key: "nFunctions"},
		{Section: "Statistics", Key: "nEvents"},
		{Section: "Statistics", Key: "fileSize"},
		{Section: "Properties", Key: "isEmpty", NoTable: true},
		{Section: "Properties", Key: "isKnown", NoTable: true},
		{Section: "Properties", Key: "hasConstructor", NoTable: true},
		{Section: "Properties", Key: "hasFallback", NoTable: true},
		{Section: "Metadata", Key: "lastModDate", Formatter: "datetime"},
		{Section: "Metadata", Key: "functions", Formatter: "json", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getFunctionsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Overview", Key: "name"},
		{Section: "Overview", Key: "type", NoTable: true},
		{Section: "Overview", Key: "encoding"},
		{Section: "Overview", Key: "signature"},
		{Section: "Properties", Key: "stateMutability"},
		{Section: "Properties", Key: "constant", Formatter: "boolean"},
		{Section: "Properties", Key: "anonymous", Formatter: "boolean", NoTable: true},
		{Section: "Parameters", Key: "inputs", NoTable: true},
		{Section: "Parameters", Key: "outputs", NoTable: true},
		{Section: "Parameters", Key: "message", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
