package dalle

import (
	"encoding/json"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
	"time"

	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"
)

func TestSeries_String(t *testing.T) {
	s := &Series{
		Suffix:  "test",
		Adverbs: []string{"quickly", "slowly"},
	}
	jsonStr := s.String()
	var out Series
	if err := json.Unmarshal([]byte(jsonStr), &out); err != nil {
		t.Fatalf("String() did not return valid JSON: %v", err)
	}
	if out.Suffix != "test" || len(out.Adverbs) != 2 {
		t.Errorf("String() mismatch: %+v", out)
	}
}

func TestSeries_GetFilter_Valid(t *testing.T) {
	s := &Series{
		Adverbs: []string{"quickly", "slowly"},
		Nouns:   []string{"cat", "dog"},
	}
	adverbs, err := s.GetFilter("Adverbs")
	if err != nil {
		t.Fatalf("GetFilter returned error: %v", err)
	}
	if !reflect.DeepEqual(adverbs, []string{"quickly", "slowly"}) {
		t.Errorf("GetFilter returned wrong slice: %v", adverbs)
	}
	nouns, err := s.GetFilter("Nouns")
	if err != nil || len(nouns) != 2 {
		t.Errorf("GetFilter failed for Nouns: %v, %v", nouns, err)
	}
}

func TestSeries_GetFilter_InvalidField(t *testing.T) {
	s := &Series{}
	_, err := s.GetFilter("NotAField")
	if err == nil {
		t.Fatal("expected error for invalid field name")
	}
	if !strings.Contains(err.Error(), "not valid") {
		t.Fatalf("unexpected error message: %v", err)
	}
}

func TestSeries_GetFilter_NotSlice(t *testing.T) {
	s := &Series{Suffix: "notaslice"}
	_, err := s.GetFilter("Suffix")
	if err == nil || err.Error() != "field Suffix not a slice" {
		t.Errorf("expected 'not a slice' error, got %v", err)
	}
}

func TestSeries_GetFilter_NotStringSlice(t *testing.T) {
	type SeriesWithInt struct {
		Ints []int
	}
	s := &SeriesWithInt{Ints: []int{1, 2, 3}}
	ref := reflect.ValueOf(s)
	field := reflect.Indirect(ref).FieldByName("Ints")
	if field.Kind() != reflect.Slice || field.Type().Elem().Kind() == reflect.String {
		t.Skip("Test only relevant if field is a non-string slice")
	}
	// Simulate GetFilter logic
	// if field.Type().Elem().Kind() != reflect.String {
	// 	// Should error
	// }
}

func TestSeries_Model(t *testing.T) {
	s := &Series{
		Suffix:     "suf",
		Last:       3,
		Deleted:    true,
		Adverbs:    []string{"quickly"},
		Adjectives: []string{"red"},
		Nouns:      []string{"cat"},
		ModifiedAt: time.Now().UTC().Format(time.RFC3339),
	}
	m := s.Model("", "", false, nil)
	if m.Data["suffix"] != "suf" || m.Data["last"].(int) != 3 {
		t.Fatalf("model data mismatch: %#v", m.Data)
	}
	// Order should contain known keys in order (spot check first / last)
	if len(m.Order) == 0 || m.Order[0] != "suffix" || m.Order[len(m.Order)-1] != "backstyles" {
		t.Fatalf("unexpected order: %v", m.Order)
	}
}

func TestSeries_StringAndSaveSeries(t *testing.T) {
	SetupTest(t, SetupTestOptions{})
	s := &Series{Suffix: "alpha", Last: 1, Adverbs: []string{"swiftly"}}
	// ensure JSON
	js := s.String()
	if !strings.Contains(js, "\"suffix\": \"alpha\"") {
		t.Fatalf("String() missing suffix: %s", js)
	}
	// Save with different last value
	s.SaveSeries("alpha", 42)
	fn := filepath.Join(storage.SeriesDir(), "alpha.json")
	b, err := os.ReadFile(fn)
	if err != nil {
		t.Fatalf("reading saved series: %v", err)
	}
	var out Series
	if err := json.Unmarshal(b, &out); err != nil {
		t.Fatalf("unmarshal saved: %v", err)
	}
	if out.Last != 42 {
		t.Fatalf("expected Last overwritten to 42, got %d", out.Last)
	}
}
