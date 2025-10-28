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
			ViewType:      "canvas",
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "facet",
		},
		"chifra": {
			Name:          "Chifra",
			Store:         "transaction",
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"etherscan": {
			Name:          "Etherscan",
			Store:         "transaction",
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"covalent": {
			Name:          "Covalent",
			Store:         "transaction",
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"alchemy": {
			Name:          "Alchemy",
			Store:         "transaction",
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
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Context", Key: "transactionIndex", Formatter: "number"},
		{Section: "Overview", Key: "hash", Formatter: "hash"},
		{Section: "Overview", Key: "from", Formatter: "address"},
		{Section: "Overview", Key: "to", Formatter: "address"},
		{Section: "Overview", Key: "value", Formatter: "wei"},
		{Section: "Gas", Key: "gasUsed"},
		{Section: "Overview", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "Overview", Key: "input", NoTable: true},
		{Section: "Overview", Key: "articulatedTx", NoTable: true},
		{Section: "Overview", Key: "isError", NoTable: true},
		{Section: "Overview", Key: "hasToken", NoTable: true},
		{Section: "Gas", Key: "gas", NoTable: true},
		{Section: "Gas", Key: "gasPrice", NoTable: true},
		{Section: "Gas", Key: "maxFeePerGas", NoTable: true},
		{Section: "Gas", Key: "maxPriorityFeePerGas", NoTable: true},
		{Section: "Context", Key: "blockHash", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "nonce", NoTable: true},
		{Section: "Details", Key: "type", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
