package types

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
)

//go:embed disablements.json
var disablementsJSON string

// EnableFacets enables or disables facets based on the view's enablement file.
type DisablementsConfig struct {
	Views map[string]struct {
		Disabled bool            `json:"disabled"`
		Facets   map[string]bool `json:"facets"`
	} `json:"views"`
}

func SetDisablements(vc *ViewConfig) {
	if vc == nil || vc.Facets == nil {
		return
	}

	var disablements DisablementsConfig
	dec := json.NewDecoder(strings.NewReader(disablementsJSON))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&disablements); err != nil {
		fmt.Printf("Failed to decode embedded disablements: %v\n", err)
		return
	}

	disablement, ok := disablements.Views[vc.ViewName]
	if !ok {
		vc.Disabled = false
		for key, facet := range vc.Facets {
			facet.Disabled = false
			vc.Facets[key] = facet
		}
		return
	}
	vc.Disabled = disablement.Disabled
	for key, facet := range vc.Facets {
		if disabled, exists := disablement.Facets[key]; exists {
			facet.Disabled = disabled
		} else {
			facet.Disabled = false
		}
		vc.Facets[key] = facet
	}
}

// NormalizeOrders sorts columns and detail fields by their explicit order values.
// It does not assign defaults; ordering must be provided in config.
func NormalizeOrders(vc *ViewConfig) {
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
