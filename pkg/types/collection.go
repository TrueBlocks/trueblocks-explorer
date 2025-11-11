package types

import (
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

type Page interface {
	GetFacet() DataFacet
	GetTotalItems() int
	GetExpectedTotal() int
	GetState() StoreState
}

type Collection interface {
	GetPage(payload *Payload, first, pageSize int, sort sdk.SortSpec, filter string) (Page, error)
	FetchByFacet(payload *Payload)
	Reset(payload *Payload)
	NeedsUpdate(payload *Payload) bool
	GetSummary(payload *Payload) Summary
	ExportData(payload *Payload) (string, error)
	ChangeVisibility(payload *Payload) error
	GetConfig() (*ViewConfig, error)
	SummaryAccumulator
}
