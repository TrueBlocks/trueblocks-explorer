package store

import (
	"fmt"
	"sync"
	"testing"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/output"
	coreTypes "github.com/TrueBlocks/trueblocks-chifra/v6/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// -------------------- Helper/Mock Functions and Types --------------------

type TestData struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Value int    `json:"value"`
}

func (t *TestData) Model(chain, format string, verbose bool, extraOptions map[string]any) coreTypes.Model {
	return coreTypes.Model{
		Data: map[string]any{
			"id":    t.ID,
			"name":  t.Name,
			"value": t.Value,
		},
		Order: []string{"id", "name", "value"},
	}
}

// Mock observer for testing
type MockObserver struct {
	newItems     []*TestData
	stateChanges []struct {
		state  types.StoreState
		reason string
	}
	mutex sync.Mutex
}

func (m *MockObserver) OnNewItem(item *TestData, index int) {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	m.newItems = append(m.newItems, item)
}

func (m *MockObserver) OnStateChanged(state types.StoreState, reason string) {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	m.stateChanges = append(m.stateChanges, struct {
		state  types.StoreState
		reason string
	}{state, reason})
}

func (m *MockObserver) GetNewItems() []*TestData {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	result := make([]*TestData, len(m.newItems))
	copy(result, m.newItems)
	return result
}

func (m *MockObserver) GetStateChanges() []struct {
	state  types.StoreState
	reason string
} {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	result := make([]struct {
		state  types.StoreState
		reason string
	}, len(m.stateChanges))
	copy(result, m.stateChanges)
	return result
}

func (m *MockObserver) Reset() {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	m.newItems = nil
	m.stateChanges = nil
}

func createTestStore(t *testing.T) *Store[TestData] {
	t.Helper()
	return NewStore("test-store",
		func(ctx *output.RenderCtx) error { return nil },
		func(item interface{}) *TestData { return item.(*TestData) },
		nil)
}

func createStoreWithTestData(t *testing.T, items []*TestData, streamError error) *Store[TestData] {
	t.Helper()
	return NewStore("test-data-store",
		func(ctx *output.RenderCtx) error {
			// Start goroutine but wait for it to complete before returning
			// This more accurately simulates real SDK behavior
			done := make(chan struct{})
			go func() {
				defer close(ctx.ModelChan)
				defer close(ctx.ErrorChan)
				defer close(done)

				if streamError != nil {
					ctx.ErrorChan <- streamError
					return
				}

				for _, item := range items {
					ctx.ModelChan <- item
				}
			}()
			<-done // Wait for goroutine to complete
			return nil
		},
		func(item interface{}) *TestData {
			if testData, ok := item.(*TestData); ok {
				return testData
			}
			return nil
		},
		func(item *TestData) (string, bool) {
			return fmt.Sprintf("%d", item.ID), true
		})
}

// createStoreWithSDKBug simulates the TrueBlocks Core SDK bug where
// the queryFunc completes and signals done, but channels never close
// This function is commented out along with its corresponding test
/*
func createStoreWithSDKBug(t *testing.T, items []*TestData, streamError error) *Store[TestData] {
	t.Helper()
	return NewStore("test-sdk-bug-store",
		func(ctx *output.RenderCtx) error {
			go func() {
				// Note: NO defer close() calls - this simulates the SDK bug

				if streamError != nil {
					ctx.ErrorChan <- streamError
					return
				}

				for _, item := range items {
					ctx.ModelChan <- item
				}
				// Goroutine exits but channels remain open (SDK bug)
			}()
			return nil
		},
		func(item interface{}) *TestData {
			if testData, ok := item.(*TestData); ok {
				return testData
			}
			return nil
		},
		func(item *TestData) (interface{}, bool) {
			return item.ID, true
		})
}
*/
