# Custom Panels and Facets Design

This document explains the design and implementation of custom panels and facets in the goMaker code generation system.

## Overview

The system supports two types of custom rendering:

1. **Custom Panels**: Regular table views with custom panel rendering (`ViewType: "table"`, `Panel: "custom"`)
2. **Custom Facets**: Completely custom view types (`ViewType: "custom"`)

## Architecture

### Core Components

#### Facet Structure
```go
type Facet struct {
    ViewType string `toml:"viewType" json:"viewType"` // "table", "form", "dashboard", "custom"
    Panel    string `toml:"panel" json:"panel"`       // "", "custom"
    // ... other fields
}
```

#### Detection Methods

**Structure-level methods** (in `types_structure.go`):
- `HasCustomPanel() bool` - Checks if any facet has `ViewType=="table" && Panel=="custom"`
- `HasCustomFacet() bool` - Checks if any facet has `ViewType=="custom"`
- `HasCustomRenderers() bool` - Returns true if either custom panels or facets exist

**Facet-level methods** (in `types_facet.go`):
- `IsCustomPanel() bool` - Individual facet check for custom panel
- `IsCustomFacet() bool` - Individual facet check for custom facet
- `NeedsCustomRenderer() bool` - True if facet needs any custom rendering

## Configuration Examples

### Custom Panel Example
```toml
[[facets]]
name = "transactions"
viewType = "table"
panel = "custom"
store = "Transaction"
actions = ["export", "delete"]
```

This creates a standard table view but with a custom panel for additional UI components.

### Custom Facet Example
```toml
[[facets]]
name = "dashboard" 
viewType = "custom"
store = "Analytics"
actions = ["export"]
```

This creates a completely custom view type, typically for dashboards, charts, or specialized layouts.

## Usage Patterns

### When to Use Custom Panels
- **Standard table with enhancements**: You want the default table functionality but need additional UI components
- **Side panels**: Adding filters, charts, or action panels alongside the main table
- **Table decorations**: Custom headers, footers, or embedded controls within table context

### When to Use Custom Facets  
- **Completely different UX**: Dashboard views, chart-heavy interfaces, specialized workflows  
- **Non-tabular data**: When data doesn't fit well into rows and columns
- **Complex interactions**: Multi-step wizards, drag-and-drop interfaces, custom forms

### Best Practices

1. **Start with standard views**: Only use custom rendering when standard table/form views are insufficient
2. **Prefer custom panels**: If you need table functionality plus extras, use custom panels rather than full custom facets
3. **Consistent naming**: Use descriptive facet names that indicate their purpose
4. **Action alignment**: Ensure actions make sense for the custom view type

## Template Integration

The template system can detect custom rendering needs using the helper methods:

```go
{{if .HasCustomRenderers}}
// Generate custom renderer imports or components
{{end}}

{{range .Facets}}
{{if .NeedsCustomRenderer}}
// Generate custom renderer for this specific facet
{{end}}
{{end}}
```

## Validation

The system validates:
- `ViewType` must be one of: `"table"`, `"form"`, `"dashboard"`, `"custom"`
- `Panel` must be one of: `""` (empty/default), `"custom"`
- Actions must be valid row or header actions

Invalid configurations will cause validation errors during code generation.

## Migration Guide

### From Legacy Patterns
If you have existing custom rendering logic, migrate by:

1. **Identify the pattern**: Is it table-with-extras (custom panel) or completely different (custom facet)?
2. **Update configuration**: Add appropriate `viewType` and `panel` values to facet definitions
3. **Use new methods**: Replace manual checks with `HasCustomRenderers()`, `IsCustomPanel()`, etc.
4. **Update templates**: Use the new detection methods in template logic

### Example Migration
**Before:**
```go
// Manual detection in templates
{{if eq .SomeAttribute "special"}}
// Custom rendering logic
{{end}}
```

**After:**
```go
// Using new detection methods
{{if .HasCustomRenderers}}
// Custom rendering logic
{{end}}
```

## Implementation Status

✅ **Completed:**
- Added `"custom"` to allowed ViewType values
- Added panel validation with `"custom"` support  
- Implemented all detection helper methods
- Updated validation to include panel checking

🎯 **Available for Templates:**
- Structure methods: `HasCustomPanel()`, `HasCustomFacet()`, `HasCustomRenderers()`
- Facet methods: `IsCustomPanel()`, `IsCustomFacet()`, `NeedsCustomRenderer()`
- Proper validation ensures configuration integrity

## Future Enhancements

Potential future improvements:
- **Panel types**: Support for specific panel types beyond just "custom"
- **View composition**: Allow multiple custom components within a single view
- **Template helpers**: Additional template functions for common custom rendering patterns
- **Runtime detection**: Methods to detect custom rendering needs at runtime, not just generation time