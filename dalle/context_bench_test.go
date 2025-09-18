package dalle

import (
	"os"
	"testing"

	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/prompt"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"
)

func BenchmarkDatabaseLoad_WithoutCache(b *testing.B) {
	// Setup isolated test environment
	tmpDir, err := os.MkdirTemp("", "dalle-bench-nocache-*")
	if err != nil {
		b.Fatalf("Failed to create temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmpDir) }()

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		// Reset state each iteration to avoid caching effects
		storage.TestOnlyResetDataDir(tmpDir)

		// Force cache invalidation to simulate cold start
		cm := storage.GetCacheManager()
		_ = cm.InvalidateCache()

		// Use fallback method (original CSV parsing)
		ctx := NewContext()
		for _, dbName := range prompt.DatabaseNames[:3] { // Test subset for speed
			if err := ctx.loadDatabaseFallback(dbName, "empty"); err != nil {
				b.Fatalf("loadDatabaseFallback failed: %v", err)
			}
		}
	}
}

func BenchmarkDatabaseLoad_WithCache(b *testing.B) {
	// Setup isolated test environment
	tmpDir, err := os.MkdirTemp("", "dalle-bench-cache-*")
	if err != nil {
		b.Fatalf("Failed to create temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmpDir) }()

	// Reset global state
	storage.TestOnlyResetDataDir(tmpDir)

	// Pre-build cache
	cm := storage.GetCacheManager()
	if err := cm.LoadOrBuild(); err != nil {
		b.Fatalf("Failed to build cache: %v", err)
	}

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		// Test cached database loading
		for _, dbName := range prompt.DatabaseNames[:3] { // Test subset for speed
			_, err := cm.GetDatabase(dbName)
			if err != nil {
				b.Fatalf("GetDatabase failed: %v", err)
			}
		}
	}
}

func BenchmarkFullDatabaseReload_WithoutCache(b *testing.B) {
	// Setup isolated test environment
	tmpDir, err := os.MkdirTemp("", "dalle-bench-full-nocache-*")
	if err != nil {
		b.Fatalf("Failed to create temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmpDir) }()

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		b.StopTimer()
		// Reset state to avoid caching
		storage.TestOnlyResetDataDir(tmpDir)

		// Invalidate any existing cache
		cm := storage.GetCacheManager()
		_ = cm.InvalidateCache()

		b.StartTimer()

		// Simulate original behavior (CSV parsing)
		ctx := NewContext()
		for _, dbName := range prompt.DatabaseNames {
			if err := ctx.loadDatabaseFallback(dbName, "empty"); err != nil {
				b.Fatalf("loadDatabaseFallback failed: %v", err)
			}
		}
	}
}

func BenchmarkFullDatabaseReload_WithCache(b *testing.B) {
	// Setup isolated test environment
	tmpDir, err := os.MkdirTemp("", "dalle-bench-full-cache-*")
	if err != nil {
		b.Fatalf("Failed to create temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmpDir) }()

	// Reset global state and pre-build cache
	storage.TestOnlyResetDataDir(tmpDir)

	cm := storage.GetCacheManager()
	if err := cm.LoadOrBuild(); err != nil {
		b.Fatalf("Failed to build cache: %v", err)
	}

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		// Test full database reload with cache
		ctx := NewContext()
		if err := ctx.ReloadDatabases("empty"); err != nil {
			b.Fatalf("ReloadDatabases failed: %v", err)
		}
	}
}

func BenchmarkCacheManagerLoadOrBuild_ColdStart(b *testing.B) {
	for i := 0; i < b.N; i++ {
		b.StopTimer()
		// Setup isolated environment for each iteration
		tmpDir, err := os.MkdirTemp("", "dalle-bench-cold-*")
		if err != nil {
			b.Fatalf("Failed to create temp dir: %v", err)
		}

		storage.TestOnlyResetDataDir(tmpDir)
		storage.TestOnlyResetCacheManager()

		b.StartTimer()

		// Time cold start (cache build)
		cm := storage.GetCacheManager()
		if err := cm.LoadOrBuild(); err != nil {
			b.Fatalf("LoadOrBuild failed: %v", err)
		}

		b.StopTimer()
		_ = os.RemoveAll(tmpDir)
	}
}

func BenchmarkCacheManagerLoadOrBuild_WarmStart(b *testing.B) {
	// Setup environment with pre-existing cache
	tmpDir, err := os.MkdirTemp("", "dalle-bench-warm-*")
	if err != nil {
		b.Fatalf("Failed to create temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmpDir) }()

	storage.TestOnlyResetDataDir(tmpDir)

	// Pre-build cache
	cm := storage.GetCacheManager()
	if err := cm.LoadOrBuild(); err != nil {
		b.Fatalf("Failed to build initial cache: %v", err)
	}

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		b.StopTimer()
		storage.TestOnlyResetCacheManager()
		b.StartTimer()

		// Time warm start (cache load from disk)
		cm := storage.GetCacheManager()
		if err := cm.LoadOrBuild(); err != nil {
			b.Fatalf("LoadOrBuild failed: %v", err)
		}
	}
}
