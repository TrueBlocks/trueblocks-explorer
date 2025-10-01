package types

import (
	"strings"
	"unicode"
)

// NormalizeFields normalizes field configurations in place.
func NormalizeFields(fields []FieldConfig) {
	for i := range fields {
		fields[i].normalizeField()
	}
}

func unCamelize(s string) string {
	var result strings.Builder
	runes := []rune(s)
	result.WriteRune(unicode.ToUpper(runes[0]))
	for i := 1; i < len(runes); i++ {
		if unicode.IsUpper(runes[i]) {
			result.WriteRune(' ')
		}
		result.WriteRune(runes[i])
	}
	return result.String()
}

func (f *FieldConfig) normalizeField() {
	clean := func(detail bool) (string, string) {
		if strings.HasPrefix(f.Key, "has") && len(f.Key) > 3 && unicode.IsUpper(rune(f.Key[3])) {
			return unCamelize(f.Key), "boolean"
		} else if strings.HasPrefix(f.Key, "is") && len(f.Key) > 2 && unicode.IsUpper(rune(f.Key[2])) {
			if detail {
				return "Is " + unCamelize(f.Key[2:]), "boolean"
			}
			return unCamelize(f.Key[2:]), "boolean"
		} else if strings.HasPrefix(f.Key, "n") && len(f.Key) > 1 && unicode.IsUpper(rune(f.Key[1])) {
			return unCamelize(f.Key[1:]), "number"
		} else {
			return unCamelize(f.Key), ""
		}
	}

	fmt := ""
	if f.ColumnLabel == "" {
		f.ColumnLabel, fmt = clean(false)
	}
	if f.DetailLabel == "" {
		f.DetailLabel, fmt = clean(true)
	}
	if fmt != "" && f.Formatter == "" {
		f.Formatter = fmt
	}
}
