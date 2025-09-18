package storage

import (
	"os"
	"path/filepath"
	"sync"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/logger"
)

var (
	dataDirOnce sync.Once
	dataDir     string
)

// TestOnlyResetDataDir resets internal directory state (intended for tests).
func TestOnlyResetDataDir(flagVal string) {
	dataDir = ""
	dataDirOnce = sync.Once{}
	dataDirOnce.Do(func() { initDataDir(flagVal) })
}

func initDataDir(flagVal string) {
	envVal := os.Getenv("TB_DALLE_DATA_DIR")
	if hasLeadingTilde(flagVal) || hasLeadingTilde(envVal) {
		logger.Error("data directory must not start with '~'; use $HOME or an absolute path.")
		os.Exit(2)
	}
	dataDir = flagVal
	if dataDir == "" {
		dataDir = envVal
	}
	if dataDir == "" {
		if xdg := os.Getenv("XDG_DATA_HOME"); xdg != "" {
			dataDir = filepath.Join(xdg, "trueblocks", "dalle")
		} else {
			home, herr := os.UserHomeDir()
			if herr == nil && home != "" {
				dataDir = filepath.Join(home, ".local", "share", "trueblocks", "dalle")
			} else {
				dataDir = filepath.Join(".", "dalle")
			}
		}
	}
	dataDir = filepath.Clean(dataDir)
	if !filepath.IsAbs(dataDir) {
		if abs, aerr := filepath.Abs(dataDir); aerr == nil {
			dataDir = abs
		}
	}
	if err := EnsureWritable(dataDir); err != nil {
		if tmp, terr := os.MkdirTemp("", "dalleserver-fallback-*"); terr != nil {
			logger.Error("ERROR: cannot establish writable data dir:", err)
			dataDir = dataDir + "-unwritable"
		} else {
			logger.Error("WARNING: using fallback temp data dir due to error:", err)
			dataDir = tmp
		}
	}
}

// DataDir returns the lazily-initialized base directory.
func DataDir() string {
	dataDirOnce.Do(func() { initDataDir("") })
	return dataDir
}

// Dir helpers (pure functions) derived from a base data directory.
func OutputDir() string { return filepath.Join(DataDir(), "output") }
func SeriesDir() string {
	seriesDir := filepath.Join(DataDir(), "series")
	_ = os.MkdirAll(seriesDir, 0o750)
	return seriesDir
}
func MetricsDir() string {
	metricsDir := filepath.Join(DataDir(), "metrics")
	_ = os.MkdirAll(metricsDir, 0o750)
	return metricsDir
}

// EnsureWritable makes sure directory exists and is writable.
func EnsureWritable(path string) error {
	// Create (or ensure) the directory with restricted permissions; callers can relax if explicitly required.
	if err := os.MkdirAll(path, 0o750); err != nil {
		return err
	}
	sentinel := filepath.Join(path, ".write_test")
	// Use 0o600 for the write test to satisfy gosec and to avoid exposing potential sensitive data.
	if werr := os.WriteFile(sentinel, []byte("ok"), 0o600); werr != nil {
		return werr
	}
	_ = os.Remove(sentinel)
	return nil
}

func hasLeadingTilde(s string) bool {
	if s == "" {
		return false
	}
	return s[0] == '~'
}
