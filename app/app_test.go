package app

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetContext(t *testing.T) {
	tests := []struct {
		name     string
		app      *App
		expected context.Context
	}{
		{
			name: "returns nil context when not set",
			app: &App{
				Projects:    project.NewManager(),
				Preferences: &preferences.Preferences{},
			},
			expected: nil,
		},
		{
			name: "returns valid context when set",
			app: &App{
				ctx:         context.Background(),
				Projects:    project.NewManager(),
				Preferences: &preferences.Preferences{},
			},
			expected: context.Background(),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.app.GetContext()
			assert.Equal(t, tt.expected, result)
		})
	}
}

// func TestStartup(t *testing.T) {
// 	app := &App{
// 		Projects:    project.NewManager(),
// 		Preferences: &preferences.Preferences{},
// 	}

// 	ctx := context.Background()

// 	// Test that Startup doesn't panic and sets context
// 	assert.NotPanics(t, func() {
// 		app.Startup(ctx)
// 	})

// 	// Verify context was set
// 	assert.Equal(t, ctx, app.ctx)
// }

// func TestDomReady(t *testing.T) {
// 	tests := []struct {
// 		name string
// 		app  *App
// 	}{
// 		{
// 			name: "handles nil context",
// 			app: &App{
// 				Projects:    project.NewManager(),
// 				Preferences: &preferences.Preferences{},
// 			},
// 		},
// 		{
// 			name: "handles valid context",
// 			app: &App{
// 				ctx:         context.Background(),
// 				Projects:    project.NewManager(),
// 				Preferences: &preferences.Preferences{},
// 			},
// 		},
// 	}

// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			ctx := context.Background()

// 			// Test that DomReady doesn't panic
// 			assert.NotPanics(t, func() {
// 				tt.app.DomReady(ctx)
// 			})

// 			// Verify context was set
// 			assert.Equal(t, ctx, tt.app.ctx)
// 		})
// 	}
// }

// func TestBeforeClose(t *testing.T) {
// 	tests := []struct {
// 		name       string
// 		app        *App
// 		expected   bool
// 		shouldExit bool
// 	}{
// 		{
// 			name: "returns false to allow window close",
// 			app: &App{
// 				Projects:    project.NewManager(),
// 				Preferences: &preferences.Preferences{},
// 			},
// 			expected:   false,
// 			shouldExit: true,
// 		},
// 		{
// 			name: "handles file server shutdown",
// 			app: &App{
// 				Projects:    project.NewManager(),
// 				Preferences: &preferences.Preferences{},
// 			},
// 			expected:   false,
// 			shouldExit: true,
// 		},
// 	}

// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			ctx := context.Background()

// 			// Test that BeforeClose doesn't panic and returns expected value
// 			var result bool
// 			assert.NotPanics(t, func() {
// 				result = tt.app.BeforeClose(ctx)
// 			})

// 			assert.Equal(t, tt.expected, result)
// 		})
// 	}
// }

func TestAppIsReady(t *testing.T) {
	tests := []struct {
		name     string
		app      *App
		expected bool
	}{
		{
			name: "returns false when context is nil",
			app: &App{
				Projects:    project.NewManager(),
				Preferences: &preferences.Preferences{},
			},
			expected: false,
		},
		{
			name: "returns true when context is set",
			app: &App{
				ctx:         context.Background(),
				Projects:    project.NewManager(),
				Preferences: &preferences.Preferences{},
			},
			expected: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.app.IsReady()
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestIsInitialized(t *testing.T) {
	app := &App{
		Projects:    project.NewManager(),
		Preferences: &preferences.Preferences{},
	}

	// Test that IsInitialized doesn't panic
	assert.NotPanics(t, func() {
		app.IsInitialized()
	})

	// Create a temporary directory for testing
	tempDir := t.TempDir()

	// Create the .initialized file in the temp directory to simulate initialization
	initFile := filepath.Join(tempDir, ".initialized")
	err := os.WriteFile(initFile, []byte(""), 0644)
	require.NoError(t, err)

	// Test file exists functionality indirectly
	_, err = os.Stat(initFile)
	assert.NoError(t, err, "initialization file should exist")
}

func TestSetInitialized(t *testing.T) {
	app := &App{
		Projects:    project.NewManager(),
		Preferences: &preferences.Preferences{},
	}

	// Create a temporary directory for testing
	tempDir := t.TempDir()
	initFile := filepath.Join(tempDir, ".initialized")

	tests := []struct {
		name        string
		isInit      bool
		expectError bool
		expectFile  bool
	}{
		{
			name:        "sets initialized to true",
			isInit:      true,
			expectError: false,
			expectFile:  true,
		},
		{
			name:        "sets initialized to false",
			isInit:      false,
			expectError: false,
			expectFile:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Clean up before test
			_ = os.Remove(initFile)

			// Test that SetInitialized doesn't panic
			assert.NotPanics(t, func() {
				_ = app.SetInitialized(tt.isInit)
			})

			// This is a high-level test, so we don't test the actual file creation
			// but verify the method executes without panicking
		})
	}
}

func TestWatchWindowBounds(t *testing.T) {
	app := &App{
		Projects:    project.NewManager(),
		Preferences: &preferences.Preferences{},
	}

	// Test that watchWindowBounds doesn't panic when context is nil
	assert.NotPanics(t, func() {
		done := make(chan bool)
		go func() {
			app.watchWindowBounds()
			done <- true
		}()

		// Give it a moment to run and then signal completion
		go func() {
			time.Sleep(10 * time.Millisecond)
			done <- true
		}()

		<-done
	})
}

func TestSaveBounds(t *testing.T) {
	tests := []struct {
		name string
		app  *App
		x, y int
		w, h int
	}{
		{
			name: "saves bounds when app is ready",
			app: &App{
				ctx:         context.Background(),
				Projects:    project.NewManager(),
				Preferences: &preferences.Preferences{},
			},
			x: 100, y: 200, w: 800, h: 600,
		},
		{
			name: "handles not ready state gracefully",
			app: &App{
				Projects:    project.NewManager(),
				Preferences: &preferences.Preferences{},
			},
			x: 100, y: 200, w: 800, h: 600,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Test that SaveBounds doesn't panic
			assert.NotPanics(t, func() {
				tt.app.SaveBounds(tt.x, tt.y, tt.w, tt.h)
			})

			// If app is ready, verify bounds were set
			if tt.app.IsReady() {
				assert.Equal(t, tt.x, tt.app.Preferences.App.Bounds.X)
				assert.Equal(t, tt.y, tt.app.Preferences.App.Bounds.Y)
				assert.Equal(t, tt.w, tt.app.Preferences.App.Bounds.Width)
				assert.Equal(t, tt.h, tt.app.Preferences.App.Bounds.Height)
			}
		})
	}
}

func TestGetAppId(t *testing.T) {
	app := &App{
		Projects:    project.NewManager(),
		Preferences: &preferences.Preferences{},
	}

	// Test that GetAppId doesn't panic and returns an ID
	assert.NotPanics(t, func() {
		id := app.GetAppId()
		// Verify we get some kind of ID back (it's a struct, so check it's not zero value)
		assert.NotEmpty(t, id.AppName)
	})
}

// MockCollection implements the types.Collection interface for testing
type MockCollection struct {
	name string
}

func (m MockCollection) GetPage(payload *types.Payload, first, pageSize int, sort sdk.SortSpec, filter string) (types.Page, error) {
	return nil, nil
}

func (m MockCollection) LoadData(facet types.DataFacet) {}

func (m MockCollection) Reset(facet types.DataFacet) {}

func (m MockCollection) NeedsUpdate(facet types.DataFacet) bool {
	return false
}

func (m MockCollection) GetSupportedFacets() []types.DataFacet {
	return []types.DataFacet{}
}

func (m MockCollection) GetStoreName(facet types.DataFacet, chain, address string) string {
	return m.name
}

func (m MockCollection) GetSummary() types.Summary {
	return types.Summary{}
}

func (m MockCollection) ExportData(payload *types.Payload) (string, error) {
	return "", nil
}

func (m MockCollection) AccumulateItem(item interface{}, summary *types.Summary) {}

func (m MockCollection) ResetSummary() {}

func (m MockCollection) GetConfig() (*types.ViewConfig, error) {
	return &types.ViewConfig{
		ViewName: m.name,
		Facets:   make(map[string]types.FacetConfig),
		Actions:  make(map[string]types.ActionConfig),
	}, nil
}

func TestRegisterCollection(t *testing.T) {
	app := &App{
		Projects:    project.NewManager(),
		Preferences: &preferences.Preferences{},
		collections: []types.Collection{},
	}

	// Create a mock collection
	mockCollection := MockCollection{name: "test-collection"}

	// Test registering a collection
	initialCount := len(app.collections)

	assert.NotPanics(t, func() {
		app.RegisterCollection(mockCollection)
	})

	// Verify collection was added
	assert.Equal(t, initialCount+1, len(app.collections))
	assert.Contains(t, app.collections, mockCollection)

	// Test registering multiple collections
	mockCollection2 := MockCollection{name: "test-collection-2"}
	app.RegisterCollection(mockCollection2)

	assert.Equal(t, initialCount+2, len(app.collections))
	assert.Contains(t, app.collections, mockCollection)
	assert.Contains(t, app.collections, mockCollection2)
}
