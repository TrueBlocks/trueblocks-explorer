// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package contracts

// ClearDashboardBucket clears the dashboard bucket
func (c *ContractsCollection) ClearDashboardBucket() {
	facet := string(ContractsDashboard)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearExecuteBucket clears the execute bucket
func (c *ContractsCollection) ClearExecuteBucket() {
	facet := string(ContractsExecute)
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
func (c *ContractsCollection) ClearEventsBucket() {
	facet := string(ContractsEvents)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}
