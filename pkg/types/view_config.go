package types

// ViewConfig represents the complete configuration for a view
type ViewConfig struct {
	ViewName   string                  `json:"viewName"`
	Disabled   bool                    `json:"disabled"`
	Facets     map[string]FacetConfig  `json:"facets"`
	Actions    map[string]ActionConfig `json:"actions"`
	FacetOrder []string                `json:"facetOrder"`
	MenuOrder  int                     `json:"menuOrder,omitempty"`
}

// FacetConfig represents configuration for a single facet within a view
type FacetConfig struct {
	Name             string              `json:"name"`
	Store            string              `json:"store"`
	ViewType         string              `json:"viewType,omitempty"`
	DividerBefore    bool                `json:"dividerBefore"`
	Disabled         bool                `json:"disabled"`
	Fields           []FieldConfig       `json:"fields"`
	Columns          []ColumnConfig      `json:"columns"`
	DetailPanels     []DetailPanelConfig `json:"detailPanels"`
	Actions          []string            `json:"actions"`
	HeaderActions    []string            `json:"headerActions"`
	RendererTypes    string              `json:"rendererTypes"`
	PanelChartConfig *PanelChartConfig   `json:"panelChartConfig,omitempty"`
	FacetChartConfig *FacetChartConfig   `json:"facetChartConfig,omitempty"`
	RowAction        *RowActionConfig    `json:"rowAction,omitempty"`
}

// FieldConfig is the single source-of-truth for facet fields
// Header is derived from Label; do not duplicate.
type FieldConfig struct {
	Key         string `json:"key"`
	Label       string `json:"label"`
	Formatter   string `json:"formatter"`
	Section     string `json:"section"`
	Width       int    `json:"width"`
	Sortable    bool   `json:"sortable"`
	Order       int    `json:"order"`
	DetailOrder int    `json:"detailOrder"`
	NoTable     bool   `json:"-"`
	NoDetail    bool   `json:"-"`
	ColumnLabel string `json:"-"`
	DetailLabel string `json:"-"`
}

// ColumnConfig represents a table column configuration
type ColumnConfig struct {
	Key       string `json:"key"`
	Header    string `json:"header"`
	Width     int    `json:"width"`
	Sortable  bool   `json:"sortable"`
	Formatter string `json:"formatter"`
	Order     int    `json:"order"`
}

// DetailPanelConfig represents a detail panel section
type DetailPanelConfig struct {
	Title     string              `json:"title"`
	Collapsed bool                `json:"collapsed"`
	Fields    []DetailFieldConfig `json:"fields"`
}

// DetailFieldConfig represents a field in a detail panel
type DetailFieldConfig struct {
	Key         string `json:"key"`
	Label       string `json:"label"`
	Formatter   string `json:"formatter"`
	DetailOrder int    `json:"detailOrder"`
}

// ActionConfig represents an available action (delete, remove, etc.)
type ActionConfig struct {
	Name         string `json:"name"`
	Label        string `json:"label"`
	Icon         string `json:"icon"`
	Confirmation bool   `json:"confirmation"`
}

// IsDisabled returns true if the view is disabled or all its facets are disabled
func (vc *ViewConfig) IsDisabled() bool {
	if vc.Disabled {
		return true
	}
	if len(vc.Facets) == 0 {
		return false
	}
	for _, facet := range vc.Facets {
		if !facet.Disabled {
			return false
		}
	}
	return true
}

// FacetChartConfig represents facet-level chart configuration
type FacetChartConfig struct {
	SeriesStrategy  string `json:"seriesStrategy,omitempty"`  // how to group data into series ("address", "symbol", "address+symbol")
	SeriesPrefixLen int    `json:"seriesPrefixLen,omitempty"` // prefix length for collision avoidance (8-15)
}

// PanelChartConfig represents visualization panel configuration
type PanelChartConfig struct {
	Type          string         `json:"type"`                  // "barchart" or "heatmap"
	DefaultMetric string         `json:"defaultMetric"`         // key of default metric
	SkipUntil     string         `json:"skipUntil,omitempty"`   // optional date filter
	TimeGroupBy   string         `json:"timeGroupBy,omitempty"` // "daily", "monthly", "quarterly", "annual"
	Metrics       []MetricConfig `json:"metrics"`               // available metrics
}

// MetricConfig represents a single metric configuration
type MetricConfig struct {
	Key          string `json:"key"`          // unique identifier
	Label        string `json:"label"`        // display name
	BucketsField string `json:"bucketsField"` // field name in Buckets struct
	Bytes        bool   `json:"bytes"`        // whether to format as bytes
}

// RowIdentifier represents different ways to identify/extract context from a row
type RowIdentifier struct {
	Type       string `json:"type"`                 // "address", "hash", "blockRange"
	FieldName  string `json:"fieldName"`            // Field name to extract from row data
	ContextKey string `json:"contextKey,omitempty"` // Key to use in context (defaults to Type)
}

// RowActionConfig defines what happens when a user presses Enter on a table row
type RowActionConfig struct {
	Type          string                 `json:"type"`                    // "navigate", "modal", "custom", "none"
	Target        *NavigationTarget      `json:"target,omitempty"`        // For navigation actions
	CustomHandler string                 `json:"customHandler,omitempty"` // For custom actions
	Parameters    map[string]interface{} `json:"parameters,omitempty"`    // Additional parameters
}

// NavigationTarget defines the destination for row navigation actions
type NavigationTarget struct {
	View        string          `json:"view"`                  // Target view name (e.g., "exports")
	Facet       string          `json:"facet"`                 // Target facet (e.g., "assetcharts") or "<latest>" for last visited
	RowIndex    int             `json:"rowIndex"`              // Row index in target view (default: 0)
	Identifiers []RowIdentifier `json:"identifiers,omitempty"` // Context extraction rules
}

// NewRowActionNavigation creates a navigation row action with sensible defaults
func NewRowActionNavigation(targetView, targetFacet, fieldType, fieldName string) *RowActionConfig {
	return &RowActionConfig{
		Type: "navigate",
		Target: &NavigationTarget{
			View:     targetView,
			Facet:    targetFacet,
			RowIndex: 0,
			Identifiers: []RowIdentifier{
				{
					Type:       fieldType,
					FieldName:  fieldName,
					ContextKey: fieldType,
				},
			},
		},
	}
}
