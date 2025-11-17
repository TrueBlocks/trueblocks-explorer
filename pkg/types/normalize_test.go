package types

import (
	"testing"
)

func TestConsolidateNamedAddresses(t *testing.T) {
	tests := []struct {
		name     string
		input    []FieldConfig
		expected []FieldConfig
	}{
		{
			name: "single address+name pair",
			input: []FieldConfig{
				{Key: "blockNumber", Type: "blknum"},
				{Key: "from", Type: "address", Section: "Overview", Label: "From"},
				{Key: "fromName", Type: "string", Section: "Overview"},
				{Key: "value", Type: "wei"},
			},
			expected: []FieldConfig{
				{Key: "blockNumber", Type: "blknum"},
				{Key: "from", Type: "address", Section: "Overview", Label: "From", NoTable: true},
				{Key: "fromNamed", Type: "namedAddress", Section: "Overview", Label: "From", NoDetail: true},
				{Key: "fromName", Type: "string", Section: "Overview", NoTable: true},
				{Key: "value", Type: "wei"},
			},
		},
		{
			name: "multiple address+name pairs",
			input: []FieldConfig{
				{Key: "from", Type: "address", Section: "Overview"},
				{Key: "fromName", Type: "string", Section: "Overview"},
				{Key: "to", Type: "address", Section: "Overview"},
				{Key: "toName", Type: "string", Section: "Overview"},
			},
			expected: []FieldConfig{
				{Key: "from", Type: "address", Section: "Overview", NoTable: true},
				{Key: "fromNamed", Type: "namedAddress", Section: "Overview", NoDetail: true},
				{Key: "fromName", Type: "string", Section: "Overview", NoTable: true},
				{Key: "to", Type: "address", Section: "Overview", NoTable: true},
				{Key: "toNamed", Type: "namedAddress", Section: "Overview", NoDetail: true},
				{Key: "toName", Type: "string", Section: "Overview", NoTable: true},
			},
		},
		{
			name: "no matching pairs",
			input: []FieldConfig{
				{Key: "blockNumber", Type: "blknum"},
				{Key: "value", Type: "wei"},
				{Key: "status", Type: "string"},
			},
			expected: []FieldConfig{
				{Key: "blockNumber", Type: "blknum"},
				{Key: "value", Type: "wei"},
				{Key: "status", Type: "string"},
			},
		},
		{
			name: "address without name",
			input: []FieldConfig{
				{Key: "address", Type: "address"},
				{Key: "value", Type: "wei"},
			},
			expected: []FieldConfig{
				{Key: "address", Type: "address"},
				{Key: "value", Type: "wei"},
			},
		},
		{
			name: "name without address",
			input: []FieldConfig{
				{Key: "contractName", Type: "string"},
				{Key: "value", Type: "wei"},
			},
			expected: []FieldConfig{
				{Key: "contractName", Type: "string"},
				{Key: "value", Type: "wei"},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Make a copy to avoid modifying the test data
			input := make([]FieldConfig, len(tt.input))
			copy(input, tt.input)

			consolidateNamedAddresses(&input)

			if len(input) != len(tt.expected) {
				t.Errorf("Expected %d fields, got %d", len(tt.expected), len(input))
				return
			}

			for i, expected := range tt.expected {
				actual := input[i]
				if actual.Key != expected.Key {
					t.Errorf("Field %d: expected key %s, got %s", i, expected.Key, actual.Key)
				}
				if actual.Type != expected.Type {
					t.Errorf("Field %d: expected type %s, got %s", i, expected.Type, actual.Type)
				}
				if actual.NoTable != expected.NoTable {
					t.Errorf("Field %d (%s): expected NoTable %t, got %t", i, actual.Key, expected.NoTable, actual.NoTable)
				}
				if actual.NoDetail != expected.NoDetail {
					t.Errorf("Field %d (%s): expected NoDetail %t, got %t", i, actual.Key, expected.NoDetail, actual.NoDetail)
				}
				if actual.Section != expected.Section {
					t.Errorf("Field %d (%s): expected section %s, got %s", i, actual.Key, expected.Section, actual.Section)
				}
			}
		})
	}
}

func TestNormalizeFieldsWithNamedAddresses(t *testing.T) {
	input := []FieldConfig{
		{Key: "blockNumber", Type: "blknum"},
		{Key: "from", Type: "address", Section: "Overview"},
		{Key: "fromName", Type: "string", Section: "Overview"},
		{Key: "value", Type: "wei"},
	}

	NormalizeFields(&input)

	// Should have identifier consolidation AND named address consolidation
	hasIdentifier := false
	hasFromNamed := false
	fromHidden := false
	fromNameHidden := false

	for _, field := range input {
		switch field.Key {
		case "identifier":
			hasIdentifier = true
		case "fromNamed":
			hasFromNamed = true
			if field.Type != "namedAddress" {
				t.Errorf("fromNamed should have type namedAddress, got %s", field.Type)
			}
		case "from":
			fromHidden = field.NoTable
		case "fromName":
			fromNameHidden = field.NoTable
		}
	}

	if !hasIdentifier {
		t.Error("Expected identifier field to be created")
	}
	if !hasFromNamed {
		t.Error("Expected fromNamed field to be created")
	}
	if !fromHidden {
		t.Error("Expected original from field to be hidden from table")
	}
	if !fromNameHidden {
		t.Error("Expected original fromName field to be hidden from table")
	}
}
