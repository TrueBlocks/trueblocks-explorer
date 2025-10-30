# Adding Custom Chart Panels to Facets

This document provides a comprehensive specification for converting regular table-based facets into chart panel facets, based on the implementation patterns used in the chunks view (Stats, Index, and Blooms facets).

## Architecture Overview

The chart panel system consists of three main layers that work together to provide data visualization:

### 1. Backend Configuration Layer
- **PanelChartConfig** in the facet configuration
- **BucketInterface** implementation for data aggregation
- **API endpoints** for fetching buckets and metric preferences

### 2. Data Processing Layer
- **Bucket aggregation** functions that process raw data into time/block-based buckets
- **Series management** with flexible metric support
- **GridInfo** for chart rendering metadata

### 3. Frontend Rendering Layer
- **Generic panel renderers** (BarchartPanel, HeatmapPanel)
- **View-specific hooks** for API integration
- **Panel component factory** that reads backend config

## Key Design Principles

### Configuration-Driven Architecture
- Backend config drives frontend behavior completely
- No hardcoded facet-specific logic in frontend components
- Generic panel components work for any collection

### Flexible Metrics System
- Any number of metrics per facet
- Dynamic field mapping via `BucketsField`
- Configurable formatting (bytes vs. numbers)

### Time vs. Block-Based Bucketing
- Supports both time-based (daily/monthly/quarterly/annual) grouping
- Falls back to block-based bucketing when dates unavailable
- Automatic bucket distribution across ranges

### Reusable Components
- `BarchartPanel` and `HeatmapPanel` are completely generic
- Panel factory pattern eliminates per-facet component creation
- Hook pattern encapsulates API integration

### Chart Type Selection
- **Barchart**: Best for time-series data, trending analysis
- **Heatmap**: Best for density visualization, pattern identification

## Implementation Steps

### Step 1: Backend Facet Configuration

**Required Changes in `pkg/types/[collection]/config.go`:**

```go
// Add to facet config
"your-facet": {
    Name:             "Your Facet",
    Store:            "yourstore",
    DividerBefore:    false,
    Fields:           getYourFacetFields(),
    Actions:          []string{},
    HeaderActions:    []string{"export"},
    RendererTypes:    "panel",                    // KEY: Must be "panel"
    PanelChartConfig: getYourFacetPanelConfig(),  // KEY: Add this
},

// Add panel configuration function
func getYourFacetPanelConfig() *types.PanelChartConfig {
    return &types.PanelChartConfig{
        Type:          "barchart", // or "heatmap"
        DefaultMetric: "primaryMetric",
        SkipUntil:     "2017",     // optional date filter
        TimeGroupBy:   "quarterly", // optional: "daily", "monthly", "quarterly", "annual"
        Metrics: []types.MetricConfig{
            {
                Key:          "primaryMetric",
                Label:        "Primary Metric Display Name",
                BucketsField: "fieldNameInStruct", // Field name in your data struct
                Bytes:        false,               // true if values should be formatted as bytes
            },
            {
                Key:          "secondaryMetric",
                Label:        "Secondary Metric",
                BucketsField: "anotherField",
                Bytes:        true,
            },
        },
    }
}
```

### Step 2: Bucket Aggregation Implementation

**Create `pkg/types/[collection]/agg_yourfacet.go`:**

```go
package yourcollection

import "github.com/TrueBlocks/trueblocks-explorer/pkg/types"

func (c *YourCollection) updateYourFacetBucket(item *YourDataItem) {
    if item == nil {
        return
    }

    c.yourFacet.UpdateBuckets(func(bucket *types.Buckets) {
        // Extract time/block range from your data
        firstBlock, lastBlock, err := parseRangeString(item.Range) // or similar
        if err != nil {
            return
        }

        size := bucket.GridInfo.Size
        lastBucketIndex := int(lastBlock / size)

        // Define metrics mapping to your struct fields
        metrics := map[string]float64{
            "primaryMetric":   float64(item.YourField),
            "secondaryMetric": float64(item.AnotherField),
        }

        // Process each metric using flexible series structure
        maxBuckets := 0
        for seriesName, value := range metrics {
            bucket.EnsureSeriesExists(seriesName)
            series := bucket.GetSeries(seriesName)
            ensureBucketsExist(&series, lastBucketIndex, size)
            distributeToBuckets(&series, firstBlock, lastBlock, value, size)
            bucket.SetSeries(seriesName, series)

            if len(series) > maxBuckets {
                maxBuckets = len(series)
            }
        }

        // Update grid info
        updateGridInfo(&bucket.GridInfo, maxBuckets, lastBlock)
    })
}
```

### Step 3: Collection Integration

**Update your collection's CRUD operations to call the bucket update:**

```go
// In your collection's Add/Update methods
func (c *YourCollection) Add(item *YourDataItem) {
    // ... existing add logic ...
    
    // Add bucket update
    c.updateYourFacetBucket(item)
}
```

**Ensure BucketInterface implementation in your facet:**
- The facet must implement `GetBuckets()`, `ClearBuckets()`, `SetBuckets()`, `UpdateBuckets()`
- This is typically auto-generated

### Step 4: API Endpoint Implementation

**Add to `app/api_[collection].go`:**

```go
// GetYourCollectionBuckets returns bucket visualization data
func (a *App) GetYourCollectionBuckets(payload *types.Payload) (*types.Buckets, error) {
    collection := yourcollection.GetYourCollection(payload)
    return collection.GetBuckets(payload)
}

// GetYourCollectionMetric gets saved metric preference
func (a *App) GetYourCollectionMetric(facetName string) (string, error) {
    // Implementation for reading saved metric preference
    return a.preferences.GetMetric("yourcollection", facetName)
}

// SetYourCollectionMetric saves metric preference
func (a *App) SetYourCollectionMetric(facetName string, metric string) error {
    // Implementation for saving metric preference
    return a.preferences.SetMetric("yourcollection", facetName, metric)
}
```

### Step 5: Frontend Panel Hook

**Create `frontend/src/views/[collection]/renderers/hooks/useYourCollectionPanelRenderer.ts`:**

```typescript
import { useCallback } from 'react';
import { GetYourCollectionBuckets, GetYourCollectionMetric, SetYourCollectionMetric } from '@app';
import { usePayload } from '@hooks';
import { types } from '@models';

export const useYourCollectionPanelRenderer = (dataFacet: types.DataFacet) => {
  const createPayload = usePayload();

  const fetchBuckets = useCallback(async () => {
    const payload = createPayload(dataFacet);
    const result = await GetYourCollectionBuckets(payload);
    if (!result) {
      throw new Error('No data returned from API');
    }
    return result;
  }, [createPayload, dataFacet]);

  const getMetric = useCallback(async (
    facetName: string,
    metrics: types.MetricConfig[],
    defaultMetric: string,
  ) => {
    const saved = await GetYourCollectionMetric(facetName);
    const validMetric = metrics.find((m) => m.key === saved);
    return validMetric ? validMetric.key : defaultMetric;
  }, []);

  const setMetric = useCallback(async (facetName: string, metric: string) => {
    await SetYourCollectionMetric(facetName, metric);
  }, []);

  return { fetchBuckets, getMetric, setMetric };
};
```

### Step 6: Frontend Panel Component

**Create `frontend/src/views/[collection]/renderers/panels/YourCollectionPanel.tsx`:**

```typescript
import { BarchartPanel, HeatmapPanel } from '@components';
import { types } from '@models';
import { formatNumericValue } from '@utils';
import { useYourCollectionPanelRenderer } from '../../hooks/useYourCollectionPanelRenderer';

interface YourCollectionPanelProps {
  panelConfig: types.PanelChartConfig;
  dataFacet: types.DataFacet;
  collection: string;
  row: Record<string, unknown> | null;
}

export const YourCollectionPanel = ({
  panelConfig,
  dataFacet,
  collection,
  row,
}: YourCollectionPanelProps) => {
  const { fetchBuckets, getMetric, setMetric } = useYourCollectionPanelRenderer(dataFacet);

  // Convert backend MetricConfig to frontend BucketsConfig
  const bucketsConfig = {
    dataFacet,
    collection,
    defaultMetric: panelConfig.defaultMetric,
    skipUntil: panelConfig.skipUntil,
    timeGroupBy: panelConfig.timeGroupBy as 'daily' | 'monthly' | 'quarterly' | 'annual' | undefined,
    metrics: panelConfig.metrics.map((metric) => ({
      key: metric.key,
      label: metric.label,
      bucketsField: metric.bucketsField,
      formatValue: (value: number) => formatNumericValue(value, { bytes: metric.bytes }),
      bytes: metric.bytes,
    })),
  };

  const enhancedGetMetric = (facetName: string) =>
    getMetric(facetName, panelConfig.metrics, panelConfig.defaultMetric);

  const PanelComponent = panelConfig.type === 'heatmap' ? HeatmapPanel : BarchartPanel;

  return (
    <PanelComponent
      config={bucketsConfig}
      row={row}
      fetchBuckets={fetchBuckets}
      getMetric={enhancedGetMetric}
      setMetric={setMetric}
    />
  );
};
```

### Step 7: Frontend Panel Factory

**Update `frontend/src/views/[collection]/renderers/index.ts`:**

```typescript
import { useViewConfig } from '@hooks';
import { types } from '@models';
import { YourCollectionPanel } from './panels';

export * from './panels';

// Generic renderer factory that reads backend config
const createPanelRenderer = (dataFacet: types.DataFacet) => {
  return (row: Record<string, unknown> | null) => {
    const { config: viewConfig } = useViewConfig({ viewName: 'yourcollection' });
    const facetConfig = viewConfig?.facets?.[dataFacet];

    if (!facetConfig?.panelChartConfig) return null;

    return YourCollectionPanel({
      panelConfig: facetConfig.panelChartConfig,
      dataFacet,
      collection: 'yourcollection',
      row,
    });
  };
};

export const renderers = {
  panels: {
    [types.DataFacet.YOUR_FACET]: createPanelRenderer(types.DataFacet.YOUR_FACET),
    // ... other facets
  },
  facets: {},
};
```

### Step 8: View Integration

**Update your main view component to use the panels:**

```typescript
// In YourCollectionView.tsx
import { createDetailPanel } from '@components';
import { renderers } from './renderers';

// In the component:
const detailPanel = useMemo(
  () => createDetailPanel(viewConfig, getCurrentDataFacet, renderers.panels),
  [viewConfig, getCurrentDataFacet],
);

// Pass to BaseTab:
<BaseTab
  // ... other props
  detailPanel={detailPanel}
/>
```

## Required Files Summary

### New Files to Create (5-6 files minimum)

**Backend (2-3 new files):**
1. `pkg/types/[collection]/agg_[facetname].go` - Bucket aggregation logic
2. `pkg/types/[collection]/buckets.go` - Collection buckets router (if not exists)
3. `pkg/types/[collection]/buckets_test.go` - Tests (optional but recommended)

**Frontend (3 new files):**
1. `frontend/src/views/[collection]/renderers/hooks/use[Collection]PanelRenderer.ts` - Panel hook
2. `frontend/src/views/[collection]/renderers/panels/[Collection]Panel.tsx` - Panel component
3. `frontend/src/views/[collection]/renderers/panels/index.ts` - Panel exports

### Files to Modify (Not New)

These existing files need updates but are **NOT** new files:
- `pkg/types/[collection]/config.go` - Add PanelChartConfig
- `pkg/types/[collection]/crud.go` - Add bucket update calls
- `app/api_[collection].go` - Add bucket/metric API endpoints  
- `frontend/src/views/[collection]/renderers/index.ts` - Add panel factory
- Main view component (e.g., `[Collection].tsx`) - Use renderers.panels

## Implementation Examples

### Real Working Examples in Codebase

**Chunks Collection:**
- Stats facet: `pkg/types/chunks/agg_stats.go`
- Index facet: `pkg/types/chunks/agg_index.go`
- Blooms facet: `pkg/types/chunks/agg_blooms.go`
- Frontend: `frontend/src/views/chunks/renderers/`

**Exports Collection:**
- Assets facet: `pkg/types/exports/config.go` (getAssetsPanelConfig)

### Chart Type Guidelines

**Use Barchart when:**
- Data has clear time progression
- Want to show trends over time
- Metrics are cumulative or rate-based
- Example: Transaction volume over time, efficiency ratios

**Use Heatmap when:**
- Want to show density patterns
- Data represents counts or sizes
- Looking for hotspots or distribution patterns
- Example: Address frequency, file sizes, block activity

## Integration with Store System

Chart panels integrate with the existing Store/Observer pattern:

1. **OnNewItem** notifications trigger bucket updates
2. **BucketInterface** provides standardized aggregation
3. **Store observers** update charts in real-time
4. **Metric preferences** persist user selections

The bucket aggregation happens automatically as data flows through the store system, ensuring charts stay synchronized with the underlying data.

## Advanced Features

### Time-Based Grouping
- **Daily**: Fine-grained analysis, short periods
- **Monthly**: Medium-term trends, quarterly data
- **Quarterly**: Business cycle analysis
- **Annual**: Long-term trends, multi-year data

### Custom Formatters
- **Bytes formatting**: Automatic KB/MB/GB conversion
- **Numeric formatting**: Thousands separators, precision
- **Percentage formatting**: For ratio-based metrics

### Performance Considerations
- Bucket updates are incremental, not full recalculations
- Frontend components use React.memo for efficient re-rendering
- API calls are cached based on current context (address/chain/period)

This architecture provides a scalable, maintainable approach to adding rich data visualizations to any facet while maintaining consistency across the application.