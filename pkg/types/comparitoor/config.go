// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package comparitoor

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

// GetConfig returns the ViewConfig for the Comparitoor view
func (c *ComparitoorCollection) GetConfig() (*types.ViewConfig, error) {
	facets := c.buildStaticFacets()
	facetOrder := c.buildFacetOrder()

	cfg := &types.ViewConfig{
		ViewName:   "comparitoor",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions:    c.buildActions(),
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func (c *ComparitoorCollection) buildStaticFacets() map[string]types.FacetConfig {
	return map[string]types.FacetConfig{
		"comparitoor": {
			Name:          "Comparitoor",
			Store:         "transaction",
			ViewType:      "custom",
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"chifra": {
			Name:          "Chifra",
			Store:         "transaction",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"etherscan": {
			Name:          "Etherscan",
			Store:         "transaction",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"covalent": {
			Name:          "Covalent",
			Store:         "transaction",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"alchemy": {
			Name:          "Alchemy",
			Store:         "transaction",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getTransactionFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
	}
}

func (c *ComparitoorCollection) buildFacetOrder() []string {
	return []string{
		"comparitoor",
		"chifra",
		"etherscan",
		"covalent",
		"alchemy",
	}
}

func (c *ComparitoorCollection) buildActions() map[string]types.ActionConfig {
	return map[string]types.ActionConfig{
		"export": {Name: "export", Label: "Export", Icon: "Export"},
	}
}

func getTransactionFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "number"},
		{Section: "Context", Key: "transactionIndex", Type: "number"},
		{Section: "Overview", Key: "hash", Type: "hash"},
		{Section: "Overview", Key: "from", Type: "address"},
		{Section: "Overview", Key: "to", Type: "address"},
		{Section: "Overview", Key: "value", Type: "wei"},
		{Section: "Gas", Key: "gasUsed"},
		{Section: "Overview", Key: "timestamp", Type: "datetime", NoTable: true},
		{Section: "Overview", Key: "input", NoTable: true},
		{Section: "Overview", Key: "articulatedTx", NoTable: true},
		{Section: "Overview", Key: "isError", NoTable: true},
		{Section: "Overview", Key: "hasToken", NoTable: true},
		{Section: "Gas", Key: "gas", NoTable: true},
		{Section: "Gas", Key: "gasPrice", NoTable: true},
		{Section: "Gas", Key: "maxFeePerGas", NoTable: true},
		{Section: "Gas", Key: "maxPriorityFeePerGas", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "nonce", NoTable: true},
		{Section: "Details", Key: "type", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
