// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package status

// EXISTING_CODE
import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// EXISTING_CODE

type StatusPage struct {
	Facet         types.DataFacet  `json:"facet"`
	Caches        []Cache          `json:"caches"`
	Chains        []Chain          `json:"chains"`
	Status        []Status         `json:"status"`
	TotalItems    int              `json:"totalItems"`
	ExpectedTotal int              `json:"expectedTotal"`
	State         types.StoreState `json:"state"`
	// EXISTING_CODE
	// EXISTING_CODE
}

func (p *StatusPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *StatusPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *StatusPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *StatusPage) GetState() types.StoreState {
	return p.State
}

func (c *StatusCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	filter = strings.ToLower(filter)
	dataFacet := payload.DataFacet
	page := &StatusPage{
		Facet: dataFacet,
	}
	_ = preprocessPage(c, page, payload, first, pageSize, sortSpec)

	if c.shouldSummarize(payload) {
		return c.getSummaryPage(dataFacet, payload.Period, first, pageSize, sortSpec, filter)
	}

	switch dataFacet {

	case StatusStatus:
		facet := c.statusFacet
		var filterFunc func(*Status) bool
		if filter != "" {
			filterFunc = func(item *Status) bool {
				return c.matchesStatusFilter(item, filter)
			}
		}
		sortFunc := func(items []Status, sort sdk.SortSpec) error {
			return sdk.SortStatus(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("status", dataFacet, "GetPage", err)
		} else {
			page.Status = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case StatusCaches:
		facet := c.cachesFacet
		var filterFunc func(*Cache) bool
		if filter != "" {
			filterFunc = func(item *Cache) bool {
				return c.matchesCacheFilter(item, filter)
			}
		}
		sortFunc := func(items []Cache, sort sdk.SortSpec) error {
			return sdk.SortCaches(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("status", dataFacet, "GetPage", err)
		} else {
			page.Caches = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case StatusChains:
		facet := c.chainsFacet
		var filterFunc func(*Chain) bool
		if filter != "" {
			filterFunc = func(item *Chain) bool {
				return c.matchesChainFilter(item, filter)
			}
		}
		sortFunc := func(items []Chain, sort sdk.SortSpec) error {
			return sdk.SortChains(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("status", dataFacet, "GetPage", err)
		} else {
			page.Chains = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("status", dataFacet, "GetPage",
			fmt.Errorf("[GetPage] unsupported dataFacet: %v", dataFacet))
	}

	return page, nil
}

// shouldSummarize returns true if the current facet can be simmarized by period
func (c *StatusCollection) shouldSummarize(payload *types.Payload) bool {
	if !payload.ShouldSummarize() {
		return false
	}
	// EXISTING_CODE
	// EXISTING_CODE
	return false
}

// getSummaryPage returns paginated summary data for a given period
func (c *StatusCollection) getSummaryPage(
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
	c.FetchByFacet(dataFacet)
	if err := c.generateSummariesForPeriod(dataFacet, period); err != nil {
		return nil, types.NewStoreError("exports", dataFacet, "getSummaryPage", err)
	}

	page := &StatusPage{
		Facet: dataFacet,
	}

	switch dataFacet {
	// EXISTING_CODE
	// EXISTING_CODE
	default:
		return nil, types.NewValidationError("status", dataFacet, "getSummaryPage",
			fmt.Errorf("[getSummaryPage] unsupported dataFacet: %v %v", dataFacet, page.Facet))
	}
}

// generateSummariesForPeriod ensures summaries are generated for the given period
func (c *StatusCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period string) error {
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
	c *StatusCollection,
	page *StatusPage,
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
func (c *StatusCollection) matchesCacheFilter(item *Cache, filter string) bool {
	_ = item
	_ = filter
	return true
}

func (c *StatusCollection) matchesChainFilter(item *Chain, filter string) bool {
	_ = item
	_ = filter
	return true
}

func (c *StatusCollection) matchesStatusFilter(item *Status, filter string) bool {
	_ = item
	_ = filter
	return true
}

// EXISTING_CODE
