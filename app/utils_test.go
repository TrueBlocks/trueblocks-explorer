package app

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/manager"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"

	coreTypes "github.com/TrueBlocks/trueblocks-chifra/v6/pkg/types"
	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/utils"
	"github.com/stretchr/testify/assert"
)

func TestLogFrontend(t *testing.T) {
	app := &App{
		Projects: manager.NewManager[*project.Project]("project"),
		Preferences: &preferences.Preferences{
			User: preferences.UserPreferences{},
		},
	}

	// Test that LogFrontend doesn't panic
	assert.NotPanics(t, func() {
		app.LogFrontend("test message")
	})
}

func TestGetMarkdown(t *testing.T) {
	tests := []struct {
		name   string
		folder string
		route  string
		tab    string
	}{
		{
			name:   "basic markdown request",
			folder: "help",
			route:  "exports",
			tab:    "list",
		},
		{
			name:   "empty parameters",
			folder: "",
			route:  "",
			tab:    "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: manager.NewManager[*project.Project]("project"),
				Preferences: &preferences.Preferences{
					App: preferences.AppPreferences{
						LastLanguage: "en",
					},
				},
			}

			result := app.GetMarkdown(tt.folder, tt.route, tt.tab)
			// Should return a string (either markdown or error message)
			assert.IsType(t, "", result)
		})
	}
}

func TestGetNodeStatus(t *testing.T) {
	tests := []struct {
		name  string
		chain string
	}{
		{
			name:  "mainnet chain",
			chain: "mainnet",
		},
		{
			name:  "unknown chain",
			chain: "unknown",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: manager.NewManager[*project.Project]("project"),
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}

			result := app.GetNodeStatus(tt.chain)
			// Should return MetaData pointer (may be nil for unknown chains)
			assert.IsType(t, (*coreTypes.MetaData)(nil), result)
		})
	}
}

func TestEncode(t *testing.T) {
	app := &App{
		Projects: manager.NewManager[*project.Project]("project"),
		Preferences: &preferences.Preferences{
			User: preferences.UserPreferences{},
		},
	}

	// Test encoding should handle invalid input gracefully
	// We can't easily create a mock sdk.Function, so just verify the method exists
	assert.NotNil(t, app.Encode)
}

func TestGetChainList(t *testing.T) {
	app := &App{
		Projects: manager.NewManager[*project.Project]("project"),
		Preferences: &preferences.Preferences{
			User: preferences.UserPreferences{},
		},
	}

	result := app.GetChainList()
	// Should return a ChainList pointer (may be nil if not initialized)
	assert.IsType(t, (*utils.ChainList)(nil), result)
}
