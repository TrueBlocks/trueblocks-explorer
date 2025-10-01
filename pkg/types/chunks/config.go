// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package chunks

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// GetConfig returns the ViewConfig for the Chunks view
func (c *ChunksCollection) GetConfig() (*types.ViewConfig, error) {
	facets := map[string]types.FacetConfig{
		"stats": {
			Name:          "Stats",
			Store:         "stats",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getStatsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"index": {
			Name:          "Index",
			Store:         "index",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getIndexFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"blooms": {
			Name:          "Blooms",
			Store:         "blooms",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getBloomsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"manifest": {
			Name:          "Manifest",
			Store:         "manifest",
			IsForm:        true,
			DividerBefore: false,
			Fields:        getManifestFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "",
		},
	}

	cfg := &types.ViewConfig{
		ViewName:   "chunks",
		Facets:     facets,
		FacetOrder: []string{"stats", "index", "blooms", "manifest"},
		Actions: map[string]types.ActionConfig{
			"export": {Name: "export", Label: "Export", Icon: "Export"},
		},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getBloomsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "range", Formatter: "blkrange", Section: "Range", Sortable: true},
		{Key: "magic", Section: "Identity", NoTable: true},
		{Key: "hash", Formatter: "hash", Section: "Identity", Sortable: true},
		{Key: "nBlooms", Section: "Counts", Sortable: true},
		{Key: "nInserted", Section: "Counts", Sortable: true},
		{Key: "size", Section: "Sizes", Sortable: true},
		{Key: "byteWidth", Formatter: "number", Section: "Sizes", Sortable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getIndexFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "range", Formatter: "blkrange", Section: "Range", Sortable: true},
		{Key: "magic", Section: "Identity", NoTable: true},
		{Key: "hash", Formatter: "hash", Section: "Identity", Sortable: true},
		{Key: "nAddresses", Section: "Counts", Sortable: true},
		{Key: "nAppearances", Section: "Counts", Sortable: true},
		{Key: "size", Section: "Sizes", Sortable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getManifestFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "version", Section: "Manifest"},
		{Key: "chain", Section: "Manifest"},
		{Key: "specification", Formatter: "hash", Section: "Manifest"},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getStatsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Key: "range", Formatter: "blkrange", Section: "Range", Sortable: true},
		{Key: "nAddrs", Section: "Counts", Sortable: true},
		{Key: "nApps", Section: "Counts", Sortable: true},
		{Key: "nBlocks", Section: "Counts", Sortable: true},
		{Key: "nBlooms", Section: "Counts", Sortable: true},
		{Key: "recWid", Formatter: "number", Section: "Sizes", Sortable: true},
		{Key: "bloomSz", Section: "Sizes", Sortable: true},
		{Key: "chunkSz", Section: "Sizes", Sortable: true},
		{Key: "ratio", Formatter: "float64", Section: "Efficiency", Sortable: true},
		{Key: "addrsPerBlock", Section: "Efficiency", Sortable: true},
		{Key: "appsPerBlock", Section: "Efficiency", Sortable: true},
		{Key: "appsPerAddr", Section: "Efficiency", Sortable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
