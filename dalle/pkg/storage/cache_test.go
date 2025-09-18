package storage

import (
	"os"
	"path/filepath"
	"sync"
	"testing"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
)

func TestCacheManager_DatabaseCache(t *testing.T) {
	// Setup isolated test environment
	tmpDir, err := os.MkdirTemp("", "dalle-cache-test-*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmpDir) }()

	// Reset global state for isolated testing
	TestOnlyResetDataDir(tmpDir)
	TestOnlyResetCacheManager()

	// Get cache manager
	cm := GetCacheManager()

	// Test LoadOrBuild
	if err := cm.LoadOrBuild(); err != nil {
		t.Fatalf("LoadOrBuild failed: %v", err)
	}

	// Test that cache was created
	cacheFile := filepath.Join(tmpDir, "cache", "databases_v0.1.0.gob")
	if !file.FileExists(cacheFile) {
		t.Error("Expected cache file to be created")
	}

	// Test GetDatabase
	dbIndex, err := cm.GetDatabase("nouns")
	if err != nil {
		t.Fatalf("GetDatabase failed: %v", err)
	}

	if dbIndex.Name != "nouns" {
		t.Errorf("Expected database name 'nouns', got '%s'", dbIndex.Name)
	}

	if len(dbIndex.Records) == 0 {
		t.Error("Expected database records, got none")
	}

	if dbIndex.Version == "" {
		t.Error("Expected version to be set")
	}

	// Test lookup functionality
	if len(dbIndex.Lookup) == 0 {
		t.Error("Expected lookup map to be populated")
	}

	// Verify lookup works
	if len(dbIndex.Records) > 0 {
		firstKey := dbIndex.Records[0].Key
		if _, exists := dbIndex.Lookup[firstKey]; !exists {
			t.Errorf("Expected key '%s' to exist in lookup map", firstKey)
		}
	}
}

func TestCacheManager_CacheReuse(t *testing.T) {
	// Setup isolated test environment
	tmpDir, err := os.MkdirTemp("", "dalle-cache-reuse-test-*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmpDir) }()

	// Reset global state
	TestOnlyResetDataDir(tmpDir)
	TestOnlyResetCacheManager()

	// Create cache manager and build cache
	cm1 := GetCacheManager()
	if err := cm1.LoadOrBuild(); err != nil {
		t.Fatalf("First LoadOrBuild failed: %v", err)
	}

	// Get database to ensure cache is populated
	_, err = cm1.GetDatabase("nouns")
	if err != nil {
		t.Fatalf("GetDatabase failed: %v", err)
	}

	// Reset the singleton and create new cache manager
	cacheManagerOnce = sync.Once{}
	cacheManager = nil

	cm2 := GetCacheManager()
	if err := cm2.LoadOrBuild(); err != nil {
		t.Fatalf("Second LoadOrBuild failed: %v", err)
	}

	// Verify cache is loaded from disk (not rebuilt)
	if cm2.dbCache == nil {
		t.Error("Expected cache to be loaded from disk")
	}

	// Verify database can still be retrieved
	dbIndex, err := cm2.GetDatabase("nouns")
	if err != nil {
		t.Fatalf("GetDatabase from cached data failed: %v", err)
	}

	if len(dbIndex.Records) == 0 {
		t.Error("Expected cached database to have records")
	}
}

func TestCacheManager_InvalidateCache(t *testing.T) {
	// Setup isolated test environment
	tmpDir, err := os.MkdirTemp("", "dalle-cache-invalidate-test-*")
	if err != nil {
		t.Fatalf("Failed to create temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmpDir) }()

	// Reset global state
	TestOnlyResetDataDir(tmpDir)
	TestOnlyResetCacheManager()

	// Create cache
	cm := GetCacheManager()
	if err := cm.LoadOrBuild(); err != nil {
		t.Fatalf("LoadOrBuild failed: %v", err)
	}

	cacheFile := filepath.Join(tmpDir, "cache", "databases_v0.1.0.gob")
	if !file.FileExists(cacheFile) {
		t.Fatal("Expected cache file to exist before invalidation")
	}

	// Invalidate cache
	if err := cm.InvalidateCache(); err != nil {
		t.Fatalf("InvalidateCache failed: %v", err)
	}

	// Verify cache file is removed
	if file.FileExists(cacheFile) {
		t.Error("Expected cache file to be removed after invalidation")
	}

	// Verify cache is cleared in memory
	if cm.dbCache != nil {
		t.Error("Expected in-memory cache to be cleared")
	}

	if cm.loaded {
		t.Error("Expected loaded flag to be false after invalidation")
	}
}
