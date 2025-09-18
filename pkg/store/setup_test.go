package store

import (
	"sync"
	"testing"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/types"
)

// -------------------- Helper/Mock Functions and Types --------------------

type TestData struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Value int    `json:"value"`
}

func (t *TestData) Model(chain, format string, verbose bool, extraOptions map[string]any) types.Model {
	return types.Model{
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
		state  StoreState
		reason string
	}
	mutex sync.Mutex
}

func (m *MockObserver) OnNewItem(item *TestData, index int) {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	m.newItems = append(m.newItems, item)
}

func (m *MockObserver) OnStateChanged(state StoreState, reason string) {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	m.stateChanges = append(m.stateChanges, struct {
		state  StoreState
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
	state  StoreState
	reason string
} {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	result := make([]struct {
		state  StoreState
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
			go func() {
				defer close(ctx.ModelChan)
				defer close(ctx.ErrorChan)

				if streamError != nil {
					ctx.ErrorChan <- streamError
					return
				}

				for _, item := range items {
					ctx.ModelChan <- item
				}
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
