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
	s = strings.ReplaceAll(s, "Per", "/")

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
		// Remove "calcs." prefix before normalizing capitalization
		key := strings.TrimPrefix(f.Key, "calcs.")

		// Remove "Eth" suffix if present
		key = strings.TrimSuffix(key, "Eth")

		if strings.HasPrefix(key, "has") && len(key) > 3 && unicode.IsUpper(rune(key[3])) {
			return unCamelize(key), "boolean"
		} else if strings.HasPrefix(key, "is") && len(key) > 2 && unicode.IsUpper(rune(key[2])) {
			if detail {
				return "Is " + unCamelize(key[2:]), "boolean"
			}
			return unCamelize(key[2:]), "boolean"
		} else if strings.HasPrefix(key, "n") && len(key) > 1 && unicode.IsUpper(rune(key[1])) {
			return unCamelize(key[1:]), "number"
		} else if key == "actions" {
			return unCamelize(key), "actions"
		} else if key == "fileSize" || key == "size" || strings.HasSuffix(key, "Sz") {
			return unCamelize(key), "fileSize"
		} else {
			fmt := ""
			if strings.Contains(key, "Per") {
				fmt = "float64"
			}
			return unCamelize(key), fmt
		}
	}

	fmt := ""
	if f.ColumnLabel == "" {
		f.ColumnLabel, fmt = clean(false)
	}
	if f.DetailLabel == "" {
		f.DetailLabel, fmt = clean(true)
	}
	if f.Formatter == "" {
		// only change the field's formatter if it's not explicitly set
		if fmt != "" {
			f.Formatter = fmt
		} else {
			f.Formatter = "text"
		}
	}
}
