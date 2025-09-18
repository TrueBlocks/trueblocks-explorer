package project

// ------------------------------------------------------------------------------------
type FilterState struct {
	Sorting   map[string]interface{} `json:"sorting,omitempty"`
	Filtering map[string]interface{} `json:"filtering,omitempty"`
	Other     map[string]interface{} `json:"other,omitempty"`
}
