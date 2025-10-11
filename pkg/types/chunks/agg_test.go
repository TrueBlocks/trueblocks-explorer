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

func TestEnsureBucketsExist(t *testing.T) {
	var buckets []Bucket
	size := uint64(100000)

	// Test creating buckets from empty slice
	ensureBucketsExist(&buckets, 2, size)

	if len(buckets) != 3 {
		t.Errorf("Expected 3 buckets, got %d", len(buckets))
	}

	// Verify bucket properties
	for i, bucket := range buckets {
		expectedStart := uint64(i) * size
		expectedEnd := uint64(i+1)*size - 1

		if bucket.BucketIndex != i {
			t.Errorf("Expected bucket index %d, got %d", i, bucket.BucketIndex)
		}
		if bucket.StartBlock != expectedStart {
			t.Errorf("Expected start block %d, got %d", expectedStart, bucket.StartBlock)
		}
		if bucket.EndBlock != expectedEnd {
			t.Errorf("Expected end block %d, got %d", expectedEnd, bucket.EndBlock)
		}
		if bucket.Total != 0 {
			t.Errorf("Expected total 0, got %f", bucket.Total)
		}
	}
}

func TestDistributeToBuckets(t *testing.T) {
	// Create 3 buckets for testing
	buckets := []Bucket{
		{BucketIndex: 0, StartBlock: 0, EndBlock: 99999, Total: 0},
		{BucketIndex: 1, StartBlock: 100000, EndBlock: 199999, Total: 0},
		{BucketIndex: 2, StartBlock: 200000, EndBlock: 299999, Total: 0},
	}
	size := uint64(100000)

	// Test distribution across multiple buckets
	// Range 50000-150000 spans bucket 0 (50%) and bucket 1 (50%)
	distributeToBuckets(&buckets, 50000, 150000, 100.0, size)

	// Bucket 0 should get 50000 blocks out of 100001 total = ~49.999%
	// Bucket 1 should get 50001 blocks out of 100001 total = ~50.001%
	expectedBucket0 := 100.0 * 50000.0 / 100001.0 // ~49.999
	expectedBucket1 := 100.0 * 50001.0 / 100001.0 // ~50.001

	if buckets[0].Total < expectedBucket0-0.1 || buckets[0].Total > expectedBucket0+0.1 {
		t.Errorf("Expected bucket 0 total ~%f, got %f", expectedBucket0, buckets[0].Total)
	}
	if buckets[1].Total < expectedBucket1-0.1 || buckets[1].Total > expectedBucket1+0.1 {
		t.Errorf("Expected bucket 1 total ~%f, got %f", expectedBucket1, buckets[1].Total)
	}
	if buckets[2].Total != 0 {
		t.Errorf("Expected bucket 2 total 0, got %f", buckets[2].Total)
	}
}
