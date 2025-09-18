package sorting

import sdk "github.com/TrueBlocks/trueblocks-sdk/v5"

// NewSortSpec creates a single-field SortSpec with proper slice initialization
// Always returns initialized slices to prevent nil slice panics in SDK functions
func NewSortSpec(field, direction string) sdk.SortSpec {
	if field == "" {
		return sdk.SortSpec{
			Fields: []string{},        // Empty slice, not nil
			Order:  []sdk.SortOrder{}, // Empty slice, not nil
		}
	}

	order := sdk.Asc
	if direction == "desc" {
		order = sdk.Dec
	}

	return sdk.SortSpec{
		Fields: []string{field},
		Order:  []sdk.SortOrder{order},
	}
}

// GetSortField extracts the first field from a SortSpec (for backward compatibility)
func GetSortField(spec sdk.SortSpec) string {
	if len(spec.Fields) > 0 {
		return spec.Fields[0]
	}
	return ""
}

// GetSortDirection extracts the first order from a SortSpec as string
func GetSortDirection(spec sdk.SortSpec) string {
	if len(spec.Order) > 0 && spec.Order[0] == sdk.Dec {
		return "desc"
	}
	return "asc"
}

// IsEmptySort checks if SortSpec is empty/unset
func IsEmptySort(spec sdk.SortSpec) bool {
	return len(spec.Fields) == 0 || spec.Fields[0] == ""
}

// EmptySortSpec returns a safe empty SortSpec (no sorting)
func EmptySortSpec() sdk.SortSpec {
	return sdk.SortSpec{
		Fields: []string{},        // Empty slice, not nil
		Order:  []sdk.SortOrder{}, // Empty slice, not nil
	}
}
