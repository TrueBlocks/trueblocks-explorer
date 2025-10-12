// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package abis

// ClearDownloadedBucket clears the downloaded bucket
func (c *AbisCollection) ClearDownloadedBucket() {
	facet := string(AbisDownloaded)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearKnownBucket clears the known bucket
func (c *AbisCollection) ClearKnownBucket() {
	facet := string(AbisKnown)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearFunctionsBucket clears the functions bucket
func (c *AbisCollection) ClearFunctionsBucket() {
	facet := string(AbisFunctions)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearEventsBucket clears the events bucket
func (c *AbisCollection) ClearEventsBucket() {
	facet := string(AbisEvents)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}
