package status

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

func (c *StatusCollection) GetBuckets(payload *types.Payload) (*types.Buckets, error) {
	var facet types.BucketInterface

	switch payload.DataFacet {
	case StatusStatus:
		facet = c.statusFacet
	case StatusCaches:
		facet = c.cachesFacet
	case StatusChains:
		facet = c.chainsFacet
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

	return facet.GetBuckets(), nil
}
