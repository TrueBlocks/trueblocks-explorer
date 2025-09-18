package preferences

import (
	"encoding/json"
	"os"
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestGetUserPreferences(t *testing.T) {
	t.Run("CreatesDefaultsWhenMissing", func(t *testing.T) {
		tmp := t.TempDir()
		defer SetConfigBaseForTest(t, tmp)()

		userPrefs, err := GetUserPreferences()
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}
		if len(userPrefs.Chains) != 0 {
			t.Errorf("Expected empty chains array, got %d chains", len(userPrefs.Chains))
		}
	})

	t.Run("LoadsExistingPreferences", func(t *testing.T) {
		tmp := t.TempDir()
		defer SetConfigBaseForTest(t, tmp)()

		path := getUserPrefsPath()
		expected := UserPreferences{
			Version: "1.0",
			Chains: []Chain{
				{
					Chain:          "mainnet",
					ChainId:        1,
					RemoteExplorer: "https://etherscan.io",
					RpcProviders:   []string{"https://example.com/rpc"},
					Symbol:         "ETH",
				},
			},
		}

		data, _ := json.MarshalIndent(expected, "", "  ")
		if err := os.WriteFile(path, data, 0644); err != nil {
			t.Fatalf("Failed to write test file: %v", err)
		}

		userPrefs, err := GetUserPreferences()
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if diff := cmp.Diff(expected, userPrefs); diff != "" {
			t.Errorf("UserPreferences mismatch (-expected +got):\n%s", diff)
		}
	})
}
