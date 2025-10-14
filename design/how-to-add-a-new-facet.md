# How to Add a New Facet to TrueBlocks Explorer

**Version**: 1.0  
**Date**: October 13, 2025  
**Audience**: Developers working on TrueBlocks Explorer

## Overview

This guide provides a generic process for adding new facets to any view in the TrueBlocks Explorer. A facet represents a tab within a view that displays a specific type of data (e.g., transactions, balances, logs, etc.).

## Architecture Context

### Key Components
- **TOML Configuration**: Defines facet structure and behavior
- **Code Generation**: Creates boilerplate Go and TypeScript code
- **Manual Implementation**: Handles custom logic and integration
- **Data Flow**: Backend stores → API → Frontend components

### File Structure
```
code_gen/templates/classDefinitions/[view].toml  # Facet configuration
pkg/types/[view]/                                # Backend data handling
app/api_[view].go                               # API endpoints
frontend/src/views/[view]/                      # Frontend components
```

## Step-by-Step Process

### Phase 1: Planning and Configuration

#### Step 1: Define Facet Requirements
**Questions to Answer**:
- What data will this facet display?
- Does it reuse an existing data type or need a new one?
- What actions should be available (export, create, delete, etc.)?
- Does it need a custom renderer or use standard table view?
- Is there an existing SDK command or do we need a new one?

#### Step 2: Choose Data Strategy
**Option A: New Data Type**
- Create new TOML class definition
- Implement new store and data structures
- Add SDK integration

**Option B: Reuse Existing Data Type** 
- Use existing data type with filtering
- Leverage existing store with facet-specific logic
- Map facet name to existing store via TOML config

#### Step 3: Update TOML Configuration
**File**: `code_gen/templates/classDefinitions/[view].toml`

Add facet entry:
```toml
[[facets]]
name = "FacetName"           # User-facing name
store = "DataTypeName"       # Backend data type/store
actions = ["export"]         # Available actions
viewType = ""               # Form view type (if applicable)
renderer = ""               # Custom renderer ("panel" for detail panel)
```

### Phase 2: Code Generation

#### Step 4: Run Code Generation
**Command**: `wails generate module`

**Generated Files**:
- Backend store methods
- API endpoint updates
- TypeScript type definitions
- Component boilerplate

**Verify Generation**:
- Check backend files in `pkg/types/[view]/`
- Review API updates in `app/api_[view].go`
- Confirm TypeScript types in `frontend/wailsjs/go/models.ts`

### Phase 3: Backend Implementation

#### Step 5: Store Integration
**Files**: `pkg/types/[view]/store.go`

**For New Data Type**:
- Implement `get[DataType]Store()` method
- Add SDK integration in queryFunc
- Define processFunc and mappingFunc

**For Existing Data Type**:
- Update existing store method to handle new facet
- Add filtering logic based on facet name
- Ensure proper SDK command usage

#### Step 6: Configuration Updates
**Files**: `pkg/types/[view]/config.go`

Add facet configuration:
```go
"facetname": {
    Name:          "FacetName",
    Store:         "storename",
    IsForm:        false,
    DividerBefore: false,
    Fields:        getFacetFields(),
    Actions:       []string{},
    HeaderActions: []string{"export"},
    RendererTypes: "",
},
```

#### Step 7: API Method Updates
**Files**: `app/api_[view].go`

Ensure API methods handle new facet:
- Update switch statements
- Add facet-specific logic if needed
- Verify error handling

### Phase 4: Frontend Implementation

#### Step 8: Component Updates
**Files**: `frontend/src/views/[view]/[View].tsx`

Add facet handling:
```tsx
// In currentData switch statement
case types.DataFacet.NEWFACET:
  return pageData.newfacetdata || [];
```

#### Step 9: DataFacet Enum
**Check**: `frontend/wailsjs/go/models.ts` or type definitions

Verify `NEWFACET` is added to DataFacet enum:
- If auto-generated, confirm it appears
- If manual, add it to the appropriate enum file

#### Step 10: Custom Renderer (Optional)
**Files**: `frontend/src/views/[view]/renderers/`

**If renderer = "panel" in TOML**:
1. Create `[FacetName].tsx` renderer component
2. Export in `index.ts`
3. Implement display logic

**Simple JSON Renderer Example**:
```tsx
import { Text } from '@mantine/core';

export const FacetRenderer = ({ data }: { data: any }) => {
  return (
    <Text component="pre" style={{ whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(data, null, 2)}
    </Text>
  );
};
```

### Phase 5: Testing and Validation

#### Step 11: Code Quality
**Commands**:
```bash
yarn lint
yarn test
```

**Fix Issues**:
- Resolve linting errors
- Update tests if needed
- Ensure TypeScript compilation

#### Step 12: Manual Testing
**Test Scenarios**:
1. New facet tab appears in view
2. Data loads correctly
3. Export functionality works
4. Custom renderer displays (if applicable)
5. Error handling works
6. No regression in existing facets

## Common Patterns and Examples

### Facet Types
**Table Facets**: Standard data table with columns
- `renderer = ""` (default)
- `isForm = false`

**Form Facets**: Custom form interface
- `viewType = "form"`
- `isForm = true`

**Panel Facets**: Custom detail panel
- `renderer = "panel"`
- Custom renderer component

### Store Mapping Examples
```toml
# New data type
name = "Statements"
store = "Statements"

# Reuse existing type
name = "Approve" 
store = "Logs"      # Uses existing Log data type

# Multiple facets, same store
name = "Balances"
store = "Balances"
name = "TokenBalances"  
store = "Balances"      # Same store, different filtering
```

### SDK Integration Patterns
```go
// Basic export
exportOpts.Export()

// Specific export type
exportOpts.ExportLogs()
exportOpts.ExportBalances()

// With options
exportOpts := sdk.ExportOptions{
    Globals:    sdk.Globals{Cache: true, Chain: chain},
    Addrs:      []string{address},
    Articulate: true,    // For detailed log parsing
    Accounting: true,    // For financial calculations
}
```

## Troubleshooting

### Common Issues
1. **Missing DataFacet Enum**: Add manually if not auto-generated
2. **Store Not Found**: Check TOML store mapping and backend implementation
3. **Data Not Loading**: Verify SDK integration and error handling
4. **TypeScript Errors**: Run `wails generate module` to sync types
5. **Renderer Not Working**: Check export in renderers/index.ts

### Debug Steps
1. Check browser console for errors
2. Verify backend logs for API issues
3. Test SDK commands directly with chifra
4. Use network tab to inspect API calls
5. Add logging to trace data flow

## Best Practices

### Configuration
- Use descriptive facet names
- Follow established naming conventions
- Include appropriate header actions
- Consider dividers for grouping related facets

### Implementation
- Reuse existing data types when possible
- Follow error handling patterns
- Maintain consistency with existing facets
- Add proper logging for debugging

### Testing
- Test with real blockchain data
- Verify edge cases (empty data, errors)
- Check responsive design
- Validate export functionality

## Conclusion

Adding a new facet involves updating TOML configuration, running code generation, and implementing manual integration points. The key is understanding when to reuse existing infrastructure versus creating new components.

Always follow the established patterns in the codebase and test thoroughly to ensure no regressions in existing functionality.