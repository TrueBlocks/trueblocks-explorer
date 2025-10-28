package types

import (
	"strings"
	"unicode"
)

// NormalizeFields normalizes field configurations in place.
func NormalizeFields(fields *[]FieldConfig) {
	for i := range *fields {
		(*fields)[i].normalizeField()
	}
	consolidateFields(fields)
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
	if f.Type == "" {
		// only change the field's type if it's not explicitly set
		if fmt != "" {
			f.Type = fmt
		} else {
			f.Type = "text"
		}
	}
}

func consolidateFields(fields *[]FieldConfig) {
	targetKeys := map[string]bool{
		"blockNumber":      true,
		"blockHash":        true,
		"transactionIndex": true,
		"transactionHash":  true,
		"hash":             true,
		"logIndex":         true,
		"traceIndex":       true,
		"timestamp":        true,
	}

	hasAnyTarget := false
	for i := range *fields {
		if targetKeys[(*fields)[i].Key] {
			hasAnyTarget = true
			break
		}
	}

	if !hasAnyTarget {
		return
	}

	identifierField := FieldConfig{
		Key:         "identifier",
		Label:       "Identifier",
		ColumnLabel: "Identifier",
		DetailLabel: "Identifier",
		NoTable:     false,
		NoDetail:    true,
		Type:        "identifier",
	}

	// Hide original identifier fields but keep them for export
	for i := range *fields {
		if targetKeys[(*fields)[i].Key] {
			(*fields)[i].NoTable = true // Hide from table view
		}
	}

	// Insert identifier field at the beginning
	result := make([]FieldConfig, 0, len(*fields)+1)
	result = append(result, identifierField)
	result = append(result, *fields...)
	*fields = result
}
