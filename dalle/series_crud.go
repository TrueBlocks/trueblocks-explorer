package dalle

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// LoadSeriesModels loads all series JSON files from the series folder beneath the provided dataDir
func LoadSeriesModels(seriesDir string) ([]Series, error) {
	items := []Series{}
	entries, err := os.ReadDir(seriesDir)
	if err != nil {
		return items, nil
	}
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		name := e.Name()
		if !strings.HasSuffix(strings.ToLower(name), ".json") {
			continue
		}
		full := filepath.Join(seriesDir, name)
		clean := filepath.Clean(full)
		if !strings.HasPrefix(clean, filepath.Clean(seriesDir)+string(os.PathSeparator)) { // ensure within seriesDir
			continue
		}
		b, err := os.ReadFile(clean) // #nosec G304 path validated
		if err != nil {
			continue
		}
		var s Series
		if err := json.Unmarshal(b, &s); err != nil {
			continue
		}
		fi, err := os.Stat(full)
		if err == nil {
			s.ModifiedAt = fi.ModTime().UTC().Format(time.RFC3339)
		}
		items = append(items, s)
	}
	return items, nil
}

// LoadActiveSeriesModels loads all non-deleted series JSON files
func LoadActiveSeriesModels(seriesDir string) ([]Series, error) {
	allSeries, err := LoadSeriesModels(seriesDir)
	if err != nil {
		return nil, err
	}

	activeSeries := make([]Series, 0, len(allSeries))
	for _, s := range allSeries {
		if !s.Deleted {
			activeSeries = append(activeSeries, s)
		}
	}
	return activeSeries, nil
}

// LoadDeletedSeriesModels loads all deleted series JSON files
func LoadDeletedSeriesModels(seriesDir string) ([]Series, error) {
	allSeries, err := LoadSeriesModels(seriesDir)
	if err != nil {
		return nil, err
	}

	deletedSeries := make([]Series, 0, len(allSeries))
	for _, s := range allSeries {
		if s.Deleted {
			deletedSeries = append(deletedSeries, s)
		}
	}
	return deletedSeries, nil
}

// SortSeries sorts in place based on field in spec (suffix, modifiedAt, last)
func SortSeries(items []Series, sortSpec sdk.SortSpec) error {
	if len(items) < 2 || len(sortSpec.Fields) == 0 {
		return nil
	}
	if len(sortSpec.Order) == 0 {
		sortSpec.Order = append(sortSpec.Order, sdk.Asc)
	}
	field := sortSpec.Fields[0]
	asc := sortSpec.Order[0] == sdk.Asc
	cmp := func(i, j int) bool { return true }
	switch strings.ToLower(field) {
	case "suffix":
		cmp = func(i, j int) bool { return strings.Compare(items[i].Suffix, items[j].Suffix) < 0 }
	case "modifiedat":
		cmp = func(i, j int) bool { return items[i].ModifiedAt < items[j].ModifiedAt }
	case "last":
		cmp = func(i, j int) bool { return items[i].Last < items[j].Last }
	default:
		cmp = func(i, j int) bool { return strings.Compare(items[i].Suffix, items[j].Suffix) < 0 }
	}
	sort.SliceStable(items, func(i, j int) bool {
		if asc {
			return cmp(i, j)
		}
		return !cmp(i, j)
	})
	return nil
}

func RemoveSeries(seriesDir, suffix string) error {
	if suffix == "" {
		return errors.New("empty suffix")
	}
	fn := filepath.Join(seriesDir, suffix+".json")
	if _, err := os.Stat(fn); err != nil {
		return err
	}

	if err := os.Remove(fn); err != nil {
		return err
	}

	// Remove regular output folder if it exists
	outputPath := filepath.Join(storage.OutputDir(), suffix)
	if _, err := os.Stat(outputPath); err == nil {
		if err := os.RemoveAll(outputPath); err != nil {
			return err
		}
	}

	// Also remove .deleted folder if it exists
	deletedOutputPath := filepath.Join(storage.OutputDir(), suffix+".deleted")
	if _, err := os.Stat(deletedOutputPath); err == nil {
		if err := os.RemoveAll(deletedOutputPath); err != nil {
			return err
		}
	}

	return nil
}

func DeleteSeries(seriesDir, suffix string) error {
	if suffix == "" {
		return errors.New("empty suffix")
	}

	fn := filepath.Join(seriesDir, suffix+".json")
	if _, err := os.Stat(fn); err != nil {
		return err
	}

	clean := filepath.Clean(fn)
	if !strings.HasPrefix(clean, filepath.Clean(seriesDir)+string(os.PathSeparator)) { // defensive
		return errors.New("invalid series file path")
	}
	b, err := os.ReadFile(clean) // #nosec G304 path validated
	if err != nil {
		return err
	}

	var s Series
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	s.Deleted = true

	jsonData := []byte(s.String())
	if err := os.WriteFile(fn, jsonData, 0o600); err != nil {
		return err
	}

	outputPath := filepath.Join(storage.OutputDir(), suffix)
	hiddenPath := filepath.Join(storage.OutputDir(), suffix+".deleted")

	if _, err := os.Stat(outputPath); err == nil {
		if err := os.Rename(outputPath, hiddenPath); err != nil {
			return err
		}
	}

	return nil
}

func UndeleteSeries(seriesDir, suffix string) error {
	if suffix == "" {
		return errors.New("empty suffix")
	}
	fn := filepath.Join(seriesDir, suffix+".json")
	if _, err := os.Stat(fn); err != nil {
		return err
	}

	// Load the series
	clean := filepath.Clean(fn)
	if !strings.HasPrefix(clean, filepath.Clean(seriesDir)+string(os.PathSeparator)) {
		return errors.New("invalid series file path")
	}
	b, err := os.ReadFile(clean) // #nosec G304
	if err != nil {
		return err
	}

	var s Series
	if err := json.Unmarshal(b, &s); err != nil {
		return err
	}

	// Mark as not deleted
	s.Deleted = false

	// Save back to file
	if err := os.WriteFile(fn, []byte(s.String()), 0o600); err != nil {
		return err
	}

	outputPath := filepath.Join(storage.OutputDir(), suffix)
	hiddenPath := filepath.Join(storage.OutputDir(), suffix+".deleted")

	if _, err := os.Stat(hiddenPath); err == nil {
		if err := os.Rename(hiddenPath, outputPath); err != nil {
			return err
		}
	}

	return nil
}
