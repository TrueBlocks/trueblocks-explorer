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
			ViewType:      "custom",
			DividerBefore: false,
			Fields:        getDatabasesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RowAction:     types.NewRowActionNavigation("dresses", "items", "databaseName", "databaseName"),
		},
		"items": {
			Name:          "Items",
			Store:         "items",
			ViewType:      "custom",
			DividerBefore: false,
			Fields:        getItemsFields(),
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
		"items",
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
		{Section: "General", Key: "originalName", Type: "string"},
		{Section: "General", Key: "fileName", Type: "path"},
		{Section: "General", Key: "seed", Type: "string"},
		{Section: "Prompts", Key: "prompt", Type: "string"},
		{Section: "Prompts", Key: "dataPrompt", Type: "string"},
		{Section: "Prompts", Key: "titlePrompt", Type: "string"},
		{Section: "Prompts", Key: "tersePrompt", Type: "string"},
		{Section: "Prompts", Key: "enhancedPrompt", Type: "string"},
		{Section: "Attributes", Key: "attributes", NoTable: true},
		{Section: "General", Key: "seedChunks", Type: "string", NoTable: true},
		{Section: "General", Key: "selectedTokens", Type: "string", NoTable: true},
		{Section: "General", Key: "selectedRecords", Type: "string", NoTable: true},
		{Section: "Image", Key: "imageUrl", Type: "url", NoTable: true},
		{Section: "Image", Key: "generatedPath", Type: "path"},
		{Section: "Image", Key: "annotatedPath", Type: "path"},
		{Section: "General", Key: "downloadMode", Type: "string"},
		{Section: "General", Key: "ipfsHash", Type: "ipfsHash"},
		{Section: "General", Key: "cacheHit", Type: "boolean"},
		{Section: "General", Key: "completed", Type: "boolean"},
		{Section: "General", Key: "series", Type: "string"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getDatabasesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "databaseName", Type: "string", Label: "Database"},
		{Section: "General", Key: "count", Type: "uint64"},
		{Section: "General", Key: "sample", Type: "string"},
		{Section: "General", Key: "filtered", Type: "string"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getItemsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "index", Type: "uint64", NoTable: true},
		{Section: "General", Key: "databaseName", Type: "string", Label: "Database"},
		{Section: "General", Key: "value", Type: "string"},
		{Section: "General", Key: "remainder", Type: "string"},
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

func getSeriesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "suffix", Type: "string"},
		{Section: "General", Key: "last", Type: "value"},
		{Section: "General", Key: "deleted", Type: "boolean"},
		{Section: "General", Key: "modifiedAt", Type: "datetime"},
		{Section: "Content", Key: "adverbs", Type: "string", NoTable: true},
		{Section: "Content", Key: "adjectives", Type: "string", NoTable: true},
		{Section: "Content", Key: "nouns", Type: "string", NoTable: true},
		{Section: "Content", Key: "emotions", Type: "string", NoTable: true},
		{Section: "Style", Key: "artstyles", Type: "string", NoTable: true},
		{Section: "Style", Key: "colors", Type: "string", NoTable: true},
		{Section: "Style", Key: "viewpoints", Type: "string", NoTable: true},
		{Section: "Style", Key: "gazes", Type: "string", NoTable: true},
		{Section: "Style", Key: "backstyles", Type: "string", NoTable: true},
		{Section: "Style", Key: "compositions", Type: "string", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
