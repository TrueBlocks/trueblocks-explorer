// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package dresses

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

// GetConfig returns the ViewConfig for the Dresses view
func (c *DressesCollection) GetConfig() (*types.ViewConfig, error) {
	facets := c.buildStaticFacets()
	facetOrder := c.buildFacetOrder()

	cfg := &types.ViewConfig{
		ViewName:   "dresses",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions:    c.buildActions(),
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func (c *DressesCollection) buildStaticFacets() map[string]types.FacetConfig {
	return map[string]types.FacetConfig{
		"generator": {
			Name:          "Generator",
			Store:         "dalledress",
			ViewType:      "custom",
			DividerBefore: false,
			Fields:        getDalledressFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RowAction:     types.NewRowActionNavigation("dresses", "gallery", "address", "original"),
		},
		"series": {
			Name:          "Series",
			Store:         "series",
			ViewType:      "custom",
			DividerBefore: false,
			Fields:        getSeriesFields(),
			Actions:       []string{"update", "delete", "remove"},
			HeaderActions: []string{"create", "export"},
		},
		"databases": {
			Name:          "Databases",
			Store:         "databases",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getDatabasesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"events": {
			Name:          "Events",
			Store:         "logs",
			ViewType:      "table",
			DividerBefore: false,
			Fields:        getLogsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
		},
		"gallery": {
			Name:          "Gallery",
			Store:         "dalledress",
			ViewType:      "custom",
			DividerBefore: false,
			Fields:        getDalledressFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RowAction:     types.NewRowActionNavigation("dresses", "generator", "address", "original"),
		},
	}
}

func (c *DressesCollection) buildFacetOrder() []string {
	return []string{
		"generator",
		"series",
		"databases",
		"events",
		"gallery",
	}
}

func (c *DressesCollection) buildActions() map[string]types.ActionConfig {
	return map[string]types.ActionConfig{
		"create": {Name: "create", Label: "Create", Icon: "Create"},
		"delete": {Name: "delete", Label: "Delete", Icon: "Delete"},
		"export": {Name: "export", Label: "Export", Icon: "Export"},
		"remove": {Name: "remove", Label: "Remove", Icon: "Remove"},
		"update": {Name: "update", Label: "Update", Icon: "Update"},
	}
}

func getDalledressFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "original", Type: "address"},
		{Section: "General", Key: "fileName", Type: "path"},
		{Section: "General", Key: "seed"},
		{Section: "Prompts", Key: "prompt"},
		{Section: "Prompts", Key: "dataPrompt"},
		{Section: "Prompts", Key: "titlePrompt"},
		{Section: "Prompts", Key: "tersePrompt"},
		{Section: "Prompts", Key: "enhancedPrompt"},
		{Section: "Attributes", Key: "attributes", NoTable: true},
		{Section: "General", Key: "seedChunks", NoTable: true},
		{Section: "General", Key: "selectedTokens", NoTable: true},
		{Section: "General", Key: "selectedRecords", NoTable: true},
		{Section: "Image", Key: "imageUrl", NoTable: true},
		{Section: "Image", Key: "generatedPath", Type: "path"},
		{Section: "Image", Key: "annotatedPath", Type: "path"},
		{Section: "General", Key: "downloadMode"},
		{Section: "General", Key: "ipfsHash", Type: "ipfsHash"},
		{Section: "General", Key: "cacheHit", Type: "boolean"},
		{Section: "General", Key: "completed", Type: "boolean"},
		{Section: "General", Key: "series"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getDatabasesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "databaseName"},
		{Section: "General", Key: "count", Type: "value"},
		{Section: "General", Key: "sample"},
		{Section: "General", Key: "filtered"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Type: "blknum"},
		{Section: "Context", Key: "transactionIndex", Type: "txnum"},
		{Section: "Context", Key: "logIndex", Type: "lognum"},
		{Section: "Context", Key: "address", Type: "address"},
		{Section: "Context", Key: "timestamp", Type: "timestamp", NoTable: true},
		{Section: "Context", Key: "blockHash", Type: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Type: "hash"},
		{Section: "Details", Key: "topic1", Type: "hash"},
		{Section: "Details", Key: "topic2", Type: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Type: "hash", NoTable: true},
		{Section: "Details", Key: "data", Type: "bytes", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getSeriesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "suffix"},
		{Section: "General", Key: "last", Type: "value"},
		{Section: "General", Key: "deleted", Type: "boolean"},
		{Section: "General", Key: "modifiedAt"},
		{Section: "Content", Key: "adverbs", NoTable: true},
		{Section: "Content", Key: "adjectives", NoTable: true},
		{Section: "Content", Key: "nouns", NoTable: true},
		{Section: "Content", Key: "emotions", NoTable: true},
		{Section: "Style", Key: "artstyles", NoTable: true},
		{Section: "Style", Key: "colors", NoTable: true},
		{Section: "Style", Key: "viewpoints", NoTable: true},
		{Section: "Style", Key: "gazes", NoTable: true},
		{Section: "Style", Key: "backstyles", NoTable: true},
		{Section: "Style", Key: "compositions", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
