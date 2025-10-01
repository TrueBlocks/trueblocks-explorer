package store

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"testing"
	"time"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
	"github.com/stretchr/testify/assert"
)

func TestNewStore(t *testing.T) {
	queryFunc := func(ctx *output.RenderCtx) error { return nil }
	processFunc := func(item interface{}) *TestData { return nil }
	mappingFunc := func(item *TestData) (interface{}, bool) { return item.ID, true }

	store := NewStore("test-key", queryFunc, processFunc, mappingFunc)

	assert.NotNil(t, store)
	assert.Equal(t, "test-key", store.GetContextKey())
	assert.Equal(t, StateStale, store.GetState())
	assert.Equal(t, 0, store.Count())
	assert.Equal(t, int64(0), store.ExpectedTotalItems())
	assert.NotNil(t, store.dataMap)
}

func TestNewStoreWithoutMapping(t *testing.T) {
	queryFunc := func(ctx *output.RenderCtx) error { return nil }
	processFunc := func(item interface{}) *TestData { return nil }

	store := NewStore("test-key", queryFunc, processFunc, nil)

	assert.NotNil(t, store)
	assert.Nil(t, store.dataMap)
}

func TestStoreObserverManagement(t *testing.T) {
	store := createTestStore(t)
	observer1 := &MockObserver{}
	observer2 := &MockObserver{}

	store.RegisterObserver(observer1)
	store.RegisterObserver(observer2)

	store.RegisterObserver(observer1)
	assert.Len(t, store.observers, 2)

	store.UnregisterObserver(observer1)
	assert.Len(t, store.observers, 1)

	store.UnregisterObserver(observer1)
	assert.Len(t, store.observers, 1)
}

func TestStoreBasicOperations(t *testing.T) {
	store := createTestStore(t)

	assert.Equal(t, StateStale, store.GetState())
	assert.Equal(t, 0, store.Count())
	assert.Empty(t, store.GetItems())

	testItem := &TestData{ID: 1, Name: "Test", Value: 100}
	store.AddItem(testItem, 0)

	assert.Equal(t, 1, store.Count())
	assert.Equal(t, testItem, store.GetItem(0))
	assert.Nil(t, store.GetItem(-1))
	assert.Nil(t, store.GetItem(10))

	items := store.GetItems()
	assert.Len(t, items, 1)
	assert.Equal(t, testItem, items[0])
}

func TestStoreDataMapping(t *testing.T) {
	mappingFunc := func(item *TestData) (interface{}, bool) {
		return item.ID, true
	}

	store := NewStore("test-mapping",
		func(ctx *output.RenderCtx) error { return nil },
		func(item interface{}) *TestData { return item.(*TestData) },
		mappingFunc)

	testItem := &TestData{ID: 42, Name: "Test", Value: 100}
	store.AddItem(testItem, 0)

	retrieved, found := store.GetItemFromMap(42)
	assert.True(t, found)
	assert.Equal(t, testItem, retrieved)

	_, found = store.GetItemFromMap(999)
	assert.False(t, found)
}

func TestStoreDataMappingWithExclusion(t *testing.T) {
	mappingFunc := func(item *TestData) (interface{}, bool) {
		return item.ID, item.ID%2 == 0
	}

	store := NewStore("test-mapping-exclude",
		func(ctx *output.RenderCtx) error { return nil },
		func(item interface{}) *TestData { return item.(*TestData) },
		mappingFunc)

	evenItem := &TestData{ID: 42, Name: "Even", Value: 100}
	oddItem := &TestData{ID: 43, Name: "Odd", Value: 101}

	store.AddItem(evenItem, 0)
	store.AddItem(oddItem, 1)

	retrieved, found := store.GetItemFromMap(42)
	assert.True(t, found)
	assert.Equal(t, evenItem, retrieved)

	_, found = store.GetItemFromMap(43)
	assert.False(t, found)

	assert.Equal(t, 2, store.Count())
}

func TestStoreStateManagement(t *testing.T) {
	store := createTestStore(t)
	observer := &MockObserver{}
	store.RegisterObserver(observer)

	store.MarkStale("Test stale")
	assert.Equal(t, StateStale, store.GetState())

	stateChanges := observer.GetStateChanges()
	assert.Len(t, stateChanges, 1)
	assert.Equal(t, StateStale, stateChanges[0].state)
	assert.Equal(t, "Test stale", stateChanges[0].reason)

	observer.Reset()
	generation := store.dataGeneration.Load()
	store.ChangeState(generation, StateLoaded, "Test loaded")

	stateChanges = observer.GetStateChanges()
	assert.Len(t, stateChanges, 1)
	assert.Equal(t, StateLoaded, stateChanges[0].state)
}

func TestStoreStateManagementWithStaleGeneration(t *testing.T) {
	store := createTestStore(t)
	observer := &MockObserver{}
	store.RegisterObserver(observer)

	store.ChangeState(999, StateLoaded, "Should be ignored")

	stateChanges := observer.GetStateChanges()
	assert.Len(t, stateChanges, 0)
	assert.Equal(t, StateStale, store.GetState())
}

func TestStoreReset(t *testing.T) {
	store := createTestStore(t)
	observer := &MockObserver{}
	store.RegisterObserver(observer)

	testItem := &TestData{ID: 1, Name: "Test", Value: 100}
	store.AddItem(testItem, 0)
	assert.Equal(t, 1, store.Count())

	oldGeneration := store.dataGeneration.Load()
	store.Reset()

	assert.Equal(t, 0, store.Count())
	assert.Equal(t, StateStale, store.GetState())
	assert.Greater(t, store.dataGeneration.Load(), oldGeneration)

	stateChanges := observer.GetStateChanges()
	assert.True(t, len(stateChanges) > 0)
	lastChange := stateChanges[len(stateChanges)-1]
	assert.Equal(t, StateStale, lastChange.state)
	assert.Equal(t, "Store reset", lastChange.reason)
}

func TestStoreFetchSuccess(t *testing.T) {
	items := []*TestData{
		{ID: 1, Name: "Item1", Value: 10},
		{ID: 2, Name: "Item2", Value: 20},
		{ID: 3, Name: "Item3", Value: 30},
	}

	store := createStoreWithTestData(t, items, nil)
	observer := &MockObserver{}
	store.RegisterObserver(observer)

	err := store.Fetch()
	assert.NoError(t, err)
	assert.Equal(t, StateLoaded, store.GetState())
	assert.Equal(t, len(items), store.Count())

	receivedItems := observer.GetNewItems()
	assert.Len(t, receivedItems, len(items))

	for i, item := range items {
		assert.Equal(t, item, receivedItems[i])
	}

	stateChanges := observer.GetStateChanges()
	assert.True(t, len(stateChanges) >= 2)
	assert.Equal(t, StateFetching, stateChanges[0].state)
	assert.Equal(t, StateLoaded, stateChanges[len(stateChanges)-1].state)
}

func TestStoreFetchWithError(t *testing.T) {
	testError := errors.New("test fetch error")

	store := NewStore("error-test",
		func(ctx *output.RenderCtx) error {
			return testError
		},
		func(item interface{}) *TestData { return item.(*TestData) },
		nil)

	observer := &MockObserver{}
	store.RegisterObserver(observer)

	err := store.Fetch()
	assert.Error(t, err)
	assert.Equal(t, testError, err)
	assert.Equal(t, StateError, store.GetState())

	stateChanges := observer.GetStateChanges()
	assert.True(t, len(stateChanges) >= 2)
	assert.Equal(t, StateFetching, stateChanges[0].state)
	assert.Equal(t, StateError, stateChanges[len(stateChanges)-1].state)
}

func TestStoreFetchWithStreamError(t *testing.T) {
	testError := errors.New("stream error")

	store := NewStore("stream-error-test",
		func(ctx *output.RenderCtx) error {
			go func() {
				ctx.ErrorChan <- testError
				close(ctx.ErrorChan)
				close(ctx.ModelChan)
			}()
			return nil
		},
		func(item interface{}) *TestData { return item.(*TestData) },
		nil)

	observer := &MockObserver{}
	store.RegisterObserver(observer)

	err := store.Fetch()
	assert.Error(t, err)
	assert.Equal(t, testError, err)
	assert.Equal(t, StateError, store.GetState())
}

func TestStoreFetchWithCancellation(t *testing.T) {
	store := NewStore("cancel-test",
		func(ctx *output.RenderCtx) error {
			go func() {
				time.Sleep(10 * time.Millisecond)
				ctx.Cancel()
			}()

			<-ctx.Ctx.Done()
			return ctx.Ctx.Err()
		},
		func(item interface{}) *TestData { return item.(*TestData) },
		nil)

	observer := &MockObserver{}
	store.RegisterObserver(observer)

	err := store.Fetch()
	assert.Error(t, err)
	assert.Equal(t, context.Canceled, err)
	assert.Equal(t, StateCanceled, store.GetState())
}

func TestStoreFetchWithStaleData(t *testing.T) {
	proceedChannel := make(chan struct{})
	store := NewStore("stale-test",
		func(ctx *output.RenderCtx) error {
			go func() {
				<-proceedChannel
				ctx.ModelChan <- &TestData{ID: 1, Name: "Test", Value: 100}
				close(ctx.ModelChan)
				close(ctx.ErrorChan)
			}()
			return nil
		},
		func(item interface{}) *TestData { return item.(*TestData) },
		nil)

	var fetchErr error
	fetchDone := make(chan struct{})
	go func() {
		defer close(fetchDone)
		fetchErr = store.Fetch()
	}()

	time.Sleep(10 * time.Millisecond)
	store.dataGeneration.Add(1)
	close(proceedChannel)
	<-fetchDone
	assert.Equal(t, ErrStaleFetch, fetchErr)
}

func TestErrStaleFetch(t *testing.T) {
	err := ErrStaleFetch
	assert.Equal(t, ErrStaleFetch, err)
	assert.Contains(t, err.Error(), "stale fetch")
}

func TestStoreConcurrentAccess(t *testing.T) {
	store := createTestStore(t)

	var wg sync.WaitGroup
	numGoroutines := 10

	for i := 0; i < numGoroutines; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			item := &TestData{ID: id, Name: fmt.Sprintf("Item%d", id), Value: id * 10}
			store.AddItem(item, id)
		}(i)
	}

	for i := 0; i < numGoroutines; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			store.GetItems()
			store.Count()
			store.GetState()
		}()
	}

	for i := 0; i < 5; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			store.MarkStale(fmt.Sprintf("Concurrent stale %d", id))
		}(i)
	}

	wg.Wait()

	assert.Equal(t, numGoroutines, store.Count())
	assert.Equal(t, StateStale, store.GetState())
}

func TestStoreObserverNotifications(t *testing.T) {
	store := createTestStore(t)
	observer1 := &MockObserver{}
	observer2 := &MockObserver{}

	store.RegisterObserver(observer1)
	store.RegisterObserver(observer2)

	testItem := &TestData{ID: 1, Name: "Test", Value: 100}
	store.AddItem(testItem, 0)

	items1 := observer1.GetNewItems()
	items2 := observer2.GetNewItems()

	assert.Len(t, items1, 1)
	assert.Len(t, items2, 1)
	assert.Equal(t, testItem, items1[0])
	assert.Equal(t, testItem, items2[0])

	store.MarkStale("Test notification")

	changes1 := observer1.GetStateChanges()
	changes2 := observer2.GetStateChanges()

	assert.True(t, len(changes1) > 0)
	assert.True(t, len(changes2) > 0)
	assert.Equal(t, StateStale, changes1[len(changes1)-1].state)
	assert.Equal(t, StateStale, changes2[len(changes2)-1].state)
}
