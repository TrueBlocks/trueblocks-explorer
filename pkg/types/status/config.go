// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package status

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

// GetConfig returns the ViewConfig for the Status view
func (c *StatusCollection) GetConfig() (*types.ViewConfig, error) {
	facets := map[string]types.FacetConfig{
		"status": {
			Name:          "Status",
			Store:         "status",
			ViewType:      "canvas",
			DividerBefore: false,
			Fields:        getStatusFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "",
		},
		"caches": {
			Name:          "Caches",
			Store:         "caches",
			DividerBefore: false,
			Fields:        getCachesFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
		"chains": {
			Name:          "Chains",
			Store:         "chains",
			DividerBefore: false,
			Fields:        getChainsFields(),
			Actions:       []string{},
			HeaderActions: []string{"export"},
			RendererTypes: "",
		},
	}

	facetOrder := []string{}
	facetOrder = append(facetOrder, "status")
	facetOrder = append(facetOrder, "caches")
	facetOrder = append(facetOrder, "chains")

	cfg := &types.ViewConfig{
		ViewName:   "status",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions: map[string]types.ActionConfig{
			"export": {Name: "export", Label: "Export", Icon: "Export"},
		},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getCachesFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "type"},
		{Section: "General", Key: "path", Type: "path"},
		{Section: "Statistics", Key: "nFiles"},
		{Section: "Statistics", Key: "nFolders"},
		{Section: "Statistics", Key: "sizeInBytes"},
		{Section: "Timestamps", Key: "lastCached"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getChainsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "General", Key: "chain"},
		{Section: "General", Key: "chainId", Type: "number"},
		{Section: "General", Key: "symbol"},
		{Section: "Providers", Key: "rpcProvider"},
		{Section: "Providers", Key: "ipfsGateway"},
		{Section: "Explorers", Key: "localExplorer"},
		{Section: "Explorers", Key: "remoteExplorer"},
		{Section: "", Key: "actions", Type: "actions", NoDetail: true},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getStatusFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Paths", Key: "cachePath", Type: "path"},
		{Section: "Paths", Key: "indexPath", Type: "path"},
		{Section: "Chain", Key: "chain"},
		{Section: "Chain", Key: "chainId"},
		{Section: "Chain", Key: "networkId"},
		{Section: "Chain", Key: "chainConfig"},
		{Section: "Config", Key: "rootConfig"},
		{Section: "Config", Key: "clientVersion"},
		{Section: "Config", Key: "version"},
		{Section: "Progress", Key: "progress"},
		{Section: "Providers", Key: "rpcProvider"},
		{Section: "Flags", Key: "hasEsKey"},
		{Section: "Flags", Key: "hasPinKey"},
		{Section: "Flags", Key: "isApi"},
		{Section: "Flags", Key: "isArchive"},
		{Section: "Flags", Key: "isScraping"},
		{Section: "Flags", Key: "isTesting"},
		{Section: "Flags", Key: "isTracing"},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
