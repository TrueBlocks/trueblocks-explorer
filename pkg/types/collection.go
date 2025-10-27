package types

import (
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

type Page interface {
	GetFacet() DataFacet
	GetTotalItems() int
	GetExpectedTotal() int
	GetState() StoreState
}

type Collection interface {
	GetPage(payload *Payload, first, pageSize int, sort sdk.SortSpec, filter string) (Page, error)
	FetchByFacet(facet DataFacet)
	Reset(facet DataFacet)
	NeedsUpdate(facet DataFacet) bool
	GetSupportedFacets() []DataFacet
	GetStoreName(payload *Payload, facet DataFacet) string
	GetSummary() Summary
	ExportData(payload *Payload) (string, error)
	GetConfig() (*ViewConfig, error)
	SummaryAccumulator
}
