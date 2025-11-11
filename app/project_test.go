package app

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/manager"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNewProject(t *testing.T) {
	tests := []struct {
		name           string
		projectName    string
		currentAddress string
		setup          func(*App)
		expectErr      bool
		errMsg         string
	}{
		{
			name:           "create project with no address",
			projectName:    "test-project",
			currentAddress: "",
			setup: func(app *App) {
				// No additional setup needed
			},
			expectErr: false,
		},
		{
			name:           "create project with valid address",
			projectName:    "test-project",
			currentAddress: "0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8",
			setup: func(app *App) {
				app.ensMap = make(map[string]base.Address)
			},
			expectErr: false,
		},
		{
			name:           "create project with invalid address",
			projectName:    "test-project",
			currentAddress: "invalid-address",
			setup: func(app *App) {
				app.ensMap = make(map[string]base.Address)
			},
			expectErr: true,
			errMsg:    "invalid address",
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
			tt.setup(app)

			err := app.NewProject(tt.projectName, tt.currentAddress)

			if tt.expectErr {
				require.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
			} else {
				require.NoError(t, err)
				// Verify project was created
				assert.True(t, app.HasActiveProject())
			}
		})
	}
}

// func TestOpenProjectFile(t *testing.T) {
// 	tests := []struct {
// 		name      string
// 		path      string
// 		setup     func(*App)
// 		expectErr bool
// 		errMsg    string
// 	}{
// 		{
// 			name: "open with empty path triggers file picker",
// 			path: "",
// 			setup: func(app *App) {
// 				// Empty path should trigger file picker, but will fail in tests
// 			},
// 			expectErr: true,
// 			errMsg:    "no file selected",
// 		},
// 		{
// 			name: "open nonexistent file",
// 			path: "/tmp/nonexistent.tbx",
// 			setup: func(app *App) {
// 				// No additional setup needed
// 			},
// 			expectErr: true,
// 		},
// 	}

// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			app := &App{
// 				Projects: manager.NewManager[*project.Project]("project"),
// 				Preferences: &preferences.Preferences{
// 					User: preferences.UserPreferences{},
// 				},
// 			}
// 			tt.setup(app)

// 			err := app.OpenProjectFile(tt.path)

// 			if tt.expectErr {
// 				require.Error(t, err)
// 				if tt.errMsg != "" {
// 					assert.Contains(t, err.Error(), tt.errMsg)
// 				}
// 			} else {
// 				require.NoError(t, err)
// 			}
// 		})
// 	}
// }

// func TestSaveProject(t *testing.T) {
// 	tests := []struct {
// 		name      string
// 		setup     func(*App)
// 		expectErr bool
// 		errMsg    string
// 	}{
// 		{
// 			name: "save with no active project",
// 			setup: func(app *App) {
// 				// No active project
// 			},
// 			expectErr: true,
// 			errMsg:    "no active project",
// 		},
// 		{
// 			name: "save project without path triggers save dialog",
// 			setup: func(app *App) {
// 				// Create a project but don't set path
// 				proj := app.Projects.Create("test", func() *project.Project { return project.NewProject("test", base.ZeroAddr, []string{"mainnet"}) })
// 				proj.Path = "" // Ensure no path is set
// 			},
// 			expectErr: true, // Will fail in test environment due to UI dialog
// 		},
// 	}

// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			app := &App{
// 				Projects: manager.NewManager[*project.Project]("project"),
// 				Preferences: &preferences.Preferences{
// 					App:  preferences.AppPreferences{},
// 					User: preferences.UserPreferences{},
// 				},
// 			}
// 			tt.setup(app)

// 			err := app.SaveProject()

// 			if tt.expectErr {
// 				require.Error(t, err)
// 				if tt.errMsg != "" {
// 					assert.Contains(t, err.Error(), tt.errMsg)
// 				}
// 			} else {
// 				require.NoError(t, err)
// 			}
// 		})
// 	}
// }

func TestGetActiveProjectPath(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected string
	}{
		{
			name: "no recent projects",
			setup: func(app *App) {
				app.Preferences.App.RecentProjects = []string{}
			},
			expected: "",
		},
		{
			name: "has recent projects",
			setup: func(app *App) {
				app.Preferences.App.RecentProjects = []string{"/path/to/project.tbx", "/other/project.tbx"}
			},
			expected: "/path/to/project.tbx",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Projects: manager.NewManager[*project.Project]("project"),
				Preferences: &preferences.Preferences{
					App: *preferences.NewAppPreferences(),
				},
			}
			tt.setup(app)

			result := app.GetActiveProjectPath()
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestHasActiveProject(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected bool
	}{
		{
			name: "no projects manager",
			setup: func(app *App) {
				app.Projects = nil
			},
			expected: false,
		},
		{
			name: "no active project ID",
			setup: func(app *App) {
				app.Projects.ActiveID = ""
			},
			expected: false,
		},
		{
			name: "has active project",
			setup: func(app *App) {
				proj := app.Projects.Create("test", func() *project.Project { return project.NewProject("test", base.ZeroAddr, []string{"mainnet"}) })
				proj.Path = "/tmp/test.tbx"
			},
			expected: true,
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
			tt.setup(app)

			result := app.HasActiveProject()
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestValidateActiveProject(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected bool
	}{
		{
			name: "no active project",
			setup: func(app *App) {
				// No active project
			},
			expected: false,
		},
		{
			name: "project with no addresses",
			setup: func(app *App) {
				proj := app.Projects.Create("test", func() *project.Project { return project.NewProject("test", base.ZeroAddr, []string{"mainnet"}) })
				proj.Path = "/tmp/test.tbx"
			},
			expected: false,
		},
		{
			name: "project with valid address",
			setup: func(app *App) {
				validAddr := base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8")
				proj := app.Projects.Create("test", func() *project.Project { return project.NewProject("test", validAddr, []string{"mainnet"}) })
				proj.Path = "/tmp/test.tbx"
			},
			expected: true,
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
			tt.setup(app)

			result := app.ValidateActiveProject()
			assert.Equal(t, tt.expected, result)
		})
	}
}

// func TestClearActiveProject(t *testing.T) {
// 	tests := []struct {
// 		name      string
// 		setup     func(*App)
// 		expectErr bool
// 		errMsg    string
// 	}{
// 		{
// 			name: "no active project",
// 			setup: func(app *App) {
// 				// No active project
// 			},
// 			expectErr: false,
// 		},
// 		{
// 			name: "clear project with unsaved changes",
// 			setup: func(app *App) {
// 				proj := app.Projects.Create("test", func() *project.Project { return project.NewProject("test", base.ZeroAddr, []string{"mainnet"}) })
// 				proj.Path = "/tmp/test.tbx"
// 			},
// 			expectErr: false, // Will succeed
// 		},
// 	}

// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			app := &App{
// 				Projects: manager.NewManager[*project.Project]("project"),
// 				Preferences: &preferences.Preferences{
// 					User: preferences.UserPreferences{},
// 				},
// 			}
// 			tt.setup(app)

// 			err := app.ClearActiveProject()

// 			if tt.expectErr {
// 				require.Error(t, err)
// 				if tt.errMsg != "" {
// 					assert.Contains(t, err.Error(), tt.errMsg)
// 				}
// 			} else {
// 				require.NoError(t, err)
// 			}
// 		})
// 	}
// }

func TestGetOpenProjects(t *testing.T) {
	tests := []struct {
		name           string
		setup          func(*App)
		expectedLength int
	}{
		{
			name: "no open projects",
			setup: func(app *App) {
				// No projects created
			},
			expectedLength: 0,
		},
		{
			name: "multiple open projects",
			setup: func(app *App) {
				app.Projects.Create("project1", func() *project.Project { return project.NewProject("project1", base.ZeroAddr, []string{"mainnet"}) })
				app.Projects.Create("project2", func() *project.Project {
					return project.NewProject("project2", base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8"), []string{"mainnet"})
				})
			},
			expectedLength: 2,
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
			tt.setup(app)

			result := app.GetOpenProjects()
			assert.Len(t, result, tt.expectedLength)

			// Verify structure of returned projects
			for _, proj := range result {
				assert.Contains(t, proj, "id")
				assert.Contains(t, proj, "name")
				assert.Contains(t, proj, "path")
				assert.Contains(t, proj, "isActive")
			}
		})
	}
}

func TestSwitchToProject(t *testing.T) {
	tests := []struct {
		name      string
		projectID string
		setup     func(*App) string
		expectErr bool
		errMsg    string
	}{
		{
			name:      "switch to nonexistent project",
			projectID: "nonexistent-id",
			setup: func(app *App) string {
				return "nonexistent-id"
			},
			expectErr: true,
			errMsg:    "no project with ID",
		},
		{
			name: "switch to existing project",
			setup: func(app *App) string {
				proj := app.Projects.Create("test", func() *project.Project { return project.NewProject("test", base.ZeroAddr, []string{"mainnet"}) })
				return proj.Name
			},
			expectErr: false,
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
			projectID := tt.setup(app)
			if tt.projectID != "" {
				projectID = tt.projectID
			}

			err := app.SwitchToProject(projectID)

			if tt.expectErr {
				require.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
			} else {
				require.NoError(t, err)
			}
		})
	}
}

// func TestCloseProject(t *testing.T) {
// 	tests := []struct {
// 		name      string
// 		projectID string
// 		setup     func(*App) string
// 		expectErr bool
// 		errMsg    string
// 	}{
// 		{
// 			name:      "close nonexistent project",
// 			projectID: "nonexistent-id",
// 			setup: func(app *App) string {
// 				return "nonexistent-id"
// 			},
// 			expectErr: true,
// 			errMsg:    "no project with ID",
// 		},
// 		{
// 			name: "close existing project",
// 			setup: func(app *App) string {
// 				proj := app.Projects.Create("test", func() *project.Project { return project.NewProject("test", base.ZeroAddr, []string{"mainnet"}) })
// 				return proj.Name
// 			},
// 			expectErr: false,
// 		},
// 	}

// 	for _, tt := range tests {
// 		t.Run(tt.name, func(t *testing.T) {
// 			app := &App{
// 				Projects: manager.NewManager[*project.Project]("project"),
// 				Preferences: &preferences.Preferences{
// 					User: preferences.UserPreferences{},
// 				},
// 			}
// 			projectID := tt.setup(app)
// 			if tt.projectID != "" {
// 				projectID = tt.projectID
// 			}

// 			err := app.CloseProject(projectID)

// 			if tt.expectErr {
// 				require.Error(t, err)
// 				if tt.errMsg != "" {
// 					assert.Contains(t, err.Error(), tt.errMsg)
// 				}
// 			} else {
// 				require.NoError(t, err)
// 			}
// 		})
// 	}
// }

func TestGetProjectAddress(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected base.Address
	}{
		{
			name: "no active project",
			setup: func(app *App) {
				// No active project
			},
			expected: base.ZeroAddr,
		},
		{
			name: "project with address",
			setup: func(app *App) {
				addr := base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8")
				app.Projects.Create("test", func() *project.Project { return project.NewProject("test", addr, []string{"mainnet"}) })
			},
			expected: base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8"),
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
			tt.setup(app)

			result := app.GetProjectAddress()
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestSetProjectAddress(t *testing.T) {
	tests := []struct {
		name    string
		address base.Address
		setup   func(*App)
	}{
		{
			name:    "set address with no active project",
			address: base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8"),
			setup: func(app *App) {
				// No active project
			},
		},
		{
			name:    "set address with active project",
			address: base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8"),
			setup: func(app *App) {
				app.Projects.Create("test", func() *project.Project { return project.NewProject("test", base.ZeroAddr, []string{"mainnet"}) })
			},
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
			tt.setup(app)

			// Should not panic
			app.SetProjectAddress(tt.address)

			// If there's an active project, verify address was set
			if app.HasActiveProject() {
				assert.Equal(t, tt.address, app.GetProjectAddress())
			}
		})
	}
}

func TestGetFilename(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected bool // whether result should be nil
	}{
		{
			name: "no active project",
			setup: func(app *App) {
				// No active project
			},
			expected: true, // should be nil
		},
		{
			name: "has active project",
			setup: func(app *App) {
				app.Projects.Create("test", func() *project.Project { return project.NewProject("test", base.ZeroAddr, []string{"mainnet"}) })
			},
			expected: false, // should not be nil
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
			tt.setup(app)

			result := app.GetFilename()
			if tt.expected {
				assert.Nil(t, result)
			} else {
				assert.NotNil(t, result)
			}
		})
	}
}

func TestUniqueProjectName(t *testing.T) {
	tests := []struct {
		name     string
		baseName string
		setup    func(*App)
		expected string
	}{
		{
			name:     "unique name with no existing projects",
			baseName: "test-project",
			setup: func(app *App) {
				// No existing projects
			},
			expected: "test-project",
		},
		{
			name:     "name collision requires numbering",
			baseName: "test-project",
			setup: func(app *App) {
				// Create a project with the same name
				proj := app.Projects.Create("test-project", func() *project.Project { return project.NewProject("test-project", base.ZeroAddr, []string{"mainnet"}) })
				proj.Name = "test-project"
			},
			expected: "test-project 1",
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
			tt.setup(app)

			result := app.uniqueProjectName(tt.baseName)
			assert.Equal(t, tt.expected, result)
		})
	}
}

// TestMultipleAddressInput tests the fix for GitHub issue #2
func TestMultipleAddressInput(t *testing.T) {
	tests := []struct {
		name      string
		input     string
		setup     func(*App)
		expectErr bool
		errMsg    string
	}{
		{
			name:  "multiple addresses with spaces",
			input: "trueblocks.eth meriam.eth rotki.eth",
			setup: func(app *App) {
				app.ensMap = map[string]base.Address{
					"trueblocks.eth": base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8"),
					"meriam.eth":     base.HexToAddress("0x1234567890abcdef1234567890abcdef12345678"),
					"rotki.eth":      base.HexToAddress("0xabcdef1234567890abcdef1234567890abcdef12"),
				}
			},
			expectErr: false,
		},
		{
			name:  "multiple addresses with trailing whitespace",
			input: "trueblocks.eth  meriam.eth   rotki.eth ",
			setup: func(app *App) {
				app.ensMap = map[string]base.Address{
					"trueblocks.eth": base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8"),
					"meriam.eth":     base.HexToAddress("0x1234567890abcdef1234567890abcdef12345678"),
					"rotki.eth":      base.HexToAddress("0xabcdef1234567890abcdef1234567890abcdef12"),
				}
			},
			expectErr: false,
		},
		{
			name:  "multiple addresses separated by commas and newlines",
			input: "trueblocks.eth,meriam.eth\nrotki.eth",
			setup: func(app *App) {
				app.ensMap = map[string]base.Address{
					"trueblocks.eth": base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8"),
					"meriam.eth":     base.HexToAddress("0x1234567890abcdef1234567890abcdef12345678"),
					"rotki.eth":      base.HexToAddress("0xabcdef1234567890abcdef1234567890abcdef12"),
				}
			},
			expectErr: false,
		},
		{
			name:  "empty string after trimming should be skipped",
			input: "trueblocks.eth   meriam.eth",
			setup: func(app *App) {
				app.ensMap = map[string]base.Address{
					"trueblocks.eth": base.HexToAddress("0x742d35Cc6634C0532925a3b8D25D19Dcf9d0c7c8"),
					"meriam.eth":     base.HexToAddress("0x1234567890abcdef1234567890abcdef12345678"),
				}
			},
			expectErr: false,
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
			tt.setup(app)

			// Create a project first
			err := app.NewProject("test-project", tt.input)

			if tt.expectErr {
				require.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
			} else {
				require.NoError(t, err)
				// Verify project was created with addresses
				assert.True(t, app.HasActiveProject())
				proj := app.GetActiveProject()
				assert.NotNil(t, proj)

				// Check that addresses were added (at least one should be present)
				addresses := proj.GetAddresses()
				assert.Greater(t, len(addresses), 0, "Should have at least one address")
			}
		})
	}
}
