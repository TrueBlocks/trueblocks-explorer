// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package comparitoor

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/facets"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	// EXISTING_CODE
	// EXISTING_CODE
)

type ComparitoorPage struct {
	Facet         types.DataFacet         `json:"facet"`
	Transaction   []*AnnotatedTransaction `json:"transaction"`
	TotalItems    int                     `json:"totalItems"`
	ExpectedTotal int                     `json:"expectedTotal"`
	IsFetching    bool                    `json:"isFetching"`
	State         types.LoadState         `json:"state"`
	// Per-source arrays and counts
	Chifra         []*AnnotatedTransaction `json:"chifra"`
	ChifraCount    int                     `json:"chifraCount"`
	Etherscan      []*AnnotatedTransaction `json:"etherscan"`
	EtherscanCount int                     `json:"etherscanCount"`
	Covalent       []*AnnotatedTransaction `json:"covalent"`
	CovalentCount  int                     `json:"covalentCount"`
	Alchemy        []*AnnotatedTransaction `json:"alchemy"`
	AlchemyCount   int                     `json:"alchemyCount"`
	// Overlap/union/intersection statistics
	OverlapCount      int `json:"overlapCount"`
	UnionCount        int `json:"unionCount"`
	IntersectionCount int `json:"intersectionCount"`
	// Optionally, a map of overlap details (e.g., how many sources each tx appears in)
	OverlapDetails map[string]int `json:"overlapDetails,omitempty"`
}

func (p *ComparitoorPage) GetFacet() types.DataFacet {
	return p.Facet
}

func (p *ComparitoorPage) GetTotalItems() int {
	return p.TotalItems
}

func (p *ComparitoorPage) GetExpectedTotal() int {
	return p.ExpectedTotal
}

func (p *ComparitoorPage) GetIsFetching() bool {
	return p.IsFetching
}

func (p *ComparitoorPage) GetState() types.LoadState {
	return p.State
}

func (c *ComparitoorCollection) GetPage(
	payload *types.Payload,
	first, pageSize int,
	sortSpec sdk.SortSpec,
	filter string,
) (types.Page, error) {
	dataFacet := payload.DataFacet

	page := &ComparitoorPage{
		Facet: dataFacet,
	}
	// Always populate per-source arrays for frontend, with missing/unique flags
	// First, gather all keys and counts
	// Helper: convert []T to []*T
	slicePtrs := func(items []Transaction) []*Transaction {
		out := make([]*Transaction, len(items))
		for i := range items {
			out[i] = &items[i]
		}
		return out
	}
	// Key as string: "blockNum:txIdx"
	key := func(tx *Transaction) string {
		if tx == nil {
			return ""
		}
		return fmt.Sprintf("%v:%v", tx.BlockNumber, tx.TransactionIndex)
	}
	// Get per-source results
	var chifraResult, esResult, cvResult, alResult *facets.PageResult[Transaction]
	if c.chifraFacet != nil {
		chifraResult, _ = c.chifraFacet.GetPage(first, pageSize, nil, sortSpec, nil)
	}
	if c.etherscanFacet != nil {
		esResult, _ = c.etherscanFacet.GetPage(first, pageSize, nil, sortSpec, nil)
	}
	if c.covalentFacet != nil {
		cvResult, _ = c.covalentFacet.GetPage(first, pageSize, nil, sortSpec, nil)
	}
	if c.alchemyFacet != nil {
		alResult, _ = c.alchemyFacet.GetPage(first, pageSize, nil, sortSpec, nil)
	}
	sets := [][]*Transaction{
		slicePtrs(chifraResult.Items),
		slicePtrs(esResult.Items),
		slicePtrs(cvResult.Items),
		slicePtrs(alResult.Items),
	}
	keyCount := make(map[string]int)
	for _, arr := range sets {
		for _, tx := range arr {
			k := key(tx)
			if k != "" {
				keyCount[k]++
			}
		}
	}
	// Helper to build annotated array for a source
	buildAnnotated := func(arr []Transaction) []*AnnotatedTransaction {
		present := make(map[string]*Transaction)
		for i := range arr {
			tx := &arr[i]
			present[key(tx)] = tx
		}
		out := make([]*AnnotatedTransaction, 0, len(keyCount))
		for k := range keyCount {
			found, ok := present[k]
			missing := !ok
			unique := false
			if !missing && keyCount[k] == 1 {
				unique = true
			}
			if found != nil {
				out = append(out, &AnnotatedTransaction{Transaction: *found, Missing: false, Unique: unique})
			} else {
				// Synthesize a missing entry (types must match SDK)
				// Parse block/tx from key
				var blk, txidx uint64
				_, _ = fmt.Sscanf(k, "%d:%d", &blk, &txidx)
				out = append(out, &AnnotatedTransaction{Transaction: Transaction{BlockNumber: base.Blknum(blk), TransactionIndex: base.Txnum(txidx)}, Missing: true, Unique: false})
			}
		}
		return out
	}
	page.Chifra = buildAnnotated(chifraResult.Items)
	page.Etherscan = buildAnnotated(esResult.Items)
	page.Covalent = buildAnnotated(cvResult.Items)
	page.Alchemy = buildAnnotated(alResult.Items)
	page.ChifraCount = len(chifraResult.Items)
	page.EtherscanCount = len(esResult.Items)
	page.CovalentCount = len(cvResult.Items)
	page.AlchemyCount = len(alResult.Items)

	// Compute overlap/union/intersection statistics
	union := 0
	intersection := 0
	overlap := 0
	for _, count := range keyCount {
		if count > 1 {
			overlap++
		}
		if count == len(sets) {
			intersection++
		}
		union++
	}
	page.OverlapCount = overlap
	page.UnionCount = union
	page.IntersectionCount = intersection
	page.OverlapDetails = keyCount
	filter = strings.ToLower(filter)

	if c.shouldSummarize(payload) {
		return c.getSummaryPage(dataFacet, payload.Period, first, pageSize, sortSpec, filter)
	}

	switch dataFacet {
	case ComparitoorComparitoor:
		facet := c.comparitoorFacet
		var filterFunc func(*Transaction) bool
		if filter != "" {
			filterFunc = func(item *Transaction) bool {
				return c.matchesComparitoorFilter(item, filter)
			}
		}
		sortFunc := func(items []Transaction, sort sdk.SortSpec) error {
			return nil // sdk.SortTransaction(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("comparitoor", dataFacet, "GetPage", err)
		} else {
			page.Transaction = buildAnnotated(result.Items)
			page.TotalItems, page.State = len(result.Items), result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ComparitoorChifra:
		facet := c.chifraFacet
		var filterFunc func(*Transaction) bool
		if filter != "" {
			filterFunc = func(item *Transaction) bool {
				return c.matchesTrueBlockFilter(item, filter)
			}
		}
		sortFunc := func(items []Transaction, sort sdk.SortSpec) error {
			return nil // sdk.SortTransaction(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("comparitoor", dataFacet, "GetPage", err)
		} else {
			page.Transaction = buildAnnotated(result.Items)
			page.TotalItems, page.State = len(result.Items), result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ComparitoorEtherScan:
		facet := c.etherscanFacet
		var filterFunc func(*Transaction) bool
		if filter != "" {
			filterFunc = func(item *Transaction) bool {
				return c.matchesEtherScanFilter(item, filter)
			}
		}
		sortFunc := func(items []Transaction, sort sdk.SortSpec) error {
			return nil // sdk.SortTransaction(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("comparitoor", dataFacet, "GetPage", err)
		} else {
			page.Transaction = buildAnnotated(result.Items)
			page.TotalItems, page.State = len(result.Items), result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ComparitoorCovalent:
		facet := c.covalentFacet
		var filterFunc func(*Transaction) bool
		if filter != "" {
			filterFunc = func(item *Transaction) bool {
				return c.matchesCovalentFilter(item, filter)
			}
		}
		sortFunc := func(items []Transaction, sort sdk.SortSpec) error {
			return nil // sdk.SortTransaction(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("comparitoor", dataFacet, "GetPage", err)
		} else {
			page.Transaction = buildAnnotated(result.Items)
			page.TotalItems, page.State = len(result.Items), result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	case ComparitoorAlchemy:
		facet := c.alchemyFacet
		var filterFunc func(*Transaction) bool
		if filter != "" {
			filterFunc = func(item *Transaction) bool {
				return c.matchesAlchemyFilter(item, filter)
			}
		}
		sortFunc := func(items []Transaction, sort sdk.SortSpec) error {
			return nil // sdk.SortTransaction(items, sort)
		}
		if result, err := facet.GetPage(first, pageSize, filterFunc, sortSpec, sortFunc); err != nil {
			return nil, types.NewStoreError("comparitoor", dataFacet, "GetPage", err)
		} else {
			page.Transaction = buildAnnotated(result.Items)
			page.TotalItems, page.State = len(result.Items), result.State
		}
		page.IsFetching = facet.IsFetching()
		page.ExpectedTotal = facet.ExpectedCount()
	default:
		return nil, types.NewValidationError("comparitoor", dataFacet, "GetPage",
			fmt.Errorf("[GetPage] unsupported dataFacet: %v", dataFacet))
	}

	return page, nil
}

// shouldSummarize returns true if the current facet can be simmarized by period
func (c *ComparitoorCollection) shouldSummarize(payload *types.Payload) bool {
	if !payload.ShouldSummarize() {
		return false
	}
	// EXISTING_CODE
	// EXISTING_CODE
	return false
}

// getSummaryPage returns paginated summary data for a given period
func (c *ComparitoorCollection) getSummaryPage(
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

	page := &ComparitoorPage{
		Facet: dataFacet,
	}

	switch dataFacet {
	// EXISTING_CODE
	// EXISTING_CODE
	default:
		return nil, types.NewValidationError("comparitoor", dataFacet, "getSummaryPage",
			fmt.Errorf("[getSummaryPage] unsupported dataFacet: %v %v", dataFacet, page.Facet))
	}
}

// generateSummariesForPeriod ensures summaries are generated for the given period
func (c *ComparitoorCollection) generateSummariesForPeriod(dataFacet types.DataFacet, period string) error {
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
func (c *ComparitoorCollection) matchesComparitoorFilter(item *Transaction, filter string) bool {
	if filter == "" || item == nil {
		return true
	}
	filter = strings.TrimSpace(filter)
	// Block range: e.g., "1000-2000"
	if strings.Contains(filter, "-") {
		parts := strings.SplitN(filter, "-", 2)
		if len(parts) == 2 {
			start, err1 := strconv.ParseInt(strings.TrimSpace(parts[0]), 10, 64)
			end, err2 := strconv.ParseInt(strings.TrimSpace(parts[1]), 10, 64)
			if err1 == nil && err2 == nil {
				return int64(item.BlockNumber) >= start && int64(item.BlockNumber) <= end
			}
		}
	}
	// Block number (exact)
	if bn, err := strconv.ParseInt(filter, 10, 64); err == nil {
		return int64(item.BlockNumber) == bn
	}
	// Transaction hash (partial or exact)
	hashStr := item.Hash.String()
	if strings.HasPrefix(filter, "0x") && len(filter) >= 6 {
		return strings.Contains(strings.ToLower(hashStr), strings.ToLower(filter))
	}
	// Address (from or to, partial or exact)
	fromStr := item.From.String()
	toStr := item.To.String()
	if len(filter) >= 4 && (strings.HasPrefix(filter, "0x") || strings.Contains(filter, ":")) {
		f := strings.ToLower(filter)
		return strings.Contains(strings.ToLower(fromStr), f) || strings.Contains(strings.ToLower(toStr), f)
	}
	// Block number (partial match)
	if strings.Contains(fmt.Sprint(item.BlockNumber), filter) {
		return true
	}
	// Fallback: match any field as string
	s := fmt.Sprintf("%d %s %s %s", item.BlockNumber, hashStr, fromStr, toStr)
	return strings.Contains(strings.ToLower(s), strings.ToLower(filter))
}

func (c *ComparitoorCollection) matchesTrueBlockFilter(item *Transaction, filter string) bool {
	return c.matchesComparitoorFilter(item, filter)
}

func (c *ComparitoorCollection) matchesEtherScanFilter(item *Transaction, filter string) bool {
	return c.matchesComparitoorFilter(item, filter)
}

func (c *ComparitoorCollection) matchesCovalentFilter(item *Transaction, filter string) bool {
	return c.matchesComparitoorFilter(item, filter)
}

func (c *ComparitoorCollection) matchesAlchemyFilter(item *Transaction, filter string) bool {
	return c.matchesComparitoorFilter(item, filter)
}
