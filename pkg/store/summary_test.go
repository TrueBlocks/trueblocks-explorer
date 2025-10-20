package store

import (
	"testing"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

type TestItem struct {
	Name      string
	Value     int
	Timestamp uint64
}

func TestSummaryManager(t *testing.T) {
	sm := NewSummaryManager[TestItem]()

	// Create test items with different timestamps
	now := time.Now()
	hourAgo := now.Add(-time.Hour)
	dayAgo := now.Add(-24 * time.Hour)

	item1 := &TestItem{Name: "item1", Value: 100, Timestamp: uint64(now.Unix())}
	item2 := &TestItem{Name: "item2", Value: 200, Timestamp: uint64(hourAgo.Unix())}
	item3 := &TestItem{Name: "item3", Value: 300, Timestamp: uint64(dayAgo.Unix())}

	// Add items to summary for different periods
	sm.Add([]*TestItem{item1}, types.PeriodHourly)
	sm.Add([]*TestItem{item2}, types.PeriodHourly)
	sm.Add([]*TestItem{item3}, types.PeriodHourly)

	// Also add them for daily summaries
	sm.Add([]*TestItem{item1}, types.PeriodDaily)
	sm.Add([]*TestItem{item2}, types.PeriodDaily)
	sm.Add([]*TestItem{item3}, types.PeriodDaily)

	// Test getting summaries by period
	hourlySummaries := sm.GetSummaries(types.PeriodHourly)
	if len(hourlySummaries) != 3 {
		t.Errorf("Expected 3 hourly summaries, got %d", len(hourlySummaries))
	}

	dailySummaries := sm.GetSummaries(types.PeriodDaily)
	if len(dailySummaries) != 3 {
		t.Errorf("Expected 3 daily summaries, got %d", len(dailySummaries))
	}

	// Test reset
	sm.Reset()
	resetSummaries := sm.GetSummaries(types.PeriodDaily)
	if len(resetSummaries) != 0 {
		t.Errorf("Expected 0 summaries after reset, got %d", len(resetSummaries))
	}
}

func TestStoreWithSummary(t *testing.T) {
	// Create a simple store for testing
	store := NewStore[TestItem](
		"test",
		nil, // queryFunc
		nil, // processFunc
		nil, // mappingFunc
	)

	// Add some items
	item1 := &TestItem{Name: "item1", Value: 100, Timestamp: uint64(time.Now().Unix())}
	item2 := &TestItem{Name: "item2", Value: 200, Timestamp: uint64(time.Now().Add(-time.Hour).Unix())}

	store.AddItem(item1, 0)
	store.AddItem(item2, 1)

	// Verify regular data
	data := store.GetItems()
	if len(data) != 2 {
		t.Errorf("Expected 2 items in store, got %d", len(data))
	}

	// Note: Summary data is only populated when the backend explicitly calls Add() or AddBalance()
	// with specific periods during summary creation. AddItem() only stores the raw data.
	// To test summaries, we need to manually add them to the summary manager
	sm := store.GetSummaryManager()
	sm.Add([]*TestItem{item1, item2}, types.PeriodDaily)

	// Verify summary data
	summaries := store.GetSummaries(types.PeriodDaily)
	if len(summaries) != 2 {
		t.Errorf("Expected 2 items in daily summaries, got %d", len(summaries))
	}
}
