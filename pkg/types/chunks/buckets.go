package chunks

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

func (c *ChunksCollection) GetBuckets(payload *types.Payload) (*types.Buckets, error) {
	var facet types.BucketInterface

	switch payload.DataFacet {
	case ChunksStats:
		facet = c.statsFacet
	case ChunksIndex:
		facet = c.indexFacet
	case ChunksBlooms:
		facet = c.bloomsFacet
	case ChunksManifest:
		facet = c.manifestFacet
	default:
		return &types.Buckets{
			Series0:      []types.Bucket{},
			Series0Stats: types.BucketStats{},
			Series1:      []types.Bucket{},
			Series1Stats: types.BucketStats{},
			Series2:      []types.Bucket{},
			Series2Stats: types.BucketStats{},
			Series3:      []types.Bucket{},
			Series3Stats: types.BucketStats{},
			GridInfo: types.GridInfo{
				Size:        100000,
				Rows:        0,
				Columns:     20,
				BucketCount: 0,
				MaxBlock:    0,
			},
		}, nil
	}

	buckets := facet.GetBuckets()
	buckets.Series0Stats = calculateBucketStatsAndColors(buckets.Series0)
	buckets.Series1Stats = calculateBucketStatsAndColors(buckets.Series1)
	buckets.Series2Stats = calculateBucketStatsAndColors(buckets.Series2)
	buckets.Series3Stats = calculateBucketStatsAndColors(buckets.Series3)
	return buckets, nil
}
