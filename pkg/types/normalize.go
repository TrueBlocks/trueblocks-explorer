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
	clean := func() (string, string) {
		key := strings.TrimPrefix(f.Key, "calcs.")
		key = strings.TrimSuffix(key, "Eth")
		return unCamelize(key), ""
	}

	fmt := ""
	if f.ColumnLabel == "" {
		f.ColumnLabel, fmt = clean()
	}
	if f.DetailLabel == "" {
		f.DetailLabel, fmt = clean()
	}
	if f.Type == "" {
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
