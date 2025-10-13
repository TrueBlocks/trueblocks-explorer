package chunks

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// TestUpdateGridInfo tests the grid info update functionality
func TestUpdateGridInfo(t *testing.T) {
	gridInfo := &types.GridInfo{
		Size:        100000,
		Rows:        0,
		Columns:     20,
		BucketCount: 0,
		MaxBlock:    0,
	}

	// Test updating with new max values
	updateGridInfo(gridInfo, 5, 250000)

	if gridInfo.BucketCount != 5 {
		t.Errorf("Expected bucket count 5, got %d", gridInfo.BucketCount)
	}
	if gridInfo.MaxBlock != 250000 {
		t.Errorf("Expected max block 250000, got %d", gridInfo.MaxBlock)
	}
	if gridInfo.Rows != 1 { // (5 + 20 - 1) / 20 = 1
		t.Errorf("Expected rows 1, got %d", gridInfo.Rows)
	}

	// Test updating with larger values
	updateGridInfo(gridInfo, 25, 500000)

	if gridInfo.BucketCount != 25 {
		t.Errorf("Expected bucket count 25, got %d", gridInfo.BucketCount)
	}
	if gridInfo.MaxBlock != 500000 {
		t.Errorf("Expected max block 500000, got %d", gridInfo.MaxBlock)
	}
	if gridInfo.Rows != 2 { // (25 + 20 - 1) / 20 = 2
		t.Errorf("Expected rows 2, got %d", gridInfo.Rows)
	}

	// Test that smaller values don't decrease the maximums
	updateGridInfo(gridInfo, 10, 100000)

	if gridInfo.BucketCount != 25 { // Should remain 25
		t.Errorf("Expected bucket count to remain 25, got %d", gridInfo.BucketCount)
	}
	if gridInfo.MaxBlock != 500000 { // Should remain 500000
		t.Errorf("Expected max block to remain 500000, got %d", gridInfo.MaxBlock)
	}
}

// TestBloomsBucketInitialization tests blooms bucket initialization
func TestBloomsBucketInitialization(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksBlooms}
	collection := NewChunksCollection(payload)

	// Get buckets from the blooms facet
	bucket := collection.bloomsFacet.GetBuckets()

	if len(bucket.Series2) != 0 {
		t.Errorf("Expected empty Series2, got length %d", len(bucket.Series2))
	}
	if len(bucket.Series3) != 0 {
		t.Errorf("Expected empty Series3, got length %d", len(bucket.Series3))
	}
	if bucket.GridInfo.Size != 100000 {
		t.Errorf("Expected grid size 100000, got %d", bucket.GridInfo.Size)
	}
	if bucket.GridInfo.Columns != 20 {
		t.Errorf("Expected 20 columns, got %d", bucket.GridInfo.Columns)
	}
}

// TestIndexBucketInitialization tests index bucket initialization
func TestIndexBucketInitialization(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksIndex}
	collection := NewChunksCollection(payload)

	// Get buckets from the index facet
	bucket := collection.indexFacet.GetBuckets()

	if len(bucket.Series0) != 0 {
		t.Errorf("Expected empty Series0, got length %d", len(bucket.Series0))
	}
	if len(bucket.Series1) != 0 {
		t.Errorf("Expected empty Series1, got length %d", len(bucket.Series1))
	}
	if len(bucket.Series2) != 0 {
		t.Errorf("Expected empty Series2, got length %d", len(bucket.Series2))
	}
	if bucket.GridInfo.Size != 100000 {
		t.Errorf("Expected grid size 100000, got %d", bucket.GridInfo.Size)
	}
}

// TestStatsBucketInitialization tests stats bucket initialization
func TestStatsBucketInitialization(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksStats}
	collection := NewChunksCollection(payload)

	// Get buckets from the stats facet
	bucket := collection.statsFacet.GetBuckets()

	if len(bucket.Series0) != 0 {
		t.Errorf("Expected empty Series0, got length %d", len(bucket.Series0))
	}
	if len(bucket.Series1) != 0 {
		t.Errorf("Expected empty Series1, got length %d", len(bucket.Series1))
	}
	if len(bucket.Series2) != 0 {
		t.Errorf("Expected empty Series2, got length %d", len(bucket.Series2))
	}
	if len(bucket.Series3) != 0 {
		t.Errorf("Expected empty Series3, got length %d", len(bucket.Series3))
	}
	if bucket.GridInfo.Size != 100000 {
		t.Errorf("Expected grid size 100000, got %d", bucket.GridInfo.Size)
	}
}

// TestBloomsBucketUpdate tests updating blooms bucket with data
func TestBloomsBucketUpdate(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksBlooms}
	collection := NewChunksCollection(payload)

	// Create test bloom data
	bloom := &Bloom{
		Range:    "000000000-000099999", // blocks 0-99999 (fits in one bucket)
		FileSize: 1024.0,
		NBlooms:  50.0,
	}

	// Update bucket with bloom data
	collection.updateBloomsBucket(bloom)

	bucket := collection.bloomsFacet.GetBuckets()

	// Should have created one bucket
	if len(bucket.Series2) != 1 {
		t.Errorf("Expected 1 bucket in Series2, got %d", len(bucket.Series2))
	}
	if len(bucket.Series3) != 1 {
		t.Errorf("Expected 1 bucket in Series3, got %d", len(bucket.Series3))
	}

	// Check bucket data
	if bucket.Series2[0].Total != 1024 {
		t.Errorf("Expected Series2 total 1024, got %f", bucket.Series2[0].Total)
	}
	if bucket.Series3[0].Total != 50 {
		t.Errorf("Expected Series3 total 50, got %f", bucket.Series3[0].Total)
	}
}

// TestIndexBucketUpdate tests updating index bucket with data
func TestIndexBucketUpdate(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksIndex}
	collection := NewChunksCollection(payload)

	// Create test index data
	index := &Index{
		Range:        "000000000-000099999", // blocks 0-99999
		FileSize:     2048.0,                // integer stored as float
		NAddresses:   150.0,                 // integer stored as float
		NAppearances: 500.0,                 // integer stored as float
	}

	// Update bucket with index data
	collection.updateIndexBucket(index)

	bucket := collection.indexFacet.GetBuckets()

	// Should have created one bucket in each series (except Series3)
	if len(bucket.Series0) != 1 {
		t.Errorf("Expected 1 bucket in Series0, got %d", len(bucket.Series0))
	}
	if len(bucket.Series1) != 1 {
		t.Errorf("Expected 1 bucket in Series1, got %d", len(bucket.Series1))
	}
	if len(bucket.Series2) != 1 {
		t.Errorf("Expected 1 bucket in Series2, got %d", len(bucket.Series2))
	}

	// Check bucket data - Series0=NAddresses, Series1=NAppearances, Series2=FileSize
	if bucket.Series0[0].Total != 150.0 {
		t.Errorf("Expected Series0 total 150.0 (NAddresses), got %f", bucket.Series0[0].Total)
	}
	if bucket.Series1[0].Total != 500.0 {
		t.Errorf("Expected Series1 total 500.0 (NAppearances), got %f", bucket.Series1[0].Total)
	}
	if bucket.Series2[0].Total != 2048.0 {
		t.Errorf("Expected Series2 total 2048.0 (FileSize), got %f", bucket.Series2[0].Total)
	}
}

// TestStatsBucketUpdate tests updating stats bucket with data
func TestStatsBucketUpdate(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksStats}
	collection := NewChunksCollection(payload)

	// Create test stats data
	stats := &Stats{
		Range:         "000000000-000099999", // blocks 0-99999
		Ratio:         2.5,                   // already a float
		AppsPerBlock:  1.2,                   // already a float
		AddrsPerBlock: 0.8,                   // already a float
		AppsPerAddr:   1.5,                   // already a float
	}

	// Update bucket with stats data
	collection.updateStatsBucket(stats)

	bucket := collection.statsFacet.GetBuckets()

	// Should have created one bucket in each series
	if len(bucket.Series0) != 1 {
		t.Errorf("Expected 1 bucket in Series0, got %d", len(bucket.Series0))
	}
	if len(bucket.Series1) != 1 {
		t.Errorf("Expected 1 bucket in Series1, got %d", len(bucket.Series1))
	}
	if len(bucket.Series2) != 1 {
		t.Errorf("Expected 1 bucket in Series2, got %d", len(bucket.Series2))
	}
	if len(bucket.Series3) != 1 {
		t.Errorf("Expected 1 bucket in Series3, got %d", len(bucket.Series3))
	}

	// Check bucket data
	if bucket.Series0[0].Total != 2.5 {
		t.Errorf("Expected Series0 total 2.5, got %f", bucket.Series0[0].Total)
	}
	if bucket.Series1[0].Total != 1.2 {
		t.Errorf("Expected Series1 total 1.2, got %f", bucket.Series1[0].Total)
	}
	if bucket.Series2[0].Total != 0.8 {
		t.Errorf("Expected Series2 total 0.8, got %f", bucket.Series2[0].Total)
	}
	if bucket.Series3[0].Total != 1.5 {
		t.Errorf("Expected Series3 total 1.5, got %f", bucket.Series3[0].Total)
	}
}

// TestGetChunksBucketsBloomsFacet tests GetBuckets for blooms facet
func TestGetChunksBucketsBloomsFacet(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksBlooms}
	collection := NewChunksCollection(payload)

	result, err := collection.GetBuckets(payload)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Should return Buckets with empty Series0 and Series1, initialized Series2 and Series3
	if len(result.Series0) != 0 {
		t.Errorf("Expected empty Series0 for blooms facet, got length %d", len(result.Series0))
	}
	if len(result.Series1) != 0 {
		t.Errorf("Expected empty Series1 for blooms facet, got length %d", len(result.Series1))
	}
	if result.GridInfo.Size != 100000 {
		t.Errorf("Expected grid size 100000, got %d", result.GridInfo.Size)
	}
}

// TestGetChunksBucketsStatsFacet tests GetBuckets for stats facet
func TestGetChunksBucketsStatsFacet(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksStats}
	collection := NewChunksCollection(payload)

	result, err := collection.GetBuckets(payload)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Should return Buckets with all four series initialized (but empty)
	if result.Series0 == nil {
		t.Error("Expected Series0 to be initialized")
	}
	if result.Series1 == nil {
		t.Error("Expected Series1 to be initialized")
	}
	if result.Series2 == nil {
		t.Error("Expected Series2 to be initialized")
	}
	if result.Series3 == nil {
		t.Error("Expected Series3 to be initialized")
	}
	if result.GridInfo.Size != 100000 {
		t.Errorf("Expected grid size 100000, got %d", result.GridInfo.Size)
	}
}

// TestGetChunksBucketsIndexFacet tests GetBuckets for index facet
func TestGetChunksBucketsIndexFacet(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksIndex}
	collection := NewChunksCollection(payload)

	result, err := collection.GetBuckets(payload)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Should return Buckets with Series0, Series1, Series2 initialized, Series3 empty
	if result.Series0 == nil {
		t.Error("Expected Series0 to be initialized")
	}
	if result.Series1 == nil {
		t.Error("Expected Series1 to be initialized")
	}
	if result.Series2 == nil {
		t.Error("Expected Series2 to be initialized")
	}
	if len(result.Series3) != 0 {
		t.Errorf("Expected empty Series3 for index facet, got length %d", len(result.Series3))
	}
}

// TestGetChunksBucketsUnknownFacet tests GetBuckets for unknown facet
func TestGetChunksBucketsUnknownFacet(t *testing.T) {
	payload := &types.Payload{DataFacet: "unknown"}
	collection := NewChunksCollection(payload)

	result, err := collection.GetBuckets(payload)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Should return empty Buckets with default grid info
	if len(result.Series0) != 0 {
		t.Errorf("Expected empty Series0, got length %d", len(result.Series0))
	}
	if len(result.Series1) != 0 {
		t.Errorf("Expected empty Series1, got length %d", len(result.Series1))
	}
	if len(result.Series2) != 0 {
		t.Errorf("Expected empty Series2, got length %d", len(result.Series2))
	}
	if len(result.Series3) != 0 {
		t.Errorf("Expected empty Series3, got length %d", len(result.Series3))
	}
	if result.GridInfo.Size != 100000 {
		t.Errorf("Expected default grid size 100000, got %d", result.GridInfo.Size)
	}
}

// TestBucketStatsFinalization tests stats finalization for different bucket types
func TestBucketStatsFinalization(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksStats}
	collection := NewChunksCollection(payload)

	// Add some test data
	stats := &Stats{
		Range: "000000000-000099999", // blocks 0-99999
		Ratio: 2.0, AppsPerBlock: 1.0, AddrsPerBlock: 0.5, AppsPerAddr: 2.0,
	}
	collection.updateStatsBucket(stats)

	stats2 := &Stats{
		Range: "000100000-000199999", // blocks 100000-199999
		Ratio: 4.0, AppsPerBlock: 2.0, AddrsPerBlock: 1.0, AppsPerAddr: 2.0,
	}
	collection.updateStatsBucket(stats2)

	bucket := collection.statsFacet.GetBuckets()

	// Manually calculate stats for verification since finalizeBucketStats was removed
	// Check that we have the expected data distribution
	if len(bucket.Series0) != 2 {
		t.Errorf("Expected 2 buckets in Series0, got %d", len(bucket.Series0))
	}
	if len(bucket.Series1) != 2 {
		t.Errorf("Expected 2 buckets in Series1, got %d", len(bucket.Series1))
	}
	if len(bucket.Series2) != 2 {
		t.Errorf("Expected 2 buckets in Series2, got %d", len(bucket.Series2))
	}
	if len(bucket.Series3) != 2 {
		t.Errorf("Expected 2 buckets in Series3, got %d", len(bucket.Series3))
	}

	// Check individual bucket values
	if bucket.Series0[0].Total != 2.0 {
		t.Errorf("Expected Series0[0] total 2.0, got %f", bucket.Series0[0].Total)
	}
	if bucket.Series0[1].Total != 4.0 {
		t.Errorf("Expected Series0[1] total 4.0, got %f", bucket.Series0[1].Total)
	}
}

// TestSeries3RegressionBug tests that Series3 data is properly handled (regression test)
func TestSeries3RegressionBug(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksStats}
	collection := NewChunksCollection(payload)

	// Add stats data that populates Series3
	stats := &Stats{
		Range: "000000000-000099999", // blocks 0-99999
		Ratio: 1.0, AppsPerBlock: 1.0, AddrsPerBlock: 1.0, AppsPerAddr: 5.0,
	}
	collection.updateStatsBucket(stats)

	result, err := collection.GetBuckets(payload)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Verify Series3 has the correct data (not empty, not copied to Series2)
	if len(result.Series3) != 1 {
		t.Errorf("Expected 1 bucket in Series3, got %d", len(result.Series3))
	}
	if result.Series3[0].Total != 5.0 {
		t.Errorf("Expected Series3 total 5.0, got %f", result.Series3[0].Total)
	}

	// Verify Series2 has its own correct data (not Series3 data)
	if len(result.Series2) != 1 {
		t.Errorf("Expected 1 bucket in Series2, got %d", len(result.Series2))
	}
	if result.Series2[0].Total != 1.0 { // Should be AddrsPerBlock, not AppsPerAddr
		t.Errorf("Expected Series2 total 1.0, got %f", result.Series2[0].Total)
	}
}
