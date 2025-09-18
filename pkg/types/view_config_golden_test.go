package types_test

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
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

type goldenProvider struct {
	name string
	get  func() (*appTypes.ViewConfig, error)
}

func goldenProviders() []goldenProvider {
	return []goldenProvider{
		{name: "abis", get: func() (*appTypes.ViewConfig, error) { return (&abis.AbisCollection{}).GetConfig() }},
		{name: "names", get: func() (*appTypes.ViewConfig, error) { return (&names.NamesCollection{}).GetConfig() }},
		{name: "monitors", get: func() (*appTypes.ViewConfig, error) { return (&monitors.MonitorsCollection{}).GetConfig() }},
		{name: "chunks", get: func() (*appTypes.ViewConfig, error) { return (&chunks.ChunksCollection{}).GetConfig() }},
		{name: "status", get: func() (*appTypes.ViewConfig, error) { return (&status.StatusCollection{}).GetConfig() }},
		{name: "contracts", get: func() (*appTypes.ViewConfig, error) { return (&contracts.ContractsCollection{}).GetConfig() }},
		{name: "exports", get: func() (*appTypes.ViewConfig, error) { return (&exports.ExportsCollection{}).GetConfig() }},
	}
}

// TestWriteViewConfigGoldenCSV writes (or validates) a flat CSV per view containing
// the unenhanced Columns and DetailPanels data. If the golden file does not exist,
// it will be created. If it exists, any difference will fail the test.
func TestWriteViewConfigGoldenCSV(t *testing.T) {
	if err := os.MkdirAll(filepath.Join("testdata"), 0o755); err != nil {
		t.Fatalf("failed to create testdata directory: %v", err)
	}

	for _, p := range goldenProviders() {
		t.Run(p.name, func(t *testing.T) {
			vc, err := p.get()
			if err != nil {
				t.Fatalf("GetConfig failed: %v", err)
			}

			var buf bytes.Buffer
			w := csv.NewWriter(&buf)

			// Columns section header (order first, then label, then rest)
			_ = w.Write([]string{"section", "facet", "order", "label", "isForm", "key", "width", "sortable", "filterable", "formatter"})

			facetKeys := orderedFacetKeys(vc)
			for _, facetKey := range facetKeys {
				facet := vc.Facets[facetKey]
				cols := make([]appTypes.ColumnConfig, len(facet.Columns))
				copy(cols, facet.Columns)
				sort.SliceStable(cols, func(i, j int) bool {
					if cols[i].Order == cols[j].Order {
						return cols[i].Key < cols[j].Key
					}
					return cols[i].Order < cols[j].Order
				})
				for _, c := range cols {
					_ = w.Write([]string{
						"columns",
						facetKey,
						fmt.Sprintf("%d", c.Order),
						c.Header,
						fmt.Sprintf("%v", facet.IsForm),
						c.Key,
						fmt.Sprintf("%d", c.Width),
						fmt.Sprintf("%v", c.Sortable),
						fmt.Sprintf("%v", c.Filterable),
						c.Formatter,
					})
				}
			}

			// Spacer row between sections for readability (empty values)
			_ = w.Write([]string{})

			// Details section header (label first, then detailOrder, then rest)
			_ = w.Write([]string{"section", "facet", "panel", "detailOrder", "label", "isForm", "key", "formatter"})

			for _, facetKey := range facetKeys {
				facet := vc.Facets[facetKey]
				for _, panel := range facet.DetailPanels {
					fields := make([]appTypes.DetailFieldConfig, len(panel.Fields))
					copy(fields, panel.Fields)
					sort.SliceStable(fields, func(i, j int) bool {
						if fields[i].DetailOrder == fields[j].DetailOrder {
							return fields[i].Key < fields[j].Key
						}
						return fields[i].DetailOrder < fields[j].DetailOrder
					})
					for _, f := range fields {
						_ = w.Write([]string{
							"details",
							facetKey,
							panel.Title,
							fmt.Sprintf("%d", f.DetailOrder),
							f.Label,
							fmt.Sprintf("%v", facet.IsForm),
							f.Key,
							f.Formatter,
						})
					}
				}
			}

			w.Flush()
			if err := w.Error(); err != nil {
				t.Fatalf("csv writer error: %v", err)
			}

			goldenPath := filepath.Join("testdata", fmt.Sprintf("%s.csv", vc.ViewName))
			data := buf.Bytes()
			if _, err := os.Stat(goldenPath); os.IsNotExist(err) {
				if err := os.WriteFile(goldenPath, data, 0o644); err != nil {
					t.Fatalf("failed to write golden file %s: %v", goldenPath, err)
				}
				return
			}

			existing, err := os.ReadFile(goldenPath)
			if err != nil {
				t.Fatalf("failed to read golden file %s: %v", goldenPath, err)
			}
			if os.Getenv("GOLDEN_UPDATE") == "1" {
				if err := os.WriteFile(goldenPath, data, 0o644); err != nil {
					t.Fatalf("failed to update golden file %s: %v", goldenPath, err)
				}
				return
			}
			if !bytes.Equal(existing, data) {
				// Provide a brief diff hint without full diff to keep logs tight
				existingLines := len(strings.Split(string(existing), "\n"))
				newLines := len(strings.Split(string(data), "\n"))
				t.Fatalf("golden mismatch for %s: existing %d lines vs new %d lines. Update the golden file if change is intended.", goldenPath, existingLines, newLines)
			}
		})
	}
}

func orderedFacetKeys(vc *appTypes.ViewConfig) []string {
	if len(vc.FacetOrder) > 0 {
		return append([]string(nil), vc.FacetOrder...)
	}
	keys := make([]string, 0, len(vc.Facets))
	for k := range vc.Facets {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}
