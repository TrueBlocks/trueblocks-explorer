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
	types.NormalizeOrders(cfg)
	types.SetDisablements(cfg)
	return cfg, nil
}

func getAbisFields() []types.FieldConfig {
	return []types.FieldConfig{
		// EXISTING_CODE
		{Key: "address", Label: "Address", ColumnLabel: "Address", DetailLabel: "Address", Formatter: "address", Section: "ABI Identity", Width: 340, Order: 1, DetailOrder: 1},
		{Key: "name", Label: "Name", ColumnLabel: "Name", DetailLabel: "Name", Section: "ABI Identity", Width: 200, Order: 2, DetailOrder: 2},
		{Key: "path", Label: "File Path", Section: "ABI Identity", NoTable: true, DetailOrder: 3},
		{Key: "nFunctions", Label: "Functions", ColumnLabel: "Functions", DetailLabel: "Number of Functions", Formatter: "number", Section: "Content Statistics", Width: 100, Order: 3, DetailOrder: 4},
		{Key: "nEvents", Label: "Events", ColumnLabel: "Events", DetailLabel: "Number of Events", Formatter: "number", Section: "Content Statistics", Width: 100, Order: 4, DetailOrder: 5},
		{Key: "fileSize", Label: "File Size", ColumnLabel: "File Size", DetailLabel: "File Size", Formatter: "fileSize", Section: "Content Statistics", Width: 120, Order: 5, DetailOrder: 6},
		{Key: "isEmpty", Label: "Empty", ColumnLabel: "Empty", DetailLabel: "Is Empty", Formatter: "boolean", Section: "ABI Properties", Width: 80, Order: 6, DetailOrder: 7},
		{Key: "isKnown", Label: "Known", ColumnLabel: "Known", DetailLabel: "Is Known", Formatter: "boolean", Section: "ABI Properties", Width: 80, Order: 7, DetailOrder: 8},
		{Key: "hasConstructor", Label: "Has Constructor", ColumnLabel: "Has Constructor", DetailLabel: "Has Constructor", Formatter: "boolean", Section: "ABI Properties", NoTable: true, DetailOrder: 9},
		{Key: "hasFallback", Label: "Has Fallback Function", ColumnLabel: "Has Fallback Function", DetailLabel: "Has Fallback Function", Formatter: "boolean", Section: "ABI Properties", NoTable: true, DetailOrder: 10},
		{Key: "lastModDate", Label: "Last Modified", ColumnLabel: "Last Modified", DetailLabel: "Last Modified", Formatter: "timestamp", Section: "File Metadata", Width: 150, Order: 8, DetailOrder: 11},
		{Key: "functions", Label: "Available Functions", ColumnLabel: "Available Functions", DetailLabel: "Available Functions", Formatter: "json", Section: "Functions List", NoTable: true, DetailOrder: 12},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Order: 9},
		// EXISTING_CODE
	}
}

func getFunctionsFields() []types.FieldConfig {
	return []types.FieldConfig{
		// EXISTING_CODE
		{Key: "name", Label: "Name", ColumnLabel: "Name", DetailLabel: "Function Name", Section: "Function Overview", Width: 200, Order: 1, DetailOrder: 1},
		{Key: "type", Label: "Type", ColumnLabel: "Type", DetailLabel: "Function Type", Section: "Function Overview", Width: 100, Order: 2, DetailOrder: 2},
		{Key: "encoding", Label: "Encoding", ColumnLabel: "Encoding", DetailLabel: "Encoding Hash", Section: "Function Overview", Width: 250, Order: 3, DetailOrder: 3},
		{Key: "signature", Label: "Signature", ColumnLabel: "Signature", DetailLabel: "Function Signature", Section: "Function Overview", Width: 300, Order: 4, DetailOrder: 4},
		{Key: "stateMutability", Label: "State Mutability", ColumnLabel: "State Mutability", DetailLabel: "State Mutability", Section: "Function Properties", Width: 150, Order: 5, DetailOrder: 5},
		{Key: "constant", Label: "Constant", ColumnLabel: "Constant", DetailLabel: "Constant", Formatter: "boolean", Section: "Function Properties", Width: 100, Order: 6, DetailOrder: 6},
		{Key: "anonymous", Label: "Anonymous", ColumnLabel: "Anonymous", DetailLabel: "Anonymous", Formatter: "boolean", Section: "Function Properties", Width: 100, Order: 7, DetailOrder: 7},
		{Key: "inputs", Label: "Input Parameters", ColumnLabel: "Input Parameters", DetailLabel: "Input Parameters", Formatter: "json", Section: "Input Parameters", NoTable: true, DetailOrder: 8},
		{Key: "outputs", Label: "Output Parameters", ColumnLabel: "Output Parameters", DetailLabel: "Output Parameters", Formatter: "json", Section: "Output Parameters", NoTable: true, DetailOrder: 9},
		{Key: "message", Label: "Error Message", ColumnLabel: "Error Message", DetailLabel: "Error Message", Section: "Additional Information", NoTable: true, DetailOrder: 10},
		// EXISTING_CODE
	}
}

// EXISTING_CODE
// EXISTING_CODE
