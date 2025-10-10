package chunks

import (
	"fmt"
	"strconv"
	"strings"
)

// Helper function to parse range string (e.g., "0000000-0000100")
func parseRangeString(rangeStr string) (first, last uint64, err error) {
	parts := strings.Split(rangeStr, "-")
	if len(parts) != 2 {
		return 0, 0, fmt.Errorf("invalid range format: %s", rangeStr)
	}

	first, err = strconv.ParseUint(strings.TrimSpace(parts[0]), 10, 64)
	if err != nil {
		return 0, 0, fmt.Errorf("invalid first value in range %s: %v", rangeStr, err)
	}

	last, err = strconv.ParseUint(strings.TrimSpace(parts[1]), 10, 64)
	if err != nil {
		return 0, 0, fmt.Errorf("invalid last value in range %s: %v", rangeStr, err)
	}

	return first, last, nil
}

// calculateBucketStatsAndColors computes statistics and assigns color values for a slice of buckets.
// This function modifies the ColorValue field of each bucket in-place and returns the calculated statistics.
// Color values are calculated as the deviation from average: (value - average) / average
func calculateBucketStatsAndColors(buckets []Bucket) BucketStats {
	if len(buckets) == 0 {
		return BucketStats{}
	}

	var total, min, max float64
	min = buckets[0].Total

	// First pass: calculate total, min, and max
	for _, bucket := range buckets {
		total += bucket.Total
		if bucket.Total < min {
			min = bucket.Total
		}
		if bucket.Total > max {
			max = bucket.Total
		}
	}

	// Calculate average
	avg := total / float64(len(buckets))

	// Second pass: assign color values based on deviation from average
	for i := range buckets {
		if avg > 0 {
			buckets[i].ColorValue = (buckets[i].Total - avg) / avg
		} else {
			buckets[i].ColorValue = 0
		}
	}

	return BucketStats{
		Total:   total,
		Average: avg,
		Min:     min,
		Max:     max,
		Count:   len(buckets),
	}
}

// ClearBloomsBucket clears the blooms facet bucket cache data
func (c *ChunksCollection) ClearBloomsBucket() {
	c.bloomsMutex.Lock()
	defer c.bloomsMutex.Unlock()

	c.bloomsBucket = nil
}

// ClearIndexBucket clears the index facet bucket cache data
func (c *ChunksCollection) ClearIndexBucket() {
	c.indexMutex.Lock()
	defer c.indexMutex.Unlock()

	c.indexBucket = nil
}
