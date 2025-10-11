package chunks

import (
	"fmt"
	"strconv"
	"strings"
)

// ensureBucketsExist ensures that the bucket slice has at least targetIndex+1 buckets
func ensureBucketsExist(buckets *[]Bucket, targetIndex int, size uint64) {
	for len(*buckets) <= targetIndex {
		newBucketIndex := len(*buckets)
		startBlock := uint64(newBucketIndex) * size
		endBlock := uint64(newBucketIndex+1)*size - 1

		newBucket := Bucket{
			BucketIndex: newBucketIndex,
			StartBlock:  startBlock,
			EndBlock:    endBlock,
			Total:       0,
			ColorValue:  0,
		}
		*buckets = append(*buckets, newBucket)
	}
}

// distributeToBuckets distributes a value across buckets using linear interpolation
func distributeToBuckets(buckets *[]Bucket, firstBlock, lastBlock uint64, value float64, size uint64) {
	rangeSize := lastBlock - firstBlock + 1
	firstBucketIndex := int(firstBlock / size)
	lastBucketIndex := int(lastBlock / size)

	// Distribute data across all affected buckets using linear interpolation
	for bucketIndex := firstBucketIndex; bucketIndex <= lastBucketIndex; bucketIndex++ {
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
func updateGridInfo(gridInfo *GridInfo, maxBuckets int, lastBlock uint64) {
	if maxBuckets > gridInfo.BucketCount {
		gridInfo.BucketCount = maxBuckets
	}
	if lastBlock > gridInfo.MaxBlock {
		gridInfo.MaxBlock = lastBlock
	}
	gridInfo.Rows = (gridInfo.BucketCount + gridInfo.Columns - 1) / gridInfo.Columns
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
