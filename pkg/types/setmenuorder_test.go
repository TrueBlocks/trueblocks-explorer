package types

import (
	"os"
	"path/filepath"
	"testing"
)

func TestSetMenuOrder(t *testing.T) {
	// Create a temporary test config file
	tmpDir := t.TempDir()
	configContent := `{
	"viewConfig": {
		"testview": {
			"menuOrder": 5,
			"disabled": true,
			"disabledFacets": {
				"testfacet": true,
				"disabledfacet": false
			}
		}
	}
}`

	configPath := filepath.Join(tmpDir, ".create-local-app.json")
	if err := os.WriteFile(configPath, []byte(configContent), 0644); err != nil {
		t.Fatalf("Failed to create test config file: %v", err)
	}

	// Change to temp directory temporarily
	originalDir, _ := os.Getwd()
	defer func() {
		_ = os.Chdir(originalDir)
	}()
	_ = os.Chdir(tmpDir)

	tests := []struct {
		name             string
		vc               *ViewConfig
		expectedOrder    int
		expectedDisabled bool
		expectedFacets   map[string]bool // true = enabled, false = disabled
	}{
		{
			name: "configured view with facets",
			vc: &ViewConfig{
				ViewName:  "testview",
				MenuOrder: 999,
				Disabled:  false, // Initially enabled
				Facets: map[string]FacetConfig{
					"testfacet": {
						Name:     "testfacet",
						Disabled: true, // Initially disabled
					},
					"disabledfacet": {
						Name:     "disabledfacet",
						Disabled: false, // Initially enabled
					},
					"unconfiguredfacet": {
						Name:     "unconfiguredfacet",
						Disabled: false, // Should remain unchanged
					},
				},
			},
			expectedOrder:    5,
			expectedDisabled: true, // Config disabled: true
			expectedFacets: map[string]bool{
				"testfacet":         true,  // Config true -> disabled (disabled=true)
				"disabledfacet":     false, // Config false -> enabled (disabled=false)
				"unconfiguredfacet": false, // Unchanged
			},
		},
		{
			name: "unconfigured view",
			vc: &ViewConfig{
				ViewName:  "unconfiguredview",
				MenuOrder: 100,
				Disabled:  true, // Initially disabled
			},
			expectedOrder:    999,
			expectedDisabled: true, // Should remain unchanged when not configured
			expectedFacets:   nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Make a copy of the original vc for comparison
			var originalFacets map[string]bool
			if tt.vc != nil && tt.vc.Facets != nil {
				originalFacets = make(map[string]bool)
				for name, config := range tt.vc.Facets {
					originalFacets[name] = config.Disabled
				}
			}

			SetMenuOrder(tt.vc)

			if tt.vc.MenuOrder != tt.expectedOrder {
				t.Errorf("Expected MenuOrder %d, got %d", tt.expectedOrder, tt.vc.MenuOrder)
			}

			if tt.vc.Disabled != tt.expectedDisabled {
				t.Errorf("Expected Disabled %v, got %v", tt.expectedDisabled, tt.vc.Disabled)
			}

			if tt.expectedFacets != nil && tt.vc.Facets != nil {
				for facetName, expectedDisabled := range tt.expectedFacets {
					if facet, exists := tt.vc.Facets[facetName]; exists {
						if facet.Disabled != expectedDisabled {
							t.Errorf("Facet %s: expected Disabled=%v, got Disabled=%v", facetName, expectedDisabled, facet.Disabled)
						}
					} else {
						t.Errorf("Expected facet %s not found", facetName)
					}
				}
			}
		})
	}
}

func TestSetMenuOrderNoConfig(t *testing.T) {
	// Test with no config file present
	tmpDir := t.TempDir()
	originalDir, _ := os.Getwd()
	defer func() {
		_ = os.Chdir(originalDir)
	}()
	_ = os.Chdir(tmpDir)

	vc := &ViewConfig{
		ViewName:  "testview",
		MenuOrder: 100,
	}

	SetMenuOrder(vc)

	if vc.MenuOrder != 999 {
		t.Errorf("Expected MenuOrder 999 when no config file, got %d", vc.MenuOrder)
	}
}
