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

		// Define index metrics and their values
		metrics := map[string]float64{
			"nAddresses":   float64(index.NAddresses),
			"nAppearances": float64(index.NAppearances),
			"fileSize":     float64(index.FileSize),
		}

		// Process each metric using the flexible series structure
		maxBuckets := 0
		for seriesName, value := range metrics {
			bucket.EnsureSeriesExists(seriesName)
			series := bucket.GetSeries(seriesName)
			ensureBucketsExist(&series, lastBucketIndex, size)
			distributeToBuckets(&series, firstBlock, lastBlock, value, size)
			bucket.SetSeries(seriesName, series)

			if len(series) > maxBuckets {
				maxBuckets = len(series)
			}
		}

		// Update grid info
		updateGridInfo(&bucket.GridInfo, maxBuckets, lastBlock)
	})
}
