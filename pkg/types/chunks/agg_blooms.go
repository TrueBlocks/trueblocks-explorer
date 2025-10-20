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

		// Ensure series exist and process both metrics efficiently
		bucket.EnsureSeriesExists("fileSize")
		bucket.EnsureSeriesExists("nBlooms")

		fileSizeSeries := bucket.GetSeries("fileSize")
		nBloomsSeries := bucket.GetSeries("nBlooms")

		ensureBucketsExist(&fileSizeSeries, lastBucketIndex, size)
		ensureBucketsExist(&nBloomsSeries, lastBucketIndex, size)

		// Distribute values to buckets
		distributeToBuckets(&fileSizeSeries, firstBlock, lastBlock, float64(bloom.FileSize), size)
		distributeToBuckets(&nBloomsSeries, firstBlock, lastBlock, float64(bloom.NBlooms), size)

		// Update series back to bucket
		bucket.SetSeries("fileSize", fileSizeSeries)
		bucket.SetSeries("nBlooms", nBloomsSeries)

		// Update grid info
		maxBuckets := len(nBloomsSeries)
		if len(fileSizeSeries) > maxBuckets {
			maxBuckets = len(fileSizeSeries)
		}
		updateGridInfo(&bucket.GridInfo, maxBuckets, lastBlock)
	})
}
