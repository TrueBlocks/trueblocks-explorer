// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package projects

// EXISTING_CODE
import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

// EXISTING_CODE

type ProjectsPage struct {
	Facet         types.DataFacet  `json:"facet"`
	AddressList   []AddressList    `json:"addresslist"`
	Projects      []Project        `json:"projects"`
	TotalItems    int              `json:"totalItems"`
	ExpectedTotal int              `json:"expectedTotal"`
	State         types.StoreState `json:"state"`
	// EXISTING_CODE
	// EXISTING_CODE
}

func (p *ProjectsPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *ProjectsPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *ProjectsPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *ProjectsPage) GetState() types.StoreState {
	return p.State
}

func (c *ProjectsCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	filter = strings.ToLower(filter)
	dataFacet := payload.DataFacet
	page := &ProjectsPage{
		Facet: dataFacet,
	}
	_ = preprocessPage(c, page, payload, first, pageSize, sortSpec)

	if c.shouldSummarize(payload) {
		return c.getSummaryPage(payload, first, pageSize, sortSpec, filter)
	}

	switch dataFacet {

	case ProjectsManage:
		facet := c.manageFacet
		var filterFunc func(*Project) bool
		if filter != "" {
			filterFunc = func(item *Project) bool {
				return c.matchesManageFilter(item, filter)
			}
		}
		sortFunc := func(items []Project, sort sdk.SortSpec) error {
			return project.SortProjects(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("projects", dataFacet, "GetPage", err)
		} else {
			page.Projects = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		itemID := string(payload.DataFacet)
		if _, exists := c.projectsFacets[itemID]; exists {
			c.ensureProjectFacet(payload)
			if projectFacet, exists := c.projectsFacets[itemID]; exists {
				var filterFunc func(*AddressList) bool
				if filter != "" {
					filterFunc = func(item *AddressList) bool {
						return c.matchesProjectFilter(item, filter)
					}
				}
				sortFunc := func(items []AddressList, sort sdk.SortSpec) error {
					return nil // project.SortAddressList(items, sort)
				}
				if result, err := projectFacet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
					return nil, types.NewStoreError("projects", payload.DataFacet, "GetPage", err)
				} else {
					page.AddressList = result.Items
					page.TotalItems = result.TotalItems
					page.State = result.State
				}
				page.ExpectedTotal = projectFacet.ExpectedCount()
			} else {
				return nil, types.NewValidationError("projects", payload.DataFacet, "GetPage",
					fmt.Errorf("[GetPage] facet not found: %v", payload.DataFacet))
			}
		} else {
			return nil, types.NewValidationError("projects", payload.DataFacet, "GetPage",
				fmt.Errorf("[GetPage] unsupported dataFacet: %v", payload.DataFacet))
		}
	}

	return page, nil
}

// shouldSummarize returns true if the current facet can be simmarized by period
func (c *ProjectsCollection) shouldSummarize(payload *types.Payload) bool {
	if !payload.ShouldSummarize() {
		return false
	}
	// EXISTING_CODE
	// EXISTING_CODE
	return false
}

// getSummaryPage returns paginated summary data for a given period
func (c *ProjectsCollection) getSummaryPage(
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

	page := &ProjectsPage{
		Facet: dataFacet,
	}

	switch dataFacet {
	// EXISTING_CODE
	// EXISTING_CODE
	default:
		return nil, types.NewValidationError("projects", dataFacet, "getSummaryPage",
			fmt.Errorf("[getSummaryPage] unsupported dataFacet: %v %v", dataFacet, page.Facet))
	}
}

// generateSummariesForPeriod ensures summaries are generated for the given period
func (c *ProjectsCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period types.Period) error {
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
	c *ProjectsCollection,
	page *ProjectsPage,
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
