package storage

import (
	"os"
	"path/filepath"
	"runtime"
	"testing"
)

// TestComputeDataDir_XDGUsed verifies XDG_DATA_HOME is used when no flag/env provided.
func TestComputeDataDir_XDGUsed(t *testing.T) {
	// Skip on Windows (not officially supported; path semantics differ and XDG rarely set).
	if runtime.GOOS == "windows" {
		t.Skip("windows not supported")
	}
	tmp, err := os.MkdirTemp("", "dalle-xdg-*")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(tmp) })
	prev := os.Getenv("XDG_DATA_HOME")
	_ = os.Setenv("XDG_DATA_HOME", tmp)
	t.Cleanup(func() { _ = os.Setenv("XDG_DATA_HOME", prev) })
	got := computeDataDir("", "")
	expect := filepath.Join(tmp, "trueblocks", "dalle")
	if got != expect {
		t.Fatalf("expected %s got %s", expect, got)
	}
}

// TestComputeDataDir_XDGIgnoredWhenEnv ensures env (TB_DALLE_DATA_DIR value passed) overrides XDG.
func TestComputeDataDir_XDGIgnoredWhenEnv(t *testing.T) {
	if runtime.GOOS == "windows" {
		t.Skip("windows not supported")
	}
	tmp, err := os.MkdirTemp("", "dalle-xdg-env-*")
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = os.RemoveAll(tmp) })
	prev := os.Getenv("XDG_DATA_HOME")
	_ = os.Setenv("XDG_DATA_HOME", tmp)
	t.Cleanup(func() { _ = os.Setenv("XDG_DATA_HOME", prev) })
	envPath := filepath.Join(tmp, "override")
	got := computeDataDir("", envPath)
	if got != envPath {
		t.Fatalf("expected env override %s got %s", envPath, got)
	}
}

// TestComputeDataDir_DefaultWhenNoXDG ensures fallback to HOME default when XDG unset.
func TestComputeDataDir_DefaultWhenNoXDG(t *testing.T) {
	if runtime.GOOS == "windows" {
		t.Skip("windows not supported")
	}
	prev := os.Getenv("XDG_DATA_HOME")
	_ = os.Unsetenv("XDG_DATA_HOME")
	t.Cleanup(func() { _ = os.Setenv("XDG_DATA_HOME", prev) })
	home, err := os.UserHomeDir()
	if err != nil {
		t.Fatal(err)
	}
	got := computeDataDir("", "")
	expect := filepath.Join(home, ".local", "share", "trueblocks", "dalle")
	if got != expect {
		t.Fatalf("expected %s got %s", expect, got)
	}
}

func computeDataDir(flagDir, envDir string) string {
	if flagDir != "" {
		return flagDir
	}
	if envDir != "" {
		return envDir
	}
	base := os.Getenv("XDG_DATA_HOME")
	if base == "" {
		home, err := os.UserHomeDir()
		if err != nil || home == "" {
			return "" // graceful empty (tests don’t hit this)
		}
		base = filepath.Join(home, ".local", "share")
	}
	return filepath.Join(base, "trueblocks", "dalle")
}
