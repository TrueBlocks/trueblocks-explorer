package app

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetLastView(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected string
	}{
		{
			name: "no active project",
			setup: func(app *App) {
				// No active project
			},
			expected: "",
		},
		{
			name: "has active project with last view",
			setup: func(app *App) {
				proj := app.Projects.NewProject("test", base.ZeroAddr, []string{"mainnet"})
				proj.Path = "/tmp/test.tbx" // Set path so project can save
				_ = proj.SetLastView("/monitors")
			},
			expected: "monitors",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: project.NewManager(),
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}
			tt.setup(app)

			result := app.GetLastView()
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestSetLastView(t *testing.T) {
	tests := []struct {
		name      string
		setup     func(*App)
		view      string
		expectErr bool
	}{
		{
			name: "no active project",
			setup: func(app *App) {
				// No active project
			},
			view:      "/monitors",
			expectErr: true,
		},
		{
			name: "has active project",
			setup: func(app *App) {
				proj := app.Projects.NewProject("test", base.ZeroAddr, []string{"mainnet"})
				proj.Path = "/tmp/test.tbx" // Set path so project can save
			},
			view:      "/names",
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: project.NewManager(),
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}
			tt.setup(app)

			_, err := app.SetLastView(tt.view)

			if tt.expectErr {
				require.Error(t, err)
				assert.Contains(t, err.Error(), "no active project")
			} else {
				require.NoError(t, err)
				assert.Equal(t, "names", app.GetLastView())
			}
		})
	}
}

func TestLastFacet(t *testing.T) {
	tests := []struct {
		name      string
		setup     func(*App)
		view      string
		facet     string
		expectErr bool
	}{
		{
			name: "no active project",
			setup: func(app *App) {
				// No active project
			},
			view:      "monitors",
			facet:     "list",
			expectErr: true,
		},
		{
			name: "has active project",
			setup: func(app *App) {
				proj := app.Projects.NewProject("test", base.ZeroAddr, []string{"mainnet"})
				proj.Path = "/tmp/test.tbx" // Set path so project can save
			},
			view:      "names",
			facet:     "list",
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: project.NewManager(),
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}
			tt.setup(app)

			// Test SetLastFacet
			_, err := app.SetLastFacet(tt.view, tt.facet)
			if tt.expectErr {
				require.Error(t, err)
				assert.Contains(t, err.Error(), "no active project")
				return
			}
			require.NoError(t, err)

			// Test GetLastFacet
			result := app.GetLastFacet(tt.view)
			assert.Equal(t, tt.facet, result)
		})
	}
}

func TestFilterState(t *testing.T) {
	viewStateKey := project.ViewStateKey{ViewName: "monitors", FacetName: "list"}
	filterState := project.FilterState{
		Sorting:   map[string]interface{}{"column": "name", "direction": "asc"},
		Filtering: map[string]interface{}{"search": "test search"},
		Other:     map[string]interface{}{"pageSize": 50, "page": 2},
	}

	tests := []struct {
		name      string
		setup     func(*App)
		expectErr bool
	}{
		{
			name: "no active project",
			setup: func(app *App) {
				// No active project
			},
			expectErr: true,
		},
		{
			name: "has active project",
			setup: func(app *App) {
				proj := app.Projects.NewProject("test", base.ZeroAddr, []string{"mainnet"})
				proj.Path = "/tmp/test.tbx" // Set path so project can save
			},
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: project.NewManager(),
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}
			tt.setup(app)

			// Test SetFilterState
			err := app.SetFilterState(viewStateKey, filterState)
			if tt.expectErr {
				require.Error(t, err)
				assert.Contains(t, err.Error(), "no active project")
				return
			}
			require.NoError(t, err)

			// Test GetFilterState
			retrievedState, err := app.GetFilterState(viewStateKey)
			require.NoError(t, err)
			assert.Equal(t, filterState.Sorting["column"], retrievedState.Sorting["column"])
			assert.Equal(t, filterState.Filtering["search"], retrievedState.Filtering["search"])

			// Test ClearFilterState
			err = app.ClearFilterState(viewStateKey)
			require.NoError(t, err)
		})
	}
}

func TestGetWizardReturn(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected string
	}{
		{
			name: "no wizard in path",
			setup: func(app *App) {
				proj := app.Projects.NewProject("test", base.ZeroAddr, []string{"mainnet"})
				proj.Path = "/tmp/test.tbx" // Set path so project can save
				_ = proj.SetLastView("/monitors")
			},
			expected: "monitors",
		},
		{
			name: "wizard in path",
			setup: func(app *App) {
				proj := app.Projects.NewProject("test", base.ZeroAddr, []string{"mainnet"})
				proj.Path = "/tmp/test.tbx" // Set path so project can save
				_ = proj.SetLastView("monitors/wizard")
			},
			expected: "monitors/",
		},
		{
			name: "no active project",
			setup: func(app *App) {
				// No active project
			},
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: project.NewManager(),
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}
			tt.setup(app)

			result := app.GetWizardReturn()
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestSetViewAndFacet(t *testing.T) {
	tests := []struct {
		name      string
		setup     func(*App)
		view      string
		facet     string
		expectErr bool
	}{
		{
			name: "no active project",
			setup: func(app *App) {
				// No active project
			},
			view:      "monitors",
			facet:     "transactions",
			expectErr: true,
		},
		{
			name: "has active project - atomic operation",
			setup: func(app *App) {
				proj := app.Projects.NewProject("test", base.ZeroAddr, []string{"mainnet"})
				proj.Path = "/tmp/test-atomic.tbx" // Set path so project can save
			},
			view:      "exports",
			facet:     "receipts",
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: project.NewManager(),
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}
			tt.setup(app)

			// Test atomic SetViewAndFacet
			_, err := app.SetViewAndFacet(tt.view, tt.facet)
			if tt.expectErr {
				require.Error(t, err)
				assert.Contains(t, err.Error(), "no active project")
				return
			}
			require.NoError(t, err)

			// Verify both view and facet were set atomically
			actualView := app.GetLastView()
			actualFacet := app.GetLastFacet(tt.view)

			assert.Equal(t, tt.facet, actualFacet, "Facet should be set correctly")
			assert.Equal(t, "exports", actualView, "View should be set correctly") // tt.view is trimmed in implementation
		})
	}
}
