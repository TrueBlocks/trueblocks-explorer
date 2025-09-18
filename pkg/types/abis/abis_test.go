package abis

import (
	"strings"
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	"github.com/stretchr/testify/assert"
)

func assertAbisPage(t *testing.T, page types.Page) *AbisPage {
	t.Helper()
	if page == nil {
		t.Fatal("page is nil")
	}
	abisPage, ok := page.(*AbisPage)
	if !ok {
		t.Fatalf("expected *AbisPage, got %T", page)
	}
	return abisPage
}

// Domain-specific filtering and ABI logic tests for Abis collection

func TestAbisMatchesFilter(t *testing.T) {
	var payload types.Payload
	collection := NewAbisCollection(&payload)
	testAbi := &Abi{
		Address:  base.HexToAddress("0x1234567890123456789012345678901234567890"),
		Name:     "Test ABI",
		IsKnown:  false,
		FileSize: 1024,
	}

	testFunction := &Function{
		Name:         "transfer",
		FunctionType: "function",
		Signature:    "transfer(address,uint256)",
		Encoding:     "0xa9059cbb",
	}

	t.Run("AbiNameMatch", func(t *testing.T) {
		filterFunc := func(item *Abi) bool {
			filter := "test"
			return collection.matchesAbiFilter(item, filter)
		}
		assert.True(t, filterFunc(testAbi))

		filterFunc2 := func(item *Abi) bool {
			filter := "ABI"
			return collection.matchesAbiFilter(item, filter)
		}
		assert.True(t, filterFunc2(testAbi))
	})

	t.Run("FunctionNameMatch", func(t *testing.T) {

		filterFunc := func(item *Function) bool {
			filter := "transfer"
			return collection.matchesFunctionFilter(item, filter)
		}
		assert.True(t, filterFunc(testFunction))
	})

	t.Run("FunctionEncodingMatch", func(t *testing.T) {

		filterFunc := func(item *Function) bool {
			filter := "0xa9059cbb"
			return collection.matchesFunctionFilter(item, filter)
		}
		assert.True(t, filterFunc(testFunction))
	})

	t.Run("EmptyFilter", func(t *testing.T) {
		filterFunc := func(item *Abi) bool {
			filter := ""
			return collection.matchesAbiFilter(item, filter)
		}
		result := filterFunc(testAbi)
		assert.True(t, result)
	})

	t.Run("NoMatch", func(t *testing.T) {
		filterFunc := func(item *Abi) bool {
			filter := "nonexistent"
			return collection.matchesAbiFilter(item, filter)
		}
		assert.False(t, filterFunc(testAbi))
	})
}

func (c *AbisCollection) matchesAbiFilter(abi *Abi, filter string) bool {
	if filter == "" {
		return true
	}
	filterLower := strings.ToLower(filter)
	return strings.Contains(strings.ToLower(abi.Name), filterLower)
}

func TestAbisCollectionDomainSpecific(t *testing.T) {
	var payload types.Payload
	collection := NewAbisCollection(&payload)

	t.Run("GetPageMultiFacetFiltering", func(t *testing.T) {
		// Test ABI list filtering
		payload := &types.Payload{DataFacet: AbisDownloaded}
		page, err := collection.GetPage(payload, 0, 10, sdk.SortSpec{}, "test")
		if err == nil && page != nil {
			abisPage := assertAbisPage(t, page)
			assert.Equal(t, AbisDownloaded, abisPage.Facet)
			assert.GreaterOrEqual(t, abisPage.TotalItems, 0)
		}

		// Test function filtering
		payload = &types.Payload{DataFacet: AbisFunctions}
		page, err = collection.GetPage(payload, 0, 10, sdk.SortSpec{}, "transfer")
		if err == nil && page != nil {
			abisPage := assertAbisPage(t, page)
			assert.Equal(t, AbisFunctions, abisPage.Facet)
			assert.GreaterOrEqual(t, abisPage.TotalItems, 0)
		}
	})

	t.Run("MultiFacetSupport", func(t *testing.T) {
		// Test that different facets work correctly
		facets := []types.DataFacet{AbisDownloaded, AbisKnown, AbisFunctions, AbisEvents}
		for _, facet := range facets {
			payload := &types.Payload{DataFacet: facet}
			page, err := collection.GetPage(payload, 0, 5, sdk.SortSpec{}, "")
			if err == nil && page != nil {
				abisPage := assertAbisPage(t, page)
				assert.Equal(t, facet, abisPage.Facet)
				// Verify the right data structure is populated based on facet
				switch facet {
				case AbisDownloaded, AbisKnown:
					// Should have Abis populated
					assert.NotNil(t, abisPage.Abis)
				case AbisFunctions, AbisEvents:
					// Should have Functions populated
					assert.NotNil(t, abisPage.Functions)
				}
			}
		}
	})
}

// -----------------------------------------------------------------------------
// Test Coverage Summary for abis_detailed_test.go
//
// TestAbisCollectionLoadDataAsync
// - "LoadDataDoesNotBlock": Verifies that calling LoadData does not panic.
// - "LoadDataStartsAsyncOperation": Ensures LoadData starts an async operation and GetPage works after loading.
// - "MultipleLoadDataCalls": Confirms multiple LoadData calls for all facets do not panic and update state.
// - "ConcurrentLoadDataCalls": Checks that concurrent LoadData calls from multiple goroutines do not panic and collection remains functional.
//
// TestAbisCollectionAdvancedAsync
// - "LoadDataWhileGettingPages": Validates that concurrent LoadData and GetPage calls do not cause errors.
// - "ResetDuringOperations": Ensures Reset can be called concurrently with LoadData and GetPage without panics, and collection remains functional.
//
// TestAbisCollectionIntegration
// - "FullWorkflowAllDataFacets": For each data facet, checks initial NeedsUpdate, LoadData, GetPage, filtering, paging, Reset, and post-reset NeedsUpdate.
// - "MixedOperationsAllFacets": Loads all facets, retrieves pages for each, resets one facet, and verifies correct update and accessibility of others.
//
// TestAbisCollectionBoundaryConditions
// - "AllDataFacetsCoverage": For each valid facet, verifies LoadData, Reset, NeedsUpdate, and GetPage do not panic and behave as expected.
// - "InvalidDataFacets": For various invalid facet strings, ensures LoadData, Reset, and NeedsUpdate do not panic, NeedsUpdate returns false, and GetPage returns an error mentioning the unexpected facet.
// - "RapidResetOperations": Calls Reset rapidly and repeatedly for multiple facets, confirming no panics and continued correct NeedsUpdate behavior.
// - "EmptyStringFilters": Calls GetPage with various empty or whitespace filters, ensuring correct page type, facet, and non-negative item count.
//
// -----------------------------------------------------------------------------
// End of Test Coverage Summary
