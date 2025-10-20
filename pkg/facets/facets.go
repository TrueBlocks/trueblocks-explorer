package facets

import (
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/progress"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

type FilterFunc[T any] func(item *T) bool
type DupFunc[T any] func(existing []*T, newItem *T) bool

type PageResult[T any] struct {
	Items      []T
	TotalItems int
	State      types.StoreState
}

type Facet[T any] struct {
	store           *store.Store[T]
	view            []*T
	expectedCnt     int
	dataFacet       types.DataFacet
	filterFunc      FilterFunc[T]
	isDupFunc       DupFunc[T]
	mutex           sync.RWMutex
	progress        *progress.Progress
	summaryProvider types.SummaryAccumulator
	collectionName  string
	buckets         *types.Buckets
	bucketsMu       sync.RWMutex
}

func NewFacet[T any](
	dataFacet types.DataFacet,
	filterFunc FilterFunc[T],
	isDupFunc DupFunc[T],
	store *store.Store[T],
	collectionName string,
	summaryProvider types.SummaryAccumulator,
) *Facet[T] {
	facet := &Facet[T]{
		store:           store,
		view:            make([]*T, 0),
		expectedCnt:     0,
		dataFacet:       dataFacet,
		filterFunc:      filterFunc,
		isDupFunc:       isDupFunc,
		summaryProvider: summaryProvider,
		collectionName:  collectionName,
		progress:        progress.NewProgressWithSummary(dataFacet, collectionName, summaryProvider, nil),
		buckets:         types.NewBuckets(),
		bucketsMu:       sync.RWMutex{},
	}
	store.RegisterObserver(facet)

	return facet
}

func (r *Facet[T]) IsLoaded() bool {
	return r.GetState() == types.StateLoaded
}

func (r *Facet[T]) GetState() types.StoreState {
	return r.store.GetState()
}

func (r *Facet[T]) NeedsUpdate() bool {
	state := r.GetState()
	return state == types.StateStale
}

func (r *Facet[T]) Reset() {
	r.mutex.Lock()
	r.view = r.view[:0]
	r.expectedCnt = 0
	storeToReset := r.store
	r.mutex.Unlock()

	if storeToReset != nil {
		storeToReset.Reset()
	}

	r.ClearBuckets()
}

func (r *Facet[T]) ExpectedCount() int {
	return r.expectedCnt
}

func (r *Facet[T]) Count() int {
	r.mutex.RLock()
	defer r.mutex.RUnlock()
	return len(r.view)
}

func (r *Facet[T]) GetBuckets() *types.Buckets {
	r.bucketsMu.RLock()
	defer r.bucketsMu.RUnlock()
	return r.buckets
}

func (r *Facet[T]) ClearBuckets() {
	r.bucketsMu.Lock()
	defer r.bucketsMu.Unlock()
	// We want to preserve the GridInfo when clearing
	r.buckets = types.NewBucketsWithGridInfo(&r.buckets.GridInfo)
}

func (r *Facet[T]) SetBuckets(buckets *types.Buckets) {
	r.bucketsMu.Lock()
	defer r.bucketsMu.Unlock()
	r.buckets = buckets
}

func (r *Facet[T]) UpdateBuckets(updateFunc func(*types.Buckets)) {
	r.bucketsMu.Lock()
	defer r.bucketsMu.Unlock()
	updateFunc(r.buckets)
}

var ErrAlreadyLoading = errors.New("already loading")

func (r *Facet[T]) FetchFacet() error {
	currentState := r.GetState()

	if currentState == types.StateFetching {
		return ErrAlreadyLoading
	}

	go func() {
		ticker := time.NewTicker(progress.MaxWaitTime / 2)
		defer ticker.Stop()

		done := make(chan error, 1)

		go func() {
			err := r.store.Fetch()
			done <- err
		}()

		for {
			select {
			case err := <-done:
				if err != nil && err.Error() != "context canceled" {
					msgs.EmitError("Fetch failed", err)
				}
				return

			case <-ticker.C:
				r.mutex.RLock()
				currentCount := len(r.view)
				expectedTotal := r.store.GetExpectedTotal()
				r.mutex.RUnlock()

				r.progress.Heartbeat(currentCount, expectedTotal)
			}
		}
	}()

	return nil
}

func (r *Facet[T]) GetPage(
	first, pageSize int,
	filter FilterFunc[T],
	sortSpec sdk.SortSpec,
	sortFunc func([]T, sdk.SortSpec) error,
) (*PageResult[T], error) {
	r.mutex.RLock()
	data := make([]T, len(r.view))
	for i, ptr := range r.view {
		data[i] = *ptr
	}
	state := r.GetState()
	r.mutex.RUnlock()

	if len(data) == 0 {
		if r.store != nil && r.store.Count() > 0 {
			// Store has data, sync with it
			r.SyncWithStore()
			// Re-read the data after sync
			r.mutex.RLock()
			data = make([]T, len(r.view))
			for i, ptr := range r.view {
				data[i] = *ptr
			}
			state = r.GetState()
			r.mutex.RUnlock()
		} else if r.NeedsUpdate() {
			// No data in store, trigger load
			go func() {
				_ = r.FetchFacet()
			}()
		}
	}

	var filteredData []T
	if filter != nil {
		for i := range data {
			ptr := &data[i]
			if filter(ptr) {
				filteredData = append(filteredData, data[i])
			}
		}
	} else {
		filteredData = data
	}

	if sortFunc != nil && len(filteredData) > 0 {
		if err := sortFunc(filteredData, sortSpec); err != nil {
			return nil, fmt.Errorf("error sorting data: %w", err)
		}
	}

	// Normalize pagination parameters
	start := max(0, first)
	end := start + max(0, pageSize)

	// Handle out-of-bounds cases
	if start >= len(filteredData) {
		start, end = 0, 0
	} else {
		end = min(end, len(filteredData))
	}

	var paginatedData []T
	if start < end {
		paginatedData = filteredData[start:end]
	} else {
		paginatedData = []T{}
	}

	return &PageResult[T]{
		Items:      paginatedData,
		TotalItems: len(filteredData),
		State:      state,
	}, nil
}

func (r *Facet[T]) GetStore() *store.Store[T] {
	return r.store
}

func (r *Facet[T]) SyncWithStore() {
	store := r.store
	if store == nil {
		return
	}

	storeItems := store.GetItems()

	r.mutex.Lock()
	r.view = make([]*T, 0, len(storeItems))
	for i := range storeItems {
		itemPtr := storeItems[i]
		if r.filterFunc == nil || r.filterFunc(itemPtr) {
			if r.isDupFunc == nil || !r.isDupFunc(r.view, itemPtr) {
				r.view = append(r.view, itemPtr)
			}
		}
	}
	r.mutex.Unlock()
}

func (r *Facet[T]) OnNewItem(item *T, index int) {
	// Apply filter
	if r.filterFunc != nil && !r.filterFunc(item) {
		return
	}

	// Check for duplicates if needed
	if r.isDupFunc != nil {
		r.mutex.RLock()
		isDuplicate := r.isDupFunc(r.view, item)
		r.mutex.RUnlock()

		if isDuplicate {
			return
		}
	}

	if r.summaryProvider != nil {
		r.summaryProvider.AccumulateItem(item, &types.Summary{})
	}

	// Add to view
	r.mutex.Lock()
	r.view = append(r.view, item)
	currentCount := len(r.view)
	expectedTotal := r.store.GetExpectedTotal()
	r.mutex.Unlock()

	r.progress.Tick(currentCount, expectedTotal)
}

// OnStateChanged handles store state changes by updating the facet view accordingly
func (r *Facet[T]) OnStateChanged(state types.StoreState, reason string) {
	switch state {
	case types.StateStale:
		r.expectedCnt = 0
		r.mutex.Lock()
		r.view = r.view[:0]
		r.mutex.Unlock()
		if r.summaryProvider != nil {
			r.summaryProvider.ResetSummary()
		}
		msgs.EmitStatus(fmt.Sprintf("data outdated: %s", reason))

	case types.StateFetching:
		r.expectedCnt = 0
		r.mutex.Lock()
		r.view = r.view[:0]
		r.mutex.Unlock()
		if r.summaryProvider != nil {
			r.summaryProvider.ResetSummary()
		}

	case types.StateLoaded:
		r.SyncWithStore()
		r.mutex.RLock()
		currentCount := len(r.view)
		r.expectedCnt = r.store.GetExpectedTotal()
		r.mutex.RUnlock()
		r.progress.Tick(currentCount, currentCount)
		if r.summaryProvider != nil {
			collectionPayload := types.DataLoadedPayload{
				CurrentCount:  currentCount,
				ExpectedTotal: currentCount,
				State:         types.StateLoaded,
				Summary:       r.summaryProvider.GetSummary(),
				Timestamp:     time.Now().Unix(),
				EventPhase:    "complete",
				Operation:     "load",
			}
			collectionPayload.Collection = r.collectionName
			collectionPayload.DataFacet = r.dataFacet
			msgs.EmitLoaded(collectionPayload)
		}
	}
}

func (r *Facet[T]) ForEvery(actionFunc func(itemMatched *T) (error, bool), matchFunc func(item *T) bool) (int, error) {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	var matchCount = 0
	filteredData := make([]*T, 0, len(r.view))
	for _, itemPtr := range r.view {
		if !matchFunc(itemPtr) {
			filteredData = append(filteredData, itemPtr)
		} else {
			matchCount++
		}
	}

	if matchCount > 0 {
		r.view = filteredData
		r.expectedCnt = len(r.view)
	}

	return matchCount, nil
}

// ExportData exports all data in this facet to the specified file path and format
func (r *Facet[T]) ExportData(payload *types.Payload, typeName string) (string, error) {
	r.mutex.RLock()
	data := make([]T, len(r.view))
	for i, ptr := range r.view {
		data[i] = *ptr
	}
	r.mutex.RUnlock()
	return types.ExportData(data, payload, typeName)
}

// ExportDataPointers exports all data in this facet as pointers to the specified file path and format
func (r *Facet[T]) ExportDataPointers(payload *types.Payload, typeName string) (string, error) {
	r.mutex.RLock()
	// Convert pointer data to value data
	data := make([]T, 0, len(r.view))
	for _, ptr := range r.view {
		if ptr != nil {
			data = append(data, *ptr)
		}
	}
	r.mutex.RUnlock()
	return types.ExportData(data, payload, typeName)
}
