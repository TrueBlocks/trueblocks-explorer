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
	types.NormalizeFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getBloomsFields() []types.FieldConfig {
	return []types.FieldConfig{
		// EXISTING_CODE
		{Key: "range", Label: "Range", ColumnLabel: "Range", DetailLabel: "Range", Formatter: "blkrange", Section: "Range", Width: 150, Sortable: true, Filterable: true, Order: 1, DetailOrder: 1},
		{Key: "magic", Label: "Magic", ColumnLabel: "Magic", DetailLabel: "Magic", Formatter: "text", Section: "Identity", Width: 150, Sortable: true, Filterable: true, Order: 2, DetailOrder: 2},
		{Key: "hash", Label: "Hash", ColumnLabel: "Hash", DetailLabel: "Hash", Formatter: "hash", Section: "Identity", Width: 150, Sortable: true, Filterable: true, Order: 3, DetailOrder: 3},
		{Key: "nBlooms", Label: "Blooms", ColumnLabel: "Blooms", DetailLabel: "Blooms", Formatter: "number", Section: "Counts", Width: 150, Sortable: true, Filterable: true, Order: 4, DetailOrder: 4},
		{Key: "nInserted", Label: "Inserted", ColumnLabel: "Inserted", DetailLabel: "Inserted", Formatter: "number", Section: "Counts", Width: 150, Sortable: true, Filterable: true, Order: 5, DetailOrder: 5},
		{Key: "size", Label: "Size", ColumnLabel: "Size", DetailLabel: "Size", Formatter: "number", Section: "Sizes", Width: 150, Sortable: true, Filterable: true, Order: 6, DetailOrder: 6},
		{Key: "byteWidth", Label: "Byte Width", ColumnLabel: "Byte Width", DetailLabel: "Byte Width", Formatter: "number", Section: "Sizes", Width: 150, Sortable: true, Filterable: true, Order: 7, DetailOrder: 7},
		// EXISTING_CODE
	}
}

func getIndexFields() []types.FieldConfig {
	return []types.FieldConfig{
		// EXISTING_CODE
		{Key: "range", Label: "Range", ColumnLabel: "Range", DetailLabel: "Range", Formatter: "blkrange", Section: "Range", Width: 150, Sortable: true, Filterable: true, Order: 1, DetailOrder: 1},
		{Key: "magic", Label: "Magic", ColumnLabel: "Magic", DetailLabel: "Magic", Formatter: "text", Section: "Identity", Width: 150, Sortable: true, Filterable: true, Order: 2, DetailOrder: 2},
		{Key: "hash", Label: "Hash", ColumnLabel: "Hash", DetailLabel: "Hash", Formatter: "hash", Section: "Identity", Width: 150, Sortable: true, Filterable: true, Order: 3, DetailOrder: 3},
		{Key: "nAddresses", Label: "Addresses", ColumnLabel: "Addresses", DetailLabel: "Addresses", Formatter: "number", Section: "Counts", Width: 150, Sortable: true, Filterable: true, Order: 4, DetailOrder: 4},
		{Key: "nAppearances", Label: "Appearances", ColumnLabel: "Appearances", DetailLabel: "Appearances", Formatter: "number", Section: "Counts", Width: 150, Sortable: true, Filterable: true, Order: 5, DetailOrder: 5},
		{Key: "size", Label: "Size", ColumnLabel: "Size", DetailLabel: "Size", Formatter: "number", Section: "Sizes", Width: 150, Sortable: true, Filterable: true, Order: 6, DetailOrder: 6},
		// EXISTING_CODE
	}
}

func getManifestFields() []types.FieldConfig {
	return []types.FieldConfig{
		// EXISTING_CODE
		{Key: "version", Label: "Version", ColumnLabel: "Version", DetailLabel: "Version", Section: "Manifest", Width: 100, Order: 1, DetailOrder: 1},
		{Key: "chain", Label: "Chain", ColumnLabel: "Chain", DetailLabel: "Chain", Section: "Manifest", Width: 120, Order: 2, DetailOrder: 2},
		{Key: "specification", Label: "Specification", ColumnLabel: "Specification", DetailLabel: "Specification", Formatter: "hash", Section: "Manifest", Width: 200, Order: 3, DetailOrder: 3},
		// EXISTING_CODE
	}
}

func getStatsFields() []types.FieldConfig {
	return []types.FieldConfig{
		// EXISTING_CODE
		{Key: "range", Label: "Range", ColumnLabel: "Range", DetailLabel: "Range", Formatter: "blkrange", Section: "Range", Width: 150, Sortable: true, Filterable: true, Order: 1, DetailOrder: 1},
		{Key: "nAddrs", Label: "Addresses", ColumnLabel: "Addrs", DetailLabel: "Addresses", Formatter: "number", Section: "Counts", Width: 120, Sortable: true, Filterable: true, Order: 2, DetailOrder: 2},
		{Key: "nApps", Label: "Apps", ColumnLabel: "Apps", DetailLabel: "Apps", Formatter: "number", Section: "Counts", Width: 100, Sortable: true, Filterable: true, Order: 3, DetailOrder: 3},
		{Key: "nBlocks", Label: "Blocks", ColumnLabel: "Blocks", DetailLabel: "Blocks", Formatter: "number", Section: "Counts", Width: 120, Sortable: true, Filterable: true, Order: 4, DetailOrder: 4},
		{Key: "nBlooms", Label: "Blooms", ColumnLabel: "Blooms", DetailLabel: "Blooms", Formatter: "number", Section: "Counts", Width: 120, Sortable: true, Filterable: true, Order: 5, DetailOrder: 5},
		{Key: "recWid", Label: "Record Width", ColumnLabel: "Rec Wid", DetailLabel: "Record Width", Formatter: "number", Section: "Sizes", Width: 120, Sortable: true, Filterable: true, Order: 6, DetailOrder: 6},
		{Key: "bloomSz", Label: "Bloom Size", ColumnLabel: "Bloom Sz", DetailLabel: "Bloom Size", Formatter: "number", Section: "Sizes", Width: 120, Sortable: true, Filterable: true, Order: 7, DetailOrder: 7},
		{Key: "chunkSz", Label: "Chunk Size", ColumnLabel: "Chunk Sz", DetailLabel: "Chunk Size", Formatter: "number", Section: "Sizes", Width: 120, Sortable: true, Filterable: true, Order: 8, DetailOrder: 8},
		{Key: "addrsPerBlock", Label: "Addrs/Block", ColumnLabel: "Addrs Per Block", DetailLabel: "Addrs/Block", Formatter: "float64", Section: "Efficiency", Width: 100, Sortable: true, Filterable: true, Order: 9, DetailOrder: 9},
		{Key: "appsPerBlock", Label: "Apps/Block", ColumnLabel: "Apps Per Block", DetailLabel: "Apps/Block", Formatter: "float64", Section: "Efficiency", Width: 100, Sortable: true, Filterable: true, Order: 10, DetailOrder: 10},
		{Key: "appsPerAddr", Label: "Apps/Addr", ColumnLabel: "Apps Per Addr", DetailLabel: "Apps/Addr", Formatter: "float64", Section: "Efficiency", Width: 100, Sortable: true, Filterable: true, Order: 11, DetailOrder: 11},
		{Key: "ratio", Label: "Ratio", ColumnLabel: "Ratio", DetailLabel: "Ratio", Formatter: "float64", Section: "Efficiency", Width: 100, Sortable: true, Filterable: true, Order: 12, DetailOrder: 12},
		// EXISTING_CODE
	}
}

// EXISTING_CODE
// EXISTING_CODE
