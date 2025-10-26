package types

// Period represents different time aggregation levels
type Period string

// Period constants for different time aggregation levels
const (
	PeriodBlockly   Period = "blockly" // Default - no aggregation, raw data
	PeriodHourly    Period = "hourly"
	PeriodDaily     Period = "daily"
	PeriodWeekly    Period = "weekly"
	PeriodMonthly   Period = "monthly"
	PeriodQuarterly Period = "quarterly"
	PeriodAnnual    Period = "annual"
)

var AllPeriods = []struct {
	Value  Period `json:"value"`
	TSName string `json:"tsname"`
}{
	{PeriodBlockly, "BLOCKLY"},
	{PeriodHourly, "HOURLY"},
	{PeriodDaily, "DAILY"},
	{PeriodWeekly, "WEEKLY"},
	{PeriodMonthly, "MONTHLY"},
	{PeriodQuarterly, "QUARTERLY"},
	{PeriodAnnual, "ANNUAL"},
}
