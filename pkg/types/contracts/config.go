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
			ViewType:      "canvas",
			DividerBefore: false,
			Fields:        getContractsFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "facet",
		},
		"execute": {
			Name:          "Execute",
			Store:         "contracts",
			ViewType:      "canvas",
			DividerBefore: false,
			Fields:        getContractsFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "facet",
		},
		"events": {
			Name:          "Events",
			Store:         "logs",
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
		{Section: "Overview", Key: "address", Type: "address"},
		{Section: "Overview", Key: "name"},
		{Section: "Technical", Key: "abi"},
		{Section: "Status", Key: "lastUpdated", Type: "datetime"},
		{Section: "Status", Key: "date"},
		{Section: "Status", Key: "errorCount"},
		{Section: "Status", Key: "lastError"},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "number"},
		{Section: "Context", Key: "transactionIndex", Type: "number"},
		{Section: "Context", Key: "logIndex", Type: "number"},
		{Section: "Context", Key: "address", Type: "address"},
		{Section: "Context", Key: "timestamp", Type: "datetime", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Type: "hash"},
		{Section: "Details", Key: "topic1", Type: "hash"},
		{Section: "Details", Key: "topic2", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Type: "hash", NoTable: true},
		{Section: "Details", Key: "data", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
