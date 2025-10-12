package chunks

import (
	"sync"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

func (c *ChunksCollection) GetBuckets(payload *types.Payload) (*types.Buckets, error) {
	facetName := string(payload.DataFacet)

	c.ensureBucketExists(facetName)
	c.finalizeBucketStats(facetName)

	c.collectionMutex.RLock()
	mutex := c.mutexByFacet[facetName]
	bucket := c.bucketsByFacet[facetName]
	c.collectionMutex.RUnlock()

	if mutex == nil || bucket == nil {
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

	mutex.RLock()
	defer mutex.RUnlock()

	// Create deep copy
	result := &types.Buckets{
		Series0:      make([]types.Bucket, len(bucket.Series0)),
		Series0Stats: bucket.Series0Stats,
		Series1:      make([]types.Bucket, len(bucket.Series1)),
		Series1Stats: bucket.Series1Stats,
		Series2:      make([]types.Bucket, len(bucket.Series2)),
		Series2Stats: bucket.Series2Stats,
		Series3:      make([]types.Bucket, len(bucket.Series3)),
		Series3Stats: bucket.Series3Stats,
		GridInfo:     bucket.GridInfo,
	}

	// Copy bucket data
	copy(result.Series0, bucket.Series0)
	copy(result.Series1, bucket.Series1)
	copy(result.Series2, bucket.Series2)
	copy(result.Series3, bucket.Series3)

	return result, nil
}

// ensureBucketExists initializes a bucket for the given facet if it doesn't exist
func (c *ChunksCollection) ensureBucketExists(facet string) {
	c.collectionMutex.RLock()
	once := c.initOnceByFacet[facet]
	c.collectionMutex.RUnlock()

	if once == nil {
		// Rare case: need to create the Once (only happens once per facet)
		c.collectionMutex.Lock()
		if c.initOnceByFacet == nil {
			c.initOnceByFacet = make(map[string]*sync.Once)
		}
		if c.bucketsByFacet == nil {
			c.bucketsByFacet = make(map[string]*types.Buckets)
		}
		if c.mutexByFacet == nil {
			c.mutexByFacet = make(map[string]*sync.RWMutex)
		}
		once = c.initOnceByFacet[facet]
		if once == nil {
			once = &sync.Once{}
			c.initOnceByFacet[facet] = once
		}
		c.collectionMutex.Unlock()
	}

	// Use sync.Once to ensure bucket initialization happens exactly once
	// After first call, this is just an atomic check - extremely fast!
	once.Do(func() {
		c.collectionMutex.Lock()
		defer c.collectionMutex.Unlock()

		c.bucketsByFacet[facet] = &types.Buckets{
			Series0:      make([]types.Bucket, 0),
			Series0Stats: types.BucketStats{},
			Series1:      make([]types.Bucket, 0),
			Series1Stats: types.BucketStats{},
			Series2:      make([]types.Bucket, 0),
			Series2Stats: types.BucketStats{},
			Series3:      make([]types.Bucket, 0),
			Series3Stats: types.BucketStats{},
			GridInfo: types.GridInfo{
				Size:        100000, // TODO: Make bucket size and grid dimensions configurable in future
				Rows:        0,
				Columns:     20, // TODO: Make bucket size and grid dimensions configurable in future
				BucketCount: 0,
				MaxBlock:    0,
			},
		}
		c.mutexByFacet[facet] = &sync.RWMutex{}
	})
}

// finalizeBucketStats calculates stats and colors for all series in a facet bucket
func (c *ChunksCollection) finalizeBucketStats(facet string) {
	c.collectionMutex.RLock()
	bucket := c.bucketsByFacet[facet]
	mutex := c.mutexByFacet[facet]
	c.collectionMutex.RUnlock()

	if bucket == nil || mutex == nil {
		return
	}

	mutex.Lock()
	defer mutex.Unlock()

	// Calculate stats for each series that has data
	if len(bucket.Series0) > 0 {
		bucket.Series0Stats = calculateBucketStatsAndColors(bucket.Series0)
	}
	if len(bucket.Series1) > 0 {
		bucket.Series1Stats = calculateBucketStatsAndColors(bucket.Series1)
	}
	if len(bucket.Series2) > 0 {
		bucket.Series2Stats = calculateBucketStatsAndColors(bucket.Series2)
	}
	if len(bucket.Series3) > 0 {
		bucket.Series3Stats = calculateBucketStatsAndColors(bucket.Series3)
	}

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

	var lastBlock uint64
	if maxBuckets > 0 {
		lastBlock = uint64(maxBuckets-1)*bucket.GridInfo.Size + bucket.GridInfo.Size - 1
	}

	updateGridInfo(&bucket.GridInfo, maxBuckets, lastBlock)
}
