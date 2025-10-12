package chunks

func (c *ChunksCollection) updateIndexBucket(index *Index) {
	if index == nil {
		return
	}

	facet := "index"
	c.ensureBucketExists(facet)
	mutex := c.mutexByFacet[facet]
	bucket := c.bucketsByFacet[facet]
	if mutex == nil || bucket == nil {
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

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
}
