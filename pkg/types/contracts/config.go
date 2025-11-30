// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package contracts

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

// GetConfig returns the ViewConfig for the Contracts view
func (c *ContractsCollection) GetConfig() (*types.ViewConfig, error) {
	facets := c.buildStaticFacets()
	facetOrder := c.buildFacetOrder()

	cfg := &types.ViewConfig{
		ViewName:   "contracts",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions:    c.buildActions(),
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func (c *ContractsCollection) buildStaticFacets() map[string]types.FacetConfig {
	return map[string]types.FacetConfig{
		"dashboard": {
			Name:          "Dashboard",
			Store:         "contracts",
			ViewType:      "custom",
			DividerBefore: false,
			Fields:        getContractsFields(),
			Actions:       []string{},
			HeaderActions: []string{},
		},
		"execute": {
			Name:          "Execute",
			Store:         "contracts",
			ViewType:      "custom",
			DividerBefore: false,
			Fields:        getContractsFields(),
			Actions:       []string{},
			HeaderActions: []string{},
		},
		"events": {
			Name:          "Events",
			Store:         "logs",
			ViewType:      "table",
			Panel:         "custom",
			DividerBefore: false,
			Fields:        getLogsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
	}
}

func (c *ContractsCollection) buildFacetOrder() []string {
	return []string{
		"dashboard",
		"execute",
		"events",
	}
}

func (c *ContractsCollection) buildActions() map[string]types.ActionConfig {
	return map[string]types.ActionConfig{
		"export": {Name: "export", Label: "Export", Icon: "Export"},
	}
}

func getContractsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Overview", Key: "address", Type: "address"},
		{Section: "Overview", Key: "addressName", Type: "string"},
		{Section: "Technical", Key: "abi"},
		{Section: "Status", Key: "lastUpdated", Type: "datetime"},
		{Section: "Status", Key: "date", Type: "datetime"},
		{Section: "Status", Key: "errorCount", Type: "int64"},
		{Section: "Status", Key: "lastError", Type: "string"},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "blknum"},
		{Section: "Context", Key: "transactionIndex", Type: "txnum"},
		{Section: "Context", Key: "logIndex", Type: "lognum"},
		{Section: "Context", Key: "address", Type: "address", Label: "Emitter"},
		{Section: "Context", Key: "addressName", Type: "string"},
		{Section: "Context", Key: "timestamp", Type: "timestamp", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Type: "hash"},
		{Section: "Details", Key: "topic1", Type: "hash"},
		{Section: "Details", Key: "topic2", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Type: "hash", NoTable: true},
		{Section: "Details", Key: "data", Type: "bytes", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", Type: "string", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
