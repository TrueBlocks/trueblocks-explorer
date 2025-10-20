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

	if len(bucket.GetSeries("fileSize")) != 0 {
		t.Errorf("Expected empty fileSize series, got length %d", len(bucket.GetSeries("fileSize")))
	}
	if len(bucket.GetSeries("nBlooms")) != 0 {
		t.Errorf("Expected empty nBlooms series, got length %d", len(bucket.GetSeries("nBlooms")))
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

	if len(bucket.GetSeries("nAddresses")) != 0 {
		t.Errorf("Expected empty nAddresses series, got length %d", len(bucket.GetSeries("nAddresses")))
	}
	if len(bucket.GetSeries("nAppearances")) != 0 {
		t.Errorf("Expected empty nAppearances series, got length %d", len(bucket.GetSeries("nAppearances")))
	}
	if len(bucket.GetSeries("fileSize")) != 0 {
		t.Errorf("Expected empty fileSize series, got length %d", len(bucket.GetSeries("fileSize")))
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

	if len(bucket.GetSeries("ratio")) != 0 {
		t.Errorf("Expected empty ratio series, got length %d", len(bucket.GetSeries("ratio")))
	}
	if len(bucket.GetSeries("appsPerBlock")) != 0 {
		t.Errorf("Expected empty appsPerBlock series, got length %d", len(bucket.GetSeries("appsPerBlock")))
	}
	if len(bucket.GetSeries("addrsPerBlock")) != 0 {
		t.Errorf("Expected empty addrsPerBlock series, got length %d", len(bucket.GetSeries("addrsPerBlock")))
	}
	if len(bucket.GetSeries("appsPerAddr")) != 0 {
		t.Errorf("Expected empty appsPerAddr series, got length %d", len(bucket.GetSeries("appsPerAddr")))
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
	if len(bucket.GetSeries("fileSize")) != 1 {
		t.Errorf("Expected 1 bucket in fileSize series, got %d", len(bucket.GetSeries("fileSize")))
	}
	if len(bucket.GetSeries("nBlooms")) != 1 {
		t.Errorf("Expected 1 bucket in nBlooms series, got %d", len(bucket.GetSeries("nBlooms")))
	}

	// Check bucket data
	if bucket.GetSeries("fileSize")[0].Total != 1024 {
		t.Errorf("Expected fileSize total 1024, got %f", bucket.GetSeries("fileSize")[0].Total)
	}
	if bucket.GetSeries("nBlooms")[0].Total != 50 {
		t.Errorf("Expected nBlooms total 50, got %f", bucket.GetSeries("nBlooms")[0].Total)
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

	// Should have created one bucket in each series
	if len(bucket.GetSeries("nAddresses")) != 1 {
		t.Errorf("Expected 1 bucket in nAddresses series, got %d", len(bucket.GetSeries("nAddresses")))
	}
	if len(bucket.GetSeries("nAppearances")) != 1 {
		t.Errorf("Expected 1 bucket in nAppearances series, got %d", len(bucket.GetSeries("nAppearances")))
	}
	if len(bucket.GetSeries("fileSize")) != 1 {
		t.Errorf("Expected 1 bucket in fileSize series, got %d", len(bucket.GetSeries("fileSize")))
	}

	// Check bucket data
	if bucket.GetSeries("nAddresses")[0].Total != 150.0 {
		t.Errorf("Expected nAddresses total 150.0, got %f", bucket.GetSeries("nAddresses")[0].Total)
	}
	if bucket.GetSeries("nAppearances")[0].Total != 500.0 {
		t.Errorf("Expected nAppearances total 500.0, got %f", bucket.GetSeries("nAppearances")[0].Total)
	}
	if bucket.GetSeries("fileSize")[0].Total != 2048.0 {
		t.Errorf("Expected fileSize total 2048.0, got %f", bucket.GetSeries("fileSize")[0].Total)
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
	if len(bucket.GetSeries("ratio")) != 1 {
		t.Errorf("Expected 1 bucket in ratio series, got %d", len(bucket.GetSeries("ratio")))
	}
	if len(bucket.GetSeries("appsPerBlock")) != 1 {
		t.Errorf("Expected 1 bucket in appsPerBlock series, got %d", len(bucket.GetSeries("appsPerBlock")))
	}
	if len(bucket.GetSeries("addrsPerBlock")) != 1 {
		t.Errorf("Expected 1 bucket in addrsPerBlock series, got %d", len(bucket.GetSeries("addrsPerBlock")))
	}
	if len(bucket.GetSeries("appsPerAddr")) != 1 {
		t.Errorf("Expected 1 bucket in appsPerAddr series, got %d", len(bucket.GetSeries("appsPerAddr")))
	}

	// Check bucket data
	if bucket.GetSeries("ratio")[0].Total != 2.5 {
		t.Errorf("Expected ratio total 2.5, got %f", bucket.GetSeries("ratio")[0].Total)
	}
	if bucket.GetSeries("appsPerBlock")[0].Total != 1.2 {
		t.Errorf("Expected appsPerBlock total 1.2, got %f", bucket.GetSeries("appsPerBlock")[0].Total)
	}
	if bucket.GetSeries("addrsPerBlock")[0].Total != 0.8 {
		t.Errorf("Expected addrsPerBlock total 0.8, got %f", bucket.GetSeries("addrsPerBlock")[0].Total)
	}
	if bucket.GetSeries("appsPerAddr")[0].Total != 1.5 {
		t.Errorf("Expected appsPerAddr total 1.5, got %f", bucket.GetSeries("appsPerAddr")[0].Total)
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

	// Should return Buckets with empty series for fileSize and nBlooms
	if len(result.GetSeries("fileSize")) != 0 {
		t.Errorf("Expected empty fileSize series for blooms facet, got length %d", len(result.GetSeries("fileSize")))
	}
	if len(result.GetSeries("nBlooms")) != 0 {
		t.Errorf("Expected empty nBlooms series for blooms facet, got length %d", len(result.GetSeries("nBlooms")))
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

	// Should return Buckets with all four metric series initialized (but empty)
	if result.GetSeries("ratio") == nil {
		t.Error("Expected ratio series to be initialized")
	}
	if result.GetSeries("appsPerBlock") == nil {
		t.Error("Expected appsPerBlock series to be initialized")
	}
	if result.GetSeries("addrsPerBlock") == nil {
		t.Error("Expected addrsPerBlock series to be initialized")
	}
	if result.GetSeries("appsPerAddr") == nil {
		t.Error("Expected appsPerAddr series to be initialized")
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

	// Should return Buckets with three metric series initialized
	if result.GetSeries("nAddresses") == nil {
		t.Error("Expected nAddresses series to be initialized")
	}
	if result.GetSeries("nAppearances") == nil {
		t.Error("Expected nAppearances series to be initialized")
	}
	if result.GetSeries("fileSize") == nil {
		t.Error("Expected fileSize series to be initialized")
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
	if len(result.Series) != 0 {
		t.Errorf("Expected empty Series map, got length %d", len(result.Series))
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
	if len(bucket.GetSeries("ratio")) != 2 {
		t.Errorf("Expected 2 buckets in ratio series, got %d", len(bucket.GetSeries("ratio")))
	}
	if len(bucket.GetSeries("appsPerBlock")) != 2 {
		t.Errorf("Expected 2 buckets in appsPerBlock series, got %d", len(bucket.GetSeries("appsPerBlock")))
	}
	if len(bucket.GetSeries("addrsPerBlock")) != 2 {
		t.Errorf("Expected 2 buckets in addrsPerBlock series, got %d", len(bucket.GetSeries("addrsPerBlock")))
	}
	if len(bucket.GetSeries("appsPerAddr")) != 2 {
		t.Errorf("Expected 2 buckets in appsPerAddr series, got %d", len(bucket.GetSeries("appsPerAddr")))
	}

	// Check individual bucket values
	if bucket.GetSeries("ratio")[0].Total != 2.0 {
		t.Errorf("Expected ratio[0] total 2.0, got %f", bucket.GetSeries("ratio")[0].Total)
	}
	if bucket.GetSeries("ratio")[1].Total != 4.0 {
		t.Errorf("Expected ratio[1] total 4.0, got %f", bucket.GetSeries("ratio")[1].Total)
	}
}

// TestAppsPerAddrRegressionBug tests that appsPerAddr data is properly handled (regression test)
func TestAppsPerAddrRegressionBug(t *testing.T) {
	payload := &types.Payload{DataFacet: ChunksStats}
	collection := NewChunksCollection(payload)

	// Add stats data that populates appsPerAddr series
	stats := &Stats{
		Range: "000000000-000099999", // blocks 0-99999
		Ratio: 1.0, AppsPerBlock: 1.0, AddrsPerBlock: 1.0, AppsPerAddr: 5.0,
	}
	collection.updateStatsBucket(stats)

	result, err := collection.GetBuckets(payload)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Verify appsPerAddr has the correct data (not empty, not copied to addrsPerBlock)
	if len(result.GetSeries("appsPerAddr")) != 1 {
		t.Errorf("Expected 1 bucket in appsPerAddr series, got %d", len(result.GetSeries("appsPerAddr")))
	}
	if result.GetSeries("appsPerAddr")[0].Total != 5.0 {
		t.Errorf("Expected appsPerAddr total 5.0, got %f", result.GetSeries("appsPerAddr")[0].Total)
	}

	// Verify addrsPerBlock has its own correct data (not appsPerAddr data)
	if len(result.GetSeries("addrsPerBlock")) != 1 {
		t.Errorf("Expected 1 bucket in addrsPerBlock series, got %d", len(result.GetSeries("addrsPerBlock")))
	}
	if result.GetSeries("addrsPerBlock")[0].Total != 1.0 { // Should be AddrsPerBlock, not AppsPerAddr
		t.Errorf("Expected addrsPerBlock total 1.0, got %f", result.GetSeries("addrsPerBlock")[0].Total)
	}
}
