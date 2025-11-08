// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package projects

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

// GetConfig returns the ViewConfig for the Projects view
func (c *ProjectsCollection) GetConfig() (*types.ViewConfig, error) {
	facets := map[string]types.FacetConfig{
		"manage": {
			Name:          "Manage",
			Store:         "projects",
			DividerBefore: false,
			Fields:        getProjectsFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "",
		},
		"projects": {
			Name:          "Projects",
			Store:         "addresslist",
			DividerBefore: false,
			Fields:        getAddresslistFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "",
		},
	}

	facetOrder := []string{}
	facetOrder = append(facetOrder, "manage")
	facetOrder = append(facetOrder, "projects")

	cfg := &types.ViewConfig{
		ViewName:   "projects",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions:    map[string]types.ActionConfig{},
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func getAddresslistFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Identity", Key: "address"},
		{Section: "Identity", Key: "name"},
		{Section: "Identity", Key: "appearances"},
		{Section: "State", Key: "lastUpdated"},
	}
	types.NormalizeFields(&ret)
	return ret
}

func getProjectsFields() []types.FieldConfig {
	ret := []types.FieldConfig{
		{Section: "Identity", Key: "id"},
		{Section: "Identity", Key: "name"},
		{Section: "Identity", Key: "path", Type: "path"},
		{Section: "State", Key: "isActive"},
	}
	types.NormalizeFields(&ret)
	return ret
}

// EXISTING_CODE
// EXISTING_CODE
