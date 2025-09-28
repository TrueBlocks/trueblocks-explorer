package types

import (
	"fmt"
	"sort"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/logger"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
)

// NormalizeFields sorts columns and detail fields by their explicit order values.
// It does not assign defaults; ordering must be provided in config.
func NormalizeFields(vc *ViewConfig) {
	if vc == nil || vc.Facets == nil {
		return
	}
	for key, facet := range vc.Facets {
		// Columns: sort by Order when both orders are positive; otherwise keep input order
		sort.SliceStable(facet.Columns, func(i, j int) bool {
			oi, oj := facet.Columns[i].Order, facet.Columns[j].Order
			if oi > 0 && oj > 0 {
				return oi < oj
			}
			return false
		})

		// Detail panels: within each panel, sort by DetailOrder when both orders are positive
		for p := range facet.DetailPanels {
			sort.SliceStable(facet.DetailPanels[p].Fields, func(i, j int) bool {
				oi, oj := facet.DetailPanels[p].Fields[i].DetailOrder, facet.DetailPanels[p].Fields[j].DetailOrder
				if oi > 0 && oj > 0 {
					return oi < oj
				}
				return false
			})
		}

		vc.Facets[key] = facet
	}
}

// SetMenuOrder applies menu ordering and facet configurations from .create-local-app.json to ViewConfig
func SetMenuOrder(vc *ViewConfig) {
	if vc == nil {
		logger.ShouldNotHappen("SetMenuOrder called with nil ViewConfig")
		return
	}

	// Load app config
	config, err := preferences.LoadAppConfig()
	if err != nil {
		panic(fmt.Sprintf("FATAL: Failed to load app config from .create-local-app.json: %v", err))
	}

	// Check if this view has configuration
	if viewConfig, exists := config.ViewConfig[vc.ViewName]; exists {
		// Apply menu order
		if viewConfig.MenuOrder > 0 {
			vc.MenuOrder = viewConfig.MenuOrder
		} else {
			vc.MenuOrder = 999 // Default order for views without explicit order
		}

		// Apply view-level disabled state
		vc.Disabled = viewConfig.Disabled

		// Apply facet configurations if both exist
		if len(viewConfig.DisabledFacets) > 0 && vc.Facets != nil {
			for facetName, facetConfig := range vc.Facets {
				if disabledState, facetExists := viewConfig.DisabledFacets[facetName]; facetExists {
					// Apply the configured disabled state directly (true = disabled, false = enabled)
					facetConfig.Disabled = disabledState
					vc.Facets[facetName] = facetConfig
				}
			}
		}
	} else {
		vc.MenuOrder = 999 // Default order for views not in config
	}
}
