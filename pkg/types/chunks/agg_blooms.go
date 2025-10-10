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
	rangeSize := lastBlock - firstBlock + 1

	// Calculate which buckets this bloom spans
	firstBucketIndex := int(firstBlock / size)
	lastBucketIndex := int(lastBlock / size)

	// Ensure we have enough buckets for nBlooms
	for len(c.bloomsBucket.NBloomsBuckets) <= lastBucketIndex {
		newBucket := Bucket{
			BucketIndex: len(c.bloomsBucket.NBloomsBuckets),
			StartBlock:  uint64(len(c.bloomsBucket.NBloomsBuckets)) * size,
			EndBlock:    uint64(len(c.bloomsBucket.NBloomsBuckets)+1)*size - 1,
			Total:       0,
			ColorValue:  0,
		}
		c.bloomsBucket.NBloomsBuckets = append(c.bloomsBucket.NBloomsBuckets, newBucket)
	}

	// Ensure we have enough buckets for fileSize
	for len(c.bloomsBucket.FileSizeBuckets) <= lastBucketIndex {
		newBucket := Bucket{
			BucketIndex: len(c.bloomsBucket.FileSizeBuckets),
			StartBlock:  uint64(len(c.bloomsBucket.FileSizeBuckets)) * size,
			EndBlock:    uint64(len(c.bloomsBucket.FileSizeBuckets)+1)*size - 1,
			Total:       0,
			ColorValue:  0,
		}
		c.bloomsBucket.FileSizeBuckets = append(c.bloomsBucket.FileSizeBuckets, newBucket)
	}

	// Distribute bloom data across all affected buckets using linear interpolation
	for bucketIndex := firstBucketIndex; bucketIndex <= lastBucketIndex; bucketIndex++ {
		bucketStartBlock := uint64(bucketIndex) * size
		bucketEndBlock := uint64(bucketIndex+1)*size - 1

		// Calculate the overlap between the bloom range and this bucket
		overlapStart := max(firstBlock, bucketStartBlock)
		overlapEnd := min(lastBlock, bucketEndBlock)
		overlapSize := overlapEnd - overlapStart + 1

		// Calculate the proportion of the bloom that belongs to this bucket
		proportion := float64(overlapSize) / float64(rangeSize)

		// Add the proportional contributions to the buckets
		c.bloomsBucket.NBloomsBuckets[bucketIndex].Total += float64(bloom.NBlooms) * proportion
		c.bloomsBucket.FileSizeBuckets[bucketIndex].Total += float64(bloom.FileSize) * proportion
	}

	// Update grid info
	maxBuckets := len(c.bloomsBucket.NBloomsBuckets)
	if len(c.bloomsBucket.FileSizeBuckets) > maxBuckets {
		maxBuckets = len(c.bloomsBucket.FileSizeBuckets)
	}

	if maxBuckets > c.bloomsBucket.GridInfo.BucketCount {
		c.bloomsBucket.GridInfo.BucketCount = maxBuckets
	}
	if lastBlock > c.bloomsBucket.GridInfo.MaxBlock {
		c.bloomsBucket.GridInfo.MaxBlock = lastBlock
	}
	c.bloomsBucket.GridInfo.Rows = (c.bloomsBucket.GridInfo.BucketCount + c.bloomsBucket.GridInfo.Columns - 1) / c.bloomsBucket.GridInfo.Columns
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
