package app

import (
	"sync"
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetUserPreferences(t *testing.T) {
	tests := []struct {
		name  string
		setup func(*App)
	}{
		{
			name: "get user preferences",
			setup: func(app *App) {
				app.Preferences.User.Name = "testuser"
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}
			tt.setup(app)

			result := app.GetUserPreferences()
			assert.NotNil(t, result)
			assert.Equal(t, &app.Preferences.User, result)
		})
	}
}

func TestSetUserPreferences(t *testing.T) {
	tests := []struct {
		name      string
		userPrefs *preferences.UserPreferences
		expectErr bool
	}{
		{
			name: "set valid user preferences",
			userPrefs: &preferences.UserPreferences{
				Name: "newuser",
			},
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmp := t.TempDir()
			defer preferences.SetConfigBaseForTest(t, tmp)()

			app := &App{
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}

			err := app.SetUserPreferences(tt.userPrefs)

			if tt.expectErr {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
				assert.Equal(t, *tt.userPrefs, app.Preferences.User)
			}
		})
	}
}

func TestGetOrgPreferences(t *testing.T) {
	tests := []struct {
		name  string
		setup func(*App)
	}{
		{
			name: "get org preferences",
			setup: func(app *App) {
				app.Preferences.Org.Language = "en"
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Preferences: &preferences.Preferences{
					Org: preferences.OrgPreferences{},
				},
			}
			tt.setup(app)

			result := app.GetOrgPreferences()
			assert.NotNil(t, result)
			assert.Equal(t, &app.Preferences.Org, result)
		})
	}
}

func TestSetOrgPreferences(t *testing.T) {
	tests := []struct {
		name      string
		orgPrefs  *preferences.OrgPreferences
		expectErr bool
	}{
		{
			name: "set valid org preferences",
			orgPrefs: &preferences.OrgPreferences{
				Language: "es",
			},
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmp := t.TempDir()
			defer preferences.SetConfigBaseForTest(t, tmp)()

			app := &App{
				Preferences: &preferences.Preferences{
					Org: preferences.OrgPreferences{},
				},
			}

			err := app.SetOrgPreferences(tt.orgPrefs)

			if tt.expectErr {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
				assert.Equal(t, *tt.orgPrefs, app.Preferences.Org)
			}
		})
	}
}

func TestGetAppPreferences(t *testing.T) {
	tests := []struct {
		name  string
		setup func(*App)
	}{
		{
			name: "get app preferences with thread safety",
			setup: func(app *App) {
				app.Preferences.App.LastTheme = "dark"
				app.Preferences.App.DebugCollapsed = false
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}
			tt.setup(app)

			result := app.GetAppPreferences()
			assert.NotNil(t, result)
			// Should return a copy, not the same reference
			assert.NotSame(t, &app.Preferences.App, result)
			assert.Equal(t, app.Preferences.App, *result)
		})
	}
}

func TestSetAppPreferences(t *testing.T) {
	tests := []struct {
		name      string
		appPrefs  *preferences.AppPreferences
		expectErr bool
	}{
		{
			name: "set valid app preferences",
			appPrefs: &preferences.AppPreferences{
				LastTheme:       "light",
				DebugCollapsed:  true,
				LastLanguage:    "fr",
				DetailCollapsed: true,
				RecentProjects:  []string{},
				LastProjects:    []preferences.OpenProject{},
				SilencedDialogs: map[string]bool{},
				Bounds:          preferences.Bounds{X: 100, Y: 100, Width: 800, Height: 600},
			},
			expectErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmp := t.TempDir()
			defer preferences.SetConfigBaseForTest(t, tmp)()

			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}

			err := app.SetAppPreferences(tt.appPrefs)

			if tt.expectErr {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
				assert.Equal(t, *tt.appPrefs, app.Preferences.App)
			}
		})
	}
}

func TestGetLanguage(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected string
	}{
		{
			name: "get default language",
			setup: func(app *App) {
				app.Preferences.App.LastLanguage = ""
			},
			expected: "",
		},
		{
			name: "get set language",
			setup: func(app *App) {
				app.Preferences.App.LastLanguage = "de"
			},
			expected: "de",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}
			tt.setup(app)

			result := app.GetLanguage()
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestSetLanguage(t *testing.T) {
	tests := []struct {
		name     string
		language string
	}{
		{
			name:     "set english language",
			language: "en",
		},
		{
			name:     "set spanish language",
			language: "es",
		},
		{
			name:     "set empty language",
			language: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmp := t.TempDir()
			defer preferences.SetConfigBaseForTest(t, tmp)()

			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}

			app.SetLanguage(tt.language)
			assert.Equal(t, tt.language, app.Preferences.App.LastLanguage)
		})
	}
}

func TestGetTheme(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected string
	}{
		{
			name: "get default theme",
			setup: func(app *App) {
				app.Preferences.App.LastTheme = ""
			},
			expected: "",
		},
		{
			name: "get dark theme",
			setup: func(app *App) {
				app.Preferences.App.LastTheme = "dark"
			},
			expected: "dark",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}
			tt.setup(app)

			result := app.GetTheme()
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestSetTheme(t *testing.T) {
	tests := []struct {
		name  string
		theme string
	}{
		{
			name:  "set light theme",
			theme: "light",
		},
		{
			name:  "set dark theme",
			theme: "dark",
		},
		{
			name:  "set custom theme",
			theme: "custom",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmp := t.TempDir()
			defer preferences.SetConfigBaseForTest(t, tmp)()

			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}

			app.SetTheme(tt.theme)
			assert.Equal(t, tt.theme, app.Preferences.App.LastTheme)
		})
	}
}

func TestGetDebugCollapsed(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected bool
	}{
		{
			name: "debug mode disabled",
			setup: func(app *App) {
				app.Preferences.App.DebugCollapsed = true
			},
			expected: true,
		},
		{
			name: "debug mode enabled",
			setup: func(app *App) {
				app.Preferences.App.DebugCollapsed = false
			},
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}
			tt.setup(app)
			result := app.GetDebugCollapsed()
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestSetDebugCollapsed(t *testing.T) {
	tests := []struct {
		name           string
		debugCollapsed bool
	}{
		{
			name:           "enable debug mode",
			debugCollapsed: false,
		},
		{
			name:           "disable debug mode",
			debugCollapsed: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmp := t.TempDir()
			defer preferences.SetConfigBaseForTest(t, tmp)()

			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}

			app.SetDebugCollapsed(tt.debugCollapsed)
			assert.Equal(t, tt.debugCollapsed, app.Preferences.App.DebugCollapsed)
		})
	}
}

func TestSetHelpCollapsed(t *testing.T) {
	tests := []struct {
		name     string
		collapse bool
	}{
		{
			name:     "collapse help panel",
			collapse: true,
		},
		{
			name:     "expand help panel",
			collapse: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmp := t.TempDir()
			defer preferences.SetConfigBaseForTest(t, tmp)()

			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}

			app.SetHelpCollapsed(tt.collapse)
			assert.Equal(t, tt.collapse, app.Preferences.App.HelpCollapsed)
		})
	}
}

func TestSetMenuCollapsed(t *testing.T) {
	tests := []struct {
		name     string
		collapse bool
	}{
		{
			name:     "collapse menu panel",
			collapse: true,
		},
		{
			name:     "expand menu panel",
			collapse: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmp := t.TempDir()
			defer preferences.SetConfigBaseForTest(t, tmp)()

			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}

			app.SetMenuCollapsed(tt.collapse)
			assert.Equal(t, tt.collapse, app.Preferences.App.MenuCollapsed)
		})
	}
}

func TestSetChromeCollapsed(t *testing.T) {
	tests := []struct {
		name     string
		collapse bool
	}{
		{
			name:     "collapse chrome",
			collapse: true,
		},
		{
			name:     "expand chrome",
			collapse: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tmp := t.TempDir()
			defer preferences.SetConfigBaseForTest(t, tmp)()

			app := &App{
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
				prefsMu: sync.RWMutex{},
			}

			app.SetChromeCollapsed(tt.collapse)
			assert.Equal(t, tt.collapse, app.Preferences.App.ChromeCollapsed)
		})
	}
}
