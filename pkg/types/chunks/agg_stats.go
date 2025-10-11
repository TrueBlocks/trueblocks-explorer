package chunks

func (c *ChunksCollection) initializeStatsBucket() {
	c.statsBucket = &StatsBucket{
		NAddrsBuckets:  make([]Bucket, 0),
		NAppsBuckets:   make([]Bucket, 0),
		NBlocksBuckets: make([]Bucket, 0),
		ChunkSzBuckets: make([]Bucket, 0),
		NAddrsStats:    BucketStats{},
		NAppsStats:     BucketStats{},
		NBlocksStats:   BucketStats{},
		ChunkSzStats:   BucketStats{},
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
	ensureBucketsExist(&c.statsBucket.NAddrsBuckets, lastBucketIndex, size)
	ensureBucketsExist(&c.statsBucket.NAppsBuckets, lastBucketIndex, size)
	ensureBucketsExist(&c.statsBucket.NBlocksBuckets, lastBucketIndex, size)
	ensureBucketsExist(&c.statsBucket.ChunkSzBuckets, lastBucketIndex, size)

	// Distribute stats data across all affected buckets
	distributeToBuckets(&c.statsBucket.NAddrsBuckets, firstBlock, lastBlock, float64(stats.NAddrs), size)
	distributeToBuckets(&c.statsBucket.NAppsBuckets, firstBlock, lastBlock, float64(stats.NApps), size)
	distributeToBuckets(&c.statsBucket.NBlocksBuckets, firstBlock, lastBlock, float64(stats.NBlocks), size)
	distributeToBuckets(&c.statsBucket.ChunkSzBuckets, firstBlock, lastBlock, float64(stats.ChunkSz), size)

	// Update grid info
	maxBuckets := len(c.statsBucket.NAddrsBuckets)
	if len(c.statsBucket.NAppsBuckets) > maxBuckets {
		maxBuckets = len(c.statsBucket.NAppsBuckets)
	}
	if len(c.statsBucket.NBlocksBuckets) > maxBuckets {
		maxBuckets = len(c.statsBucket.NBlocksBuckets)
	}
	if len(c.statsBucket.ChunkSzBuckets) > maxBuckets {
		maxBuckets = len(c.statsBucket.ChunkSzBuckets)
	}
	updateGridInfo(&c.statsBucket.GridInfo, maxBuckets, lastBlock)
}

func (c *ChunksCollection) finalizeStatsBucketsStats() {
	c.statsMutex.Lock()
	defer c.statsMutex.Unlock()

	if c.statsBucket == nil {
		return
	}

	// Calculate stats and color values for nAddrs
	if len(c.statsBucket.NAddrsBuckets) > 0 {
		c.statsBucket.NAddrsStats = calculateBucketStatsAndColors(c.statsBucket.NAddrsBuckets)
	}

	// Calculate stats and color values for nApps
	if len(c.statsBucket.NAppsBuckets) > 0 {
		c.statsBucket.NAppsStats = calculateBucketStatsAndColors(c.statsBucket.NAppsBuckets)
	}

	// Calculate stats and color values for nBlocks
	if len(c.statsBucket.NBlocksBuckets) > 0 {
		c.statsBucket.NBlocksStats = calculateBucketStatsAndColors(c.statsBucket.NBlocksBuckets)
	}

	// Calculate stats and color values for chunkSz
	if len(c.statsBucket.ChunkSzBuckets) > 0 {
		c.statsBucket.ChunkSzStats = calculateBucketStatsAndColors(c.statsBucket.ChunkSzBuckets)
	}
}

// ClearStatsBucket clears the stats facet bucket cache data
func (c *ChunksCollection) ClearStatsBucket() {
	c.statsMutex.Lock()
	defer c.statsMutex.Unlock()

	c.statsBucket = nil
}
