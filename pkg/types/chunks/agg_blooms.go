package chunks

// BloomsBucket stores bucket data specifically for the BLOOMS facet
type BloomsBucket struct {
	Series2      []Bucket    `json:"series2"`
	Series2Stats BucketStats `json:"series2Stats"`

	Series3      []Bucket    `json:"series3"`
	Series3Stats BucketStats `json:"series3Stats"`

	GridInfo GridInfo `json:"gridInfo"`
}

func (c *ChunksCollection) initializeBloomsBucket() {
	c.bloomsBucket = &BloomsBucket{
		Series2:      make([]Bucket, 0),
		Series2Stats: BucketStats{},

		Series3:      make([]Bucket, 0),
		Series3Stats: BucketStats{},

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
	ensureBucketsExist(&c.bloomsBucket.Series2, lastBucketIndex, size)
	ensureBucketsExist(&c.bloomsBucket.Series3, lastBucketIndex, size)

	// Distribute bloom data across all affected buckets
	distributeToBuckets(&c.bloomsBucket.Series2, firstBlock, lastBlock, float64(bloom.FileSize), size)
	distributeToBuckets(&c.bloomsBucket.Series3, firstBlock, lastBlock, float64(bloom.NBlooms), size)

	// Update grid info
	maxBuckets := len(c.bloomsBucket.Series3)
	if len(c.bloomsBucket.Series2) > maxBuckets {
		maxBuckets = len(c.bloomsBucket.Series2)
	}
	updateGridInfo(&c.bloomsBucket.GridInfo, maxBuckets, lastBlock)
}

func (c *ChunksCollection) finalizeBloomsBucketsStats() {
	c.bloomsMutex.Lock()
	defer c.bloomsMutex.Unlock()

	if c.bloomsBucket == nil {
		return
	}

	// Calculate stats and color values for fileSize
	if len(c.bloomsBucket.Series2) > 0 {
		c.bloomsBucket.Series2Stats = calculateBucketStatsAndColors(c.bloomsBucket.Series2)
	}

	// Calculate stats and color values for nBlooms
	if len(c.bloomsBucket.Series3) > 0 {
		c.bloomsBucket.Series3Stats = calculateBucketStatsAndColors(c.bloomsBucket.Series3)
	}
}

// ClearBloomsBucket clears the blooms facet bucket cache data
func (c *ChunksCollection) ClearBloomsBucket() {
	c.bloomsMutex.Lock()
	defer c.bloomsMutex.Unlock()

	c.bloomsBucket = nil
}
