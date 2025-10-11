package chunks

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
)

func (c *ChunksCollection) initializeIndexBucket() {
	c.indexBucket = &IndexBucket{
		Series0:             make([]Bucket, 0),
		NAppearancesBuckets: make([]Bucket, 0),
		FileSizeBuckets:     make([]Bucket, 0),
		NAddressesStats:     BucketStats{},
		NAppearancesStats:   BucketStats{},
		FileSizeStats:       BucketStats{},
		GridInfo: GridInfo{
			Size:        100000, // 100k blocks per bucket
			Rows:        0,
			Columns:     20,
			BucketCount: 0,
			MaxBlock:    0,
		},
	}
}

func (c *ChunksCollection) updateIndexBucket(index *Index) {
	c.indexMutex.Lock()
	defer c.indexMutex.Unlock()

	if index == nil {
		return
	}

	if c.indexBucket == nil {
		c.initializeIndexBucket()
	}

	// Parse the range string to get block numbers
	firstBlock, lastBlock, err := parseRangeString(index.Range)
	if err != nil {
		logging.LogBackend(fmt.Sprintf("Error parsing index range %s: %v", index.Range, err))
		return
	}

	size := c.indexBucket.GridInfo.Size

	// Calculate which buckets this index spans
	lastBucketIndex := int(lastBlock / size)

	// Ensure we have enough buckets for all three types
	ensureBucketsExist(&c.indexBucket.FileSizeBuckets, lastBucketIndex, size)
	ensureBucketsExist(&c.indexBucket.Series0, lastBucketIndex, size)
	ensureBucketsExist(&c.indexBucket.NAppearancesBuckets, lastBucketIndex, size)

	// Distribute index data across all affected buckets
	distributeToBuckets(&c.indexBucket.FileSizeBuckets, firstBlock, lastBlock, float64(index.FileSize), size)
	distributeToBuckets(&c.indexBucket.Series0, firstBlock, lastBlock, float64(index.NAddresses), size)
	distributeToBuckets(&c.indexBucket.NAppearancesBuckets, firstBlock, lastBlock, float64(index.NAppearances), size)

	// Update grid info
	maxBuckets := len(c.indexBucket.FileSizeBuckets)
	if len(c.indexBucket.Series0) > maxBuckets {
		maxBuckets = len(c.indexBucket.Series0)
	}
	if len(c.indexBucket.NAppearancesBuckets) > maxBuckets {
		maxBuckets = len(c.indexBucket.NAppearancesBuckets)
	}
	updateGridInfo(&c.indexBucket.GridInfo, maxBuckets, lastBlock)
}

func (c *ChunksCollection) finalizeIndexBucketsStats() {
	c.indexMutex.Lock()
	defer c.indexMutex.Unlock()

	if c.indexBucket == nil {
		return
	}

	// Calculate stats and color values for nAddresses
	if len(c.indexBucket.Series0) > 0 {
		c.indexBucket.NAddressesStats = calculateBucketStatsAndColors(c.indexBucket.Series0)
	}

	// Calculate stats and color values for nAppearances
	if len(c.indexBucket.NAppearancesBuckets) > 0 {
		c.indexBucket.NAppearancesStats = calculateBucketStatsAndColors(c.indexBucket.NAppearancesBuckets)
	}

	// Calculate stats and color values for fileSize
	if len(c.indexBucket.FileSizeBuckets) > 0 {
		c.indexBucket.FileSizeStats = calculateBucketStatsAndColors(c.indexBucket.FileSizeBuckets)
	}
}

// ClearIndexBucket clears the index facet bucket cache data
func (c *ChunksCollection) ClearIndexBucket() {
	c.indexMutex.Lock()
	defer c.indexMutex.Unlock()

	c.indexBucket = nil
}
