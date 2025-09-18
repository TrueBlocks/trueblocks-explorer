package preferences

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
)

func TestSaveAndGetAppPreferences(t *testing.T) {
	tmp := t.TempDir()
	defer SetConfigBaseForTest(t, tmp)()

	expected := *NewAppPreferences()
	expected.Version = "1.0"
	expected.RecentProjects = []string{"file1", "file2"}

	err := SetAppPreferences(&expected)
	if err != nil {
		t.Fatalf("Failed to save preferences: %v", err)
	}

	actual, err := GetAppPreferences()
	if err != nil {
		t.Fatalf("Failed to load preferences: %v", err)
	}

	if actual.Version != expected.Version {
		t.Errorf("Expected Version %q, got %q", expected.Version, actual.Version)
	}

	if len(actual.RecentProjects) != len(expected.RecentProjects) {
		t.Fatalf("Expected %d recently used files, got %d", len(expected.RecentProjects), len(actual.RecentProjects))
	}

	for i := range expected.RecentProjects {
		if actual.RecentProjects[i] != expected.RecentProjects[i] {
			t.Errorf("Mismatch at index %d: expected %q, got %q", i, expected.RecentProjects[i], actual.RecentProjects[i])
		}
	}
}

func TestGetAppPreferences(t *testing.T) {
	t.Run("CreatesDefaultAppPreferencesIfMissing", func(t *testing.T) {
		tmp := t.TempDir()
		defer SetConfigBaseForTest(t, tmp)()

		path := filepath.Join(tmp, "app_prefs.json")
		if _, err := os.Stat(path); err == nil {
			t.Fatal("app_prefs.json should not exist yet")
		}

		appPrefs, err := GetAppPreferences()
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if appPrefs.Version != "1.0" {
			t.Errorf("Expected version '1.0', got %s", appPrefs.Version)
		}
	})

	t.Run("LoadsExistingAppPreferences", func(t *testing.T) {
		tmp := t.TempDir()
		defer SetConfigBaseForTest(t, tmp)()

		expected := *NewAppPreferences()
		expected.Version = "1.0"
		expected.RecentProjects = []string{"/tmp/one", "/tmp/two"}

		_ = file.EstablishFolder(filepath.Join(tmp, "testing"))
		path := filepath.Join(tmp, "testing", "app_prefs.json")
		data, _ := json.MarshalIndent(expected, "", "  ")
		if err := os.WriteFile(path, data, 0644); err != nil {
			t.Fatalf("Failed to write appPrefs file: %v", err)
		}

		_, err := GetAppPreferences()
		if err != nil {
			t.Fatalf("Expected no error loading existing appPrefs, got %v", err)
		}
	})
}
