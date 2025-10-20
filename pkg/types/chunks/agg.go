package chunks

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// ensureBucketsExist ensures that the bucket slice has at least targetIndex+1 buckets
func ensureBucketsExist(buckets *[]types.Bucket, targetIndex int, size uint64) {
	for len(*buckets) <= targetIndex {
		newBucketKey := len(*buckets)
		startBlock := uint64(newBucketKey) * size
		endBlock := uint64(newBucketKey+1)*size - 1

		newBucket := types.NewBucket(strconv.Itoa(newBucketKey), startBlock, endBlock)
		*buckets = append(*buckets, newBucket)
	}
}

// distributeToBuckets distributes a value across buckets using linear interpolation
func distributeToBuckets(buckets *[]types.Bucket, firstBlock, lastBlock uint64, value float64, size uint64) {
	rangeSize := lastBlock - firstBlock + 1
	firstBucketKey := int(firstBlock / size)
	lastBucketKey := int(lastBlock / size)

	// Distribute data across all affected buckets using linear interpolation
	for bucketIndex := firstBucketKey; bucketIndex <= lastBucketKey; bucketIndex++ {
		bucketStartBlock := uint64(bucketIndex) * size
		bucketEndBlock := uint64(bucketIndex+1)*size - 1

		// Calculate the overlap between the data range and this bucket
		overlapStart := max(firstBlock, bucketStartBlock)
		overlapEnd := min(lastBlock, bucketEndBlock)
		overlapSize := overlapEnd - overlapStart + 1

		// Calculate the proportion of the data that belongs to this bucket
		proportion := float64(overlapSize) / float64(rangeSize)

		// Add the proportional contribution to the bucket
		(*buckets)[bucketIndex].Total += value * proportion
	}
}

// updateGridInfo updates grid information based on current bucket state
func updateGridInfo(gridInfo *types.GridInfo, maxBuckets int, lastBlock uint64) {
	if maxBuckets > gridInfo.BucketCount {
		gridInfo.BucketCount = maxBuckets
	}
	if lastBlock > gridInfo.MaxBlock {
		gridInfo.MaxBlock = lastBlock
	}
	gridInfo.Rows = (gridInfo.BucketCount + gridInfo.Columns - 1) / gridInfo.Columns
}

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

// parseDateToDailyBucket parses a date string and returns a daily bucket key
// Input: "2025-10-08 10:40:23 UTC"
// Output: "20251008"
func parseDateToDailyBucket(dateStr string) (string, error) {
	// Parse the date string - format: "2025-10-08 10:40:23 UTC"
	t, err := time.Parse("2006-01-02 15:04:05 MST", dateStr)
	if err != nil {
		return "", fmt.Errorf("failed to parse date %s: %v", dateStr, err)
	}

	return fmt.Sprintf("%04d%02d%02d", t.Year(), t.Month(), t.Day()), nil
}

// ensureTimeBucketsExist ensures that time-based buckets exist for a date range
func (c *ChunksCollection) ensureTimeBucketsExist(bucket *types.Buckets, startBucket, endBucket string) {
	// For now, just ensure the start and end buckets exist
	// In a full implementation, you'd generate all daily buckets between start and end
	c.ensureDailyBucketExists(bucket, startBucket)
	c.ensureDailyBucketExists(bucket, endBucket)
}

// ensureDailyBucketExists ensures a single daily bucket exists
func (c *ChunksCollection) ensureDailyBucketExists(bucket *types.Buckets, bucketKey string) {
	// Check if bucket exists in the flexible series
	metrics := []string{"ratio", "appsPerBlock", "addrsPerBlock", "appsPerAddr"}

	for _, metricName := range metrics {
		bucket.EnsureSeriesExists(metricName)
		series := bucket.GetSeries(metricName)

		// Check if bucket already exists
		found := false
		for _, existingBucket := range series {
			if existingBucket.BucketKey == bucketKey {
				found = true
				break
			}
		}

		if !found {
			// Bucket doesn't exist, add it
			newBucket := types.NewBucket(bucketKey, 0, 0)
			series = append(series, newBucket)
			bucket.SetSeries(metricName, series)
		}
	}
}

// distributeToTimeBuckets distributes stats values across time buckets
func (c *ChunksCollection) distributeToTimeBuckets(bucket *types.Buckets, startBucket, endBucket string, stats *Stats) {
	// For simplicity, add values to both start and end buckets
	// In a more sophisticated implementation, you'd distribute proportionally across all days in the range

	c.addStatsToTimeBucket(bucket, startBucket, stats)
	if startBucket != endBucket {
		c.addStatsToTimeBucket(bucket, endBucket, stats)
	}
}

// addStatsToTimeBucket adds stats values to a specific time bucket
func (c *ChunksCollection) addStatsToTimeBucket(bucket *types.Buckets, bucketKey string, stats *Stats) {
	// Define metrics and their values
	metrics := map[string]float64{
		"ratio":         float64(stats.Ratio),
		"appsPerBlock":  float64(stats.AppsPerBlock),
		"addrsPerBlock": float64(stats.AddrsPerBlock),
		"appsPerAddr":   float64(stats.AppsPerAddr),
	}

	// Update flexible series
	for seriesName, value := range metrics {
		bucket.EnsureSeriesExists(seriesName)
		series := bucket.GetSeries(seriesName)
		for i := range series {
			if series[i].BucketKey == bucketKey {
				series[i].Total += value
				series[i].ColorValue += value
				break
			}
		}
		bucket.SetSeries(seriesName, series)
	}
}
