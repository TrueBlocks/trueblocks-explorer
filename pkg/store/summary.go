package store

import (
	"reflect"
	"sync"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// SummaryKey represents a unique key for summary data based on normalized timestamp and period
type SummaryKey struct {
	Timestamp int64
	Period    types.Period
	AssetAddr string // Asset address for balance-specific summarization
}

// SummaryManager manages aggregated summary data for different time periods
type SummaryManager[T any] struct {
	summaries map[SummaryKey][]*T
	mutex     sync.RWMutex
}

// NewSummaryManager creates a new summary manager
func NewSummaryManager[T any]() *SummaryManager[T] {
	return &SummaryManager[T]{
		summaries: make(map[SummaryKey][]*T),
	}
}

// Add items to the summary for a given period
func (sm *SummaryManager[T]) Add(items []*T, period types.Period) {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()

	for _, item := range items {
		timestamp := extractTimestampFromItem(item)
		normalizedTime := NormalizeToPeriod(timestamp, period)
		key := SummaryKey{Timestamp: normalizedTime, Period: period, AssetAddr: ""} // Empty asset for regular Add
		sm.summaries[key] = append(sm.summaries[key], item)
	}
}

// AddBalance adds a balance item, replacing any existing balance for the same timestamp/period/asset
// This ensures we keep only the most recent balance per period per asset
func (sm *SummaryManager[T]) AddBalance(item *T, period types.Period) {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()

	timestamp := extractTimestampFromItem(item)
	assetAddr := extractAssetAddressFromItem(item)
	normalizedTime := NormalizeToPeriod(timestamp, period)
	key := SummaryKey{Timestamp: normalizedTime, Period: period, AssetAddr: assetAddr}
	// For balances, we replace any existing balance for this timestamp/period/asset combination
	// instead of accumulating them (since we want the latest balance per period per asset)
	sm.summaries[key] = []*T{item}
}

// GetSummaries returns all summary data for a given period
func (sm *SummaryManager[T]) GetSummaries(period types.Period) []*T {
	sm.mutex.RLock()
	defer sm.mutex.RUnlock()

	var results []*T
	matchingKeys := 0
	for key, items := range sm.summaries {
		if key.Period == period {
			matchingKeys++
			results = append(results, items...)
		}
	}
	return results
}

// Reset clears all summary data
func (sm *SummaryManager[T]) Reset() {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()
	sm.summaries = make(map[SummaryKey][]*T)
}

// NormalizeToPeriod normalizes a timestamp to the start of the given period
func NormalizeToPeriod(timestamp int64, period types.Period) int64 {
	t := time.Unix(timestamp, 0).UTC()

	switch period {
	case types.PeriodHourly:
		return time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), 0, 0, 0, time.UTC).Unix()
	case types.PeriodDaily:
		return time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC).Unix()
	case types.PeriodWeekly:
		// Start of week (Sunday)
		days := int(t.Weekday())
		return time.Date(t.Year(), t.Month(), t.Day()-days, 0, 0, 0, 0, time.UTC).Unix()
	case types.PeriodMonthly:
		return time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, time.UTC).Unix()
	case types.PeriodQuarterly:
		quarter := ((int(t.Month())-1)/3)*3 + 1
		return time.Date(t.Year(), time.Month(quarter), 1, 0, 0, 0, 0, time.UTC).Unix()
	case types.PeriodAnnual:
		return time.Date(t.Year(), 1, 1, 0, 0, 0, 0, time.UTC).Unix()
	default: // PeriodBlockly
		return timestamp // No normalization for block-level data
	}
}

// extractTimestampFromItem extracts a timestamp from an item using reflection
func extractTimestampFromItem(item interface{}) int64 {
	// Try to find a Timestamp field using reflection
	value := reflect.ValueOf(item)
	if value.Kind() == reflect.Ptr {
		value = value.Elem()
	}
	if value.Kind() == reflect.Struct {
		timestampField := value.FieldByName("Timestamp")
		if timestampField.IsValid() {
			switch timestampField.Kind() {
			case reflect.Uint64:
				return int64(timestampField.Uint())
			case reflect.Int64:
				return timestampField.Int()
			}
		}
	}
	// Fallback to current time for items without timestamps
	return time.Now().Unix()
}

// extractAssetAddressFromItem extracts an asset address from an item using reflection
func extractAssetAddressFromItem(item interface{}) string {
	// Try to find an Address field using reflection (for Balance items)
	value := reflect.ValueOf(item)
	if value.Kind() == reflect.Ptr {
		value = value.Elem()
	}
	if value.Kind() == reflect.Struct {
		// For Balance items, the asset address is in the "Address" field
		addressField := value.FieldByName("Address")
		if addressField.IsValid() {
			// The Address field is typically a base.Address type with a Hex() method
			if addressField.CanInterface() {
				addr := addressField.Interface()
				// Try to call Hex() method if it exists
				addrValue := reflect.ValueOf(addr)
				hexMethod := addrValue.MethodByName("Hex")
				if hexMethod.IsValid() {
					results := hexMethod.Call(nil)
					if len(results) > 0 && results[0].Kind() == reflect.String {
						return results[0].String()
					}
				}
			}
		}
	}
	// Fallback to empty string for items without asset addresses
	return ""
}
