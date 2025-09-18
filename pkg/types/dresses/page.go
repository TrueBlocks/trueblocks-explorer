// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package dresses

import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	//
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	// EXISTING_CODE
	dalle "github.com/TrueBlocks/trueblocks-dalle/v2"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/model"
	// EXISTING_CODE
)

type DalleDressPage struct {
	Facet         types.DataFacet `json:"facet"`
	Logs          []*Log          `json:"logs"`
	Dresses       []*DalleDress   `json:"dresses"`
	Databases     []*Database     `json:"databases"`
	Series        []*Series       `json:"series"`
	TotalItems    int             `json:"totalItems"`
	ExpectedTotal int             `json:"expectedTotal"`
	IsFetching    bool            `json:"isFetching"`
	State         types.LoadState `json:"state"`
}

func (p *DalleDressPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *DalleDressPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *DalleDressPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *DalleDressPage) GetIsFetching() bool {
	return p.IsFetching
}

func (p *DalleDressPage) GetState() types.LoadState {
	return p.State
}

func (c *DalleDressCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	dataFacet := payload.DataFacet
	// BINGY_JOE
	// TODO: BOGUS - CLEAN THIS UP?
	const UnpaginatedPageSize = 1_000_000_000
	if dataFacet == DalleDressGenerator || dataFacet == DalleDressGallery {
		first = 0
		pageSize = UnpaginatedPageSize
	}
	// BINGY_JOE

	page := &DalleDressPage{
		Facet: dataFacet,
	}
	filter = strings.ToLower(filter)

	if c.shouldSummarize(payload) {
		return c.getSummaryPage(dataFacet, payload.Period, first, pageSize, sortSpec, filter)
	}

	switch dataFacet {
	case DalleDressGenerator:
		facet := c.generatorFacet
		var filterFunc func(*DalleDress) bool
		filterFunc = func(item *DalleDress) bool {
			// First check if the dresses belongs to a deleted series
			if item.Series != "" {
				seriesItems := c.seriesFacet.GetStore().GetItems()
				for _, s := range seriesItems {
					if s != nil && s.Suffix == item.Series && s.Deleted {
						return false // Exclude dresses from deleted series
					}
				}
			}
			// Then apply text filter if provided
			if filter != "" {
				return c.matchesGeneratorFilter(item, filter)
			}
			return true
		}
		sortFunc := func(items []DalleDress, sort sdk.SortSpec) error {
			return model.SortDalleDress(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("dresses", dataFacet, "GetPage", err)
		} else {
			generator := make([]*DalleDress, 0, len(result.Items))
			for i := range result.Items {
				generator = append(generator, &result.Items[i])
			}
			page.Dresses, page.TotalItems, page.State = generator, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case DalleDressSeries:
		facet := c.seriesFacet
		var filterFunc func(*Series) bool
		if filter != "" {
			filterFunc = func(item *Series) bool {
				return c.matchesSeriesFilter(item, filter)
			}
		}
		sortFunc := func(items []Series, sort sdk.SortSpec) error {
			return dalle.SortSeries(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("dresses", dataFacet, "GetPage", err)
		} else {
			series := make([]*Series, 0, len(result.Items))
			for i := range result.Items {
				series = append(series, &result.Items[i])
			}
			page.Series, page.TotalItems, page.State = series, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case DalleDressDatabases:
		facet := c.databasesFacet
		var filterFunc func(*Database) bool
		if filter != "" {
			filterFunc = func(item *Database) bool {
				return c.matchesDatabaseFilter(item, filter)
			}
		}
		sortFunc := func(items []Database, sort sdk.SortSpec) error {
			return dalle.SortDatabases(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("dresses", dataFacet, "GetPage", err)
		} else {
			database := make([]*Database, 0, len(result.Items))
			for i := range result.Items {
				database = append(database, &result.Items[i])
			}
			page.Databases, page.TotalItems, page.State = database, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case DalleDressEvents:
		facet := c.eventsFacet
		var filterFunc func(*Log) bool
		if filter != "" {
			filterFunc = func(item *Log) bool {
				return c.matchesEventFilter(item, filter)
			}
		}
		sortFunc := func(items []Log, sort sdk.SortSpec) error {
			return sdk.SortLogs(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("dresses", dataFacet, "GetPage", err)
		} else {
			event := make([]*Log, 0, len(result.Items))
			for i := range result.Items {
				event = append(event, &result.Items[i])
			}
			page.Logs, page.TotalItems, page.State = event, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case DalleDressGallery:
		facet := c.galleryFacet
		var filterFunc func(*DalleDress) bool
		filterFunc = func(item *DalleDress) bool {
			// First check if the dresses belongs to a deleted series
			if item.Series != "" {
				seriesItems := c.seriesFacet.GetStore().GetItems()
				for _, s := range seriesItems {
					if s != nil && s.Suffix == item.Series && s.Deleted {
						return false // Exclude dresseses from deleted series
					}
				}
			}
			// Then apply text filter if provided
			if filter != "" {
				return c.matchesGalleryFilter(item, filter)
			}
			return true
		}
		sortFunc := func(items []DalleDress, sort sdk.SortSpec) error {
			return model.SortDalleDress(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("dresses", dataFacet, "GetPage", err)
		} else {
			gallery := make([]*DalleDress, 0, len(result.Items))
			for i := range result.Items {
				gallery = append(gallery, &result.Items[i])
			}
			page.Dresses, page.TotalItems, page.State = gallery, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("dresses", dataFacet, "GetPage",
			fmt.Errorf("[GetPage] unsupported dataFacet: %v", dataFacet))
	}

	return page, nil
}

// shouldSummarize returns true if the current facet can be simmarized by period
func (c *DalleDressCollection) shouldSummarize(payload *types.Payload) bool {
	if !payload.ShouldSummarize() {
		return false
	}
	// EXISTING_CODE
	// EXISTING_CODE
	return false
}

// getSummaryPage returns paginated summary data for a given period
func (c *DalleDressCollection) getSummaryPage(
	dataFacet types.DataFacet,
	period string,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	// TODO: Use these
	_ = first
	_ = pageSize
	_ = sortSpec
	_ = filter
	// CRITICAL: Ensure underlying raw data is loaded before generating summaries
	// For summary periods, we need the blockly (raw) data to be loaded first
	c.LoadData(dataFacet)
	if err := c.generateSummariesForPeriod(dataFacet, period); err != nil {
		return nil, types.NewStoreError("exports", dataFacet, "getSummaryPage", err)
	}

	page := &DalleDressPage{
		Facet: dataFacet,
	}

	switch dataFacet {
	// EXISTING_CODE
	// EXISTING_CODE
	default:
		return nil, types.NewValidationError("dresses", dataFacet, "getSummaryPage",
			fmt.Errorf("[getSummaryPage] unsupported dataFacet: %v %v", dataFacet, page.Facet))
	}
}

// generateSummariesForPeriod ensures summaries are generated for the given period
func (c *DalleDressCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period string) error {
	// TODO: Use this
	_ = period
	switch dataFacet {
	// EXISTING_CODE
	// EXISTING_CODE
	default:
		return fmt.Errorf("[generateSummariesForPeriod] unsupported dataFacet for summary generation: %v", dataFacet)
	}
}

// EXISTING_CODE
func (c *DalleDressCollection) matchesGeneratorFilter(item *DalleDress, filter string) bool {
	_ = item   // delint
	_ = filter // delint
	return true
}

func (c *DalleDressCollection) matchesSeriesFilter(item *Series, filter string) bool {
	if item == nil {
		return false
	}
	if filter == "" {
		return true
	}
	// simple case-insensitive substring match on suffix
	lf := strings.ToLower(filter)
	return strings.Contains(strings.ToLower(item.Suffix), lf)
}

func (c *DalleDressCollection) matchesDatabaseFilter(item *Database, filter string) bool {
	_ = item   // delint
	_ = filter // delint
	return true
}

func (c *DalleDressCollection) matchesEventFilter(item *Log, filter string) bool {
	_ = item   // delint
	_ = filter // delint
	return true
}

func (c *DalleDressCollection) matchesGalleryFilter(item *DalleDress, filter string) bool {
	_ = item   // delint
	_ = filter // delint
	return true
}

// EXISTING_CODE
