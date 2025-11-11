// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package dresses

// EXISTING_CODE
import (
	"fmt"
	"strings"

	dalle "github.com/TrueBlocks/trueblocks-dalle/v6"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

// EXISTING_CODE

type DressesPage struct {
	Facet         types.DataFacet  `json:"facet"`
	DalleDress    []DalleDress     `json:"dalledress"`
	Databases     []Database       `json:"databases"`
	Logs          []Log            `json:"logs"`
	Series        []Series         `json:"series"`
	TotalItems    int              `json:"totalItems"`
	ExpectedTotal int              `json:"expectedTotal"`
	State         types.StoreState `json:"state"`
	// EXISTING_CODE
	// EXISTING_CODE
}

func (p *DressesPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *DressesPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *DressesPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *DressesPage) GetState() types.StoreState {
	return p.State
}

func (c *DressesCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	filter = strings.ToLower(filter)
	dataFacet := payload.DataFacet
	page := &DressesPage{
		Facet: dataFacet,
	}
	_ = preprocessPage(c, page, payload, first, pageSize, sortSpec)
	if page.Facet == DressesGenerator || page.Facet == DressesGallery {
		first = 0
		pageSize = 1_000_000_000
	}

	if c.shouldSummarize(payload) {
		return c.getSummaryPage(payload, first, pageSize, sortSpec, filter)
	}

	switch dataFacet {

	case DressesGenerator:
		facet := c.generatorFacet
		var filterFunc func(*DalleDress) bool
		if filter != "" {
			filterFunc = func(item *DalleDress) bool {
				return c.matchesGeneratorFilter(item, filter)
			}
		}
		sortFunc := func(items []DalleDress, sort sdk.SortSpec) error {
			return dalle.SortDalleDress(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("dresses", dataFacet, "GetPage", err)
		} else {
			page.DalleDress = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case DressesSeries:
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
			page.Series = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case DressesDatabases:
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
			page.Databases = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case DressesEvents:
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
			page.Logs = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case DressesGallery:
		facet := c.galleryFacet
		var filterFunc func(*DalleDress) bool
		if filter != "" {
			filterFunc = func(item *DalleDress) bool {
				return c.matchesGalleryFilter(item, filter)
			}
		}
		sortFunc := func(items []DalleDress, sort sdk.SortSpec) error {
			return dalle.SortDalleDress(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("dresses", dataFacet, "GetPage", err)
		} else {
			page.DalleDress = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("dresses", payload.DataFacet, "GetPage",
			fmt.Errorf("[GetPage] unsupported dataFacet: %v", payload.DataFacet))
	}

	return page, nil
}

// shouldSummarize returns true if the current facet can be simmarized by period
func (c *DressesCollection) shouldSummarize(payload *types.Payload) bool {
	if !payload.ShouldSummarize() {
		return false
	}
	// EXISTING_CODE
	// EXISTING_CODE
	return false
}

// getSummaryPage returns paginated summary data for a given period
func (c *DressesCollection) getSummaryPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	// TODO: Use these
	dataFacet := payload.DataFacet
	period := payload.ActivePeriod
	_ = first
	_ = pageSize
	_ = sortSpec
	_ = filter
	// CRITICAL: Ensure underlying raw data is loaded before generating summaries
	// For summary periods, we need the blockly (raw) data to be loaded first
	c.FetchByFacet(payload)
	if err := c.generateSummariesForPeriod(dataFacet, period); err != nil {
		return nil, types.NewStoreError("exports", dataFacet, "getSummaryPage", err)
	}

	page := &DressesPage{
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
func (c *DressesCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period types.Period) error {
	// TODO: Use this
	_ = period
	switch dataFacet {
	// EXISTING_CODE
	// EXISTING_CODE
	default:
		return fmt.Errorf("[generateSummariesForPeriod] unsupported dataFacet for summary: %v", dataFacet)
	}
}

func preprocessPage(
	c *DressesCollection,
	page *DressesPage,
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
) error {
	_ = page
	_ = c
	_ = payload
	_ = first
	_ = pageSize
	_ = sortSpec
	// EXISTING_CODE
	// EXISTING_CODE
	return nil
}

// EXISTING_CODE
func (c *DressesCollection) matchesGeneratorFilter(item *DalleDress, filter string) bool {
	_ = item   // delint
	_ = filter // delint
	return true
}

func (c *DressesCollection) matchesSeriesFilter(item *Series, filter string) bool {
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

func (c *DressesCollection) matchesDatabaseFilter(item *Database, filter string) bool {
	_ = item   // delint
	_ = filter // delint
	return true
}

func (c *DressesCollection) matchesEventFilter(item *Log, filter string) bool {
	_ = item   // delint
	_ = filter // delint
	return true
}

func (c *DressesCollection) matchesGalleryFilter(item *DalleDress, filter string) bool {
	_ = item   // delint
	_ = filter // delint
	return true
}

// EXISTING_CODE
