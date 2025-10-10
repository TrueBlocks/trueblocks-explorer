package chunks

import (
	"testing"
)

func TestCalculateBucketStatsAndColors(t *testing.T) {
	// Test with sample bucket data
	buckets := []Bucket{
		{Total: 10.0},
		{Total: 20.0},
		{Total: 30.0},
		{Total: 40.0},
	}

	stats := calculateBucketStatsAndColors(buckets)

	// Verify stats calculations
	expectedTotal := 100.0
	expectedAvg := 25.0
	expectedMin := 10.0
	expectedMax := 40.0
	expectedCount := 4

	if stats.Total != expectedTotal {
		t.Errorf("Expected total %f, got %f", expectedTotal, stats.Total)
	}
	if stats.Average != expectedAvg {
		t.Errorf("Expected average %f, got %f", expectedAvg, stats.Average)
	}
	if stats.Min != expectedMin {
		t.Errorf("Expected min %f, got %f", expectedMin, stats.Min)
	}
	if stats.Max != expectedMax {
		t.Errorf("Expected max %f, got %f", expectedMax, stats.Max)
	}
	if stats.Count != expectedCount {
		t.Errorf("Expected count %d, got %d", expectedCount, stats.Count)
	}

	// Verify color values are calculated (deviation from average)
	// bucket[0]: (10 - 25) / 25 = -0.6
	// bucket[1]: (20 - 25) / 25 = -0.2
	// bucket[2]: (30 - 25) / 25 = 0.2
	// bucket[3]: (40 - 25) / 25 = 0.6
	expectedColors := []float64{-0.6, -0.2, 0.2, 0.6}
	for i, expected := range expectedColors {
		if buckets[i].ColorValue != expected {
			t.Errorf("Expected color value %f for bucket %d, got %f", expected, i, buckets[i].ColorValue)
		}
	}
}

func TestCalculateBucketStatsAndColorsEmptySlice(t *testing.T) {
	var buckets []Bucket

	stats := calculateBucketStatsAndColors(buckets)

	// Should return zero-value stats for empty slice
	if stats.Total != 0 || stats.Average != 0 || stats.Min != 0 || stats.Max != 0 || stats.Count != 0 {
		t.Errorf("Expected zero stats for empty slice, got %+v", stats)
	}
}

func TestCalculateBucketStatsAndColorsSingleBucket(t *testing.T) {
	buckets := []Bucket{
		{Total: 42.0},
	}

	stats := calculateBucketStatsAndColors(buckets)

	// Single bucket should have zero color value (no deviation from itself)
	if buckets[0].ColorValue != 0.0 {
		t.Errorf("Expected color value 0.0 for single bucket, got %f", buckets[0].ColorValue)
	}
	if stats.Total != 42.0 || stats.Average != 42.0 || stats.Min != 42.0 || stats.Max != 42.0 || stats.Count != 1 {
		t.Errorf("Expected all stats to be 42.0 for single bucket, got %+v", stats)
	}
}
