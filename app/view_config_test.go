package app

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// TestViewConfigIntegrity consolidates multiple invariant checks for backend ViewConfig:
// 1) FacetOrderIntegrity: every ViewConfig has non-empty FacetOrder containing each Facets key exactly once
// 2) HeaderActionsExport: every non-form facet includes required 'export' action and HeaderActions is never nil
func TestViewConfigIntegrity(t *testing.T) {
	// Define the shared test matrix once.
	type testCase struct {
		name        string
		getter      func(types.Payload) (*types.ViewConfig, error)
		collection  string
		sampleFacet types.DataFacet
	}

	// Each subtest will create its own App instance to mirror original isolation.
	buildApp := func() *App {
		return &App{
			Projects:    project.NewManager(),
			Preferences: &preferences.Preferences{},
			apiKeys:     map[string]string{},
		}
	}

	a := buildApp()
	tests := []testCase{
		{"abis", a.GetAbisConfig, "abis", types.DataFacet("downloaded")},
		{"chunks", a.GetChunksConfig, "chunks", types.DataFacet("stats")},
		{"contracts", a.GetContractsConfig, "contracts", types.DataFacet("dashboard")},
		{"exports", a.GetExportsConfig, "exports", types.DataFacet("statements")},
		{"monitors", a.GetMonitorsConfig, "monitors", types.DataFacet("monitors")},
		{"names", a.GetNamesConfig, "names", types.DataFacet("all")},
		{"status", a.GetStatusConfig, "status", types.DataFacet("status")},
		{"dresses", a.GetDressesConfig, "dresses", types.DataFacet("generator")},
	}

	// Shared baseline payload fields.
	base := types.Payload{
		ActiveChain:   "mainnet",
		ActiveAddress: "0x0",
		ActivePeriod:  types.PeriodBlockly,
	}

	t.Run("FacetOrderIntegrity", func(t *testing.T) {
		for _, tc := range tests {
			t.Run(tc.name, func(t *testing.T) {
				payload := base
				payload.Collection = tc.collection
				payload.DataFacet = tc.sampleFacet
				cfg, err := tc.getter(payload)
				if err != nil {
					t.Fatalf("%s: error retrieving config: %v", tc.name, err)
				}
				if cfg == nil {
					t.Fatalf("%s: nil config returned", tc.name)
				}
				if len(cfg.FacetOrder) == 0 {
					t.Fatalf("%s: FacetOrder is empty", tc.name)
				}
				seen := make(map[string]bool, len(cfg.FacetOrder))
				for i, id := range cfg.FacetOrder {
					if id == "" {
						t.Errorf("%s: empty facet id at position %d", tc.name, i)
						continue
					}
					if seen[id] {
						t.Errorf("%s: duplicate facet id %q in FacetOrder", tc.name, id)
					}
					seen[id] = true
					if _, ok := cfg.Facets[id]; !ok {
						t.Errorf("%s: facet %q in FacetOrder not found in Facets map", tc.name, id)
					}
				}
				for k := range cfg.Facets {
					if !seen[k] {
						t.Errorf("%s: facet %q present in Facets but missing from FacetOrder", tc.name, k)
					}
				}
			})
		}
	})

	t.Run("HeaderActionsExport", func(t *testing.T) {
		exceptions := map[string]map[string]bool{
			"dresses": {"gallery": true},
		}
		for _, tc := range tests {
			t.Run(tc.name, func(t *testing.T) {
				payload := base
				payload.Collection = tc.collection
				payload.DataFacet = tc.sampleFacet
				cfg, err := tc.getter(payload)
				if err != nil {
					t.Fatalf("%s: error retrieving config: %v", tc.name, err)
				}
				if cfg == nil {
					t.Fatalf("%s: nil config returned", tc.name)
				}
				for facetKey, facet := range cfg.Facets {
					if facet.HeaderActions == nil {
						t.Errorf("%s: facet %q has nil HeaderActions (must be empty slice when none)", tc.name, facetKey)
					}
					reqExport := facet.ViewType != "canvas"
					if ex, ok := exceptions[cfg.ViewName]; ok {
						if ex[facetKey] {
							reqExport = false
						}
					}
					if reqExport && !containsString(facet.HeaderActions, "export") {
						t.Errorf("%s: non-canvas facet %q missing required 'export' in HeaderActions", tc.name, facetKey)
					}
				}
			})
		}
	})
}

func containsString(list []string, needle string) bool {
	for _, s := range list {
		if s == needle {
			return true
		}
	}
	return false
}
