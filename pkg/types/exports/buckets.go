package exports

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

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
	case ExportsApprovals:
		facet = c.approvalsFacet
	case ExportsWithdrawals:
		facet = c.withdrawalsFacet
	case ExportsAssets:
		facet = c.assetsFacet
	case ExportsLogs:
		facet = c.logsFacet
	case ExportsTraces:
		facet = c.tracesFacet
	case ExportsReceipts:
		facet = c.receiptsFacet
	default:
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

	return facet.GetBuckets(), nil
}
