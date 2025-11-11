// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package names

// EXISTING_CODE
import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

// EXISTING_CODE

type NamesPage struct {
	Facet         types.DataFacet  `json:"facet"`
	Names         []Name           `json:"names"`
	TotalItems    int              `json:"totalItems"`
	ExpectedTotal int              `json:"expectedTotal"`
	State         types.StoreState `json:"state"`
	// EXISTING_CODE
	// EXISTING_CODE
}

func (p *NamesPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *NamesPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *NamesPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *NamesPage) GetState() types.StoreState {
	return p.State
}

func (c *NamesCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	filter = strings.ToLower(filter)
	dataFacet := payload.DataFacet
	page := &NamesPage{
		Facet: dataFacet,
	}
	_ = preprocessPage(c, page, payload, first, pageSize, sortSpec)

	if c.shouldSummarize(payload) {
		return c.getSummaryPage(payload, first, pageSize, sortSpec, filter)
	}

	switch dataFacet {

	case NamesAll:
		facet := c.allFacet
		var filterFunc func(*Name) bool
		if filter != "" {
			filterFunc = func(item *Name) bool {
				return c.matchesAllFilter(item, filter)
			}
		}
		sortFunc := func(items []Name, sort sdk.SortSpec) error {
			return sdk.SortNames(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("names", dataFacet, "GetPage", err)
		} else {
			page.Names = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case NamesCustom:
		facet := c.customFacet
		var filterFunc func(*Name) bool
		if filter != "" {
			filterFunc = func(item *Name) bool {
				return c.matchesCustomFilter(item, filter)
			}
		}
		sortFunc := func(items []Name, sort sdk.SortSpec) error {
			return sdk.SortNames(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("names", dataFacet, "GetPage", err)
		} else {
			page.Names = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case NamesPrefund:
		facet := c.prefundFacet
		var filterFunc func(*Name) bool
		if filter != "" {
			filterFunc = func(item *Name) bool {
				return c.matchesPrefundFilter(item, filter)
			}
		}
		sortFunc := func(items []Name, sort sdk.SortSpec) error {
			return sdk.SortNames(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("names", dataFacet, "GetPage", err)
		} else {
			page.Names = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case NamesRegular:
		facet := c.regularFacet
		var filterFunc func(*Name) bool
		if filter != "" {
			filterFunc = func(item *Name) bool {
				return c.matchesRegularFilter(item, filter)
			}
		}
		sortFunc := func(items []Name, sort sdk.SortSpec) error {
			return sdk.SortNames(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("names", dataFacet, "GetPage", err)
		} else {
			page.Names = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case NamesBaddress:
		facet := c.baddressFacet
		var filterFunc func(*Name) bool
		if filter != "" {
			filterFunc = func(item *Name) bool {
				return c.matchesBaddressFilter(item, filter)
			}
		}
		sortFunc := func(items []Name, sort sdk.SortSpec) error {
			return sdk.SortNames(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("names", dataFacet, "GetPage", err)
		} else {
			page.Names = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("names", payload.DataFacet, "GetPage",
			fmt.Errorf("[GetPage] unsupported dataFacet: %v", payload.DataFacet))
	}

	return page, nil
}

// shouldSummarize returns true if the current facet can be simmarized by period
func (c *NamesCollection) shouldSummarize(payload *types.Payload) bool {
	if !payload.ShouldSummarize() {
		return false
	}
	// EXISTING_CODE
	// EXISTING_CODE
	return false
}

// getSummaryPage returns paginated summary data for a given period
func (c *NamesCollection) getSummaryPage(
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

	page := &NamesPage{
		Facet: dataFacet,
	}

	switch dataFacet {
	// EXISTING_CODE
	// EXISTING_CODE
	default:
		return nil, types.NewValidationError("names", dataFacet, "getSummaryPage",
			fmt.Errorf("[getSummaryPage] unsupported dataFacet: %v %v", dataFacet, page.Facet))
	}
}

// generateSummariesForPeriod ensures summaries are generated for the given period
func (c *NamesCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period types.Period) error {
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
	c *NamesCollection,
	page *NamesPage,
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
// EXISTING_CODE
