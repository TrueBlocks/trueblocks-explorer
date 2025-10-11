package chunks

func (c *ChunksCollection) updateStatsBucket(stats *Stats) {
	if stats == nil {
		return
	}

	facet := "stats"
	c.ensureBucketExists(facet)
	mutex := c.mutexByFacet[facet]
	mutex.Lock()
	defer mutex.Unlock()

	// Parse the range string to get block numbers
	firstBlock, lastBlock, err := parseRangeString(stats.Range)
	if err != nil {
		return
	}

	bucket := c.bucketsByFacet[facet]
	size := bucket.GridInfo.Size
	lastBucketIndex := int(lastBlock / size)

	// Ensure we have enough buckets
	ensureBucketsExist(&bucket.Series0, lastBucketIndex, size)
	ensureBucketsExist(&bucket.Series1, lastBucketIndex, size)
	ensureBucketsExist(&bucket.Series2, lastBucketIndex, size)
	ensureBucketsExist(&bucket.Series3, lastBucketIndex, size)

	// Distribute items across all affected buckets
	distributeToBuckets(&bucket.Series0, firstBlock, lastBlock, float64(stats.Ratio), size)
	distributeToBuckets(&bucket.Series1, firstBlock, lastBlock, float64(stats.AppsPerBlock), size)
	distributeToBuckets(&bucket.Series2, firstBlock, lastBlock, float64(stats.AddrsPerBlock), size)
	distributeToBuckets(&bucket.Series3, firstBlock, lastBlock, float64(stats.AppsPerAddr), size)

	// Update grid info
	maxBuckets := len(bucket.Series0)
	if len(bucket.Series1) > maxBuckets {
		maxBuckets = len(bucket.Series1)
	}
	if len(bucket.Series2) > maxBuckets {
		maxBuckets = len(bucket.Series2)
	}
	if len(bucket.Series3) > maxBuckets {
		maxBuckets = len(bucket.Series3)
	}
	updateGridInfo(&bucket.GridInfo, maxBuckets, lastBlock)
}

// ClearStatsBucket clears the facet's bucket cache data
func (c *ChunksCollection) ClearStatsBucket() {
	facet := "stats"
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}
