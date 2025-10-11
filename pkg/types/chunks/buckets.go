package chunks

import (
	"sync"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

type ChunksBuckets struct {
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

type Bucket struct {
	BucketIndex int     `json:"bucketIndex"`
	StartBlock  uint64  `json:"startBlock"`
	EndBlock    uint64  `json:"endBlock"`
	Total       float64 `json:"total"`
	ColorValue  float64 `json:"colorValue"`
}

type BucketStats struct {
	Total   float64 `json:"total"`
	Average float64 `json:"average"`
	Min     float64 `json:"min"`
	Max     float64 `json:"max"`
	Count   int     `json:"count"`
}

type GridInfo struct {
	Rows        int    `json:"rows"`
	Columns     int    `json:"columns"`
	MaxBlock    uint64 `json:"maxBlock"`
	Size        uint64 `json:"size"`
	BucketCount int    `json:"bucketCount"`
}

func (c *ChunksCollection) GetChunksBuckets(payload *types.Payload) (*ChunksBuckets, error) {
	facetName := string(payload.DataFacet)

	c.ensureBucketExists(facetName)
	c.finalizeBucketStats(facetName)

	mutex := c.mutexByFacet[facetName]
	mutex.RLock()
	defer mutex.RUnlock()

	bucket := c.bucketsByFacet[facetName]
	if bucket == nil {
		return &ChunksBuckets{
			Series0:      []Bucket{},
			Series0Stats: BucketStats{},
			Series1:      []Bucket{},
			Series1Stats: BucketStats{},
			Series2:      []Bucket{},
			Series2Stats: BucketStats{},
			Series3:      []Bucket{},
			Series3Stats: BucketStats{},
			GridInfo: GridInfo{
				Size:        100000,
				Rows:        0,
				Columns:     20,
				BucketCount: 0,
				MaxBlock:    0,
			},
		}, nil
	}

	// Create deep copy
	result := &ChunksBuckets{
		Series0:      make([]Bucket, len(bucket.Series0)),
		Series0Stats: bucket.Series0Stats,
		Series1:      make([]Bucket, len(bucket.Series1)),
		Series1Stats: bucket.Series1Stats,
		Series2:      make([]Bucket, len(bucket.Series2)),
		Series2Stats: bucket.Series2Stats,
		Series3:      make([]Bucket, len(bucket.Series3)),
		Series3Stats: bucket.Series3Stats,
		GridInfo:     bucket.GridInfo,
	}

	// Copy bucket data
	copy(result.Series0, bucket.Series0)
	copy(result.Series1, bucket.Series1)
	copy(result.Series2, bucket.Series2)
	copy(result.Series3, bucket.Series3)

	return result, nil
}

// ensureBucketExists initializes a bucket for the given facet if it doesn't exist
func (c *ChunksCollection) ensureBucketExists(facet string) {
	if c.bucketsByFacet == nil {
		c.bucketsByFacet = make(map[string]*ChunksBuckets)
	}
	if c.mutexByFacet == nil {
		c.mutexByFacet = make(map[string]*sync.RWMutex)
	}

	if _, exists := c.bucketsByFacet[facet]; !exists {
		c.bucketsByFacet[facet] = &ChunksBuckets{
			Series0:      make([]Bucket, 0),
			Series0Stats: BucketStats{},
			Series1:      make([]Bucket, 0),
			Series1Stats: BucketStats{},
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
		c.mutexByFacet[facet] = &sync.RWMutex{}
	}
}

// finalizeBucketStats calculates stats and colors for all series in a facet bucket
func (c *ChunksCollection) finalizeBucketStats(facet string) {
	if c.bucketsByFacet == nil || c.bucketsByFacet[facet] == nil {
		return
	}

	bucket := c.bucketsByFacet[facet]
	mutex := c.mutexByFacet[facet]

	mutex.Lock()
	defer mutex.Unlock()

	// Calculate stats for each series that has data
	if len(bucket.Series0) > 0 {
		bucket.Series0Stats = calculateBucketStatsAndColors(bucket.Series0)
	}
	if len(bucket.Series1) > 0 {
		bucket.Series1Stats = calculateBucketStatsAndColors(bucket.Series1)
	}
	if len(bucket.Series2) > 0 {
		bucket.Series2Stats = calculateBucketStatsAndColors(bucket.Series2)
	}
	if len(bucket.Series3) > 0 {
		bucket.Series3Stats = calculateBucketStatsAndColors(bucket.Series3)
	}

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

	var lastBlock uint64
	if maxBuckets > 0 {
		lastBlock = uint64(maxBuckets-1)*bucket.GridInfo.Size + bucket.GridInfo.Size - 1
	}

	updateGridInfo(&bucket.GridInfo, maxBuckets, lastBlock)
}
