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
		{Section: "Range", Key: "range", Formatter: "blkrange", Sortable: true},
		{Section: "Identity", Key: "magic", NoTable: true},
		{Section: "Identity", Key: "hash", Formatter: "hash", NoTable: true, Sortable: true},
		{Section: "Counts", Key: "nBlooms", Sortable: true},
		// {Section: "Counts", Key: "nInserted", Sortable: true},
		{Section: "Sizes", Key: "calcs.fileSize", Sortable: true},
		{Section: "Sizes", Key: "byteWidth", Formatter: "number", Sortable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getIndexFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Range", Key: "range", Formatter: "blkrange", Sortable: true},
		{Section: "Identity", Key: "magic", NoTable: true},
		{Section: "Identity", Key: "hash", Formatter: "hash", NoTable: true, Sortable: true},
		{Section: "Counts", Key: "nAddresses", Sortable: true},
		{Section: "Counts", Key: "nAppearances", Sortable: true},
		{Section: "Sizes", Key: "size", Sortable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getManifestFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Manifest", Key: "version"},
		{Section: "Manifest", Key: "chain"},
		{Section: "Manifest", Key: "specification", Formatter: "hash"},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

func getStatsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		// EXISTING_CODE
		{Section: "Range", Key: "range", Formatter: "blkrange", Sortable: true},
		{Section: "Efficiency", Key: "ratio", Formatter: "float64", Sortable: true},
		{Section: "Efficiency", Key: "addrsPerBlock", Sortable: true},
		{Section: "Efficiency", Key: "appsPerBlock", Sortable: true},
		{Section: "Efficiency", Key: "appsPerAddr", Sortable: true},
		{Section: "Sizes", Key: "bloomSz", NoTable: true, Sortable: true},
		{Section: "Sizes", Key: "chunkSz", NoTable: true, Sortable: true},
		{Section: "Counts", Key: "nAddrs", NoTable: true, Sortable: true},
		{Section: "Counts", Key: "nApps", NoTable: true, Sortable: true},
		{Section: "Counts", Key: "nBlocks", NoTable: true, Sortable: true},
		{Section: "Counts", Key: "nBlooms", NoTable: true, Sortable: true},
		{Section: "Sizes", Key: "recWid", Formatter: "number", NoTable: true, Sortable: true},
		// EXISTING_CODE
	}
	types.NormalizeFields(ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
