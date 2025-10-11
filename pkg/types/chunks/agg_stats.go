package chunks

// StatsBucket stores bucket data specifically for the STATS facet
type StatsBucket struct {
	Series0      []Bucket    `json:"series0"`
	Series0Stats BucketStats `json:"series0Stats"`

	Series1      []Bucket    `json:"series1"`
	Series1Stats BucketStats `json:"series1Stats"`

	Series2      []Bucket    `json:"series2"`
	Series2Stats BucketStats `json:"series2Stats"`

	Series3      []Bucket    `json:"series3"`
	Series3Stats BucketStats `json:"series3Stats"`

	GridInfo GridInfo `json:"gridInfo"`
}

func (c *ChunksCollection) initializeStatsBucket() {
	c.statsBucket = &StatsBucket{
		Series0:      make([]Bucket, 0),
		Series0Stats: BucketStats{},

		Series1:      make([]Bucket, 0),
		Series1Stats: BucketStats{},

		Series2:      make([]Bucket, 0),
		Series2Stats: BucketStats{},

		Series3:      make([]Bucket, 0),
		Series3Stats: BucketStats{},

		GridInfo: GridInfo{
			Size:        100000, // 100k blocks per bucket (same as others)
			Rows:        0,
			Columns:     20,
			BucketCount: 0,
			MaxBlock:    0,
		},
	}
}

func (c *ChunksCollection) updateStatsBucket(stats *Stats) {
	c.statsMutex.Lock()
	defer c.statsMutex.Unlock()

	if stats == nil {
		return
	}

	if c.statsBucket == nil {
		c.initializeStatsBucket()
	}

	// Parse the range string to get block numbers
	firstBlock, lastBlock, err := parseRangeString(stats.Range)
	if err != nil {
		return
	}

	size := c.statsBucket.GridInfo.Size

	// Calculate which buckets this stats spans
	lastBucketIndex := int(lastBlock / size)

	// Ensure we have enough buckets for all four types
	ensureBucketsExist(&c.statsBucket.Series0, lastBucketIndex, size)
	ensureBucketsExist(&c.statsBucket.Series1, lastBucketIndex, size)
	ensureBucketsExist(&c.statsBucket.Series2, lastBucketIndex, size)
	ensureBucketsExist(&c.statsBucket.Series3, lastBucketIndex, size)

	// Distribute stats data across all affected buckets
	distributeToBuckets(&c.statsBucket.Series0, firstBlock, lastBlock, float64(stats.Ratio), size)
	distributeToBuckets(&c.statsBucket.Series1, firstBlock, lastBlock, float64(stats.AppsPerBlock), size)
	distributeToBuckets(&c.statsBucket.Series2, firstBlock, lastBlock, float64(stats.AddrsPerBlock), size)
	distributeToBuckets(&c.statsBucket.Series3, firstBlock, lastBlock, float64(stats.AppsPerAddr), size)

	// Update grid info
	maxBuckets := len(c.statsBucket.Series0)
	if len(c.statsBucket.Series1) > maxBuckets {
		maxBuckets = len(c.statsBucket.Series1)
	}
	if len(c.statsBucket.Series2) > maxBuckets {
		maxBuckets = len(c.statsBucket.Series2)
	}
	if len(c.statsBucket.Series3) > maxBuckets {
		maxBuckets = len(c.statsBucket.Series3)
	}
	updateGridInfo(&c.statsBucket.GridInfo, maxBuckets, lastBlock)
}

func (c *ChunksCollection) finalizeStatsBucketsStats() {
	c.statsMutex.Lock()
	defer c.statsMutex.Unlock()

	if c.statsBucket == nil {
		return
	}

	// Calculate stats and color values for ratio
	if len(c.statsBucket.Series0) > 0 {
		c.statsBucket.Series0Stats = calculateBucketStatsAndColors(c.statsBucket.Series0)
	}

	// Calculate stats and color values for appsPerBlk
	if len(c.statsBucket.Series1) > 0 {
		c.statsBucket.Series1Stats = calculateBucketStatsAndColors(c.statsBucket.Series1)
	}

	// Calculate stats and color values for addrsPerBlk
	if len(c.statsBucket.Series2) > 0 {
		c.statsBucket.Series2Stats = calculateBucketStatsAndColors(c.statsBucket.Series2)
	}

	// Calculate stats and color values for addrsPerApps
	if len(c.statsBucket.Series3) > 0 {
		c.statsBucket.Series3Stats = calculateBucketStatsAndColors(c.statsBucket.Series3)
	}
}

// ClearStatsBucket clears the stats facet bucket cache data
func (c *ChunksCollection) ClearStatsBucket() {
	c.statsMutex.Lock()
	defer c.statsMutex.Unlock()
	c.statsBucket = nil
}
