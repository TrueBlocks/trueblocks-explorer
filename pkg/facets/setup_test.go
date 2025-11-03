package facets

import (
	"testing"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/output"
	coreTypes "github.com/TrueBlocks/trueblocks-chifra/v6/pkg/types"
)

// -------------------- Helper/Mock Functions and Types --------------------

type TestItem struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Value int    `json:"value"`
}

func (t *TestItem) Model(chain, format string, verbose bool, extraOptions map[string]any) coreTypes.Model {
	return coreTypes.Model{
		Data: map[string]any{
			"id":    t.ID,
			"name":  t.Name,
			"value": t.Value,
		},
		Order: []string{"id", "name", "value"},
	}
}

type TestDataFacet types.DataFacet

const (
	TestList TestDataFacet = "test-list"
)

func createTestStore() *store.Store[TestItem] {
	return store.NewStore(
		"test-store",
		func(ctx *output.RenderCtx) error {
			testData := []TestItem{
				{ID: 1, Name: "Item1", Value: 10},
				{ID: 2, Name: "Item2", Value: 20},
				{ID: 3, Name: "Item3", Value: 30},
				{ID: 4, Name: "Item4", Value: 40},
				{ID: 5, Name: "Item5", Value: 50},
			}

			for _, item := range testData {
				ctx.ModelChan <- &item
			}

			close(ctx.ModelChan)
			close(ctx.ErrorChan)
			return nil
		},
		func(item interface{}) *TestItem {
			if it, ok := item.(TestItem); ok {
				return &it
			}
			if it, ok := item.(*TestItem); ok {
				return it
			}
			return nil
		},
		nil,
	)
}

func createTestFacet(store *store.Store[TestItem]) *Facet[TestItem] {
	return NewFacet(
		types.DataFacet(TestList),
		nil,
		nil,
		store,
		"test",
		nil,
		false,
	)
}

func createFilteredFacet(store *store.Store[TestItem], minValue int) *Facet[TestItem] {
	return NewFacet(
		types.DataFacet(TestList),
		func(item *TestItem) bool {
			return item.Value >= minValue
		},
		nil,
		store,
		"test",
		nil,
		false,
	)
}

func createDedupedFacet(store *store.Store[TestItem]) *Facet[TestItem] {
	return NewFacet(
		types.DataFacet(TestList),
		nil,
		func(existing []*TestItem, newItem *TestItem) bool {
			for _, existingItem := range existing {
				if existingItem.ID == newItem.ID {
					return true
				}
			}
			return false
		},
		store,
		"test",
		nil,
		false,
	)
}

func waitForCondition[T any](t *testing.T, timeout time.Duration, facet *Facet[T], condition func() bool, description string) {
	t.Helper()
	timer := time.NewTimer(timeout)
	defer timer.Stop()

	ticker := time.NewTicker(50 * time.Millisecond) // Poll frequently for faster tests
	defer ticker.Stop()

	for {
		select {
		case <-timer.C:
			currentState := "unknown"
			if facet != nil {
				currentState = string(facet.GetState())
			}
			t.Fatalf("Timeout waiting for %s. Last facet state: %s", description, currentState)
		case <-ticker.C:
			if condition() {
				return
			}
		}
	}
}
