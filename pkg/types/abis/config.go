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
		{Key: "address", Section: "ABI Identity", Formatter: "address"},
		{Key: "name", Section: "ABI Identity"},
		{Key: "path", Section: "ABI Identity", NoTable: true, Formatter: "path"},
		{Key: "nFunctions", Section: "Content Statistics"},
		{Key: "nEvents", Section: "Content Statistics"},
		{Key: "fileSize", Section: "Content Statistics", Formatter: "fileSize"},
		{Key: "isEmpty", Section: "ABI Properties", NoTable: true},
		{Key: "isKnown", Section: "ABI Properties", NoTable: true},
		{Key: "hasConstructor", Section: "ABI Properties", NoTable: true},
		{Key: "hasFallback", Section: "ABI Properties", NoTable: true},
		{Key: "lastModDate", Section: "File Metadata", Formatter: "datetime"},
		{Key: "functions", Section: "Functions List", Formatter: "json", NoTable: true},
		{Key: "actions", Section: "", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getFunctionsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "name", Section: "Function Overview"},
		{Key: "type", Section: "Function Overview", NoTable: true},
		{Key: "encoding", Section: "Function Overview"},
		{Key: "signature", Section: "Function Overview"},
		{Key: "stateMutability", Section: "Function Properties"},
		{Key: "constant", Section: "Function Properties", Formatter: "boolean"},
		{Key: "anonymous", Section: "Function Properties", Formatter: "boolean", NoTable: true},
		{Key: "inputs", Section: "Parameters", NoTable: true},
		{Key: "outputs", Section: "Parameters", NoTable: true},
		{Key: "message", Section: "Parameters", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
