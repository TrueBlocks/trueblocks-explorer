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
	consolidateNamedAddresses(fields)
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

func consolidateNamedAddresses(fields *[]FieldConfig) {
	// Map to track address fields and their corresponding name fields
	addressFields := make(map[string]int)    // key -> index of address field
	nameFields := make(map[string]int)       // key -> index of name field
	addressToName := make(map[string]string) // address key -> name key

	// First pass: identify address and name field pairs
	for i, field := range *fields {
		key := field.Key
		if strings.HasSuffix(key, "Name") {
			// This is a potential name field
			addressKey := strings.TrimSuffix(key, "Name")
			nameFields[addressKey] = i
			addressToName[addressKey] = key
		} else {
			// Check if this could be an address field
			addressFields[key] = i
		}
	}

	// Track which pairs we've processed to avoid duplicates
	processedPairs := make(map[string]bool)

	// Build result slice with synthetic fields inserted in correct positions
	var result []FieldConfig

	for _, field := range *fields {
		key := field.Key

		// Check if this is a name field with a matching address field
		if strings.HasSuffix(key, "Name") {
			addressKey := strings.TrimSuffix(key, "Name")

			if addressIdx, hasAddress := addressFields[addressKey]; hasAddress && !processedPairs[addressKey] {
				// Found a matching pair - create and insert synthetic field
				addressField := (*fields)[addressIdx]

				syntheticKey := addressKey + "Named"
				syntheticField := FieldConfig{
					Key:         syntheticKey, // Use {prefix}Named pattern
					Label:       addressField.Label,
					ColumnLabel: addressField.ColumnLabel,
					DetailLabel: addressField.DetailLabel,
					Section:     addressField.Section,
					Width:       addressField.Width,
					Sortable:    addressField.Sortable,
					Order:       addressField.Order,
					DetailOrder: addressField.DetailOrder,
					NoTable:     addressField.NoTable, // Only hide from table if original was hidden
					NoDetail:    true,                 // Always hide synthetics from detail view
					Type:        "namedAddress",
				}

				// Add synthetic field right after the name field
				result = append(result, syntheticField)
				processedPairs[addressKey] = true
			}
		}

		// Add the current field (will be hidden later if part of a pair)
		result = append(result, field)
	}

	// Hide original address and name fields from table view
	for i := range result {
		key := result[i].Key
		if strings.HasSuffix(key, "Name") {
			addressKey := strings.TrimSuffix(key, "Name")
			if processedPairs[addressKey] {
				result[i].NoTable = true
			}
		} else if processedPairs[key] {
			// This is an address field that has a matching name field
			result[i].NoTable = true
		}
	}

	*fields = result
}
