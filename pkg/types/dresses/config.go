// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package dresses

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// GetConfig returns the ViewConfig for the Dresses view
func (c *DressesCollection) GetConfig() (*types.ViewConfig, error) {
	facets := map[string]types.FacetConfig{
		"generator": {
			Name:          "Generator",
			Store:         "dalledress",
			IsForm:        true,
			DividerBefore: false,
			Fields:        getDalledressFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "facet",
		},
		"series": {
			Name:          "Series",
			Store:         "series",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getSeriesFields(),
			Actions:       []string{"update", "delete", "remove"},
			HeaderActions: []string{"create", "export"},
			RendererTypes: "",
		},
		"databases": {
			Name:          "Databases",
			Store:         "databases",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getDatabasesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
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
		"gallery": {
			Name:          "Gallery",
			Store:         "dalledress",
			IsForm:        true,
			DividerBefore: false,
			Fields:        getDalledressFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "facet",
		},
	}

	cfg := &types.ViewConfig{
		ViewName:   "dresses",
		Facets:     facets,
		FacetOrder: []string{"generator", "series", "databases", "events", "gallery"},
		Actions: map[string]types.ActionConfig{
			"create": {Name: "create", Label: "Create", Icon: "Create"},
			"delete": {Name: "delete", Label: "Delete", Icon: "Delete"},
			"export": {Name: "export", Label: "Export", Icon: "Export"},
			"remove": {Name: "remove", Label: "Remove", Icon: "Remove"},
			"update": {Name: "update", Label: "Update", Icon: "Update"},
		},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getDalledressFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "original", Label: "Original", ColumnLabel: "Original", DetailLabel: "Original Value", Section: "General", Order: 1, DetailOrder: 1},
		{Key: "fileName", Label: "File Name", ColumnLabel: "File Name", DetailLabel: "File Name", Section: "General", Order: 2, DetailOrder: 2},
		{Key: "seed", Label: "Seed", ColumnLabel: "Seed", DetailLabel: "Seed", Section: "General", Order: 3, DetailOrder: 3},
		{Key: "prompt", Label: "Prompt", ColumnLabel: "Prompt", DetailLabel: "Prompt", Section: "Prompts", Order: 4, DetailOrder: 4},
		{Key: "dataPrompt", Label: "Data Prompt", ColumnLabel: "Data Prompt", DetailLabel: "Data Prompt", Section: "Prompts", Order: 5, DetailOrder: 5},
		{Key: "titlePrompt", Label: "Title Prompt", ColumnLabel: "Title Prompt", DetailLabel: "Title Prompt", Section: "Prompts", Order: 6, DetailOrder: 6},
		{Key: "tersePrompt", Label: "Terse Prompt", ColumnLabel: "Terse Prompt", DetailLabel: "Terse Prompt", Section: "Prompts", Order: 7, DetailOrder: 7},
		{Key: "enhancedPrompt", Label: "Enhanced Prompt", ColumnLabel: "Enhanced Prompt", DetailLabel: "Enhanced Prompt", Section: "Prompts", Order: 8, DetailOrder: 8},
		{Key: "attributes", Label: "Attributes", ColumnLabel: "Attributes", DetailLabel: "Attributes", Section: "Attributes", NoTable: true, DetailOrder: 9},
		{Key: "seedChunks", Label: "Seed Chunks", ColumnLabel: "Seed Chunks", DetailLabel: "Seed Chunks", Section: "General", NoTable: true, DetailOrder: 10},
		{Key: "selectedTokens", Label: "Selected Tokens", ColumnLabel: "Selected Tokens", DetailLabel: "Selected Tokens", Section: "General", NoTable: true, DetailOrder: 11},
		{Key: "selectedRecords", Label: "Selected Records", ColumnLabel: "Selected Records", DetailLabel: "Selected Records", Section: "General", NoTable: true, DetailOrder: 12},
		{Key: "imageUrl", Label: "Image URL", ColumnLabel: "Image URL", DetailLabel: "Image URL", Section: "Image", Order: 13, DetailOrder: 13},
		{Key: "generatedPath", Label: "Generated Path", ColumnLabel: "Generated Path", DetailLabel: "Generated Path", Section: "Image", Order: 14, DetailOrder: 14},
		{Key: "annotatedPath", Label: "Annotated Path", ColumnLabel: "Annotated Path", DetailLabel: "Annotated Path", Section: "Image", Order: 15, DetailOrder: 15},
		{Key: "downloadMode", Label: "Download Mode", ColumnLabel: "Download Mode", DetailLabel: "Download Mode", Section: "General", Order: 16, DetailOrder: 16},
		{Key: "ipfsHash", Label: "IPFS Hash", ColumnLabel: "IPFS Hash", DetailLabel: "IPFS Hash", Section: "General", Order: 17, DetailOrder: 17},
		{Key: "cacheHit", Label: "Cache Hit", ColumnLabel: "Cache Hit", DetailLabel: "Cache Hit", Section: "General", Order: 18, DetailOrder: 18},
		{Key: "completed", Label: "Completed", ColumnLabel: "Completed", DetailLabel: "Completed", Section: "General", Order: 19, DetailOrder: 19},
		{Key: "series", Label: "Series", ColumnLabel: "Series", DetailLabel: "Series", Section: "General", Order: 20, DetailOrder: 20},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getDatabasesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "databaseName", Label: "Database Name", ColumnLabel: "Database", DetailLabel: "Database Name", Section: "General", Width: 200, Order: 1, DetailOrder: 1},
		{Key: "count", Label: "Count", ColumnLabel: "Count", DetailLabel: "Count", Section: "General", Width: 100, Order: 2, DetailOrder: 2},
		{Key: "sample", Label: "Sample", ColumnLabel: "Sample", DetailLabel: "Sample", Section: "General", Width: 300, Order: 3, DetailOrder: 3},
		{Key: "filtered", Label: "Filtered", ColumnLabel: "Filtered", DetailLabel: "Filtered", Section: "General", Width: 80, Order: 4, DetailOrder: 4},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Label: "Block", ColumnLabel: "Block", DetailLabel: "Block Number", Section: "Transaction Context", Width: 100, Order: 1, DetailOrder: 8},
		{Key: "transactionIndex", Label: "Tx Index", ColumnLabel: "Tx Index", DetailLabel: "Transaction Index", Section: "Transaction Context", Width: 80, Order: 2, DetailOrder: 11},
		{Key: "logIndex", Label: "Log Index", ColumnLabel: "Log Index", DetailLabel: "Log Index", Section: "Log Overview", Width: 80, Order: 3, DetailOrder: 3},
		{Key: "address", Label: "Address", ColumnLabel: "Address", DetailLabel: "Contract Address", Formatter: "address", Section: "Log Overview", Width: 340, Order: 4, DetailOrder: 1},
		{Key: "topic0", Label: "Topic0", ColumnLabel: "Topic0", DetailLabel: "Topic 0 (Event Signature)", Formatter: "hash", Section: "Topics", Width: 340, Order: 5, DetailOrder: 4},
		{Key: "topic1", Label: "Topic1", ColumnLabel: "Topic1", DetailLabel: "Topic 1", Formatter: "hash", Section: "Topics", Width: 340, Order: 6, DetailOrder: 5},
		{Key: "actions", Label: "Actions", ColumnLabel: "Actions", DetailLabel: "Actions", Section: "", NoDetail: true, Width: 80, Order: 7},
		{Key: "data", Label: "Data", DetailLabel: "Data", Section: "Log Overview", NoTable: true, DetailOrder: 2},
		{Key: "topic2", Label: "Topic 2", DetailLabel: "Topic 2", Formatter: "hash", Section: "Topics", NoTable: true, DetailOrder: 6},
		{Key: "topic3", Label: "Topic 3", DetailLabel: "Topic 3", Formatter: "hash", Section: "Topics", NoTable: true, DetailOrder: 7},
		{Key: "blockHash", Label: "Block Hash", DetailLabel: "Block Hash", Formatter: "hash", Section: "Transaction Context", NoTable: true, DetailOrder: 9},
		{Key: "transactionHash", Label: "Transaction Hash", DetailLabel: "Transaction Hash", Formatter: "hash", Section: "Transaction Context", NoTable: true, DetailOrder: 10},
		{Key: "timestamp", Label: "Timestamp", DetailLabel: "Timestamp", Formatter: "datetime", Section: "Transaction Context", NoTable: true, DetailOrder: 12},
		{Key: "articulatedLog", Label: "Articulated Log", DetailLabel: "Articulated Log", Formatter: "json", Section: "Articulated Information", NoTable: true, DetailOrder: 13},
		{Key: "compressedLog", Label: "Compressed Log", DetailLabel: "Compressed Log", Section: "Articulated Information", NoTable: true, DetailOrder: 14},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getSeriesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "suffix", Label: "Series Name", ColumnLabel: "Series", DetailLabel: "Series Name", Section: "General", Width: 150, Order: 1, DetailOrder: 1},
		{Key: "last", Label: "Last Index", ColumnLabel: "Last", DetailLabel: "Last Index", Section: "General", Width: 80, Order: 2, DetailOrder: 2},
		{Key: "deleted", Label: "Deleted", ColumnLabel: "Deleted", DetailLabel: "Deleted", Section: "Status", Width: 80, Order: 3, DetailOrder: 13, Formatter: "boolean"},
		{Key: "adverbs", Label: "Adverbs", ColumnLabel: "", DetailLabel: "Adverbs", Section: "Content", NoTable: true, DetailOrder: 3},
		{Key: "adjectives", Label: "Adjectives", ColumnLabel: "", DetailLabel: "Adjectives", Section: "Content", NoTable: true, DetailOrder: 4},
		{Key: "nouns", Label: "Nouns", ColumnLabel: "", DetailLabel: "Nouns", Section: "Content", NoTable: true, DetailOrder: 5},
		{Key: "emotions", Label: "Emotions", ColumnLabel: "", DetailLabel: "Emotions", Section: "Content", NoTable: true, DetailOrder: 6},
		{Key: "artstyles", Label: "Art Styles", ColumnLabel: "", DetailLabel: "Art Styles", Section: "Style", NoTable: true, DetailOrder: 7},
		{Key: "colors", Label: "Colors", ColumnLabel: "", DetailLabel: "Colors", Section: "Style", NoTable: true, DetailOrder: 8},
		{Key: "orientations", Label: "Orientations", ColumnLabel: "", DetailLabel: "Orientations", Section: "Style", NoTable: true, DetailOrder: 9},
		{Key: "gazes", Label: "Gazes", ColumnLabel: "", DetailLabel: "Gazes", Section: "Style", NoTable: true, DetailOrder: 10},
		{Key: "backstyles", Label: "Back Styles", ColumnLabel: "", DetailLabel: "Back Styles", Section: "Style", NoTable: true, DetailOrder: 11},
		{Key: "modifiedAt", Label: "Modified At", ColumnLabel: "Modified", DetailLabel: "Modified At", Section: "General", Width: 120, Order: 4, DetailOrder: 12},
		{Key: "actions", Label: "Actions", Section: "General", NoDetail: true, Width: 80, Order: 7},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
