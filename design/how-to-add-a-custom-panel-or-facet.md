# How to Add a Custom Panel or Facet

## Overview

A TrueBlocks mini-dApps project uses a template-driven approach to generate consistent custom renderers across all views. This document explains how to add custom panels (table-based custom rendering) or custom facets (completely custom rendering) to any view.

## Prerequisites

- Basic understanding of React/TypeScript
- Familiarity with TrueBlocks architecture
- Access to the codebase and build tools

## Process

### Step 1: Configure the TOML File

Edit the appropriate view configuration TOML file (e.g., `chunks.toml`, `exports.toml`) to specify your custom renderer:

**For a Custom Panel** (table with custom columns/rendering):
```toml
[[facets]]
name = "YourFacetName"
viewType = "table"
panel = "custom"
# ... other configuration
```

**For a Custom Facet** (completely custom rendering):
```toml
[[facets]]
name = "YourFacetName"
viewType = "custom"
# ... other configuration
```

**For Dynamic Facets** (projects view pattern):
```toml
[[facets]]
name = "YourFacetName"
viewType = "custom"
isDynamic = true
# ... other configuration
```

### Step 2: Ensure CSV Data Files

Make sure you have the appropriate CSV data files for your facet. The system expects data files that match your facet configuration.

### Step 3: Generate Template Files

Run the code generation system:

```bash
make generate
```

This will automatically create or update the following files based on your TOML configuration:

**Backend Files:**
- View-specific Go structures and types
- API handlers and query functions (stub implementations)

**Frontend Files:**
- `frontend/src/views/{view}/renderers/index.tsx` - Main renderer configuration
- `frontend/src/views/{view}/renderers/panels/index.ts` - Panel exports (if custom panels exist)
- `frontend/src/views/{view}/renderers/facets/index.ts` - Facet exports (if custom facets exist)
- Directory structures for your custom components

**Generated Structure Example:**
```
frontend/src/views/yourview/renderers/
├── index.tsx                    # Auto-generated renderer configuration
├── panels/
│   ├── index.ts                # Auto-generated panel exports
│   └── yourfacet/              # Directory for your custom panel
│       └── YourFacetPanel.tsx  # Your custom panel component (create this)
└── facets/
    ├── index.ts                # Auto-generated facet exports
    └── yourfacet/              # Directory for your custom facet
        └── YourFacetFacet.tsx  # Your custom facet component (create this)
```

### Step 4: Implement Backend Query Function

Complete the backend implementation by filling in the query function in the generated Go files. Look for stub functions that need implementation.

**Example:**
```go
func (c *YourView) getYourFacetStore(payload *config.Payload, facet types.DataFacet) *store.Store[YourDataType] {
    // Implement your data fetching logic here
    return store.NewStore[YourDataType]()
}
```

### Step 5: Create Frontend Components

Create your actual React components in the generated directories:

**For Custom Panels** (`YourFacetPanel.tsx`):
```tsx
import { RendererParams } from '@components';

interface YourFacetPanelProps {
  params: RendererParams;
}

export function YourFacetPanel({ params }: YourFacetPanelProps) {
  const { data, columns, facet } = params;
  
  // Implement your custom panel rendering
  return (
    <div>
      {/* Your custom panel content */}
    </div>
  );
}
```

**For Custom Facets** (`YourFacetFacet.tsx`):
```tsx
import { RendererParams } from '@components';

interface YourFacetFacetProps {
  params: RendererParams;
}

export function YourFacetFacet({ params }: YourFacetFacetProps) {
  const { data, columns, facet } = params;
  
  // Implement your completely custom rendering
  return (
    <div>
      {/* Your custom facet content */}
    </div>
  );
}
```

## Generated File Architecture

The template system creates a consistent architecture:

### Renderer Index (`renderers/index.tsx`)
Auto-generated file that:
- Imports components using namespace imports (`import * as panels/facets`)
- Configures renderer objects with proper TypeScript patterns
- Handles dynamic facets for projects view
- Only created when custom renderers exist

### Component Naming Conventions
- **Panels**: `{DataFacet}Panel` (e.g., `StatsPanel`, `ApprovalsPanel`)
- **Facets**: `{DataFacet}Facet` (e.g., `GalleryFacet`, `AssetChartsFacet`)
- **Dynamic**: `{ViewName}Facet` (e.g., `ProjectsFacet`)

### Import Strategy
- Uses `import * as panels/facets` to avoid explicit component listing
- Components are encapsulated within renderers, not re-exported
- References components as `panels.ComponentPanel` or `facets.ComponentFacet`

## Special Cases

### Index Name Conflict
The template system handles the special case where a component named "Index" would conflict with the index file name by importing directly from the component file:
```typescript
export { IndexPanel } from './indexdata/IndexPanel';
```

### Dynamic Facets (Projects View)
Dynamic facets use a special `dynamic` key in the renderer configuration:
```typescript
facets: {
  dynamic: (params: RendererParams) => {
    return <ProjectsFacet params={params} />;
  },
}
```

## Verification

After completing the steps:

1. **Build Check**: Run `yarn build` to ensure no TypeScript errors
2. **Runtime Test**: Start the application and navigate to your view/facet
3. **Data Flow**: Verify data flows from backend to your custom component
4. **Styling**: Ensure your component integrates well with the overall design

## Common Issues

- **Missing CSV files**: Ensure data files match your facet configuration
- **Backend stubs**: Don't forget to implement the actual query logic
- **Component exports**: Make sure your components are properly exported from their files
- **TypeScript errors**: The RendererParams interface provides type safety

## Notes

- The template system only generates renderer files when custom renderers are actually configured
- All renderer index files follow identical patterns for consistency
- The system supports mixing panels and facets within the same view
- Changes to TOML configuration require re-running `make generate`