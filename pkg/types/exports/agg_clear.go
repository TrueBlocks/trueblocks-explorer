// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package exports

// ClearStatementsBucket clears the statements bucket
func (c *ExportsCollection) ClearStatementsBucket() {
	facet := string(ExportsStatements)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearBalancesBucket clears the balances bucket
func (c *ExportsCollection) ClearBalancesBucket() {
	facet := string(ExportsBalances)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearTransfersBucket clears the transfers bucket
func (c *ExportsCollection) ClearTransfersBucket() {
	facet := string(ExportsTransfers)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearTransactionsBucket clears the transactions bucket
func (c *ExportsCollection) ClearTransactionsBucket() {
	facet := string(ExportsTransactions)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearApprovalsBucket clears the approvals bucket
func (c *ExportsCollection) ClearApprovalsBucket() {
	facet := string(ExportsApprovals)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearWithdrawalsBucket clears the withdrawals bucket
func (c *ExportsCollection) ClearWithdrawalsBucket() {
	facet := string(ExportsWithdrawals)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearAssetsBucket clears the assets bucket
func (c *ExportsCollection) ClearAssetsBucket() {
	facet := string(ExportsAssets)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearLogsBucket clears the logs bucket
func (c *ExportsCollection) ClearLogsBucket() {
	facet := string(ExportsLogs)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearTracesBucket clears the traces bucket
func (c *ExportsCollection) ClearTracesBucket() {
	facet := string(ExportsTraces)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}

// ClearReceiptsBucket clears the receipts bucket
func (c *ExportsCollection) ClearReceiptsBucket() {
	facet := string(ExportsReceipts)
	if c.mutexByFacet != nil && c.mutexByFacet[facet] != nil {
		mutex := c.mutexByFacet[facet]
		mutex.Lock()
		defer mutex.Unlock()
		if c.bucketsByFacet != nil {
			delete(c.bucketsByFacet, facet)
		}
	}
}
