# Adding Row Actions

This document describes how to add new row actions to the application, with a focus on navigation between facets. Row actions are user interactions (Enter key, double-click) that trigger backend processing and can result in navigation, data updates, or other operations.

**Note**: This guide primarily covers the `"navigate"` row action type. Other available row action types include:
- `"export"` - Export data in various formats  
- `"expand"` - Expand row details inline
- `"modal"` - Open details in modal dialog
- `"crud"` - Create, read, update, delete operations

The implementation patterns described here apply to all action types, but navigation actions require additional configuration for target facets and context mapping.

## Overview

Row actions in this application follow a unified pattern:
1. User interaction (Enter/double-click) triggers frontend handler
2. Frontend calls `ExecuteRowAction` with payload
3. Backend processes the action based on configuration
4. Backend can emit events, update data, or trigger navigation
5. Frontend receives events and updates UI accordingly

## Key Components

### Backend Configuration
- **RowActionConfig**: Defines available actions for each facet
- **RowIdentifier**: Specifies which field identifies the row
- **Action Types**: `navigate`, `delete`, `export`, etc.

### Frontend Integration
- **ExecuteRowAction**: API call to backend
- **Event Handling**: Processes backend responses
- **UI Handlers**: Enter key and double-click handlers

## Step-by-Step Implementation Guide

### Step 1: Define Backend Configuration

Add a `RowActionConfig` to your collection's facet configuration in `pkg/types/{view}/config.go`:

```go
// Example from pkg/types/dresses/config.go
facetConfigs[types.DataFacetGallery] = &types.FacetConfig{
    // ... other config
    RowActionConfig: &types.RowActionConfig{
        ActionType: "navigate",
        Target:     "generator", // Target facet
        RowIdentifier: &types.RowIdentifier{
            Field:      "address",      // Field that identifies the row
            ContextKey: "original",     // Context key for the identifier
        },
    },
}
```

**Configuration Fields:**
- `ActionType`: Type of action (`"navigate"`, `"export"`, `"expand"`, `"modal"`, `"crud"`)
- `Target`: For navigation actions, the target facet name (not used for other action types)
- `RowIdentifier.Field`: Database/API field that uniquely identifies the row
- `RowIdentifier.ContextKey`: Key used in context values for the identifier

### Step 2: Update Frontend Handler

Modify your facet component to use `ExecuteRowAction` for both Enter key and double-click:

```tsx
// Import ExecuteRowAction
import { ExecuteRowAction } from '@app';

// Create the action handler
const handleItemAction = useCallback(
  async (item: YourItemType) => {
    const itemKey = getItemKey(item); // Get unique identifier
    
    const payload: types.RowActionPayload = {
      ViewStateKey: viewStateKey,
      RowKey: itemKey,
      ContextValues: {
        // Map your item fields to context
        [contextKey]: item.yourIdentifierField,
        // Add other context as needed
      },
    };

    try {
      await ExecuteRowAction(payload);
    } catch (error) {
      LogError('Row action failed:', error);
    }
  },
  [viewStateKey]
);
```

### Step 3: Connect Enter Key Handler

Ensure your keyboard handler passes the action function to the shared key handling:

```tsx
const handleKey = useCallback(
  (e: React.KeyboardEvent<HTMLDivElement>) => {
    sharedHandleKey(
      e,
      items,
      viewStateKey,
      columns,           // Optional: for column adjustment
      handleItemAction,  // CRITICAL: Pass your action handler
      groupNames,        // Optional: for grouped layouts
      groupedItems,      // Optional: for grouped layouts
    );
  },
  [sharedHandleKey, items, viewStateKey, columns, handleItemAction, groupNames, groupedItems],
);
```

**Important**: The 5th parameter (`handleItemAction`) is required for Enter key functionality. The shared key handler calls this function when Enter is pressed.

### Step 4: Connect Double-Click Handler

Ensure your component passes the action handler to UI components:

```tsx
<YourComponent
  items={items}
  onItemClick={handleItemSelect}      // For selection
  onItemDoubleClick={handleItemAction} // For action
  // ... other props
/>
```

### Step 5: Update Component Exports (if needed)

If you created new reusable components, add them to the appropriate index file:

```tsx
// In frontend/src/views/{view}/renderers/components/index.ts
export * from './YourNewComponent';
```

## Real-World Examples

### Example 1: Gallery → Generator Navigation

**Backend Config** (`pkg/types/dresses/config.go`):
```go
facetConfigs[types.DataFacetGallery] = &types.FacetConfig{
    RowActionConfig: &types.RowActionConfig{
        ActionType: "navigate",
        Target:     "generator",
        RowIdentifier: &types.RowIdentifier{
            Field:      "address",
            ContextKey: "original",
        },
    },
}
```

**Frontend Handler** (`GalleryFacet.tsx`):
```tsx
const handleItemDoubleClick = useCallback(
  async (item: model.DalleDress) => {
    const itemKey = getItemKey(item);
    const payload: types.RowActionPayload = {
      ViewStateKey: viewStateKey,
      RowKey: itemKey,
      ContextValues: {
        original: item.original,
      },
    };
    await ExecuteRowAction(payload);
  },
  [viewStateKey]
);
```

### Example 2: Generator → Gallery Navigation

**Backend Config** (same file, different facet):
```go
facetConfigs[types.DataFacetGenerator] = &types.FacetConfig{
    RowActionConfig: &types.RowActionConfig{
        ActionType: "navigate",
        Target:     "gallery",
        RowIdentifier: &types.RowIdentifier{
            Field:      "address",
            ContextKey: "original",
        },
    },
}
```

**Frontend Integration** (`GeneratorFacet.tsx`):
```tsx
// Reusable Thumbnail component
<Thumbnail
  items={thumbItems}
  selectedKey={getSelectionKey()}
  onItemClick={handleThumbSelect}
  onItemDoubleClick={handleThumbDouble}  // Action handler
  containerRef={thumbRowRef}
  onKeyDown={handleKey}                  // Key handler with action
/>

// Key handler with action function
const handleKey = useCallback(
  (e: React.KeyboardEvent<HTMLDivElement>) => {
    sharedHandleKey(
      e,
      thumbItems,
      viewStateKey,
      undefined,
      handleThumbDouble,  // CRITICAL: Action handler for Enter key
      undefined,
      undefined,
    );
  },
  [sharedHandleKey, thumbItems, viewStateKey, handleThumbDouble],
);
```

## Common Patterns

### Navigation Actions
- Use `ActionType: "navigate"` with `Target` facet
- `RowIdentifier` typically uses primary key field
- Context values provide data for target facet

### Other Action Types
- **Export Actions**: Use `ActionType: "export"` with export format in context
- **Expand Actions**: Use `ActionType: "expand"` to show row details inline
- **Modal Actions**: Use `ActionType: "modal"` to open details in modal dialog
- **CRUD Actions**: Use `ActionType: "crud"` for create, read, update, delete operations

### Selection and Navigation
- Single-click: Select item (visual feedback)
- Double-click/Enter: Execute action (navigation, delete, export, etc.)
- Keyboard navigation: Arrow keys + Enter

### Reusable Components
- Extract complex UI into reusable components
- Pass handlers as props for flexibility
- Maintain consistent interfaces across facets

## Troubleshooting

### Enter Key Not Working
- **Check**: Is action handler passed as 5th parameter to `sharedHandleKey`?
- **Verify**: Does the handler function exist and have correct signature?
- **Test**: Does double-click work? If yes, it's a key handler issue.

### Navigation Not Triggering
- **Check**: Is `RowActionConfig` properly defined in backend?
- **Verify**: Are `ContextValues` mapping correctly to expected keys?
- **Debug**: Check browser console for `ExecuteRowAction` errors.

### Selection vs Action Confusion
- **Click**: Selection only (visual feedback)
- **Double-click/Enter**: Action execution (navigation/operation)
- **Ensure**: Separate handlers for `onItemClick` vs `onItemDoubleClick`

## Backend Processing

When `ExecuteRowAction` is called, the backend:

1. **Validates** the payload and configuration
2. **Processes** the action based on `ActionType`
3. **Emits events** for navigation or data updates
4. **Updates state** as needed (selection, active facet, etc.)

The frontend receives these events and updates the UI accordingly, including:
- Changing active facet
- Updating selection
- Scrolling to target items
- Refreshing data

## Testing Checklist

- [ ] Double-click triggers action
- [ ] Enter key triggers action  
- [ ] Navigation reaches correct target facet
- [ ] Selection is maintained/transferred correctly
- [ ] Scroll-to-selection works in target facet
- [ ] Error handling works for invalid items
- [ ] Keyboard navigation (arrows) works
- [ ] Component is properly exported if reusable

## Files to Modify

For a complete row action implementation, you'll typically modify:

**Backend:**
- `pkg/types/{view}/config.go` - Add RowActionConfig
- `app/app_rowaction.go` - (framework handles automatically)

**Frontend:**
- `frontend/src/views/{view}/renderers/facets/{facet}/{Facet}.tsx` - Add handlers
- `frontend/src/views/{view}/renderers/components/` - Create reusable components
- `frontend/src/views/{view}/renderers/components/index.ts` - Export components

**After Changes:**
- Run `wails generate module` to update TypeScript bindings
- Test both Enter key and double-click functionality
- Verify navigation works in both directions if bidirectional