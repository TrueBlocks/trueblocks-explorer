// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package dresses

// ClearGeneratorBucket clears the generator bucket
func (c *DressesCollection) ClearGeneratorBucket() {
	facet := string(DressesGenerator)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearSeriesBucket clears the series bucket
func (c *DressesCollection) ClearSeriesBucket() {
	facet := string(DressesSeries)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearDatabasesBucket clears the databases bucket
func (c *DressesCollection) ClearDatabasesBucket() {
	facet := string(DressesDatabases)
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
func (c *DressesCollection) ClearEventsBucket() {
	facet := string(DressesEvents)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearGalleryBucket clears the gallery bucket
func (c *DressesCollection) ClearGalleryBucket() {
	facet := string(DressesGallery)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}
