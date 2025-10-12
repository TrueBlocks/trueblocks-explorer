// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package comparitoor

// ClearComparitoorBucket clears the comparitoor bucket
func (c *ComparitoorCollection) ClearComparitoorBucket() {
	facet := string(ComparitoorComparitoor)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearChifraBucket clears the chifra bucket
func (c *ComparitoorCollection) ClearChifraBucket() {
	facet := string(ComparitoorChifra)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearEtherScanBucket clears the etherscan bucket
func (c *ComparitoorCollection) ClearEtherScanBucket() {
	facet := string(ComparitoorEtherScan)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearCovalentBucket clears the covalent bucket
func (c *ComparitoorCollection) ClearCovalentBucket() {
	facet := string(ComparitoorCovalent)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearAlchemyBucket clears the alchemy bucket
func (c *ComparitoorCollection) ClearAlchemyBucket() {
	facet := string(ComparitoorAlchemy)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}
