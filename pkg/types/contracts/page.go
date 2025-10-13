// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package contracts

// EXISTING_CODE
import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// EXISTING_CODE
type ContractsPage struct {
	Facet         types.DataFacet `json:"facet"`
	Contracts     []*Contract     `json:"contracts"`
	Logs          []*Log          `json:"logs"`
	TotalItems    int             `json:"totalItems"`
	ExpectedTotal int             `json:"expectedTotal"`
	IsFetching    bool            `json:"isFetching"`
	State         types.LoadState `json:"state"`
	// EXISTING_CODE
	// EXISTING_CODE
}

func (p *ContractsPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *ContractsPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *ContractsPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *ContractsPage) GetIsFetching() bool {
	return p.IsFetching
}

func (p *ContractsPage) GetState() types.LoadState {
	return p.State
}

func (c *ContractsCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	dataFacet := payload.DataFacet

	page := &ContractsPage{
		Facet: dataFacet,
	}
	filter = strings.ToLower(filter)

	if c.shouldSummarize(payload) {
		return c.getSummaryPage(dataFacet, payload.Period, first, pageSize, sortSpec, filter)
	}

	switch dataFacet {

	case ContractsDashboard:
		facet := c.dashboardFacet
		var filterFunc func(*Contract) bool
		if filter != "" {
			filterFunc = func(item *Contract) bool {
				return c.matchesDashboardFilter(item, filter)
			}
		}
		sortFunc := func(items []Contract, sort sdk.SortSpec) error {
			return sdk.SortContracts(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("contracts", dataFacet, "GetPage", err)
		} else {
			dashboard := make([]*Contract, 0, len(result.Items))
			for i := range result.Items {
				dashboard = append(dashboard, &result.Items[i])
			}
			page.Contracts, page.TotalItems, page.State = dashboard, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ContractsExecute:
		facet := c.executeFacet
		var filterFunc func(*Contract) bool
		if filter != "" {
			filterFunc = func(item *Contract) bool {
				return c.matchesExecuteFilter(item, filter)
			}
		}
		sortFunc := func(items []Contract, sort sdk.SortSpec) error {
			return sdk.SortContracts(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("contracts", dataFacet, "GetPage", err)
		} else {
			execute := make([]*Contract, 0, len(result.Items))
			for i := range result.Items {
				execute = append(execute, &result.Items[i])
			}
			page.Contracts, page.TotalItems, page.State = execute, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ContractsEvents:
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
			return nil, types.NewStoreError("contracts", dataFacet, "GetPage", err)
		} else {
			event := make([]*Log, 0, len(result.Items))
			for i := range result.Items {
				event = append(event, &result.Items[i])
			}
			page.Logs, page.TotalItems, page.State = event, result.TotalItems, result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("contracts", dataFacet, "GetPage",
			fmt.Errorf("[GetPage] unsupported dataFacet: %v", dataFacet))
	}

	return page, nil
}

// shouldSummarize returns true if the current facet can be simmarized by period
func (c *ContractsCollection) shouldSummarize(payload *types.Payload) bool {
	if !payload.ShouldSummarize() {
		return false
	}
	// EXISTING_CODE
	// EXISTING_CODE
	return false
}

// getSummaryPage returns paginated summary data for a given period
func (c *ContractsCollection) getSummaryPage(
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

	page := &ContractsPage{
		Facet: dataFacet,
	}

	switch dataFacet {
	// EXISTING_CODE
	// EXISTING_CODE
	default:
		return nil, types.NewValidationError("contracts", dataFacet, "getSummaryPage",
			fmt.Errorf("[getSummaryPage] unsupported dataFacet: %v %v", dataFacet, page.Facet))
	}
}

// generateSummariesForPeriod ensures summaries are generated for the given period
func (c *ContractsCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period string) error {
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
func (c *ContractsCollection) matchesDashboardFilter(item *Contract, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.TransactionHash.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.ContractAddress.Hex()), filter)
}

func (c *ContractsCollection) matchesExecuteFilter(item *Contract, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.TransactionHash.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.ContractAddress.Hex()), filter)
}

func (c *ContractsCollection) matchesEventFilter(item *Log, filter string) bool {
	_ = item    // delint
	_ = filter  // delint
	return true // strings.Contains(strings.ToLower(item.TransactionHash.Hex()), filter) ||
	// strings.Contains(strings.ToLower(item.ContractAddress.Hex()), filter)
}

// EXISTING_CODE
