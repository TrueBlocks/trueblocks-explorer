package store

import (
	"sort"
	"sync"
	"sync/atomic"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
)

type FacetObserver[T any] interface {
	OnNewItem(item *T, index int)
	OnStateChanged(state types.StoreState, reason string)
}

type MappingFunc[T any] func(item *T) (key string, includeInMap bool)

// Store handle the low-level data fetching and streaming from external systems
type Store[T any] struct {
	data               []*T
	observers          []FacetObserver[T]
	queryFunc          func(renderCtx *output.RenderCtx) error
	processFunc        func(rawItem interface{}) *T
	mappingFunc        MappingFunc[T]
	dataMap            *map[interface{}]*T
	contextKey         string // Key for ContextManager
	state              types.StoreState
	stateReason        string
	expectedTotalItems atomic.Int64
	summaryManager     *SummaryManager[T] // Manages aggregated summary data
	mutex              sync.RWMutex
	mapSortFunc        func(a, b *T) bool
}

// NewStore creates a new SDK-based store
func NewStore[T any](
	contextKey string,
	queryFunc func(*output.RenderCtx) error,
	processFunc func(interface{}) *T,
	mappingFunc MappingFunc[T],
) *Store[T] {
	s := &Store[T]{
		data:           make([]*T, 0),
		observers:      make([]FacetObserver[T], 0),
		queryFunc:      queryFunc,
		processFunc:    processFunc,
		mappingFunc:    mappingFunc,
		contextKey:     contextKey,
		state:          types.StateStale,
		summaryManager: NewSummaryManager[T](),
	}
	if mappingFunc != nil {
		tempMap := make(map[interface{}]*T)
		s.dataMap = &tempMap
	}
	s.expectedTotalItems.Store(0)
	return s
}

func (s *Store[T]) RegisterObserver(observer FacetObserver[T]) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	for _, obs := range s.observers {
		if obs == observer {
			return
		}
	}

	if s.observers == nil {
		s.observers = make([]FacetObserver[T], 0)
	}

	s.observers = append(s.observers, observer)
}

func (s *Store[T]) UnregisterObserver(observer FacetObserver[T]) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	for i, obs := range s.observers {
		if obs == observer {
			lastIndex := len(s.observers) - 1
			s.observers[i] = s.observers[lastIndex]
			s.observers = s.observers[:lastIndex]
			return
		}
	}
}

func (s *Store[T]) ChangeState(newState types.StoreState, reason string) {
	s.mutex.Lock()

	s.state = newState
	s.stateReason = reason

	currentObservers := make([]FacetObserver[T], len(s.observers))
	copy(currentObservers, s.observers)
	stateToSend := s.state
	messageToSend := s.stateReason
	s.mutex.Unlock()

	for _, observer := range currentObservers {
		observer.OnStateChanged(stateToSend, messageToSend)
	}
}

func (s *Store[T]) GetState() types.StoreState {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return s.state
}

func (s *Store[T]) SetMapSortFunc(sortFunc func(a, b *T) bool) {
	s.mapSortFunc = sortFunc
}

func (s *Store[T]) MarkStale(reason string) {
	s.ChangeState(types.StateStale, reason)
}

func (s *Store[T]) GetItem(index int) *T {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	if index < 0 || index >= len(s.data) {
		return nil
	}
	return s.data[index]
}

func (s *Store[T]) ExpectedTotalItems() int64 {
	return s.expectedTotalItems.Load()
}

func (s *Store[T]) GetContextKey() string {
	return s.contextKey
}

func (s *Store[T]) GetItemFromMap(key string) (*T, bool) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	if s.dataMap == nil {
		return nil, false
	}

	item, found := (*s.dataMap)[key]
	return item, found
}

func (s *Store[T]) GetItems(useMapKey bool) []*T {
	if useMapKey {
		return s.GetMapItems()
	}
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	result := make([]*T, len(s.data))
	copy(result, s.data)
	return result
}

func (s *Store[T]) GetMapItems() []*T {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	result := make([]*T, len(s.data))
	if s.dataMap != nil && len(*s.dataMap) > 0 {
		result = make([]*T, 0, len(*s.dataMap))
		for _, item := range *s.dataMap {
			result = append(result, item)
		}
	} else {
		copy(result, s.data)
	}

	if s.mapSortFunc != nil {
		sort.Slice(result, func(i, j int) bool {
			return s.mapSortFunc(result[i], result[j])
		})
	}

	return result
}

func (s *Store[T]) Count() int {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return len(s.data)
}

func (s *Store[T]) Fetch() error {
	// Stop any currently running fetches. If we're here, we want to reload (or process for the first time)
	UnregisterContext(s.contextKey)

	// Clear data and change state to prepare for the new fetch
	s.mutex.Lock()
	s.data = s.data[:0]
	s.expectedTotalItems.Store(0)
	s.state = types.StateFetching
	s.stateReason = "User reload - fetching data"

	// Notify observers while holding the lock
	currentObservers := make([]FacetObserver[T], len(s.observers))
	copy(currentObservers, s.observers)
	s.mutex.Unlock()
	for _, observer := range currentObservers {
		observer.OnStateChanged(types.StateFetching, "User reload - fetching data")
	}

	renderCtx := RegisterContext(s.contextKey)
	errChan := make(chan error, 1)

	// Execute the query function which will fill the channels with streamed data
	if s.queryFunc != nil {
		go func() {
			defer logging.Silence()()
			err := s.queryFunc(renderCtx)
			if err != nil {
				errChan <- err
			}
		}()
	}

	modelChanClosed := false
	errorChanClosed := false

	for !modelChanClosed || !errorChanClosed {
		select {
		case item, ok := <-renderCtx.ModelChan:
			if !ok {
				modelChanClosed = true
				if errorChanClosed {
					s.ChangeState(types.StateLoaded, "Data loaded successfully")
				}
				continue
			}

			itemPtr := s.processFunc(item)
			if itemPtr == nil {
				continue
			}

			s.mutex.Lock()

			if s.mappingFunc != nil {
				key, includeInMap := s.mappingFunc(itemPtr)
				if includeInMap {
					if s.dataMap == nil {
						tempMap := make(map[interface{}]*T)
						s.dataMap = &tempMap
					}
					(*s.dataMap)[key] = itemPtr
				}
			}

			s.data = append(s.data, itemPtr)
			s.expectedTotalItems.Store(int64(len(s.data)))
			index := len(s.data) - 1

			// TODO: BOGUS
			// Note: Summary aggregation is now handled by the GetSummaryPage method in the backend
			// which calls AddItem/AddBalance during summary creation per period
			// Items during fetch are stored but not immediately summarized

			currentObservers := make([]FacetObserver[T], len(s.observers))
			copy(currentObservers, s.observers)
			s.mutex.Unlock()

			for _, obs := range currentObservers {
				s.mutex.RLock()
				if index < len(s.data) {
					itemToSend := s.data[index]
					s.mutex.RUnlock()
					obs.OnNewItem(itemToSend, index)
				} else {
					s.mutex.RUnlock()
				}
			}

		case streamErr, ok := <-renderCtx.ErrorChan:
			if !ok {
				errorChanClosed = true
				if modelChanClosed {
					s.ChangeState(types.StateLoaded, "Data loaded successfully")
				}
				continue
			}
			msgs.EmitError("Stream error during fetch", streamErr)
			if s.Count() > 0 {
				s.ChangeState(types.StateLoaded, "Partial data loaded despite stream error")
			} else {
				s.ChangeState(types.StateStale, "No data due to stream error, ready to retry")
			}
			return streamErr

		case <-renderCtx.Ctx.Done():
			msgs.EmitStatus("loading canceled")
			s.ChangeState(types.StateLoaded, "User cancelled operation")
			return renderCtx.Ctx.Err()

		case queryErr := <-errChan:
			msgs.EmitError("Query function failed", queryErr)
			if s.Count() > 0 {
				s.ChangeState(types.StateLoaded, "Partial data loaded despite query error")
			} else {
				s.ChangeState(types.StateStale, "No data due to query error, ready to retry")
			}
			return queryErr
		}
	}

	s.ChangeState(types.StateLoaded, "Data loaded successfully")
	return nil
}

func (s *Store[T]) AddItem(item *T, index int) {
	s.mutex.Lock()
	s.data = append(s.data, item)
	newIndex := len(s.data) - 1
	itemPtr := s.data[newIndex]

	if s.mappingFunc != nil {
		if key, include := s.mappingFunc(itemPtr); include {
			if s.dataMap == nil {
				tempMap := make(map[interface{}]*T)
				s.dataMap = &tempMap
			}
			(*s.dataMap)[key] = itemPtr
		}
	}

	// TODO: BOGUS
	// Note: Summary aggregation is now handled by the GetSummaryPage method in the backend
	// which calls summary manager methods during summary creation per period
	// Items added individually are stored but not immediately summarized

	observers := make([]FacetObserver[T], len(s.observers))
	copy(observers, s.observers)
	s.mutex.Unlock()

	for _, observer := range observers {
		observer.OnNewItem(itemPtr, newIndex)
	}
}

func (s *Store[T]) GetExpectedTotal() int {
	return int(s.expectedTotalItems.Load())
}

func (s *Store[T]) Reset() {
	s.mutex.Lock()
	UnregisterContext(s.contextKey)

	s.data = make([]*T, 0)
	if s.dataMap != nil {
		newMap := make(map[interface{}]*T)
		s.dataMap = &newMap
	}
	s.summaryManager.Reset()
	s.expectedTotalItems.Store(0)

	s.state = types.StateStale
	s.stateReason = "Store reset"

	currentObservers := make([]FacetObserver[T], len(s.observers))
	copy(currentObservers, s.observers)
	s.mutex.Unlock()

	// Notify observers of state change
	for _, observer := range currentObservers {
		observer.OnStateChanged(types.StateStale, "Store reset")
	}
}

func (s *Store[T]) UpdateData(updateFunc func(data []*T) []*T) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	s.data = updateFunc(s.data)
	s.expectedTotalItems.Store(int64(len(s.data)))

	if s.dataMap != nil && s.mappingFunc != nil {
		newMap := make(map[interface{}]*T)
		for _, item := range s.data {
			key, includeInMap := s.mappingFunc(item)
			if includeInMap {
				newMap[key] = item
			}
		}
		s.dataMap = &newMap
	}
}

// GetSummaryManager returns the summary manager for this store
func (s *Store[T]) GetSummaryManager() *SummaryManager[T] {
	return s.summaryManager
}

// GetSummaries returns summary data for the given period
func (s *Store[T]) GetSummaries(period types.Period) []*T {
	return s.summaryManager.GetSummaries(period)
}

// AddBalance adds a balance item using the balance-specific summarization logic
// This method keeps only the most recent balance per period instead of accumulating all balances
func (s *Store[T]) AddBalance(item *T, index int) {
	s.mutex.Lock()
	s.data = append(s.data, item)
	newIndex := len(s.data) - 1
	itemPtr := s.data[newIndex]

	if s.mappingFunc != nil {
		if key, include := s.mappingFunc(itemPtr); include {
			if s.dataMap == nil {
				tempMap := make(map[interface{}]*T)
				s.dataMap = &tempMap
			}
			(*s.dataMap)[key] = itemPtr
		}
	}

	// Note: Balance summarization is handled by the GetSummaryPage method in the backend
	// which calls AddBalance during summary creation per period with proper period strings
	// Balances added individually are stored but not immediately summarized

	observers := make([]FacetObserver[T], len(s.observers))
	copy(observers, s.observers)
	s.mutex.Unlock()

	for _, observer := range observers {
		observer.OnNewItem(itemPtr, newIndex)
	}
}
