// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package chunks

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

// GetConfig returns the ViewConfig for the Chunks view
func (c *ChunksCollection) GetConfig() (*types.ViewConfig, error) {
	facets := c.buildStaticFacets()
	facetOrder := c.buildFacetOrder()

	cfg := &types.ViewConfig{
		ViewName:   "chunks",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions:    c.buildActions(),
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func (c *ChunksCollection) buildStaticFacets() map[string]types.FacetConfig {
	return map[string]types.FacetConfig{
		"stats": {
			Name:             "Stats",
			Store:            "stats",
			ViewType:         "table",
			Panel:            "custom",
			DividerBefore:    false,
			Fields:           getStatsFields(),
			Actions:          []string{},
			HeaderActions:    []string{"export"},
			PanelChartConfig: getStatsPanelConfig(),
		},
		"index": {
			Name:             "Index",
			Store:            "index",
			ViewType:         "table",
			Panel:            "custom",
			DividerBefore:    false,
			Fields:           getIndexFields(),
			Actions:          []string{},
			HeaderActions:    []string{"export"},
			PanelChartConfig: getIndexPanelConfig(),
		},
		"blooms": {
			Name:             "Blooms",
			Store:            "blooms",
			ViewType:         "table",
			Panel:            "custom",
			DividerBefore:    false,
			Fields:           getBloomsFields(),
			Actions:          []string{},
			HeaderActions:    []string{"export"},
			PanelChartConfig: getBloomsPanelConfig(),
		},
		"manifest": {
			Name:          "Manifest",
			Store:         "manifest",
			ViewType:      "form",
			DividerBefore: false,
			Fields:        getManifestFields(),
			Actions:       []string{},
			HeaderActions: []string{},
		},
	}
}

func (c *ChunksCollection) buildFacetOrder() []string {
	return []string{
		"stats",
		"index",
		"blooms",
		"manifest",
	}
}

func (c *ChunksCollection) buildActions() map[string]types.ActionConfig {
	return map[string]types.ActionConfig{
		"export": {Name: "export", Label: "Export", Icon: "Export"},
	}
}

func getBloomsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Range", Key: "range", Type: "blkrange"},
		{Section: "Identity", Key: "magic", NoTable: true},
		{Section: "Identity", Key: "hash", Type: "hash", NoTable: true},
		{Section: "Counts", Key: "nBlooms", Type: "uint64"},
		{Section: "Counts", Key: "nInserted", Type: "uint64"},
		{Section: "Sizes", Key: "calc.fileSize", Type: "fileSize"},
		{Section: "Sizes", Key: "byteWidth", Type: "uint64"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getIndexFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Range", Key: "range", Type: "blkrange"},
		{Section: "Identity", Key: "magic", NoTable: true},
		{Section: "Identity", Key: "hash", Type: "hash", NoTable: true},
		{Section: "Counts", Key: "nAddresses", Type: "uint64"},
		{Section: "Counts", Key: "nAppearances", Type: "uint64"},
		{Section: "Sizes", Key: "size", Type: "fileSize"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getManifestFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Manifest", Key: "version"},
		{Section: "Manifest", Key: "chain"},
		{Section: "Manifest", Key: "specification", Type: "ipfsHash"},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getStatsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Range", Key: "range", Type: "blkrange"},
		{Section: "Efficiency", Key: "ratio", Type: "float64"},
		{Section: "Efficiency", Key: "addrsPerBlock", Type: "float64"},
		{Section: "Efficiency", Key: "appsPerBlock", Type: "float64"},
		{Section: "Efficiency", Key: "appsPerAddr", Type: "float64"},
		{Section: "Sizes", Key: "bloomSz", Type: "fileSize", NoTable: true},
		{Section: "Sizes", Key: "chunkSz", Type: "fileSize", NoTable: true},
		{Section: "Counts", Key: "nAddrs", Type: "uint64", NoTable: true},
		{Section: "Counts", Key: "nApps", Type: "uint64", NoTable: true},
		{Section: "Counts", Key: "nBlocks", Type: "uint64", NoTable: true},
		{Section: "Counts", Key: "nBlooms", Type: "uint64", NoTable: true},
		{Section: "Sizes", Key: "recWid", Type: "uint64", NoTable: true},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
func getStatsPanelConfig() *types.PanelChartConfig {
	return &types.PanelChartConfig{
		Type:          "barchart",
		DefaultMetric: "ratio",
		SkipUntil:     "2017",
		TimeGroupBy:   "quarterly",
		Metrics: []types.MetricConfig{
			{
				Key:          "ratio",
				Label:        "Compressed",
				BucketsField: "ratio",
				Bytes:        false,
			},
			{
				Key:          "appsPerBlk",
				Label:        "Apps per Block",
				BucketsField: "appsPerBlock",
				Bytes:        false,
			},
			{
				Key:          "addrsPerBlk",
				Label:        "Addrs per Block",
				BucketsField: "addrsPerBlock",
				Bytes:        false,
			},
			{
				Key:          "appsPerAddr",
				Label:        "Apps per Addr",
				BucketsField: "appsPerAddr",
				Bytes:        false,
			},
		},
	}
}

func getIndexPanelConfig() *types.PanelChartConfig {
	return &types.PanelChartConfig{
		Type:          "heatmap",
		DefaultMetric: "nAddresses",
		Metrics: []types.MetricConfig{
			{
				Key:          "nAddresses",
				Label:        "Number of Addresses",
				BucketsField: "nAddresses",
				Bytes:        false,
			},
			{
				Key:          "nAppearances",
				Label:        "Number of Appearances",
				BucketsField: "nAppearances",
				Bytes:        false,
			},
			{
				Key:          "fileSize",
				Label:        "File Size",
				BucketsField: "fileSize",
				Bytes:        true,
			},
		},
	}
}

func getBloomsPanelConfig() *types.PanelChartConfig {
	return &types.PanelChartConfig{
		Type:          "heatmap",
		DefaultMetric: "nBlooms",
		Metrics: []types.MetricConfig{
			{
				Key:          "nBlooms",
				Label:        "Number of Blooms",
				BucketsField: "nBlooms",
				Bytes:        false,
			},
			{
				Key:          "fileSize",
				Label:        "File Size",
				BucketsField: "fileSize",
				Bytes:        true,
			},
		},
	}
}

// EXISTING_CODE
