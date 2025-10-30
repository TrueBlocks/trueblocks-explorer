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

## Step 0: TOML Configuration (Required First)

### TOML Chart Panel Schema

Chart panels must be defined in the TOML configuration before any implementation work begins. In `./code_gen/templates/classDefinitions/[collection].toml`:

```toml
[[facets]]
name = "YourFacet"
store = "YourStore" 
actions = ["export"]
renderer = "panel"        # Enables panel rendering
panelChart = true        # Enables chart panel functionality
```

### Generation Workflow

The complete workflow follows this sequence:

1. **Edit TOML** - Add/modify facet with `renderer = "panel"` + `panelChart = true`
2. **Run `make generate`** - Generates backend scaffolding and wiring
3. **Implement manual components** - Fill in business logic (Steps 1-9 below)

### What Gets Auto-Generated

When `panelChart = true` is set in TOML, `make generate` automatically creates:

- ✅ **Config scaffolding** - `PanelChartConfig` references in facet configuration
- ✅ **Store integration** - `c.updateXxxBucket(it)` calls in store processFunc  
- ✅ **Basic wiring** - Facet structure, action configs, field mappings
- ✅ **Function references** - Calls to `getYourFacetPanelConfig()` and creates skeleton functions in the `// EXISTING_CODE` section at the end of the file (functions must be implemented manually)

### What Requires Manual Implementation

The generation creates the scaffolding, but these components must be implemented manually:

- ❌ **Panel configuration functions** - `getPanelConfig()` implementations with chart types and metrics
- ❌ **Bucket aggregation logic** - `updateBucket()` functions with data processing
- ❌ **Business logic** - Chart-specific decisions, metric mappings, time grouping

## Implementation Steps

### Step 1: Verify Generated Backend Configuration

**After running `make generate`, verify in `pkg/types/[collection]/config.go`:**

- ✅ Facet has `RendererTypes: "panel"`
- ✅ Facet has `PanelChartConfig: getYourFacetPanelConfig()` reference  
- ✅ Store calls include `c.updateYourFacetBucket(it)` in processFunc (in `store.go`)

**Manual implementation required:**

Now you need to implement the panel configuration function that was referenced in the generated config.

### Step 2: Implement Panel Configuration Function

**Create the panel configuration function in `pkg/types/[collection]/config.go` within the `// BINGO` blocks:**

```go
func getYourFacetPanelConfig() *types.PanelChartConfig {
    return &types.PanelChartConfig{
        // BINGO
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
        // BINGO
    }
}
```

### Step 3: Bucket Aggregation Implementation

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

### Step 4: Collection Integration

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

### Step 5: API Endpoint Implementation

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

### Step 6: Frontend Panel Hook

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

### Step 7: Frontend Panel Component

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

### Step 8: Frontend Panel Factory

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

### Step 9: View Integration

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

### Step 0: TOML Configuration (First)
- **TOML file**: `./code_gen/templates/classDefinitions/[collection].toml` - Add `renderer = "panel"` and `panelChart = true`
- **Generation**: Run `make generate` to create backend scaffolding

### New Files to Create (5-6 files minimum)

**Backend (2-3 new files):**
1. `pkg/types/[collection]/agg_[facetname].go` - Bucket aggregation logic
2. `pkg/types/[collection]/buckets.go` - Collection buckets router (if not exists)
3. `pkg/types/[collection]/buckets_test.go` - Tests (optional but recommended)

**Frontend (3 new files):**
1. `frontend/src/views/[collection]/renderers/hooks/use[Collection]PanelRenderer.ts` - Panel hook
2. `frontend/src/views/[collection]/renderers/panels/[Collection]Panel.tsx` - Panel component
3. `frontend/src/views/[collection]/renderers/panels/index.ts` - Panel exports

### Files Auto-Generated (After `make generate`)

These files are **automatically updated** by the generation process:
- ✅ `pkg/types/[collection]/config.go` - PanelChartConfig references added
- ✅ `pkg/types/[collection]/store.go` - Bucket update calls added to processFunc

### Files to Modify Manually (Not New)

These existing files need manual updates and are **NOT** auto-generated:
- `pkg/types/[collection]/config.go` - Implement PanelChartConfig functions in `// EXISTING_CODE` blocks
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

## Future Scaffolding Enhancements

### Planned Template Extensions

These scaffolding improvements are planned for future automation to further reduce manual implementation work:

**Backend Skeleton Generation:**
1. **Panel config function skeletons** - Generate empty `getPanelConfigSkeleton()` functions with `// BINGO` comment pairs for manual completion
2. **Bucket function skeletons** - Generate `updateBucketSkeleton()` function signatures with `// BINGO` comment pairs for manual implementation

**Template Files to Extend:**
- `pkg_types_route_config.go.tmpl` - Add skeleton panel config functions alongside existing ones
- New: `pkg_types_route_agg_xxx.go.tmpl` - Generate bucket aggregation function skeletons

**Implementation Strategy:**
- Generate separate skeleton functions (don't modify existing working functions)
- Use `// BINGO` comment pairs to mark areas requiring manual completion
- Developer manually migrates from old functions to new skeletons when ready
- Focus scaffolding on eliminating file creation, not business logic

### Current Generation Capabilities vs. Vision

**✅ Currently Auto-Generated (TOML → `make generate`):**
- Basic facet configuration with panel enablement (`RendererTypes: "panel"`)
- Store integration calls for bucket updates (`c.updateXxxBucket(it)`)
- Field configurations and action mappings
- Function reference calls (`getYourFacetPanelConfig()`)

**👤 Currently Manual Implementation Required:**
- Panel configuration functions (`getPanelConfig()`) with chart types and metrics
- Bucket aggregation logic (`updateBucket()`) with data processing algorithms
- All business logic and chart-specific design decisions

**🎯 Future Vision (Scaffolding Extensions):**
- Function skeletons with `// BINGO` comment placeholders for manual completion
- Reduced manual file creation and boilerplate setup
- Focus manual work on business logic and chart design decisions only
- Gradual migration path from existing implementations to generated scaffolding

This architecture provides a scalable, maintainable approach to adding rich data visualizations to any facet while maintaining consistency across the application.