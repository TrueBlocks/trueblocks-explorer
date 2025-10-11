package chunks

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
)

// IndexBucket stores bucket data specifically for the INDEX facet
type IndexBucket struct {
	Series0      []Bucket    `json:"series0"`
	Series0Stats BucketStats `json:"series0Stats"`

	Series1      []Bucket    `json:"series1"`
	Series1Stats BucketStats `json:"series1Stats"`

	Series2      []Bucket    `json:"series2"`
	Series2Stats BucketStats `json:"series2Stats"`

	GridInfo GridInfo `json:"gridInfo"`
}

func (c *ChunksCollection) initializeIndexBucket() {
	c.indexBucket = &IndexBucket{
		Series0:      make([]Bucket, 0),
		Series0Stats: BucketStats{},

		Series1:      make([]Bucket, 0),
		Series1Stats: BucketStats{},

		Series2:      make([]Bucket, 0),
		Series2Stats: BucketStats{},

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
	ensureBucketsExist(&c.indexBucket.Series2, lastBucketIndex, size)
	ensureBucketsExist(&c.indexBucket.Series0, lastBucketIndex, size)
	ensureBucketsExist(&c.indexBucket.Series1, lastBucketIndex, size)

	// Distribute index data across all affected buckets
	distributeToBuckets(&c.indexBucket.Series2, firstBlock, lastBlock, float64(index.FileSize), size)
	distributeToBuckets(&c.indexBucket.Series0, firstBlock, lastBlock, float64(index.NAddresses), size)
	distributeToBuckets(&c.indexBucket.Series1, firstBlock, lastBlock, float64(index.NAppearances), size)

	// Update grid info
	maxBuckets := len(c.indexBucket.Series2)
	if len(c.indexBucket.Series0) > maxBuckets {
		maxBuckets = len(c.indexBucket.Series0)
	}
	if len(c.indexBucket.Series1) > maxBuckets {
		maxBuckets = len(c.indexBucket.Series1)
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
		c.indexBucket.Series0Stats = calculateBucketStatsAndColors(c.indexBucket.Series0)
	}

	// Calculate stats and color values for nAppearances
	if len(c.indexBucket.Series1) > 0 {
		c.indexBucket.Series1Stats = calculateBucketStatsAndColors(c.indexBucket.Series1)
	}

	// Calculate stats and color values for fileSize
	if len(c.indexBucket.Series2) > 0 {
		c.indexBucket.Series2Stats = calculateBucketStatsAndColors(c.indexBucket.Series2)
	}
}

// ClearIndexBucket clears the index facet bucket cache data
func (c *ChunksCollection) ClearIndexBucket() {
	c.indexMutex.Lock()
	defer c.indexMutex.Unlock()

	c.indexBucket = nil
}
