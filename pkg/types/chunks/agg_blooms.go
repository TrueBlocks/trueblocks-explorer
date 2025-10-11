package chunks

func (c *ChunksCollection) initializeBloomsBucket() {
	c.bloomsBucket = &BloomsBucket{
		NBloomsBuckets:  make([]Bucket, 0),
		FileSizeBuckets: make([]Bucket, 0),
		NBloomsStats:    BucketStats{},
		FileSizeStats:   BucketStats{},
		GridInfo: GridInfo{
			Size:        100000, // 100k blocks per bucket
			Rows:        0,
			Columns:     20,
			BucketCount: 0,
			MaxBlock:    0,
		},
	}
}

func (c *ChunksCollection) updateBloomsBucket(bloom *Bloom) {
	c.bloomsMutex.Lock()
	defer c.bloomsMutex.Unlock()

	if bloom == nil {
		return
	}

	if c.bloomsBucket == nil {
		c.initializeBloomsBucket()
	}

	// Parse the range string to get block numbers
	firstBlock, lastBlock, err := parseRangeString(bloom.Range)
	if err != nil {
		return
	}

	size := c.bloomsBucket.GridInfo.Size

	// Calculate which buckets this bloom spans
	lastBucketIndex := int(lastBlock / size)

	// Ensure we have enough buckets for both types
	ensureBucketsExist(&c.bloomsBucket.NBloomsBuckets, lastBucketIndex, size)
	ensureBucketsExist(&c.bloomsBucket.FileSizeBuckets, lastBucketIndex, size)

	// Distribute bloom data across all affected buckets
	distributeToBuckets(&c.bloomsBucket.NBloomsBuckets, firstBlock, lastBlock, float64(bloom.NBlooms), size)
	distributeToBuckets(&c.bloomsBucket.FileSizeBuckets, firstBlock, lastBlock, float64(bloom.FileSize), size)

	// Update grid info
	maxBuckets := len(c.bloomsBucket.NBloomsBuckets)
	if len(c.bloomsBucket.FileSizeBuckets) > maxBuckets {
		maxBuckets = len(c.bloomsBucket.FileSizeBuckets)
	}
	updateGridInfo(&c.bloomsBucket.GridInfo, maxBuckets, lastBlock)
}

func (c *ChunksCollection) finalizeBloomsBucketsStats() {
	c.bloomsMutex.Lock()
	defer c.bloomsMutex.Unlock()

	if c.bloomsBucket == nil {
		return
	}

	// Calculate stats and color values for nBlooms
	if len(c.bloomsBucket.NBloomsBuckets) > 0 {
		c.bloomsBucket.NBloomsStats = calculateBucketStatsAndColors(c.bloomsBucket.NBloomsBuckets)
	}

	// Calculate stats and color values for fileSize
	if len(c.bloomsBucket.FileSizeBuckets) > 0 {
		c.bloomsBucket.FileSizeStats = calculateBucketStatsAndColors(c.bloomsBucket.FileSizeBuckets)
	}
}

// ClearBloomsBucket clears the blooms facet bucket cache data
func (c *ChunksCollection) ClearBloomsBucket() {
	c.bloomsMutex.Lock()
	defer c.bloomsMutex.Unlock()

	c.bloomsBucket = nil
}
