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
		{Key: "original", Formatter: "address", Section: "General"},
		{Key: "fileName", Formatter: "path", Section: "General"},
		{Key: "seed", Section: "General"},
		{Key: "prompt", Section: "Prompts"},
		{Key: "dataPrompt", Section: "Prompts"},
		{Key: "titlePrompt", Section: "Prompts"},
		{Key: "tersePrompt", Section: "Prompts"},
		{Key: "enhancedPrompt", Section: "Prompts"},
		{Key: "attributes", Section: "Attributes", NoTable: true},
		{Key: "seedChunks", Section: "General", NoTable: true},
		{Key: "selectedTokens", Section: "General", NoTable: true},
		{Key: "selectedRecords", Section: "General", NoTable: true},
		{Key: "imageUrl", Formatter: "url", Section: "Image"},
		{Key: "generatedPath", Formatter: "path", Section: "Image"},
		{Key: "annotatedPath", Formatter: "path", Section: "Image"},
		{Key: "downloadMode", Section: "General"},
		{Key: "ipfsHash", Formatter: "hash", Section: "General"},
		{Key: "cacheHit", Formatter: "boolean", Section: "General"},
		{Key: "completed", Formatter: "boolean", Section: "General"},
		{Key: "series", Section: "General"},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getDatabasesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "databaseName", Section: "General"},
		{Key: "count", Formatter: "number", Section: "General"},
		{Key: "sample", Section: "General"},
		{Key: "filtered", Section: "General"},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "blockNumber", Formatter: "number", Section: "Transaction Context"},
		{Key: "transactionIndex", Formatter: "number", Section: "Transaction Context"},
		{Key: "logIndex", Formatter: "number", Section: "Log Overview"},
		{Key: "address", Formatter: "address", Section: "Log Overview"},
		{Key: "topic0", Formatter: "hash", Section: "Topics"},
		{Key: "topic1", Formatter: "hash", Section: "Topics"},
		{Key: "data", Section: "Log Overview", NoTable: true},
		{Key: "topic2", Formatter: "hash", Section: "Topics", NoTable: true},
		{Key: "topic3", Formatter: "hash", Section: "Topics", NoTable: true},
		{Key: "blockHash", Formatter: "hash", Section: "Transaction Context", NoTable: true},
		{Key: "transactionHash", Formatter: "hash", Section: "Transaction Context", NoTable: true},
		{Key: "timestamp", Formatter: "timestamp", Section: "Transaction Context", NoTable: true},
		{Key: "articulatedLog", Formatter: "json", Section: "Articulated Information", NoTable: true},
		{Key: "compressedLog", Section: "Articulated Information", NoTable: true},
		{Key: "actions", Formatter: "actions", Section: "", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getSeriesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "suffix", Section: "General"},
		{Key: "last", Formatter: "timestamp", Section: "General"},
		{Key: "deleted", Formatter: "boolean", Section: "Status"},
		{Key: "adverbs", Section: "Content", NoTable: true},
		{Key: "adjectives", Section: "Content", NoTable: true},
		{Key: "nouns", Section: "Content", NoTable: true},
		{Key: "emotions", Section: "Content", NoTable: true},
		{Key: "artstyles", Section: "Style", NoTable: true},
		{Key: "colors", Section: "Style", NoTable: true},
		{Key: "orientations", Section: "Style", NoTable: true},
		{Key: "gazes", Section: "Style", NoTable: true},
		{Key: "backstyles", Section: "Style", NoTable: true},
		{Key: "modifiedAt", Section: "General"},
		{Key: "actions", Formatter: "actions", Section: "General", NoDetail: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
