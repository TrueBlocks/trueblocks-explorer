# How to Add a New Facet to a TrueBlocks mini-dApps project

**Version**: 1.0  
**Date**: October 13, 2025  
**Audience**: Developers working on TrueBlocks projects

## Overview

This guide provides a generic process for adding new facets to any view in a TrueBlocks mini-dApps project. A facet represents a tab within a view that displays a specific type of data (e.g., transactions, balances, logs, etc.).

## Architecture Context

### Key Components
- **TOML Configuration**: Defines facet structure and behavior
- **Code Generation**: Creates boilerplate Go and TypeScript code
- **Manual Implementation**: Handles custom logic and integration
- **Data Flow**: Backend stores → API → Frontend components

### View Architecture
**Two Main View Modes**:
1. **Table View** (default): Standard data table presentation
   - Uses fields without `NoTable: true`
   - Has optional Detail Panel for selected rows (uses `NoTable: true` fields)
   - Detail Panel can have custom "panel" renderers

2. **Canvas View**: Free-form graphical presentation
   - Uses same field definitions but in flexible ways
   - If custom renderer specified → uses custom renderer
   - If no custom renderer → uses CanvasView (form fields, no buttons)

### File Structure
```
code_gen/templates/classDefinitions/[view].toml  # Facet configuration
pkg/types/[view]/                                # Backend data handling
app/api_[view].go                               # API endpoints
frontend/src/views/[view]/                      # Frontend components
```

## Step-by-Step Process

**IMPORTANT**: Work step by step. Present each change, explain why you want to make it, and wait for approval before proceeding. Do not run ahead with multiple changes.

### Phase 1: Planning and Configuration

#### Step 0: Pre-flight Checklist
**Before Starting**:
- Make a backup of your current working state
- Verify the store name you plan to use (format: `Xxxx`)
- Confirm that `./code_gen/templates/classDefinitions/fields/[store].csv` exists for your chosen store
- Understand whether you're creating a new store or reusing an existing one

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
viewType = ""               # "canvas" for non-table view, "" for table view
renderer = ""               # Custom renderer ("panel" for detail panel, "facet" for canvas)
```

### Phase 2: Code Generation

#### Step 4: Run Code Generation
**Command**: `make generate`

**What Gets Generated** (general overview):
- Backend: DataFacet constants, config entries, store method stubs, API switch cases
- Frontend: TypeScript enum updates, component switch cases, basic data mapping
- Templates: Boilerplate for new facet integration across the stack

**Expected Issues After Generation**:
- Enum constants with spaces (e.g., `ASSET HISTORIES`) need manual correction
- Generated switch cases may need adjustment
- Store method implementations may need refinement
- Frontend data mapping may require fixes

**Critical**: Expect significant manual work after code generation. The generator creates the skeleton, but manual refinement is always required.

#### Step 5: Manual Code Fixes (Post-Generation)
After `make generate`, you will need to manually fix generated code issues:

**Common Fixes Needed**:
- Remove spaces from TypeScript enum constants
- Correct data field mappings in switch statements
- Verify store method implementations
- Fix any syntax errors in generated TypeScript
- Ensure proper data type consistency

**Process**: Work through compilation errors systematically, starting with TypeScript syntax issues, then backend compilation, then runtime integration.

### Phase 3: Backend Implementation

#### Step 6: Store Integration
**Files**: `pkg/types/[view]/store.go`

**For New Data Type**:
- Implement `get[DataType]Store()` method
- Add SDK integration in queryFunc
- Define processFunc and mappingFunc

**For Existing Data Type**:
- Update existing store method to handle new facet
- Add filtering logic based on facet name
- Ensure proper SDK command usage

#### Step 7: Configuration Updates
**Files**: `pkg/types/[view]/config.go`

Add facet configuration:
```go
"facetname": {
    Name:          "FacetName",
    Store:         "storename",
    ViewType:      "table",        // "table" (default) or "canvas"
    DividerBefore: false,
    Fields:        getFacetFields(),
    Actions:       []string{},
    HeaderActions: []string{"export"},
    RendererTypes: "",
},
```

**Note**: `IsForm` has been replaced with `ViewType`. Canvas view with no renderer automatically uses CanvasView (form fields).

**Field Configuration**: To see available fields, check `./code_gen/templates/classDefinitions/fields/[store].csv`

#### Step 8: API Method Updates
**Files**: `app/api_[view].go`

Ensure API methods handle new facet:
- Update switch statements
- Add facet-specific logic if needed
- Verify error handling

### Phase 4: Frontend Implementation

#### Step 9: Component Updates
**Files**: `frontend/src/views/[view]/[View].tsx`

Add facet handling:
```tsx
// In currentData switch statement
case types.DataFacet.NEWFACET:
  return pageData.newfacetdata || [];
```

#### Step 10: DataFacet Enum
**Check**: `frontend/wailsjs/go/models.ts` or type definitions

Verify `NEWFACET` is added to DataFacet enum:
- If auto-generated, confirm it appears
- If manual, add it to the appropriate enum file

#### Step 11: Custom Renderer (Optional)
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

#### Step 12: Code Quality
**Commands**:
```bash
yarn lint
yarn test
```

**Fix Issues**:
- Resolve linting errors
- Update tests if needed
- Ensure TypeScript compilation

#### Step 13: Manual Testing
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
- `viewType = ""` (default)
- `renderer = ""` (default table view)

**Canvas Facets**: Free-form non-table presentation
- `viewType = "canvas"`
- `renderer = ""` (uses default CanvasView with form fields)
- `renderer = "facet"` (uses custom canvas renderer)

**Detail Panel**: Contextual overlay within table view
- `renderer = "panel"` (custom detail panel renderer)
- Uses `NoTable: true` fields from field configuration

### Store Reuse Patterns

When multiple facets use the same underlying data store, they can provide different views or filters of the same data:

**Store Mapping Examples**:
```toml
# New data type - facet and store match
name = "Statements"
store = "Statements"

# Reuse existing type - different facet name
name = "Asset Histories" 
store = "Statements"    # Reuses existing Statements data

# Multiple related facets, same store
name = "Balances"
store = "Balances"
name = "TokenBalances"  
store = "Balances"      # Same store, potentially different filtering
```

**When to Reuse vs. Create New**:
- **Reuse**: When you want a different view/presentation of existing data
- **Create New**: When you need fundamentally different SDK calls or data processing
- **Consider**: Whether the existing store's SDK integration matches your needs

### SDK Integration Patterns
```go
// Basic export
opts.Export()

// Specific export type
opts.ExportLogs()
opts.ExportBalances()

// With options
opts := sdk.ExportOptions{
    Globals:    sdk.Globals{Cache: true, Chain: payload.ActiveChain},
    Addrs:      []string{address},
    Articulate: true,    // For detailed log parsing
    Accounting: true,    // For financial calculations
}
```

### Multi-Facet Refactoring Patterns

When renaming or restructuring multiple related facets, follow this pattern:

1. **Update DataFacet Constants**: Change all constant definitions in one commit
2. **Update Type Aliases**: Ensure type mappings reflect the new data structure (e.g., Transaction vs Log)
3. **Update Collections**: Modify struct fields and initialization methods
4. **Update Store Methods**: Rename and add new store getter methods
5. **Update View Configuration**: Modify facet ordering and field definitions
6. **Generate TypeScript Bindings**: Run `wails generate module`
7. **Update Frontend References**: Modify switch cases and data access
8. **Update Renderers**: Adjust any custom renderer mappings
9. **Test and Validate**: Run linting and tests

#### Example: Splitting One Facet into Multiple
```go
// Before: Single facet
ExportsApproves types.DataFacet = "approves"

// After: Split into multiple semantic facets
ExportsApprovalLogs types.DataFacet = "approvallogs"  // Log data
ExportsApprovalTxs  types.DataFacet = "approvaltxs"   // Transaction data
```

#### Log Extraction from Transaction Data
When the SDK changes return types, you may need to extract specific data:
```go
processFunc := func(item interface{}) *ApprovalLog {
    // Extract logs from transaction data
    if tx, ok := item.(*sdk.Transaction); ok {
        for _, log := range tx.Receipt.Logs {
            if len(log.Topics) > 0 {
                return (*ApprovalLog)(&log)
            }
        }
    }
    return nil
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
- **Facet Ordering**: Default behavior uses TOML order. Do not implement custom sorting unless specifically required

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