package names

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	coreTypes "github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	"github.com/stretchr/testify/assert"
)

func assertNamesPage(t *testing.T, page types.Page) *NamesPage {
	t.Helper()
	if page == nil {
		t.Fatal("page is nil")
	}
	namesPage, ok := page.(*NamesPage)
	if !ok {
		t.Fatalf("expected *NamesPage, got %T", page)
	}
	return namesPage
}

// Domain-specific filtering tests for Names collection

func TestNamesMatchesFilter(t *testing.T) {
	var payload types.Payload
	collection := NewNamesCollection(&payload)
	testName := &Name{
		Address:    base.HexToAddress("0x1234567890123456789012345678901234567890"),
		Name:       "Test Name",
		Tags:       "testing,example",
		Source:     "test",
		Symbol:     "TEST",
		Decimals:   18,
		IsCustom:   true,
		IsPrefund:  false,
		IsContract: true,
		IsErc20:    true,
		IsErc721:   false,
		Parts:      coreTypes.Custom,
	}

	t.Run("AddressMatch", func(t *testing.T) {
		assert.True(t, collection.matchesFilter(testName, "1234"))
		assert.True(t, collection.matchesFilter(testName, "0x1234"))
	})

	t.Run("NameMatch", func(t *testing.T) {
		assert.True(t, collection.matchesFilter(testName, "test"))
		assert.True(t, collection.matchesFilter(testName, "Name"))
	})

	t.Run("TagsMatch", func(t *testing.T) {
		assert.True(t, collection.matchesFilter(testName, "testing"))
		assert.True(t, collection.matchesFilter(testName, "example"))
	})

	t.Run("SourceMatch", func(t *testing.T) {
		assert.True(t, collection.matchesFilter(testName, "test"))
	})

	t.Run("EmptyFilter", func(t *testing.T) {
		result := collection.matchesFilter(testName, "")
		assert.True(t, result)
	})

	t.Run("NoMatch", func(t *testing.T) {
		assert.False(t, collection.matchesFilter(testName, "nonexistent"))
	})
}

func TestNamesCollectionDomainSpecificFiltering(t *testing.T) {
	var payload types.Payload
	collection := NewNamesCollection(&payload)

	t.Run("GetPageWithDomainSpecificFilter", func(t *testing.T) {
		payload := &types.Payload{DataFacet: NamesAll}
		page, err := collection.GetPage(payload, 0, 10, sdk.SortSpec{}, "test")

		if err == nil && page != nil {
			namesPage := assertNamesPage(t, page)
			assert.Equal(t, NamesAll, namesPage.Facet)
			assert.GreaterOrEqual(t, namesPage.TotalItems, 0)
		}
	})
}

// ...existing code...

// -----------------------------------------------------------------------------
// Test Coverage Summary for names_detailed_test.go
//
// TestNamesCollectionLoadDataAsync
// - "LoadDataDoesNotBlock": Verifies that LoadData completes without panicking.
// - "LoadDataStartsAsyncOperation": Ensures LoadData starts an async operation and NeedsUpdate can be called during loading.
// - "MultipleLoadDataCalls": Confirms multiple sequential LoadData calls do not panic and NeedsUpdate remains functional.
// - "ConcurrentLoadDataCalls": Checks that concurrent LoadData calls from multiple goroutines do not panic and NeedsUpdate remains functional.
//
// TestNamesCollectionAdvancedAsync
// - "LoadDataAllDataFacets": For each data facet, verifies LoadData and NeedsUpdate do not panic and work as expected.
// - "ResetDuringAsyncLoad": Ensures Reset can be called during or after LoadData without panics and LoadData remains functional after Reset.
// - "GetPageDuringAsyncLoad": Confirms GetPage can be called during async LoadData without panics.
//
// TestNamesCollectionIntegration
// - "MultipleDataFacetsWorkflow": Loads all data facets, then for each, gets a page and checks facet and item count, including type assertion for NamesPage.
// - "FilteringAcrossDataFacets": For each data facet and various filters, gets a page and checks correct type, facet, and non-negative item count.
// - "SortingAndPagination": For selected data facets, sort specs, and page sizes, gets a page and checks correct type, facet, and that the number of names does not exceed the page size.
//
// TestNamesCollectionDomainSpecificIntegration
// - "SpecialFilterStrings": For a variety of special and edge-case filter strings, ensures GetPage does not panic.
// - "ResetAfterMultipleLoads": Loads multiple data facets, resets one, and verifies NeedsUpdate does not panic for any facet.
//
// -----------------------------------------------------------------------------
// End of Test
