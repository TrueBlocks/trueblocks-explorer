package types

// Period string constants for different time aggregation levels
const (
	PeriodBlockly   = "blockly" // Default - no aggregation, raw data
	PeriodHourly    = "hourly"
	PeriodDaily     = "daily"
	PeriodWeekly    = "weekly"
	PeriodMonthly   = "monthly"
	PeriodQuarterly = "quarterly"
	PeriodAnnual    = "annual"
)

type Payload struct {
	Collection  string    `json:"collection"`
	DataFacet   DataFacet `json:"dataFacet"`
	Chain       string    `json:"chain,omitempty"`
	Address     string    `json:"address,omitempty"`
	Period      string    `json:"period,omitempty"`
	Format      string    `json:"format,omitempty"`
	ProjectPath string    `json:"projectPath,omitempty"`
}

func (p *Payload) ShouldSummarize() bool {
	return p.Period != PeriodBlockly
}

type DataLoadedPayload struct {
	Payload
	CurrentCount  int        `json:"currentCount"`
	ExpectedTotal int        `json:"expectedTotal"`
	State         StoreState `json:"state"`
	Summary       Summary    `json:"summary"`
	Error         string     `json:"error,omitempty"`
	Timestamp     int64      `json:"timestamp"`
	EventPhase    string     `json:"eventPhase"`
	Operation     string     `json:"operation,omitempty"`
}

type ProjectPayload struct {
	HasProject     bool                 `json:"hasProject"`
	ActiveChain    string               `json:"activeChain"`
	ActivePeriod   string               `json:"activePeriod"`
	ActiveAddress  string               `json:"activeAddress"`
	ActiveContract string               `json:"activeContract"`
	LastView       string               `json:"lastView"`
	LastFacetMap   map[string]DataFacet `json:"lastFacetMap"`
}

type NavigationPayload struct {
	Payload
	RecordId string `json:"recordId"` // Unique identifier for database lookup
	RowIndex int    `json:"rowIndex"` // Calculated position in current table
}

type RowActionPayload struct {
	Payload
	RowData       map[string]interface{} `json:"rowData"`
	RowAction     *RowActionConfig       `json:"rowAction"`
	ContextValues map[string]interface{} `json:"contextValues,omitempty"` // Processed context values
}
