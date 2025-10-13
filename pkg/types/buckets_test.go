package types

import (
	"testing"
)

func TestNewGridInfo(t *testing.T) {
	gridInfo := NewGridInfo()

	if gridInfo.Size != 100000 {
		t.Errorf("Expected Size 100000, got %d", gridInfo.Size)
	}
	if gridInfo.Columns != 20 {
		t.Errorf("Expected Columns 20, got %d", gridInfo.Columns)
	}
	if gridInfo.Rows != 0 {
		t.Errorf("Expected Rows 0, got %d", gridInfo.Rows)
	}
	if gridInfo.BucketCount != 0 {
		t.Errorf("Expected BucketCount 0, got %d", gridInfo.BucketCount)
	}
	if gridInfo.MaxBlock != 0 {
		t.Errorf("Expected MaxBlock 0, got %d", gridInfo.MaxBlock)
	}
}

func TestNewBucket(t *testing.T) {
	bucket := NewBucket("test-key", 1000, 2000)

	if bucket.BucketKey != "test-key" {
		t.Errorf("Expected BucketKey 'test-key', got '%s'", bucket.BucketKey)
	}
	if bucket.StartBlock != 1000 {
		t.Errorf("Expected StartBlock 1000, got %d", bucket.StartBlock)
	}
	if bucket.EndBlock != 2000 {
		t.Errorf("Expected EndBlock 2000, got %d", bucket.EndBlock)
	}
	if bucket.Total != 0 {
		t.Errorf("Expected Total 0, got %f", bucket.Total)
	}
	if bucket.ColorValue != 0 {
		t.Errorf("Expected ColorValue 0, got %f", bucket.ColorValue)
	}
}

func TestNewBucketStats(t *testing.T) {
	stats := NewBucketStats()

	if stats.Total != 0 {
		t.Errorf("Expected Total 0, got %f", stats.Total)
	}
	if stats.Average != 0 {
		t.Errorf("Expected Average 0, got %f", stats.Average)
	}
	if stats.Min != 0 {
		t.Errorf("Expected Min 0, got %f", stats.Min)
	}
	if stats.Max != 0 {
		t.Errorf("Expected Max 0, got %f", stats.Max)
	}
	if stats.Count != 0 {
		t.Errorf("Expected Count 0, got %d", stats.Count)
	}
}

func TestNewBuckets(t *testing.T) {
	buckets := NewBuckets()

	// Test that all series are initialized as empty slices (not nil)
	if buckets.Series0 == nil {
		t.Error("Expected Series0 to be initialized")
	}
	if len(buckets.Series0) != 0 {
		t.Errorf("Expected Series0 length 0, got %d", len(buckets.Series0))
	}

	if buckets.Series1 == nil {
		t.Error("Expected Series1 to be initialized")
	}
	if len(buckets.Series1) != 0 {
		t.Errorf("Expected Series1 length 0, got %d", len(buckets.Series1))
	}

	if buckets.Series2 == nil {
		t.Error("Expected Series2 to be initialized")
	}
	if len(buckets.Series2) != 0 {
		t.Errorf("Expected Series2 length 0, got %d", len(buckets.Series2))
	}

	if buckets.Series3 == nil {
		t.Error("Expected Series3 to be initialized")
	}
	if len(buckets.Series3) != 0 {
		t.Errorf("Expected Series3 length 0, got %d", len(buckets.Series3))
	}

	// Test GridInfo is properly initialized
	if buckets.GridInfo.Size != 100000 {
		t.Errorf("Expected GridInfo.Size 100000, got %d", buckets.GridInfo.Size)
	}
	if buckets.GridInfo.Columns != 20 {
		t.Errorf("Expected GridInfo.Columns 20, got %d", buckets.GridInfo.Columns)
	}

	// Test BucketStats are initialized
	if buckets.Series0Stats.Count != 0 {
		t.Errorf("Expected Series0Stats.Count 0, got %d", buckets.Series0Stats.Count)
	}
	if buckets.Series1Stats.Total != 0 {
		t.Errorf("Expected Series1Stats.Total 0, got %f", buckets.Series1Stats.Total)
	}
}
