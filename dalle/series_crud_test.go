package dalle

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"testing"

	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

func writeSeriesFile(t *testing.T, dir, suffix string, deleted bool, last int) {
	t.Helper()
	s := Series{Suffix: suffix, Deleted: deleted, Last: last}
	data, _ := json.Marshal(s)
	if err := os.WriteFile(filepath.Join(dir, suffix+".json"), data, 0o600); err != nil {
		t.Fatalf("write series file: %v", err)
	}
}

func TestLoadSeriesModelsAndVariants(t *testing.T) {
	tmp := t.TempDir()
	// valid
	writeSeriesFile(t, tmp, "one", false, 1)
	writeSeriesFile(t, tmp, "two", true, 2)
	// invalid extension
	_ = os.WriteFile(filepath.Join(tmp, "readme.txt"), []byte("ignore"), 0o600)
	// invalid json
	_ = os.WriteFile(filepath.Join(tmp, "bad.json"), []byte("{"), 0o600)

	all, err := LoadSeriesModels(tmp)
	if err != nil {
		t.Fatalf("LoadSeriesModels error: %v", err)
	}
	if len(all) != 2 { // only valid JSON files
		t.Fatalf("expected 2 valid series, got %d", len(all))
	}
	// Check ModifiedAt populated
	foundMod := false
	for _, s := range all {
		if s.Suffix == "one" && s.ModifiedAt != "" {
			foundMod = true
		}
	}
	if !foundMod {
		t.Fatalf("ModifiedAt not populated on at least one series: %#v", all)
	}

	active, _ := LoadActiveSeriesModels(tmp)
	if len(active) != 1 || active[0].Suffix != "one" {
		t.Fatalf("expected only 'one' active, got %#v", active)
	}
	deleted, _ := LoadDeletedSeriesModels(tmp)
	if len(deleted) != 1 || deleted[0].Suffix != "two" {
		t.Fatalf("expected only 'two' deleted, got %#v", deleted)
	}
}

func TestSortSeries(t *testing.T) {
	items := []Series{
		{Suffix: "b", Last: 2, ModifiedAt: "2025-01-02T00:00:00Z"},
		{Suffix: "a", Last: 3, ModifiedAt: "2025-01-01T00:00:00Z"},
		{Suffix: "c", Last: 1, ModifiedAt: "2025-01-03T00:00:00Z"},
	}
	// sort by suffix asc
	_ = SortSeries(items, sdk.SortSpec{Fields: []string{"suffix"}, Order: []sdk.SortOrder{sdk.Asc}})
	if items[0].Suffix != "a" || items[2].Suffix != "c" {
		t.Fatalf("suffix asc sort wrong: %#v", items)
	}
	// sort by last desc
	_ = SortSeries(items, sdk.SortSpec{Fields: []string{"last"}, Order: []sdk.SortOrder{sdk.Dec}})
	if items[0].Last != 3 || items[2].Last != 1 {
		t.Fatalf("last desc sort wrong: %#v", items)
	}
	// unknown field falls back to suffix
	_ = SortSeries(items, sdk.SortSpec{Fields: []string{"unknown"}})
	if items[0].Suffix != "a" {
		t.Fatalf("fallback sort expected a first: %#v", items)
	}
	// modifiedAt asc
	_ = SortSeries(items, sdk.SortSpec{Fields: []string{"modifiedAt"}, Order: []sdk.SortOrder{sdk.Asc}})
	if items[0].ModifiedAt != "2025-01-01T00:00:00Z" {
		t.Fatalf("modifiedAt asc sort wrong: %#v", items)
	}
}

func TestRemoveDeleteUndeleteSeries(t *testing.T) {
	SetupTest(t, SetupTestOptions{})
	// Prepare JSON file for suffix
	writeSeriesFile(t, storage.SeriesDir(), "s1", false, 0)
	// output dirs
	outDir := filepath.Join(storage.OutputDir(), "s1")
	delDir := filepath.Join(storage.OutputDir(), "s1.deleted")
	if err := os.MkdirAll(outDir, 0o750); err != nil {
		t.Fatalf("mkdir out: %v", err)
	}
	if err := os.MkdirAll(delDir, 0o750); err != nil {
		t.Fatalf("mkdir del: %v", err)
	}
	if err := RemoveSeries(storage.SeriesDir(), "s1"); err != nil {
		t.Fatalf("RemoveSeries: %v", err)
	}
	if _, err := os.Stat(filepath.Join(storage.SeriesDir(), "s1.json")); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("expected series file removed")
	}
	if _, err := os.Stat(outDir); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("expected output dir removed")
	}
	if _, err := os.Stat(delDir); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("expected deleted dir removed")
	}

	// Recreate for delete / undelete cycle
	writeSeriesFile(t, storage.SeriesDir(), "s2", false, 0)
	out2 := filepath.Join(storage.OutputDir(), "s2")
	if err := os.MkdirAll(out2, 0o750); err != nil {
		t.Fatalf("mkdir out2: %v", err)
	}
	if err := DeleteSeries(storage.SeriesDir(), "s2"); err != nil {
		t.Fatalf("DeleteSeries: %v", err)
	}
	// JSON should show Deleted true
	b, _ := os.ReadFile(filepath.Join(storage.SeriesDir(), "s2.json"))
	var s Series
	_ = json.Unmarshal(b, &s)
	if !s.Deleted {
		t.Fatalf("expected Deleted true after DeleteSeries")
	}
	if _, err := os.Stat(out2); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("expected original output dir moved")
	}
	if _, err := os.Stat(filepath.Join(storage.OutputDir(), "s2.deleted")); err != nil {
		t.Fatalf("expected .deleted dir exists")
	}

	if err := UndeleteSeries(storage.SeriesDir(), "s2"); err != nil {
		t.Fatalf("UndeleteSeries: %v", err)
	}
	b, _ = os.ReadFile(filepath.Join(storage.SeriesDir(), "s2.json"))
	// Need a fresh variable because field omitted (omitempty) would not overwrite true value.
	var s2 Series
	_ = json.Unmarshal(b, &s2)
	if s2.Deleted {
		t.Fatalf("expected Deleted false after UndeleteSeries; got %+v", s2)
	}
	if _, err := os.Stat(filepath.Join(storage.OutputDir(), "s2")); err != nil {
		t.Fatalf("expected output dir restored")
	}
	if _, err := os.Stat(filepath.Join(storage.OutputDir(), "s2.deleted")); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("expected .deleted dir gone")
	}
}
