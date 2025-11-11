// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package chunks

// EXISTING_CODE
import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

// EXISTING_CODE

type ChunksPage struct {
	Facet         types.DataFacet  `json:"facet"`
	Blooms        []Bloom          `json:"blooms"`
	Index         []Index          `json:"index"`
	Manifest      []Manifest       `json:"manifest"`
	Stats         []Stats          `json:"stats"`
	TotalItems    int              `json:"totalItems"`
	ExpectedTotal int              `json:"expectedTotal"`
	State         types.StoreState `json:"state"`
	// EXISTING_CODE
	// EXISTING_CODE
}

func (p *ChunksPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *ChunksPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *ChunksPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *ChunksPage) GetState() types.StoreState {
	return p.State
}

func (c *ChunksCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	filter = strings.ToLower(filter)
	dataFacet := payload.DataFacet
	page := &ChunksPage{
		Facet: dataFacet,
	}
	_ = preprocessPage(c, page, payload, first, pageSize, sortSpec)

	if c.shouldSummarize(payload) {
		return c.getSummaryPage(payload, first, pageSize, sortSpec, filter)
	}

	switch dataFacet {

	case ChunksStats:
		facet := c.statsFacet
		var filterFunc func(*Stats) bool
		if filter != "" {
			filterFunc = func(item *Stats) bool {
				return c.matchesStatsFilter(item, filter)
			}
		}
		sortFunc := func(items []Stats, sort sdk.SortSpec) error {
			return sdk.SortStats(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("chunks", dataFacet, "GetPage", err)
		} else {
			page.Stats = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ChunksIndex:
		facet := c.indexFacet
		var filterFunc func(*Index) bool
		if filter != "" {
			filterFunc = func(item *Index) bool {
				return c.matchesIndexFilter(item, filter)
			}
		}
		sortFunc := func(items []Index, sort sdk.SortSpec) error {
			return sdk.SortIndex(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("chunks", dataFacet, "GetPage", err)
		} else {
			page.Index = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ChunksBlooms:
		facet := c.bloomsFacet
		var filterFunc func(*Bloom) bool
		if filter != "" {
			filterFunc = func(item *Bloom) bool {
				return c.matchesBloomFilter(item, filter)
			}
		}
		sortFunc := func(items []Bloom, sort sdk.SortSpec) error {
			return sdk.SortBlooms(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("chunks", dataFacet, "GetPage", err)
		} else {
			page.Blooms = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	case ChunksManifest:
		facet := c.manifestFacet
		var filterFunc func(*Manifest) bool
		if filter != "" {
			filterFunc = func(item *Manifest) bool {
				return c.matchesManifestFilter(item, filter)
			}
		}
		sortFunc := func(items []Manifest, sort sdk.SortSpec) error {
			return sdk.SortManifest(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("chunks", dataFacet, "GetPage", err)
		} else {
			page.Manifest = result.Items
			page.TotalItems = result.TotalItems
			page.State = result.State
		}
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("chunks", payload.DataFacet, "GetPage",
			fmt.Errorf("[GetPage] unsupported dataFacet: %v", payload.DataFacet))
	}

	return page, nil
}

// shouldSummarize returns true if the current facet can be simmarized by period
func (c *ChunksCollection) shouldSummarize(payload *types.Payload) bool {
	if !payload.ShouldSummarize() {
		return false
	}
	// EXISTING_CODE
	// EXISTING_CODE
	return false
}

// getSummaryPage returns paginated summary data for a given period
func (c *ChunksCollection) getSummaryPage(
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

	page := &ChunksPage{
		Facet: dataFacet,
	}

	switch dataFacet {
	// EXISTING_CODE
	// EXISTING_CODE
	default:
		return nil, types.NewValidationError("chunks", dataFacet, "getSummaryPage",
			fmt.Errorf("[getSummaryPage] unsupported dataFacet: %v %v", dataFacet, page.Facet))
	}
}

// generateSummariesForPeriod ensures summaries are generated for the given period
func (c *ChunksCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period types.Period) error {
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
	c *ChunksCollection,
	page *ChunksPage,
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
