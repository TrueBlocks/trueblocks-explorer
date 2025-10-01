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
		{Section: "General", Key: "hash", Formatter: "hash"},
		{Section: "General", Key: "blockNumber", Formatter: "number"},
		{Section: "General", Key: "timestamp", Formatter: "timestamp"},
		{Section: "General", Key: "from", Formatter: "address"},
		{Section: "General", Key: "to", Formatter: "address"},
		{Section: "General", Key: "value", Formatter: "wei"},
		{Section: "General", Key: "gasUsed", Formatter: "wei"},
		{Section: "General", Key: "status"},
		{Section: "Presence", Key: "presentInChifra", Formatter: "boolean"},
		{Section: "Presence", Key: "presentInEtherscan", Formatter: "boolean"},
		{Section: "Presence", Key: "presentInCovalent", Formatter: "boolean"},
		{Section: "Presence", Key: "presentInAlchemy", Formatter: "boolean"},
		{Section: "Diffs", Key: "diffType"},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
