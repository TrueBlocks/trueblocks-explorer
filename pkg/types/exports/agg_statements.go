package exports

import (
	"fmt"
	"time"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"
)

// AssetCharts series strategy constants
const (
	AddressOnly       = "address"
	SymbolOnly        = "symbol"
	AddressWithSymbol = "address+symbol"
)

// generateAssetIdentifier creates collision-safe asset identifiers for series naming
func generateAssetIdentifier(asset, symbol string, config types.FacetChartConfig) string {
	switch config.SeriesStrategy {
	case AddressOnly:
		chars := config.SeriesPrefixLen
		if chars < 8 {
			chars = 8
		} // Minimum (risky but functional)
		if chars > 15 {
			chars = 15
		} // Six sigma safety limit
		return asset[:2+chars] // "0x" + chars

	case SymbolOnly:
		// Risk: symbol conflicts exist in real data
		return symbol

	case AddressWithSymbol:
		chars := config.SeriesPrefixLen
		if chars < 8 {
			chars = 8
		}
		if chars > 15 {
			chars = 15
		}
		return fmt.Sprintf("%s_%s", asset[:2+chars], symbol)

	default:
		return asset[:14] // Default: 12 chars (practical safety)
	}
}

// findOrCreateBucket finds an existing bucket by key or creates a new one
func findOrCreateBucket(series *[]types.Bucket, bucketKey string) int {
	// Search for existing bucket
	for i, bucket := range *series {
		if bucket.BucketKey == bucketKey {
			return i
		}
	}

	// Bucket doesn't exist, create it
	newBucket := types.Bucket{
		BucketKey:  bucketKey,
		Total:      0,
		StartBlock: 0,
		EndBlock:   0,
		ColorValue: 0,
	}
	*series = append(*series, newBucket)
	return len(*series) - 1
}

// statementValueToFloat64 converts base.Wei to float64
func statementValueToFloat64(wei *base.Wei, decimals int) float64 {
	if wei == nil {
		return 0.0
	}
	ret := base.ToFloatWithDecimals(wei, decimals)
	return ret.Float64()
}

// timestampToDailyBucket converts Unix timestamp to daily bucket identifier (YYYYMMDD)
func timestampToDailyBucket(timestamp int64) string {
	t := time.Unix(timestamp, 0).UTC()
	return fmt.Sprintf("%04d%02d%02d", t.Year(), t.Month(), t.Day())
}

// updateStatementsBucket processes a single Statement and updates asset chart buckets incrementally
func (c *ExportsCollection) updateStatementsBucket(statement *Statement) {
	if statement == nil {
		return
	}

	c.assetchartsFacet.UpdateBuckets(func(buckets *types.Buckets) {
		// Get the actual facet configuration
		var config types.FacetChartConfig
		if viewConfig, err := c.GetConfig(); err == nil {
			if facetConfig, exists := viewConfig.Facets["assetcharts"]; exists && facetConfig.FacetChartConfig != nil {
				config = *facetConfig.FacetChartConfig
			} else {
				// Fallback to defaults
				config = types.FacetChartConfig{
					SeriesStrategy:  AddressWithSymbol,
					SeriesPrefixLen: 12,
				}
			}
		} else {
			// Fallback if config unavailable
			config = types.FacetChartConfig{
				SeriesStrategy:  AddressWithSymbol,
				SeriesPrefixLen: 12,
			}
		}

		// Generate asset identifier for this statement
		assetIdentifier := generateAssetIdentifier(statement.Asset.Hex(), statement.Symbol, config)

		if _, ok := buckets.AssetNames[assetIdentifier]; !ok {
			if name, _ := names.NameFromAddress(statement.Asset); name != nil {
				// if statement.Asset.NotEqual(base.FAKE_ETH_ADDRESS) {
				// 	logging.LogBackend(fmt.Sprintf("found name: %s ==> %s", statement.Asset.Hex(), name.Name))
				// }
				buckets.SetAssetName(assetIdentifier, name)
				// } else {
				// 	logging.LogBackend(fmt.Sprintf("no name found for: %s", statement.Asset.Hex()))
			}
		}

		// Calculate metrics for this single statement
		dailyBucket := timestampToDailyBucket(int64(statement.Timestamp))

		// Get decimals for value calculations
		decimals := 18 // Default for ETH
		if statement.Decimals > 0 {
			decimals = int(statement.Decimals)
		}

		// Update each metric series incrementally
		metricNames := []string{"frequency", "volume", "endBalEth"}
		for _, metricName := range metricNames {
			seriesName := fmt.Sprintf("%s.%s", assetIdentifier, metricName)
			buckets.EnsureSeriesExists(seriesName)

			series := buckets.GetSeries(seriesName)
			bucketIndex := findOrCreateBucket(&series, dailyBucket)

			// Update the specific metric
			switch metricName {
			case "frequency":
				series[bucketIndex].Total += 1.0
			case "volume":
				amountIn := statementValueToFloat64(&statement.AmountIn, decimals)
				amountOut := statementValueToFloat64(&statement.AmountOut, decimals)
				volume := amountIn + amountOut
				series[bucketIndex].Total += volume
			case "endBal":
				endBal := statementValueToFloat64(&statement.EndBal, decimals)
				series[bucketIndex].Total = endBal // EndBal is absolute, not cumulative
				// case "neighbors":
				//	 // Count unique counterparties (simplified - could track actual unique count)
				//	 series[bucketIndex].Total += 1.0
			}

			buckets.SetSeries(seriesName, series)
		}
	})
}

// padSeriesWithMetric adds front and back padding buckets for unified chart axes
func padSeriesWithMetric(buckets []types.Bucket, seriesName string) []types.Bucket {
	_ = seriesName // delint
	nowDate := timestampToDailyBucket(time.Now().Unix())
	if len(buckets) == 0 {
		nowMinusOne := timestampToDailyBucket(time.Now().Unix() - 86400)
		return []types.Bucket{
			{
				BucketKey:  nowMinusOne,
				Total:      0,
				StartBlock: 0,
				EndBlock:   0,
				ColorValue: 0,
			},
			{
				BucketKey:  nowDate,
				Total:      0,
				StartBlock: 0,
				EndBlock:   0,
				ColorValue: 0,
			},
		}
	}

	var firstKey, latestKey types.Bucket
	firstKey = buckets[0]
	latestKey = buckets[0]
	for _, bucket := range buckets {
		if bucket.BucketKey < firstKey.BucketKey {
			firstKey = bucket
		}
		if bucket.BucketKey > latestKey.BucketKey {
			latestKey = bucket
		}
	}

	// Add front padding one day before earliest
	if firstKey.BucketKey != "" {
		dayBefore := func(dateStr string) (string, error) {
			t, err := time.Parse("20060102", dateStr)
			if err != nil {
				return "", fmt.Errorf("invalid date format: %v", err)
			}
			previousDay := t.AddDate(0, 0, -1)
			return previousDay.Format("20060102"), nil
		}
		db, _ := dayBefore(firstKey.BucketKey)
		buckets = append([]types.Bucket{{
			BucketKey:  db,
			Total:      0,
			StartBlock: 0,
			EndBlock:   0,
			ColorValue: 0,
		}}, buckets...)
	}

	if latestKey.BucketKey != "" && nowDate > latestKey.BucketKey {
		copy := latestKey
		copy.BucketKey = nowDate
		buckets = append(buckets, copy)
	}

	return buckets
}
