package facets

import (
	"cmp"
	"errors"
	"fmt"
	"slices"
	"sync"
	"testing"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	"github.com/stretchr/testify/assert"
)

// Test functions will be here

func TestNewFacet(t *testing.T) {
	testStore := createTestStore()
	facet := createTestFacet(testStore)

	assert.Equal(t, types.StateStale, facet.GetState(), "Expected initial state to be StateStale")
	assert.Equal(t, 0, facet.Count(), "Expected initial count to be 0")
	assert.True(t, facet.NeedsUpdate(), "New facet should need update")
	assert.False(t, facet.IsLoaded(), "New facet should not be loaded")
	assert.Equal(t, testStore, facet.GetStore(), "Facet should reference the provided store")
}

func TestStoreStateTransitions(t *testing.T) {
	testStore := createTestStore()
	facet := createTestFacet(testStore)

	// Test initial state
	assert.Equal(t, types.StateStale, facet.GetState(), "Expected initial state to be StateStale")

	// Test reset maintains stale state
	facet.Reset()
	assert.Equal(t, types.StateStale, facet.GetState(), "Expected state to be StateStale after reset")
	assert.Equal(t, 0, facet.Count(), "Expected count to be 0 after reset")

	// Test that fetch through facet properly delegates to store
	err := facet.FetchFacet()
	assert.NoError(t, err, "FetchFacet should succeed")

	// Since fetch is now async, wait for completion
	time.Sleep(50 * time.Millisecond)

	// After successful fetch, facet should be in LOADED state (store completed the fetch)
	assert.Equal(t, types.StateLoaded, facet.GetState(), "Expected state to be StateLoaded after successful fetch")
}

func TestFacetLoad(t *testing.T) {
	t.Run("standardLoadWithFiveItems", func(t *testing.T) {
		testStore := createTestStore()
		facet := createTestFacet(testStore)

		err := facet.FetchFacet()
		assert.NoError(t, err, "Load should not return error on first call")

		waitForCondition(t, 5*time.Second, facet, func() bool {
			return facet.GetState() == types.StateLoaded
		}, "standard facet to be loaded")

		assert.Equal(t, 5, facet.Count(), "Expected count to be 5 after load")
		assert.Equal(t, types.StateLoaded, facet.GetState(), "Expected state to be StateLoaded")

		err = facet.FetchFacet()
		assert.NoError(t, err, "Second load should not return error")

		// Test the early return when data is already loaded
		facet.Reset()
		err = facet.FetchFacet() // Should load the data
		assert.NoError(t, err, "First fetch should succeed")

		// Now facet has data, so subsequent fetch should return early with cached message
		err = facet.FetchFacet()
		assert.NoError(t, err, "Subsequent fetch should return early without error when data is cached")
	})

	t.Run("loadWithSingleItemStore", func(t *testing.T) {
		singleItemStore := store.NewStore(
			"single-item-store",
			func(ctx *output.RenderCtx) error {
				time.Sleep(10 * time.Millisecond)
				item := TestItem{ID: 99, Name: "Debug Item", Value: 999}
				ctx.ModelChan <- &item
				close(ctx.ModelChan)
				close(ctx.ErrorChan)
				return nil
			},
			func(item interface{}) *TestItem {
				if it, ok := item.(*TestItem); ok {
					return it
				}
				return nil
			},
			nil,
		)

		facet := NewFacet(
			types.DataFacet(TestList),
			nil,
			nil,
			singleItemStore,
			"test",
			nil,
			false,
		)

		assert.Equal(t, types.StateStale, facet.GetState(), "Initial state for single item store facet should be Stale")

		err := facet.FetchFacet()
		assert.NoError(t, err, "Load for single item store failed")

		waitForCondition(t, 5*time.Second, facet, func() bool {
			return facet.GetState() == types.StateLoaded
		}, "single item store facet to be loaded")

		assert.Equal(t, 1, facet.Count(), "Expected count to be 1 for single item store")
		assert.Equal(t, types.StateLoaded, facet.GetState(), "Expected state to be StateLoaded for single item store")
	})
}

func TestFacetFiltering(t *testing.T) {
	testStore := createTestStore()
	facet := createFilteredFacet(testStore, 30)

	if err := facet.FetchFacet(); err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	waitForCondition(t, 5*time.Second, facet, func() bool {
		return facet.GetState() == types.StateLoaded
	}, "filtered facet to be loaded (TestFacetFiltering)")

	// Items are {1,10}, {2,20}, {3,30}, {4,40}, {5,50}
	// Filtered should be {3,30}, {4,40}, {5,50}
	assert.Equal(t, 3, facet.Count(), "Expected 3 items after filtering")
}

func TestFacetDeduplication(t *testing.T) {
	testStore := createTestStore()
	facet := createDedupedFacet(testStore)

	testItem := &TestItem{ID: 1, Name: "Duplicate", Value: 100}

	facet.OnNewItem(testItem, 0)
	facet.OnNewItem(testItem, 1)

	assert.Equal(t, 1, facet.Count(), "Expected 1 item after deduplication")
}

func TestFacetPagination(t *testing.T) {
	testStore := createTestStore()
	facet := createTestFacet(testStore)

	assert := assert.New(t)

	err := facet.FetchFacet()
	assert.NoError(err, "Load failed")

	waitForCondition(t, 5*time.Second, facet, func() bool {
		return facet.GetState() == types.StateLoaded
	}, "facet to be loaded (TestFacetPagination)")

	page1, err := facet.GetPage(0, 2, nil, sdk.SortSpec{}, nil)
	assert.NoError(err, "GetPage failed")
	assert.Len(page1.Items, 2, "Expected 2 items in first page")
	assert.Equal(5, page1.TotalItems, "Expected total items to be 5")
	assert.Equal(types.StateLoaded, page1.State, "Expected page state to be StateLoaded")

	page2, err := facet.GetPage(2, 2, nil, sdk.SortSpec{}, nil)
	assert.NoError(err, "GetPage failed")
	assert.Len(page2.Items, 2, "Expected 2 items in second page")

	page3, err := facet.GetPage(4, 2, nil, sdk.SortSpec{}, nil)
	assert.NoError(err, "GetPage failed")
	assert.Len(page3.Items, 1, "Expected 1 item in last page")

	pageEmpty, err := facet.GetPage(10, 2, nil, sdk.SortSpec{}, nil)
	assert.NoError(err, "GetPage failed")
	assert.Len(pageEmpty.Items, 0, "Expected 0 items for out of bounds page")
}

func TestFacetPageWithFilter(t *testing.T) {
	assert := assert.New(t)

	testStore := createTestStore()
	facet := createTestFacet(testStore) // Using standard facet, filter applied in GetPage

	err := facet.FetchFacet()
	assert.NoError(err, "Load failed")

	waitForCondition(t, 5*time.Second, facet, func() bool {
		return facet.GetState() == types.StateLoaded
	}, "facet to be loaded (TestFacetPageWithFilter)")

	filterFunc := func(item *TestItem) bool {
		return item.Value >= 30
	}

	page, err := facet.GetPage(0, 5, filterFunc, sdk.SortSpec{}, nil)
	assert.NoError(err, "GetPage with filter failed")

	assert.Len(page.Items, 3, "Expected 3 filtered items")
	assert.Equal(3, page.TotalItems, "Expected total filtered items to be 3")
}

func TestFacetSorting(t *testing.T) {
	assert := assert.New(t)

	testStore := createTestStore()
	facet := createTestFacet(testStore)

	err := facet.FetchFacet()
	assert.NoError(err, "Load failed")

	waitForCondition(t, 5*time.Second, facet, func() bool {
		return facet.GetState() == types.StateLoaded
	}, "facet to be loaded (TestFacetSorting)")

	sortFunc := func(items []TestItem, spec sdk.SortSpec) error {
		slices.SortFunc(items, func(a, b TestItem) int {
			return cmp.Compare(b.Value, a.Value)
		})
		return nil
	}

	page, err := facet.GetPage(0, 5, nil, sdk.SortSpec{}, sortFunc)
	assert.NoError(err, "GetPage with sort failed")

	assert.Len(page.Items, 5, "Expected 5 items")
	assert.Equal(50, page.Items[0].Value, "Expected first item value to be 50")
	assert.Equal(10, page.Items[4].Value, "Expected last item value to be 10")
}

func TestFacetSortingError(t *testing.T) {
	assert := assert.New(t)

	testStore := createTestStore()
	facet := createTestFacet(testStore)

	err := facet.FetchFacet()
	assert.NoError(err, "Load failed")

	waitForCondition(t, 5*time.Second, facet, func() bool {
		return facet.GetState() == types.StateLoaded
	}, "facet to be loaded (TestFacetSortingError)")

	sortFuncError := func(items []TestItem, spec sdk.SortSpec) error {
		return errors.New("sort error")
	}

	_, err = facet.GetPage(0, 5, nil, sdk.SortSpec{}, sortFuncError)
	assert.Error(err, "Expected GetPage to return error when sort function fails")
	assert.EqualError(err, "error sorting data: sort error", "Expected specific error message")
}

func TestFacetObserverInterface(t *testing.T) {
	assert := assert.New(t)

	testStore := createTestStore()
	facet := createTestFacet(testStore)

	testStore.ChangeState(types.StateFetching, "Test fetching")
	assert.Equal(types.StateFetching, facet.GetState(), "Expected state to be StateFetching")

	testStore.ChangeState(types.StateLoaded, "Test loaded")
	assert.Equal(types.StateLoaded, facet.GetState(), "Expected state to be StateLoaded")

	testStore.ChangeState(types.StateStale, "Test stale")
	assert.Equal(types.StateStale, facet.GetState(), "Expected state to be StateStale")

	// Test state with existing data
	facet.OnNewItem(&TestItem{ID: 1, Name: "Test", Value: 100}, 0)
	testStore.ChangeState(types.StateLoaded, "Test loaded with data")
	assert.Equal(types.StateLoaded, facet.GetState(), "Expected state to be StateLoaded with data")
}

func TestFacetForEvery(t *testing.T) {
	assert := assert.New(t)

	testStore := createTestStore()
	facet := createTestFacet(testStore)

	items := []*TestItem{
		{ID: 1, Name: "Test1", Value: 100},
		{ID: 2, Name: "Test2", Value: 200},
		{ID: 3, Name: "Test3", Value: 300},
	}

	for i, item := range items {
		facet.OnNewItem(item, i)
	}

	matchCount, err := facet.ForEvery(
		func(item *TestItem) (error, bool) {
			return nil, true
		},
		func(item *TestItem) bool {
			return item.Value >= 200
		},
	)

	assert.NoError(err, "ForEvery failed")
	assert.Equal(2, matchCount, "Expected 2 matches")
	assert.Equal(1, facet.Count(), "Expected 1 item remaining")
}

func TestFacetSyncWithStore(t *testing.T) {
	testStore := createTestStore()
	facet := createTestFacet(testStore)

	testStore.AddItem(&TestItem{ID: 1, Name: "Direct1", Value: 111}, 0)
	testStore.AddItem(&TestItem{ID: 2, Name: "Direct2", Value: 222}, 1)
	facet.SyncWithStore()

	assert.Equal(t, 2, facet.Count(), "Expected 2 items after sync")
}

func TestFacetProgressIntegration(t *testing.T) {
	testStore := createTestStore()
	facet := createTestFacet(testStore)
	assert.NotNil(t, facet.progress, "Progress should be initialized in facet")

	t.Run("does not panic", func(t *testing.T) {
		defer func() {
			if r := recover(); r != nil {
				assert.Failf(t, "OnNewItem panicked", "%v", r)
			}
		}()
		item := &TestItem{ID: 1, Name: "Progress Test", Value: 100}
		facet.OnNewItem(item, 0)
	})
}

func TestFacetConcurrency(t *testing.T) {
	testStore := createTestStore()
	facet := createTestFacet(testStore)

	var wg sync.WaitGroup
	numGoroutines := 10
	itemsPerGoroutine := 5

	wg.Add(numGoroutines)

	for i := 0; i < numGoroutines; i++ {
		go func(routineID int) {
			defer wg.Done()
			for j := 0; j < itemsPerGoroutine; j++ {
				item := &TestItem{
					ID:    routineID*itemsPerGoroutine + j,
					Name:  fmt.Sprintf("Concurrent-%d-%d", routineID, j),
					Value: (routineID*itemsPerGoroutine + j) * 10,
				}
				facet.OnNewItem(item, routineID*itemsPerGoroutine+j)
			}
		}(i)
	}

	wg.Wait()

	expectedCount := numGoroutines * itemsPerGoroutine
	assert.Equal(t, expectedCount, facet.Count(), "Expected %d items after concurrent access, got %d", expectedCount, facet.Count())
}

func TestFacetEdgeCases(t *testing.T) {
	assert := assert.New(t)

	testStore := createTestStore()
	facet := createTestFacet(testStore)

	page, err := facet.GetPage(0, 10, nil, sdk.SortSpec{}, nil)
	assert.NoError(err, "GetPage should not fail with empty data")
	assert.Len(page.Items, 0, "Expected 0 items with empty data")
	assert.Equal(0, page.TotalItems, "Expected total items to be 0")

	_, err = facet.GetPage(-1, 5, nil, sdk.SortSpec{}, nil)
	assert.NoError(err, "GetPage should handle negative start")

	page, err = facet.GetPage(0, 0, nil, sdk.SortSpec{}, nil)
	assert.NoError(err, "GetPage should handle zero page size")
	assert.Len(page.Items, 0, "Expected 0 items with zero page size")
}
