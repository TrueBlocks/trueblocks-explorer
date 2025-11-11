// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package monitors

// EXISTING_CODE
import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

// EXISTING_CODE

type MonitorsPage struct {
	Facet         types.DataFacet  `json:"facet"`
	Monitors      []Monitor        `json:"monitors"`
	TotalItems    int              `json:"totalItems"`
	ExpectedTotal int              `json:"expectedTotal"`
	State         types.StoreState `json:"state"`
	// EXISTING_CODE
	// EXISTING_CODE
}

func (p *MonitorsPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *MonitorsPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *MonitorsPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *MonitorsPage) GetState() types.StoreState {
	return p.State
}

func (c *MonitorsCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	filter = strings.ToLower(filter)
	dataFacet := payload.DataFacet
	page := &MonitorsPage{
		Facet: dataFacet,
	}
	_ = preprocessPage(c, page, payload, first, pageSize, sortSpec)

	if c.shouldSummarize(payload) {
		return c.getSummaryPage(payload, first, pageSize, sortSpec, filter)
	}

	switch dataFacet {

	case MonitorsMonitors:
		facet := c.monitorsFacet
		var filterFunc func(*Monitor) bool
		if filter != "" {
			filterFunc = func(item *Monitor) bool {
				return c.matchesMonitorFilter(item, filter)
			}
		}
		sortFunc := func(items []Monitor, sort sdk.SortSpec) error {
			return sdk.SortMonitors(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("monitors", dataFacet, "GetPage", err)
		} else {
			page.Monitors = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("monitors", payload.DataFacet, "GetPage",
			fmt.Errorf("[GetPage] unsupported dataFacet: %v", payload.DataFacet))
	}

	return page, nil
}

// shouldSummarize returns true if the current facet can be simmarized by period
func (c *MonitorsCollection) shouldSummarize(payload *types.Payload) bool {
	if !payload.ShouldSummarize() {
		return false
	}
	// EXISTING_CODE
	// EXISTING_CODE
	return false
}

// getSummaryPage returns paginated summary data for a given period
func (c *MonitorsCollection) getSummaryPage(
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

	page := &MonitorsPage{
		Facet: dataFacet,
	}

	switch dataFacet {
	// EXISTING_CODE
	// EXISTING_CODE
	default:
		return nil, types.NewValidationError("monitors", dataFacet, "getSummaryPage",
			fmt.Errorf("[getSummaryPage] unsupported dataFacet: %v %v", dataFacet, page.Facet))
	}
}

// generateSummariesForPeriod ensures summaries are generated for the given period
func (c *MonitorsCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period types.Period) error {
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
	c *MonitorsCollection,
	page *MonitorsPage,
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
