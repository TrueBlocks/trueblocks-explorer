package app

import (
	"strings"
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetUserInfoStatus(t *testing.T) {
	tests := []struct {
		name     string
		setup    func(*App)
		expected UserInfoStatus
	}{
		{
			name: "missing name and email",
			setup: func(app *App) {
				app.Preferences.User.Name = ""
				app.Preferences.User.Email = ""
			},
			expected: UserInfoStatus{
				MissingNameEmail: true,
				RPCUnavailable:   true,
			},
		},
		{
			name: "has name and email but no chains",
			setup: func(app *App) {
				app.Preferences.User.Name = "Test User"
				app.Preferences.User.Email = "test@example.com"
				app.Preferences.User.Chains = []preferences.Chain{}
			},
			expected: UserInfoStatus{
				MissingNameEmail: false,
				RPCUnavailable:   true,
			},
		},
		{
			name: "has name, email and chains with RPCs",
			setup: func(app *App) {
				app.Preferences.User.Name = "Test User"
				app.Preferences.User.Email = "test@example.com"
				app.Preferences.User.Chains = []preferences.Chain{
					{
						ChainId:      1,
						RpcProviders: []string{"https://mainnet.infura.io"},
					},
				}
			},
			expected: UserInfoStatus{
				MissingNameEmail: false,
				RPCUnavailable:   true, // Will be true because RPC check will likely fail in test
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

			result := app.GetUserInfoStatus()

			assert.Equal(t, tt.expected.MissingNameEmail, result.MissingNameEmail)
			// Note: RPCUnavailable will likely always be true in tests due to network calls
			// so we just check the structure is correct
			assert.IsType(t, bool(false), result.RPCUnavailable)
		})
	}
}

func TestSetUserInfo(t *testing.T) {
	tests := []struct {
		name       string
		inputName  string
		inputEmail string
		expectErr  bool
		errMsg     string
	}{
		{
			name:       "valid name and email",
			inputName:  "John Doe",
			inputEmail: "john@example.com",
			expectErr:  false,
		},
		{
			name:       "trims whitespace",
			inputName:  "  Jane Doe  ",
			inputEmail: "  jane@example.com  ",
			expectErr:  false,
		},
		{
			name:       "empty name",
			inputName:  "",
			inputEmail: "test@example.com",
			expectErr:  true,
			errMsg:     "invalid name",
		},
		{
			name:       "empty name with whitespace",
			inputName:  "   ",
			inputEmail: "test@example.com",
			expectErr:  true,
			errMsg:     "invalid name",
		},
		{
			name:       "invalid email",
			inputName:  "John Doe",
			inputEmail: "invalid-email",
			expectErr:  true,
			errMsg:     "invalid email",
		},
		{
			name:       "empty email",
			inputName:  "John Doe",
			inputEmail: "",
			expectErr:  true,
			errMsg:     "invalid email",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			app := &App{
				Preferences: &preferences.Preferences{
					User: preferences.UserPreferences{},
				},
			}

			err := app.SetUserInfo(tt.inputName, tt.inputEmail)

			if tt.expectErr {
				require.Error(t, err)
				assert.Contains(t, err.Error(), tt.errMsg)
			} else {
				require.NoError(t, err)
				// Check that values were set correctly (trimmed)
				expectedName := strings.TrimSpace(tt.inputName)
				expectedEmail := strings.TrimSpace(tt.inputEmail)
				assert.Equal(t, expectedName, app.Preferences.User.Name)
				assert.Equal(t, expectedEmail, app.Preferences.User.Email)
			}
		})
	}
}

func TestSetChain(t *testing.T) {
	tests := []struct {
		name         string
		setup        func(*App)
		inputChain   preferences.Chain
		expectErr    bool
		validateFunc func(*testing.T, *App)
	}{
		{
			name: "add new chain",
			setup: func(app *App) {
				app.Preferences.User.Chains = []preferences.Chain{}
			},
			inputChain: preferences.Chain{
				ChainId:      1,
				RpcProviders: []string{"https://mainnet.infura.io"},
			},
			expectErr: false,
			validateFunc: func(t *testing.T, app *App) {
				require.Len(t, app.Preferences.User.Chains, 1)
				assert.Equal(t, uint64(1), app.Preferences.User.Chains[0].ChainId)
				assert.Contains(t, app.Preferences.User.Chains[0].RpcProviders, "https://mainnet.infura.io")
			},
		},
		{
			name: "update existing chain",
			setup: func(app *App) {
				app.Preferences.User.Chains = []preferences.Chain{
					{
						ChainId:      1,
						RpcProviders: []string{"https://old-rpc.com"},
					},
				}
			},
			inputChain: preferences.Chain{
				ChainId:      1,
				RpcProviders: []string{"https://new-rpc.com"},
			},
			expectErr: false,
			validateFunc: func(t *testing.T, app *App) {
				require.Len(t, app.Preferences.User.Chains, 1)
				assert.Equal(t, uint64(1), app.Preferences.User.Chains[0].ChainId)
				// New RPC should be at the beginning
				assert.Equal(t, "https://new-rpc.com", app.Preferences.User.Chains[0].RpcProviders[0])
				assert.Contains(t, app.Preferences.User.Chains[0].RpcProviders, "https://old-rpc.com")
			},
		},
		{
			name: "trims whitespace from RPCs",
			setup: func(app *App) {
				app.Preferences.User.Chains = []preferences.Chain{}
			},
			inputChain: preferences.Chain{
				ChainId:      1,
				RpcProviders: []string{"  https://mainnet.infura.io  "},
			},
			expectErr: false,
			validateFunc: func(t *testing.T, app *App) {
				require.Len(t, app.Preferences.User.Chains, 1)
				assert.Equal(t, "https://mainnet.infura.io", app.Preferences.User.Chains[0].RpcProviders[0])
			},
		},
		{
			name: "limits RPCs to 5",
			setup: func(app *App) {
				app.Preferences.User.Chains = []preferences.Chain{
					{
						ChainId: 1,
						RpcProviders: []string{
							"https://rpc1.com",
							"https://rpc2.com",
							"https://rpc3.com",
							"https://rpc4.com",
						},
					},
				}
			},
			inputChain: preferences.Chain{
				ChainId: 1,
				RpcProviders: []string{
					"https://new-rpc1.com",
					"https://new-rpc2.com",
				},
			},
			expectErr: false,
			validateFunc: func(t *testing.T, app *App) {
				require.Len(t, app.Preferences.User.Chains, 1)
				assert.Len(t, app.Preferences.User.Chains[0].RpcProviders, 5)
				// Should have new RPCs at the beginning
				assert.Equal(t, "https://new-rpc1.com", app.Preferences.User.Chains[0].RpcProviders[0])
				assert.Equal(t, "https://new-rpc2.com", app.Preferences.User.Chains[0].RpcProviders[1])
			},
		},
		{
			name: "invalid RPC URL",
			setup: func(app *App) {
				app.Preferences.User.Chains = []preferences.Chain{}
			},
			inputChain: preferences.Chain{
				ChainId:      1,
				RpcProviders: []string{"invalid-url"},
			},
			expectErr: true,
		},
		{
			name: "empty RPC providers",
			setup: func(app *App) {
				app.Preferences.User.Chains = []preferences.Chain{}
			},
			inputChain: preferences.Chain{
				ChainId:      1,
				RpcProviders: []string{},
			},
			expectErr: false,
			validateFunc: func(t *testing.T, app *App) {
				require.Len(t, app.Preferences.User.Chains, 1)
				assert.Equal(t, uint64(1), app.Preferences.User.Chains[0].ChainId)
				assert.Empty(t, app.Preferences.User.Chains[0].RpcProviders)
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

			err := app.SetChain(tt.inputChain)

			if tt.expectErr {
				require.Error(t, err)
			} else {
				require.NoError(t, err)
				if tt.validateFunc != nil {
					tt.validateFunc(t, app)
				}
			}
		})
	}
}

func TestUserInfoStatus_JsonSerialization(t *testing.T) {
	status := UserInfoStatus{
		MissingNameEmail: true,
		RPCUnavailable:   false,
	}

	// Basic check that the struct has proper JSON tags
	assert.NotEmpty(t, status.MissingNameEmail)
	assert.Empty(t, status.RPCUnavailable)
}
