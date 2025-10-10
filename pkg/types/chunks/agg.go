package chunks

import (
	"fmt"
	"strconv"
	"strings"
)

// Helper function to parse range string (e.g., "0000000-0000100")
func parseRangeString(rangeStr string) (first, last uint64, err error) {
	parts := strings.Split(rangeStr, "-")
	if len(parts) != 2 {
		return 0, 0, fmt.Errorf("invalid range format: %s", rangeStr)
	}

	first, err = strconv.ParseUint(strings.TrimSpace(parts[0]), 10, 64)
	if err != nil {
		return 0, 0, fmt.Errorf("invalid first value in range %s: %v", rangeStr, err)
	}

	last, err = strconv.ParseUint(strings.TrimSpace(parts[1]), 10, 64)
	if err != nil {
		return 0, 0, fmt.Errorf("invalid last value in range %s: %v", rangeStr, err)
	}

	return first, last, nil
}

// ClearBloomsBucket clears the blooms facet bucket cache data
func (c *ChunksCollection) ClearBloomsBucket() {
	c.bloomsMutex.Lock()
	defer c.bloomsMutex.Unlock()

	c.bloomsBucket = nil
}

// ClearIndexBucket clears the index facet bucket cache data
func (c *ChunksCollection) ClearIndexBucket() {
	c.indexMutex.Lock()
	defer c.indexMutex.Unlock()

	c.indexBucket = nil
}
