package chunks

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

func (c *ChunksCollection) updateStatsBucket(stats *Stats) {
	if stats == nil {
		return
	}

	facet := "stats"
	c.ensureBucketExists(facet)
	mutex := c.mutexByFacet[facet]
	bucket := c.bucketsByFacet[facet]
	if mutex == nil || bucket == nil {
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	// For stats, use time-based daily buckets if range dates are available
	if stats.RangeDates != nil && stats.RangeDates.FirstDate != "" && stats.RangeDates.LastDate != "" {
		c.updateStatsBucketTimeBase(stats, bucket)
	} else {
		c.updateStatsBucketBlockBase(stats, bucket)
	}
}

// updateStatsBucketTimeBase handles time-based daily bucketing for stats
func (c *ChunksCollection) updateStatsBucketTimeBase(stats *Stats, bucket *types.Buckets) {
	startBucket, err := parseDateToDailyBucket(stats.RangeDates.FirstDate)
	if err != nil {
		return
	}

	endBucket, err := parseDateToDailyBucket(stats.RangeDates.LastDate)
	if err != nil {
		return
	}

	// Find or create buckets for the date range
	c.ensureTimeBucketsExist(bucket, startBucket, endBucket)

	// Distribute the values across the time buckets
	c.distributeToTimeBuckets(bucket, startBucket, endBucket, stats)
}

// updateStatsBucketBlockBase handles traditional block-based bucketing (fallback)
func (c *ChunksCollection) updateStatsBucketBlockBase(stats *Stats, bucket *types.Buckets) {
	// Parse the range string to get block numbers
	firstBlock, lastBlock, err := parseRangeString(stats.Range)
	if err != nil {
		return
	}

	size := bucket.GridInfo.Size
	lastBucketIndex := int(lastBlock / size)

	// Ensure we have enough buckets
	ensureBucketsExist(&bucket.Series0, lastBucketIndex, size)
	ensureBucketsExist(&bucket.Series1, lastBucketIndex, size)
	ensureBucketsExist(&bucket.Series2, lastBucketIndex, size)
	ensureBucketsExist(&bucket.Series3, lastBucketIndex, size)

	// Distribute items across all affected buckets
	distributeToBuckets(&bucket.Series0, firstBlock, lastBlock, float64(stats.Ratio), size)
	distributeToBuckets(&bucket.Series1, firstBlock, lastBlock, float64(stats.AppsPerBlock), size)
	distributeToBuckets(&bucket.Series2, firstBlock, lastBlock, float64(stats.AddrsPerBlock), size)
	distributeToBuckets(&bucket.Series3, firstBlock, lastBlock, float64(stats.AppsPerAddr), size)

	// Update grid info
	maxBuckets := len(bucket.Series0)
	if len(bucket.Series1) > maxBuckets {
		maxBuckets = len(bucket.Series1)
	}
	if len(bucket.Series2) > maxBuckets {
		maxBuckets = len(bucket.Series2)
	}
	if len(bucket.Series3) > maxBuckets {
		maxBuckets = len(bucket.Series3)
	}
	updateGridInfo(&bucket.GridInfo, maxBuckets, lastBlock)
}
