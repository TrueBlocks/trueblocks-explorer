package chunks

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
)

func (c *ChunksCollection) initializeIndexBucket() {
	c.indexBucket = &IndexBucket{
		NAddressesBuckets:   make([]Bucket, 0),
		NAppearancesBuckets: make([]Bucket, 0),
		FileSizeBuckets:     make([]Bucket, 0),
		NAddressesStats:     BucketStats{},
		NAppearancesStats:   BucketStats{},
		FileSizeStats:       BucketStats{},
		GridInfo: GridInfo{
			Size:        100000, // 100k blocks per bucket
			Rows:        0,
			Columns:     20,
			BucketCount: 0,
			MaxBlock:    0,
		},
	}
}

func (c *ChunksCollection) updateIndexBucket(index *Index) {
	c.indexMutex.Lock()
	defer c.indexMutex.Unlock()

	if index == nil {
		return
	}

	if c.indexBucket == nil {
		c.initializeIndexBucket()
	}

	// Parse the range string to get block numbers
	firstBlock, lastBlock, err := parseRangeString(index.Range)
	if err != nil {
		logging.LogBackend(fmt.Sprintf("Error parsing index range %s: %v", index.Range, err))
		return
	}

	size := c.indexBucket.GridInfo.Size
	rangeSize := lastBlock - firstBlock + 1

	// Calculate which buckets this index spans
	firstBucketIndex := int(firstBlock / size)
	lastBucketIndex := int(lastBlock / size)

	// Helper function to ensure we have enough buckets for all types
	ensureBucketsExist := func(targetIndex int) {
		for len(c.indexBucket.FileSizeBuckets) <= targetIndex {
			newBucketIndex := len(c.indexBucket.FileSizeBuckets)
			startBlock := uint64(newBucketIndex) * size
			endBlock := uint64(newBucketIndex+1)*size - 1

			newBucket := Bucket{
				BucketIndex: newBucketIndex,
				StartBlock:  startBlock,
				EndBlock:    endBlock,
				Total:       0,
				ColorValue:  0,
			}
			c.indexBucket.FileSizeBuckets = append(c.indexBucket.FileSizeBuckets, newBucket)
		}

		for len(c.indexBucket.NAddressesBuckets) <= targetIndex {
			newBucketIndex := len(c.indexBucket.NAddressesBuckets)
			startBlock := uint64(newBucketIndex) * size
			endBlock := uint64(newBucketIndex+1)*size - 1

			newBucket := Bucket{
				BucketIndex: newBucketIndex,
				StartBlock:  startBlock,
				EndBlock:    endBlock,
				Total:       0,
				ColorValue:  0,
			}
			c.indexBucket.NAddressesBuckets = append(c.indexBucket.NAddressesBuckets, newBucket)
		}

		for len(c.indexBucket.NAppearancesBuckets) <= targetIndex {
			newBucketIndex := len(c.indexBucket.NAppearancesBuckets)
			startBlock := uint64(newBucketIndex) * size
			endBlock := uint64(newBucketIndex+1)*size - 1

			newBucket := Bucket{
				BucketIndex: newBucketIndex,
				StartBlock:  startBlock,
				EndBlock:    endBlock,
				Total:       0,
				ColorValue:  0,
			}
			c.indexBucket.NAppearancesBuckets = append(c.indexBucket.NAppearancesBuckets, newBucket)
		}
	}

	// Ensure we have enough buckets for all types
	ensureBucketsExist(lastBucketIndex)

	// Distribute index data across all affected buckets using linear interpolation
	for bucketIndex := firstBucketIndex; bucketIndex <= lastBucketIndex; bucketIndex++ {
		bucketStartBlock := uint64(bucketIndex) * size
		bucketEndBlock := uint64(bucketIndex+1)*size - 1

		// Calculate the overlap between the index range and this bucket
		overlapStart := max(firstBlock, bucketStartBlock)
		overlapEnd := min(lastBlock, bucketEndBlock)
		overlapSize := overlapEnd - overlapStart + 1

		// Calculate the proportion of the index that belongs to this bucket
		proportion := float64(overlapSize) / float64(rangeSize)

		// Add the proportional contributions to the buckets
		c.indexBucket.FileSizeBuckets[bucketIndex].Total += float64(index.FileSize) * proportion
		c.indexBucket.NAddressesBuckets[bucketIndex].Total += float64(index.NAddresses) * proportion
		c.indexBucket.NAppearancesBuckets[bucketIndex].Total += float64(index.NAppearances) * proportion
	}

	// Update grid info
	maxBuckets := len(c.indexBucket.FileSizeBuckets)
	if len(c.indexBucket.NAddressesBuckets) > maxBuckets {
		maxBuckets = len(c.indexBucket.NAddressesBuckets)
	}
	if len(c.indexBucket.NAppearancesBuckets) > maxBuckets {
		maxBuckets = len(c.indexBucket.NAppearancesBuckets)
	}

	if maxBuckets > c.indexBucket.GridInfo.BucketCount {
		c.indexBucket.GridInfo.BucketCount = maxBuckets
	}
	if lastBlock > c.indexBucket.GridInfo.MaxBlock {
		c.indexBucket.GridInfo.MaxBlock = lastBlock
	}
	c.indexBucket.GridInfo.Rows = (c.indexBucket.GridInfo.BucketCount + c.indexBucket.GridInfo.Columns - 1) / c.indexBucket.GridInfo.Columns
}

func (c *ChunksCollection) finalizeIndexBucketsStats() {
	c.indexMutex.Lock()
	defer c.indexMutex.Unlock()

	if c.indexBucket == nil {
		return
	}

	// Calculate stats and color values for nAddresses
	if len(c.indexBucket.NAddressesBuckets) > 0 {
		c.indexBucket.NAddressesStats = calculateBucketStatsAndColors(c.indexBucket.NAddressesBuckets)
	}

	// Calculate stats and color values for nAppearances
	if len(c.indexBucket.NAppearancesBuckets) > 0 {
		c.indexBucket.NAppearancesStats = calculateBucketStatsAndColors(c.indexBucket.NAppearancesBuckets)
	}

	// Calculate stats and color values for fileSize
	if len(c.indexBucket.FileSizeBuckets) > 0 {
		c.indexBucket.FileSizeStats = calculateBucketStatsAndColors(c.indexBucket.FileSizeBuckets)
	}
}
