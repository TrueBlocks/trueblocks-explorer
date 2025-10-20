package chunks

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

func (c *ChunksCollection) updateStatsBucket(stats *Stats) {
	if stats == nil {
		return
	}

	c.statsFacet.UpdateBuckets(func(bucket *types.Buckets) {
		// For stats, use time-based daily buckets if range dates are available
		if stats.RangeDates != nil && stats.RangeDates.FirstDate != "" && stats.RangeDates.LastDate != "" {
			c.updateStatsBucketTimeBase(stats, bucket)
		} else {
			c.updateStatsBucketBlockBase(stats, bucket)
		}
	})
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

	// Define metrics and their values
	metrics := map[string]float64{
		"ratio":         float64(stats.Ratio),
		"appsPerBlock":  float64(stats.AppsPerBlock),
		"addrsPerBlock": float64(stats.AddrsPerBlock),
		"appsPerAddr":   float64(stats.AppsPerAddr),
	}

	// Process each metric using the flexible series structure
	maxBuckets := 0
	for seriesName, value := range metrics {
		bucket.EnsureSeriesExists(seriesName)
		series := bucket.GetSeries(seriesName)
		ensureBucketsExist(&series, lastBucketIndex, size)
		distributeToBuckets(&series, firstBlock, lastBlock, value, size)
		bucket.SetSeries(seriesName, series)

		if len(series) > maxBuckets {
			maxBuckets = len(series)
		}
	}

	// Update grid info
	updateGridInfo(&bucket.GridInfo, maxBuckets, lastBlock)
}
