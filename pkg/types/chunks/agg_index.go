package chunks

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

func (c *ChunksCollection) updateIndexBucket(index *Index) {
	if index == nil {
		return
	}

	c.indexFacet.UpdateBuckets(func(bucket *types.Buckets) {
		// Parse the range string to get block numbers
		firstBlock, lastBlock, err := parseRangeString(index.Range)
		if err != nil {
			return
		}

		size := bucket.GridInfo.Size
		lastBucketIndex := int(lastBlock / size)

		// Ensure we have enough buckets
		ensureBucketsExist(&bucket.Series0, lastBucketIndex, size)
		ensureBucketsExist(&bucket.Series1, lastBucketIndex, size)
		ensureBucketsExist(&bucket.Series2, lastBucketIndex, size)

		// Distribute items across all affected buckets
		distributeToBuckets(&bucket.Series0, firstBlock, lastBlock, float64(index.NAddresses), size)
		distributeToBuckets(&bucket.Series1, firstBlock, lastBlock, float64(index.NAppearances), size)
		distributeToBuckets(&bucket.Series2, firstBlock, lastBlock, float64(index.FileSize), size)

		// Update grid info
		maxBuckets := len(bucket.Series0)
		if len(bucket.Series1) > maxBuckets {
			maxBuckets = len(bucket.Series1)
		}
		if len(bucket.Series2) > maxBuckets {
			maxBuckets = len(bucket.Series2)
		}
		updateGridInfo(&bucket.GridInfo, maxBuckets, lastBlock)
	})
}
