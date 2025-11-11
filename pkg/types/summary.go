package types

type Summary struct {
	TotalCount  int                    `json:"totalCount"`
	FacetCounts map[DataFacet]int      `json:"facetCounts"`
	CustomData  map[string]interface{} `json:"customData,omitempty"`
	LastUpdated int64                  `json:"lastUpdated"`
}

type SummaryAccumulator interface {
	AccumulateItem(item interface{}, summary *Summary)
	GetSummary(payload *Payload) Summary
	ResetSummary()
}
