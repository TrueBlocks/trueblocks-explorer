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
			ViewType:      "canvas",
			DividerBefore: false,
			Fields:        getDalledressFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "facet",
			RowAction:     types.NewRowActionNavigation("dresses", "gallery", "address", "original"),
		},
		"series": {
			Name:          "Series",
			Store:         "series",
			ViewType:      "canvas",
			DividerBefore: false,
			Fields:        getSeriesFields(),
			Actions:       []string{"update", "delete", "remove"},
			HeaderActions: []string{"create", "export"},
			RendererTypes: "facet",
		},
		"databases": {
			Name:          "Databases",
			Store:         "databases",
			DividerBefore: false,
			Fields:        getDatabasesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
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
		"gallery": {
			Name:          "Gallery",
			Store:         "dalledress",
			ViewType:      "canvas",
			DividerBefore: false,
			Fields:        getDalledressFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "facet",
			RowAction:     types.NewRowActionNavigation("dresses", "generator", "address", "original"),
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
		{Section: "General", Key: "original", Formatter: "address"},
		{Section: "General", Key: "fileName", Formatter: "path"},
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
		{Section: "Image", Key: "imageUrl", Formatter: "url", NoTable: true},
		{Section: "Image", Key: "generatedPath", Formatter: "path"},
		{Section: "Image", Key: "annotatedPath", Formatter: "path"},
		{Section: "General", Key: "downloadMode"},
		{Section: "General", Key: "ipfsHash", Formatter: "hash"},
		{Section: "General", Key: "cacheHit", Formatter: "boolean"},
		{Section: "General", Key: "completed", Formatter: "boolean"},
		{Section: "General", Key: "series"},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(ret)
	return ret
}

func getDatabasesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "databaseName"},
		{Section: "General", Key: "count", Formatter: "number"},
		{Section: "General", Key: "sample"},
		{Section: "General", Key: "filtered"},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(ret)
	return ret
}

func getLogsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Context", Key: "blockNumber", Formatter: "number"},
		{Section: "Context", Key: "transactionIndex", Formatter: "number"},
		{Section: "Context", Key: "logIndex", Formatter: "number"},
		{Section: "Context", Key: "address", Formatter: "address"},
		{Section: "Context", Key: "timestamp", Formatter: "datetime", NoTable: true},
		{Section: "Context", Key: "blockHash", Formatter: "hash", NoTable: true},
		{Section: "Context", Key: "transactionHash", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "topic0", Formatter: "hash"},
		{Section: "Details", Key: "topic1", Formatter: "hash"},
		{Section: "Details", Key: "topic2", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "topic3", Formatter: "hash", NoTable: true},
		{Section: "Details", Key: "data", NoTable: true},
		{Section: "Articulation", Key: "articulatedLog", NoTable: true},
		{Section: "Articulation", Key: "compressedLog", NoTable: true},
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(ret)
	return ret
}

func getSeriesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "suffix"},
		{Section: "General", Key: "last"},
		{Section: "General", Key: "deleted", Formatter: "boolean"},
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
		{Section: "", Key: "actions", Formatter: "actions", NoDetail: true},
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
