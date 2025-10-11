package chunks

import (
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
	switch payload.DataFacet {
	case ChunksBlooms:
		// Ensure blooms bucket data exists
		if c.bloomsBucket == nil {
			c.initializeBloomsBucket()
		}

		// Finalize stats for blooms data
		c.finalizeBloomsBucketsStats()

		// Read with mutex protection
		c.bloomsMutex.Lock()
		result := &ChunksBuckets{
			Series0:      []Bucket{},
			Series0Stats: BucketStats{},

			Series1:      []Bucket{},
			Series1Stats: BucketStats{},

			Series2:      make([]Bucket, len(c.bloomsBucket.Series2)),
			Series2Stats: c.bloomsBucket.Series2Stats,

			Series3:      make([]Bucket, len(c.bloomsBucket.Series3)),
			Series3Stats: c.bloomsBucket.Series3Stats,

			GridInfo: c.bloomsBucket.GridInfo,
		}
		copy(result.Series3, c.bloomsBucket.Series3)
		copy(result.Series2, c.bloomsBucket.Series2)
		c.bloomsMutex.Unlock()

		return result, nil

	case ChunksIndex:
		// Ensure index bucket data exists
		if c.indexBucket == nil {
			c.initializeIndexBucket()
		}

		// Finalize stats for index data
		c.finalizeIndexBucketsStats()

		// Read with mutex protection
		c.indexMutex.Lock()
		result := &ChunksBuckets{
			Series0:      make([]Bucket, len(c.indexBucket.Series0)),
			Series0Stats: c.indexBucket.Series0Stats,

			Series1:      make([]Bucket, len(c.indexBucket.Series1)),
			Series1Stats: c.indexBucket.Series1Stats,

			Series2:      make([]Bucket, len(c.indexBucket.Series2)),
			Series2Stats: c.indexBucket.Series2Stats,

			Series3:      []Bucket{},
			Series3Stats: BucketStats{},
			GridInfo:     c.indexBucket.GridInfo,
		}
		copy(result.Series2, c.indexBucket.Series2)
		copy(result.Series0, c.indexBucket.Series0)
		copy(result.Series1, c.indexBucket.Series1)
		c.indexMutex.Unlock()

		return result, nil

	case ChunksStats:
		// Ensure stats bucket data exists
		if c.statsBucket == nil {
			c.initializeStatsBucket()
		}

		// Finalize stats for stats data
		c.finalizeStatsBucketsStats()

		// Read with mutex protection
		c.statsMutex.Lock()
		result := &ChunksBuckets{
			Series0:      make([]Bucket, len(c.statsBucket.Series0)),
			Series0Stats: c.statsBucket.Series0Stats,

			Series1:      make([]Bucket, len(c.statsBucket.Series1)),
			Series1Stats: c.statsBucket.Series1Stats,

			Series2:      make([]Bucket, len(c.statsBucket.Series2)),
			Series2Stats: c.statsBucket.Series2Stats,

			Series3:      make([]Bucket, len(c.statsBucket.Series3)),
			Series3Stats: c.statsBucket.Series3Stats,

			GridInfo: c.statsBucket.GridInfo,
		}
		copy(result.Series0, c.statsBucket.Series0)
		copy(result.Series1, c.statsBucket.Series1)
		copy(result.Series2, c.statsBucket.Series2)
		copy(result.Series3, c.statsBucket.Series3)
		c.statsMutex.Unlock()

		return result, nil

	default:
		// For unknown facets, return empty data with default grid info
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
}
