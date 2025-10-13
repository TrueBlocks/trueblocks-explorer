package dresses

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

func (c *DressesCollection) GetBuckets(payload *types.Payload) (*types.Buckets, error) {
	var facet types.BucketInterface

	switch payload.DataFacet {
	case DressesGenerator:
		facet = c.generatorFacet
	case DressesSeries:
		facet = c.seriesFacet
	case DressesDatabases:
		facet = c.databasesFacet
	case DressesEvents:
		facet = c.eventsFacet
	case DressesGallery:
		facet = c.galleryFacet
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
