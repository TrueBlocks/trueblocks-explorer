package preferences

import (
	"testing"
)

func TestGetOrgPreferences(t *testing.T) {
	t.Run("CreatesFileAndDefaults", func(t *testing.T) {
		tmp := t.TempDir()
		defer SetConfigBaseForTest(t, tmp)()

		org, err := GetOrgPreferences()
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}
		if org.Version != "1.0" {
			t.Errorf("Expected version 1.0, got %s", org.Version)
		}
		if org.Theme == "" || org.Language == "" {
			t.Errorf("Expected default theme and language, got %s / %s", org.Theme, org.Language)
		}
	})

	t.Run("LoadsExistingFile", func(t *testing.T) {
		tmp := t.TempDir()
		defer SetConfigBaseForTest(t, tmp)()

		original, _ := GetOrgPreferences()
		reloaded, err := GetOrgPreferences()
		if err != nil {
			t.Fatalf("Expected no error reloading org orgPrefs, got %v", err)
		}
		if reloaded.Theme != original.Theme || reloaded.Language != original.Language {
			t.Error("Expected loaded org orgPrefs to match original values")
		}
	})
}
