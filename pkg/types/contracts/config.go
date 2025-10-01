// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package contracts

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// GetConfig returns the ViewConfig for the Contracts view
func (c *ContractsCollection) GetConfig() (*types.ViewConfig, error) {
	facets := map[string]types.FacetConfig{
		"dashboard": {
			Name:          "Dashboard",
			Store:         "contracts",
			IsForm:        true,
			DividerBefore: false,
			Fields:        getContractsFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "facet",
		},
		"execute": {
			Name:          "Execute",
			Store:         "contracts",
			IsForm:        true,
			DividerBefore: false,
			Fields:        getContractsFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "facet",
		},
		"events": {
			Name:          "Events",
			Store:         "logs",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getLogsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
	}

	cfg := &types.ViewConfig{
		ViewName:   "contracts",
		Facets:     facets,
		FacetOrder: []string{"dashboard", "execute", "events"},
		Actions: map[string]types.ActionConfig{
			"export": {Name: "export", Label: "Export", Icon: "Export"},
		},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getContractsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "General", Key: "address"},
		{Section: "General", Key: "name"},
		{Section: "General", Key: "symbol"},
		{Section: "General", Key: "decimals"},
		{Section: "Source", Key: "source"},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Block/Tx", Key: "date"},
		{Section: "Event", Key: "address"},
		{Section: "Event", Key: "name"},
		{Section: "Event", Key: "articulatedLog"},
		{Section: "Block/Tx", Key: "blockNumber", NoTable: true},
		{Section: "Block/Tx", Key: "transactionIndex", NoTable: true},
		{Section: "Block/Tx", Key: "transactionHash", NoTable: true},
		{Section: "Event", Key: "signature", NoTable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
