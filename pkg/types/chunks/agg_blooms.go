package chunks

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

func (c *ChunksCollection) updateBloomsBucket(bloom *Bloom) {
	if bloom == nil {
		return
	}

	c.bloomsFacet.UpdateBuckets(func(bucket *types.Buckets) {
		// Parse the range string to get block numbers
		firstBlock, lastBlock, err := parseRangeString(bloom.Range)
		if err != nil {
			return
		}

		size := bucket.GridInfo.Size
		lastBucketIndex := int(lastBlock / size)

		ensureBucketsExist(&bucket.Series2, lastBucketIndex, size)
		ensureBucketsExist(&bucket.Series3, lastBucketIndex, size)

		// Distribute items across all affected buckets
		distributeToBuckets(&bucket.Series2, firstBlock, lastBlock, float64(bloom.FileSize), size)
		distributeToBuckets(&bucket.Series3, firstBlock, lastBlock, float64(bloom.NBlooms), size)

		// Update grid info
		maxBuckets := len(bucket.Series3)
		if len(bucket.Series2) > maxBuckets {
			maxBuckets = len(bucket.Series2)
		}
		updateGridInfo(&bucket.GridInfo, maxBuckets, lastBlock)
	})
}
