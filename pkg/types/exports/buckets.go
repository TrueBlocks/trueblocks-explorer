// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package exports

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

func (c *ExportsCollection) GetBuckets(payload *types.Payload) (*types.Buckets, error) {
	var facet types.BucketInterface

	switch payload.DataFacet {
	case ExportsStatements:
		facet = c.statementsFacet
	case ExportsBalances:
		facet = c.balancesFacet
	case ExportsTransfers:
		facet = c.transfersFacet
	case ExportsTransactions:
		facet = c.transactionsFacet
	case ExportsOpenApprovals:
		facet = c.openapprovalsFacet
	case ExportsApprovalLogs:
		facet = c.approvallogsFacet
	case ExportsApprovalTxs:
		facet = c.approvaltxsFacet
	case ExportsWithdrawals:
		facet = c.withdrawalsFacet
	case ExportsAssets:
		facet = c.assetsFacet
	case ExportsAssetCharts:
		facet = c.assetchartsFacet
	case ExportsLogs:
		facet = c.logsFacet
	case ExportsTraces:
		facet = c.tracesFacet
	case ExportsReceipts:
		facet = c.receiptsFacet
	default:
		return &types.Buckets{
			Series: make(map[string][]types.Bucket),
			GridInfo: types.GridInfo{
				Size:        86400,
				Rows:        0,
				Columns:     4,
				BucketCount: 0,
				MaxBlock:    0,
			},
		}, nil
	}

	buckets := facet.GetBuckets()
	if payload.DataFacet == ExportsAssetCharts && c.assetchartsFacet != nil {
		buckets = c.padSeries(buckets)
	}

	return buckets, nil
}

// padSeries applies edge padding to AssetCharts buckets
func (c *ExportsCollection) padSeries(originalBuckets *types.Buckets) *types.Buckets {
	if originalBuckets == nil || c.assetchartsFacet == nil {
		return originalBuckets
	}

	c.collectionMutex.RLock()
	defer c.collectionMutex.RUnlock()

	paddedBuckets := &types.Buckets{
		Series:   make(map[string][]types.Bucket),
		GridInfo: originalBuckets.GridInfo,
	}

	// Use UpdateBuckets (which locks the series map) to add the padding
	c.assetchartsFacet.UpdateBuckets(func(facetBuckets *types.Buckets) {
		for seriesName, series := range facetBuckets.Series {
			paddedSeries := padSeriesWithMetric(series, seriesName)
			paddedBuckets.Series[seriesName] = paddedSeries
		}
	})

	return paddedBuckets
}
