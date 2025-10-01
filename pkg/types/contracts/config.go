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
		{Key: "address", Label: "Address", ColumnLabel: "Address", DetailLabel: "Address", Section: "General", Width: 240, Order: 1, DetailOrder: 1},
		{Key: "name", Label: "Name", ColumnLabel: "Name", DetailLabel: "Name", Section: "General", Width: 200, Order: 2, DetailOrder: 2},
		{Key: "symbol", Label: "Symbol", ColumnLabel: "Symbol", DetailLabel: "Symbol", Section: "General", Width: 100, Order: 3, DetailOrder: 3},
		{Key: "decimals", Label: "Decimals", ColumnLabel: "Decimals", DetailLabel: "Decimals", Section: "General", Width: 100, Order: 4, DetailOrder: 4},
		{Key: "source", Label: "Source", ColumnLabel: "Source", DetailLabel: "Source", Section: "Source", Width: 150, Order: 5, DetailOrder: 5},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "date", Label: "Date", ColumnLabel: "Date", DetailLabel: "Date", Section: "Block/Tx", Width: 120, Order: 1, DetailOrder: 1},
		{Key: "address", Label: "Address", ColumnLabel: "Address", DetailLabel: "Address", Section: "Event", Width: 340, Order: 2, DetailOrder: 5},
		{Key: "name", Label: "Event Name", ColumnLabel: "Name", DetailLabel: "Event Name", Section: "Event", Width: 200, Order: 3, DetailOrder: 6},
		{Key: "articulatedLog", Label: "Articulated Log", ColumnLabel: "Log Details", DetailLabel: "Articulated Log", Section: "Event", Width: 120, Order: 4, DetailOrder: 8},
		{Key: "blockNumber", Label: "Block Number", ColumnLabel: "", DetailLabel: "Block Number", Section: "Block/Tx", NoTable: true, DetailOrder: 2},
		{Key: "transactionIndex", Label: "Transaction Index", ColumnLabel: "", DetailLabel: "Transaction Index", Section: "Block/Tx", NoTable: true, DetailOrder: 3},
		{Key: "transactionHash", Label: "Transaction Hash", ColumnLabel: "", DetailLabel: "Transaction Hash", Section: "Block/Tx", NoTable: true, DetailOrder: 4},
		{Key: "signature", Label: "Signature", ColumnLabel: "", DetailLabel: "Signature", Section: "Event", NoTable: true, DetailOrder: 7},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
