package chunks

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

type ChunksBuckets struct {
	NBloomsBuckets      []Bucket    `json:"nBloomsBuckets"`
	FileSizeBuckets     []Bucket    `json:"fileSizeBuckets"`
	NAddressesBuckets   []Bucket    `json:"nAddressesBuckets"`
	NAppearancesBuckets []Bucket    `json:"nAppearancesBuckets"`
	NBloomsStats        BucketStats `json:"nBloomsStats"`
	FileSizeStats       BucketStats `json:"fileSizeStats"`
	NAddressesStats     BucketStats `json:"nAddressesStats"`
	NAppearancesStats   BucketStats `json:"nAppearancesStats"`
	GridInfo            GridInfo    `json:"gridInfo"`
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

// BloomsBucket stores bucket data specifically for the BLOOMS facet
type BloomsBucket struct {
	NBloomsBuckets  []Bucket    `json:"nBloomsBuckets"`
	FileSizeBuckets []Bucket    `json:"bloomFileSizeBuckets"` // Bloom file sizes
	NBloomsStats    BucketStats `json:"nBloomsStats"`
	FileSizeStats   BucketStats `json:"bloomFileSizeStats"`
	GridInfo        GridInfo    `json:"gridInfo"`
}

// IndexBucket stores bucket data specifically for the INDEX facet
type IndexBucket struct {
	NAddressesBuckets   []Bucket    `json:"nAddressesBuckets"`
	NAppearancesBuckets []Bucket    `json:"nAppearancesBuckets"`
	FileSizeBuckets     []Bucket    `json:"indexFileSizeBuckets"` // Index file sizes
	NAddressesStats     BucketStats `json:"nAddressesStats"`
	NAppearancesStats   BucketStats `json:"nAppearancesStats"`
	FileSizeStats       BucketStats `json:"indexFileSizeStats"`
	GridInfo            GridInfo    `json:"gridInfo"`
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
			NBloomsBuckets:      make([]Bucket, len(c.bloomsBucket.NBloomsBuckets)),
			FileSizeBuckets:     make([]Bucket, len(c.bloomsBucket.FileSizeBuckets)),
			NAddressesBuckets:   []Bucket{},
			NAppearancesBuckets: []Bucket{},
			NBloomsStats:        c.bloomsBucket.NBloomsStats,
			FileSizeStats:       c.bloomsBucket.FileSizeStats,
			NAddressesStats:     BucketStats{},
			NAppearancesStats:   BucketStats{},
			GridInfo:            c.bloomsBucket.GridInfo,
		}
		copy(result.NBloomsBuckets, c.bloomsBucket.NBloomsBuckets)
		copy(result.FileSizeBuckets, c.bloomsBucket.FileSizeBuckets)
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
			NBloomsBuckets:      []Bucket{},
			FileSizeBuckets:     make([]Bucket, len(c.indexBucket.FileSizeBuckets)),
			NAddressesBuckets:   make([]Bucket, len(c.indexBucket.NAddressesBuckets)),
			NAppearancesBuckets: make([]Bucket, len(c.indexBucket.NAppearancesBuckets)),
			NBloomsStats:        BucketStats{},
			FileSizeStats:       c.indexBucket.FileSizeStats,
			NAddressesStats:     c.indexBucket.NAddressesStats,
			NAppearancesStats:   c.indexBucket.NAppearancesStats,
			GridInfo:            c.indexBucket.GridInfo,
		}
		copy(result.FileSizeBuckets, c.indexBucket.FileSizeBuckets)
		copy(result.NAddressesBuckets, c.indexBucket.NAddressesBuckets)
		copy(result.NAppearancesBuckets, c.indexBucket.NAppearancesBuckets)
		c.indexMutex.Unlock()

		return result, nil

	default:
		// For unknown facets, return empty data with default grid info
		return &ChunksBuckets{
			NBloomsBuckets:      []Bucket{},
			FileSizeBuckets:     []Bucket{},
			NAddressesBuckets:   []Bucket{},
			NAppearancesBuckets: []Bucket{},
			NBloomsStats:        BucketStats{},
			FileSizeStats:       BucketStats{},
			NAddressesStats:     BucketStats{},
			NAppearancesStats:   BucketStats{},
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
