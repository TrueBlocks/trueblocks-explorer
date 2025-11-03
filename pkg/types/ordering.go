package types

import (
	"fmt"
	"os"
	"sort"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/logger"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
)

// SortFields sorts columns and detail fields by their explicit order values.
// It does not assign defaults; ordering must be provided in config.
func SortFields(vc *ViewConfig) {
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

// SetMenuOrder applies menu ordering and facet configurations from embedded or file-based config to ViewConfig.
// When TB_ALLVIEWS environment variable is set, ordering and disabled state configurations are ignored.
func SetMenuOrder(vc *ViewConfig) {
	if vc == nil {
		logger.ShouldNotHappen("SetMenuOrder called with nil ViewConfig")
		return
	}

	// Load app config (embedded or from file)
	config, err := preferences.LoadAppConfig()
	if err != nil {
		panic(fmt.Sprintf("FATAL: Failed to load app config: %v", err))
	}

	// Check if this view has configuration
	if viewConfig, exists := config.ViewConfig[vc.ViewName]; exists {
		skipOrdering := os.Getenv("TB_ALLVIEWS") != ""
		if !skipOrdering {
			if viewConfig.MenuOrder > 0 {
				vc.MenuOrder = viewConfig.MenuOrder
			} else {
				vc.MenuOrder = 999 // Default order for views without explicit order
			}
			vc.Disabled = viewConfig.Disabled
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
			vc.MenuOrder = 999 // Default order when TB_ALLVIEWS is set
		}

		// Apply custom facet ordering if provided (unless TB_ALLVIEWS is set)
		if !skipOrdering && len(viewConfig.FacetOrder) > 0 && vc.Facets != nil {
			// Validate that all facets in the custom order exist and build valid order
			validOrder := []string{}
			customOrderSet := make(map[string]bool)

			for _, facetId := range viewConfig.FacetOrder {
				if _, exists := vc.Facets[facetId]; exists {
					validOrder = append(validOrder, facetId)
					customOrderSet[facetId] = true
				}
			}

			// Add any missing facets from the original order at the end
			for _, id := range vc.FacetOrder {
				if !customOrderSet[id] {
					validOrder = append(validOrder, id)
				}
			}

			// Only update if we have a valid non-empty order
			if len(validOrder) > 0 {
				vc.FacetOrder = validOrder
			}
		}
	} else {
		vc.MenuOrder = 999 // Default order for views not in config
	}
}
