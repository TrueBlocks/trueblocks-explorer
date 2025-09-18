package dalle

import (
	"encoding/json"
	"fmt"
	"path/filepath"
	"reflect"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	coreTypes "github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/types"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"
)

// Series represents a collection of prompt attributes and their values.
type Series struct {
	Last         int      `json:"last,omitempty"`
	Suffix       string   `json:"suffix"`
	Purpose      string   `json:"purpose,omitempty"`
	Deleted      bool     `json:"deleted,omitempty"`
	Adverbs      []string `json:"adverbs"`
	Adjectives   []string `json:"adjectives"`
	Nouns        []string `json:"nouns"`
	Emotions     []string `json:"emotions"`
	Occupations  []string `json:"occupations"`
	Actions      []string `json:"actions"`
	Artstyles    []string `json:"artstyles"`
	Litstyles    []string `json:"litstyles"`
	Colors       []string `json:"colors"`
	Orientations []string `json:"orientations"`
	Gazes        []string `json:"gazes"`
	Backstyles   []string `json:"backstyles"`
	ModifiedAt   string   `json:"modifiedAt,omitempty"`
}

func (s *Series) Model(chain, format string, verbose bool, extraOpts map[string]any) coreTypes.Model {
	return coreTypes.Model{
		Data: map[string]any{
			"suffix":       s.Suffix,
			"purpose":      s.Purpose,
			"last":         s.Last,
			"deleted":      s.Deleted,
			"modifiedAt":   s.ModifiedAt,
			"adverbs":      s.Adverbs,
			"adjectives":   s.Adjectives,
			"nouns":        s.Nouns,
			"emotions":     s.Emotions,
			"occupations":  s.Occupations,
			"actions":      s.Actions,
			"artstyles":    s.Artstyles,
			"litstyles":    s.Litstyles,
			"colors":       s.Colors,
			"orientations": s.Orientations,
			"gazes":        s.Gazes,
			"backstyles":   s.Backstyles,
		},
		Order: []string{"suffix", "purpose", "last", "deleted", "modifiedAt", "adverbs", "adjectives", "nouns", "emotions", "occupations", "actions", "artstyles", "litstyles", "colors", "orientations", "gazes", "backstyles"},
	}
}

// String returns the JSON representation of the Series.
func (s *Series) String() string {
	bytes, _ := json.MarshalIndent(s, "", "  ")
	return string(bytes)
}

// SaveSeries saves the Series to a file with the given filename and last index.
func (s *Series) SaveSeries(series string, last int) {
	ss := s
	ss.Last = last
	target := filepath.Join(storage.SeriesDir(), series+".json") // creates the folder
	_ = file.StringToAsciiFile(target, ss.String())
}

// GetFilter returns a string slice for the given field name in the Series.
func (s *Series) GetFilter(fieldName string) ([]string, error) {
	reflectedT := reflect.ValueOf(s)
	field := reflect.Indirect(reflectedT).FieldByName(fieldName)
	if !field.IsValid() {
		return nil, fmt.Errorf("field %s not valid", fieldName)
	}
	if field.Kind() != reflect.Slice {
		return nil, fmt.Errorf("field %s not a slice", fieldName)
	}
	if field.Type().Elem().Kind() != reflect.String {
		return nil, fmt.Errorf("field %s not a string slice", fieldName)
	}
	return field.Interface().([]string), nil
}
