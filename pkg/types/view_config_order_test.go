package types_test

import (
	"testing"

	appTypes "github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/abis"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/chunks"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/contracts"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/exports"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/monitors"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/status"
)

type configProvider struct {
	name string
	get  func() (*appTypes.ViewConfig, error)
}

func providers() []configProvider {
	return []configProvider{
		{name: "abis", get: func() (*appTypes.ViewConfig, error) { return (&abis.AbisCollection{}).GetConfig() }},
		{name: "names", get: func() (*appTypes.ViewConfig, error) { return (&names.NamesCollection{}).GetConfig() }},
		{name: "monitors", get: func() (*appTypes.ViewConfig, error) { return (&monitors.MonitorsCollection{}).GetConfig() }},
		{name: "chunks", get: func() (*appTypes.ViewConfig, error) { return (&chunks.ChunksCollection{}).GetConfig() }},
		{name: "status", get: func() (*appTypes.ViewConfig, error) { return (&status.StatusCollection{}).GetConfig() }},
		{name: "contracts", get: func() (*appTypes.ViewConfig, error) { return (&contracts.ContractsCollection{}).GetConfig() }},
		{name: "exports", get: func() (*appTypes.ViewConfig, error) { return (&exports.ExportsCollection{}).GetConfig() }},
	}
}

func TestConfigOrdersAndKeys(t *testing.T) {
	for _, p := range providers() {
		t.Run(p.name, func(t *testing.T) {
			vc, err := p.get()
			if err != nil {
				t.Fatalf("GetConfig failed: %v", err)
			}
			for facetKey, facet := range vc.Facets {
				t.Run(facetKey, func(t *testing.T) {
					// (a) Every column has non-zero Order
					for i, col := range facet.Columns {
						if col.Order <= 0 {
							t.Errorf("column %d key=%s has non-positive Order=%d", i, col.Key, col.Order)
						}
					}

					// (b) Every detailPanel field has non-zero DetailOrder
					for pi, panel := range facet.DetailPanels {
						for fi, f := range panel.Fields {
							if f.DetailOrder <= 0 {
								t.Errorf("panel %d field %d key=%s has non-positive DetailOrder=%d", pi, fi, f.Key, f.DetailOrder)
							}
						}
					}

					// (c) Every non-actions column key appears in detail fields (flattened across panels)
					colKeys := make(map[string]struct{})
					for _, c := range facet.Columns {
						if c.Key != "" && c.Key != "actions" {
							colKeys[c.Key] = struct{}{}
						}
					}
					detailKeys := make(map[string]struct{})
					for _, p := range facet.DetailPanels {
						for _, f := range p.Fields {
							if f.Key != "" {
								detailKeys[f.Key] = struct{}{}
							}
						}
					}
					for k := range colKeys {
						if _, ok := detailKeys[k]; !ok {
							t.Errorf("column key missing from details: %s", k)
						}
					}
					// No reverse requirement; details may include extra fields
				})
			}
		})
	}
}
