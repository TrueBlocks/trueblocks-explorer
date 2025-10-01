// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package comparitoor

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// GetConfig returns the ViewConfig for the Comparitoor view
func (c *ComparitoorCollection) GetConfig() (*types.ViewConfig, error) {
	facets := map[string]types.FacetConfig{
		"comparitoor": {
			Name:          "Comparitoor",
			Store:         "transaction",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "facet",
		},
		"chifra": {
			Name:          "Chifra",
			Store:         "transaction",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"etherscan": {
			Name:          "Etherscan",
			Store:         "transaction",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"covalent": {
			Name:          "Covalent",
			Store:         "transaction",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"alchemy": {
			Name:          "Alchemy",
			Store:         "transaction",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
	}

	cfg := &types.ViewConfig{
		ViewName:   "comparitoor",
		Facets:     facets,
		FacetOrder: []string{"comparitoor", "chifra", "etherscan", "covalent", "alchemy"},
		Actions: map[string]types.ActionConfig{
			"export": {Name: "export", Label: "Export", Icon: "Export"},
		},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getTransactionFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "hash", Label: "Hash", Section: "General", Order: 1, DetailOrder: 1},
		{Key: "blockNumber", Label: "Block", Section: "General", Order: 2, DetailOrder: 2},
		{Key: "timestamp", Label: "Timestamp", Section: "General", Order: 3, DetailOrder: 3},
		{Key: "from", Label: "From", Section: "General", Order: 4, DetailOrder: 4},
		{Key: "to", Label: "To", Section: "General", Order: 5, DetailOrder: 5},
		{Key: "value", Label: "Value", Section: "General", Order: 6, DetailOrder: 6},
		{Key: "gasUsed", Label: "Gas Used", Section: "General", Order: 7, DetailOrder: 7},
		{Key: "status", Label: "Status", Section: "General", Order: 8, DetailOrder: 8},
		{Key: "presentInChifra", Label: "Chifra", Section: "Presence", Order: 9, DetailOrder: 9},
		{Key: "presentInEtherscan", Label: "Etherscan", Section: "Presence", Order: 10, DetailOrder: 10},
		{Key: "presentInCovalent", Label: "Covalent", Section: "Presence", Order: 11, DetailOrder: 11},
		{Key: "presentInAlchemy", Label: "Alchemy", Section: "Presence", Order: 12, DetailOrder: 12},
		{Key: "diffType", Label: "Diff Type", Section: "Diffs", Order: 13, DetailOrder: 13},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
