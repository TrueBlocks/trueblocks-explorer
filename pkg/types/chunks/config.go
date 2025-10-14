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
			RendererTypes: "panel",
			PanelConfig:   getStatsPanelConfig(),
		},
		"index": {
			Name:          "Index",
			Store:         "index",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getIndexFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "panel",
			PanelConfig:   getIndexPanelConfig(),
		},
		"blooms": {
			Name:          "Blooms",
			Store:         "blooms",
			IsForm:        false,
			DividerBefore: false,
			Fields:        getBloomsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "panel",
			PanelConfig:   getBloomsPanelConfig(),
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
			PanelConfig:   nil, // Form facet - no panel
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

func getStatsPanelConfig() *types.PanelConfig {
	return &types.PanelConfig{
		Type:          "barchart",
		DefaultMetric: "ratio",
		SkipUntil:     "2017",
		TimeGroupBy:   "quarterly",
		Metrics: []types.MetricConfig{
			{
				Key:          "ratio",
				Label:        "Compressed",
				BucketsField: "series0",
				StatsField:   "series0Stats",
				Bytes:        false,
			},
			{
				Key:          "appsPerBlk",
				Label:        "Apps per Block",
				BucketsField: "series1",
				StatsField:   "series1Stats",
				Bytes:        false,
			},
			{
				Key:          "addrsPerBlk",
				Label:        "Addrs per Block",
				BucketsField: "series2",
				StatsField:   "series2Stats",
				Bytes:        false,
			},
			{
				Key:          "appsPerAddr",
				Label:        "Apps per Addr",
				BucketsField: "series3",
				StatsField:   "series3Stats",
				Bytes:        false,
			},
		},
	}
}

func getIndexPanelConfig() *types.PanelConfig {
	return &types.PanelConfig{
		Type:          "heatmap",
		DefaultMetric: "nAddresses",
		Metrics: []types.MetricConfig{
			{
				Key:          "nAddresses",
				Label:        "Number of Addresses",
				BucketsField: "series0",
				StatsField:   "series0Stats",
				Bytes:        false,
			},
			{
				Key:          "nAppearances",
				Label:        "Number of Appearances",
				BucketsField: "series1",
				StatsField:   "series1Stats",
				Bytes:        false,
			},
			{
				Key:          "fileSize",
				Label:        "File Size",
				BucketsField: "series2",
				StatsField:   "series2Stats",
				Bytes:        true,
			},
		},
	}
}

func getBloomsPanelConfig() *types.PanelConfig {
	return &types.PanelConfig{
		Type:          "heatmap",
		DefaultMetric: "nBlooms",
		Metrics: []types.MetricConfig{
			{
				Key:          "nBlooms",
				Label:        "Number of Blooms",
				BucketsField: "series3",
				StatsField:   "series3Stats",
				Bytes:        false,
			},
			{
				Key:          "fileSize",
				Label:        "File Size",
				BucketsField: "series2",
				StatsField:   "series2Stats",
				Bytes:        true,
			},
		},
	}
}
