package dalle

import (
	"os"
	"path/filepath"
	"sync"
	"testing"
	"text/template"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/model"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/prompt"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"
)

// --- Test helpers ---
func minimalContext(t *testing.T) *Context {
	t.Helper()
	tmpl := template.Must(template.New("x").Parse("ok"))
	return &Context{
		promptTemplate: tmpl,
		dataTemplate:   tmpl,
		titleTemplate:  tmpl,
		terseTemplate:  tmpl,
		authorTemplate: tmpl,
		Series:         Series{Suffix: "test"},
		Databases: map[string][]string{
			"adverbs":      {"quickly,quick,fast"},
			"adjectives":   {"red,red,red"},
			"nouns":        {"cat,cat,cat"},
			"emotions":     {"happy,happy,happy,happy,happy"},
			"occupations":  {"none,none"},
			"actions":      {"run,run"},
			"artstyles":    {"modern,modern,modern"},
			"litstyles":    {"none,none"},
			"colors":       {"blue,blue"},
			"orientations": {"left,left"},
			"gazes":        {"forward,forward"},
			"backstyles":   {"plain,plain"},
		},
		DalleCache: make(map[string]*model.DalleDress),
		CacheMutex: sync.Mutex{},
	}
}

// --- Tests ---
func TestMakeDalleDress_ValidAndCache(t *testing.T) {
	ctx := minimalContext(t)
	addr := "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

	dress, err := ctx.MakeDalleDress(addr)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if dress == nil {
		t.Fatal("expected non-nil DalleDress")
	}

	dress2, err2 := ctx.MakeDalleDress(addr)
	if err2 != nil || dress2 != dress {
		t.Error("expected cached DalleDress to be returned")
	}
}

func TestMakeDalleDress_InvalidAddress(t *testing.T) {
	ctx := minimalContext(t)
	addr := "short"
	_, err := ctx.MakeDalleDress(addr)
	if err == nil || err.Error() != "seed length is less than 66" {
		t.Errorf("expected seed length error, got %v", err)
	}
}

func TestGetPromptAndEnhanced(t *testing.T) {
	ctx := minimalContext(t)

	addr := "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
	_, _ = ctx.MakeDalleDress(addr) // populate cache
	if got := ctx.GetPrompt(addr); got == "" {
		t.Errorf("GetPrompt = %q, want non-empty", got)
	}
	if got := ctx.GetEnhanced(addr); got != "" {
		t.Errorf("GetEnhanced = %q, want empty (no enhanced prompt)", got)
	}
}

func TestSave(t *testing.T) {
	ctx := minimalContext(t)

	addr := "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
	_, _ = ctx.MakeDalleDress(addr)
	if !ctx.Save(addr) {
		t.Error("Save should return true on success")
	}
	if ctx.Save("short") {
		t.Error("Save should return false on error")
	}
}

func TestReloadDatabases_Basic(t *testing.T) {
	tmpDir := t.TempDir()
	storage.TestOnlyResetDataDir(tmpDir)
	ctx := NewContext()

	// Use prompt.DatabaseNames for the test context
	_ = prompt.DatabaseNames

	if err := ctx.ReloadDatabases("empty"); err != nil {
		t.Fatalf("error reloading database: %v", err)
	}

	if len(ctx.Databases) == 0 {
		t.Error("Databases not loaded")
	}
	if got := ctx.Databases["nouns"]; len(got) == 0 {
		t.Errorf("Database 'nouns' is empty: %v", got)
	}
}

func TestToLines_EmptyAndFiltered(t *testing.T) {
	lines, err := storage.ReadDatabaseCSV("nouns.csv")
	if err != nil {
		t.Errorf("Expected nil error, got %v", err)
	}
	if len(lines) == 0 {
		t.Error("Expected at least one line (should append 'none' if empty)")
	}
}

func TestDatabaseIntegrationWithCache(t *testing.T) {
	// Setup isolated test environment
	tmpDir, err := os.MkdirTemp("", "dalle-db-integration-test-*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmpDir) }()

	// Reset global state
	storage.TestOnlyResetDataDir(tmpDir)
	storage.TestOnlyResetCacheManager()

	// Create context and reload databases (should use cache)
	ctx := NewContext()
	if err := ctx.ReloadDatabases("empty"); err != nil {
		t.Fatalf("ReloadDatabases failed: %v", err)
	}

	// Verify databases were loaded
	if len(ctx.Databases) == 0 {
		t.Error("Expected databases to be loaded")
	}

	// Check that cache file was created during database reload
	cacheFile := filepath.Join(tmpDir, "cache", "databases_v0.1.0.gob")
	if !file.FileExists(cacheFile) {
		t.Error("Expected cache file to be created during database reload")
	}

	// Verify specific database exists
	if _, exists := ctx.Databases["nouns"]; !exists {
		t.Error("Expected 'nouns' database to be loaded")
	}

	if len(ctx.Databases["nouns"]) == 0 {
		t.Error("Expected 'nouns' database to have records")
	}
}
