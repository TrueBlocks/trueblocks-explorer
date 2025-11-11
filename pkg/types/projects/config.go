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
	facets := c.buildStaticFacets()
	facetOrder := c.buildFacetOrder()
	c.addDynamicFacets(facets, &facetOrder)

	cfg := &types.ViewConfig{
		ViewName:   "projects",
		Facets:     facets,
		FacetOrder: facetOrder,
		Actions:    c.buildActions(),
	}

	types.DeriveFacets(cfg)
	types.SortFields(cfg)
	types.SetMenuOrder(cfg)
	return cfg, nil
}

func (c *ProjectsCollection) buildStaticFacets() map[string]types.FacetConfig {
	return map[string]types.FacetConfig{
		"manage": {
			Name:          "Manage",
			Store:         "projects",
			ViewType:      "canvas",
			DividerBefore: false,
			Fields:        getProjectsFields(),
			Actions:       []string{},
			HeaderActions: []string{},
			RendererTypes: "facet",
		},
	}
}

func (c *ProjectsCollection) buildFacetOrder() []string {
	return []string{
		"manage",
	}
}

func (c *ProjectsCollection) buildActions() map[string]types.ActionConfig {
	return map[string]types.ActionConfig{}
}

func (c *ProjectsCollection) addDynamicFacets(facets map[string]types.FacetConfig, facetOrder *[]string) {
	if c.projectsManager == nil {
		return
	}

	for _, id := range c.projectsManager.GetOpenIDs() {
		if item, exists := c.projectsManager.GetItemByID(id); exists {
			facets[id] = types.FacetConfig{
				Name:          item.GetName(),
				Store:         "addresslist",
				DividerBefore: false,
				Fields:        getAddresslistFields(),
				Actions:       []string{},
				HeaderActions: []string{},
				RendererTypes: "",
				CanClose:      true,
				RowAction:     types.NewRowActionNavigation("exports", "<latest>", "address", "address"),
			}
			*facetOrder = append(*facetOrder, id)
		}
	}
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
