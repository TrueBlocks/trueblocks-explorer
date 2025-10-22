# Implementation Guide: Intra-View Navigation with Row Targeting

## Overview

This document outlines the implementation of a comprehensive intra-view navigation system that enables row actions to navigate between facets within the same view while preserving and targeting specific row information. The system supports navigating from the Statements facet to either the Transactions facet (fast loading) or the Traces facet (comprehensive data) within the Exports view, with sophisticated row targeting, pagination calculation, and address context management.

## Background & Analysis

### Current State
- **Exports View**: Contains multiple facets including `statements`, `transactions`, `traces`, and others
- **Data Types**: All types share common identifiers like `transactionHash`/`hash`, `blockNumber`, `transactionIndex`
- **Row Action System**: Robust collection-specific system for navigation between facets
- **Address Context**: Each collection requires proper address context for data fetching

### Key Files Involved
- `pkg/types/exports/config.go` - Exports facet configuration with row actions
- `pkg/types/exports/exports.go` - Collection-specific row action handling
- `app/api_exports.go` - App layer delegation to collection handlers
- `app/app_rowaction.go` - Main row action coordination
- `frontend/src/views/exports/Exports.tsx` - Exports view component
- `frontend/src/components/TabView.tsx` - Tab highlighting for navigation
- `pkg/types/view_config.go` - Helper functions for row action configuration

## Technical Architecture

### Collection-Specific Pattern
The system follows a collection-specific pattern where each collection handles its own row actions:

```go
// App layer delegates to collection-specific handlers
func (a *App) HandleExportsRowAction(payload *types.RowActionPayload) error {
    collection := exports.GetExportsCollection(&types.Payload{
        Collection: payload.Collection,
        DataFacet:  payload.DataFacet,
        Chain:      payload.Chain,
        Address:    payload.Address,  // Critical for data fetching
        Period:     payload.Period,
    })
    return collection.HandleRowAction(payload)
}

// Collection handles row actions with proper context
func (c *ExportsCollection) HandleRowAction(payload *types.RowActionPayload) error {
    // Extract search criteria from row context
    searchCriteria := make(map[string]interface{})
    for _, identifier := range target.Identifiers {
        if value, exists := payload.ContextValues[identifier.ContextKey]; exists {
            searchCriteria[identifier.FieldName] = value
        }
    }
    
    // Find target row with graceful error handling
    targetRowInfo, err := c.findTargetRow(targetFacet, searchCriteria, payload)
    if err != nil {
        // Log warning but allow navigation to continue
        fmt.Printf("Row targeting warning: %v\n", err)
        targetRowInfo = nil
    }
    
    return nil
}

```

### Address Context Management
Critical lesson learned: Address context must be preserved and passed correctly for data fetching:

```go
// When traces/transactions data not loaded, create fresh collection with correct address
if payload.Address != "" {
    freshPayload := &types.Payload{
        Collection: payload.Collection,
        DataFacet:  ExportsTransactions, // or ExportsTraces
        Chain:      payload.Chain,
        Address:    payload.Address,      // Essential for SDK operations
        Period:     payload.Period,
    }
    freshCollection := GetExportsCollection(freshPayload)
    go func() {
        freshCollection.FetchByFacet(ExportsTransactions)
    }()
}
```

### Row Targeting System
The system includes sophisticated row targeting with pagination calculation:

```go
type TargetRowInfo struct {
    RowIndex    int                    `json:"rowIndex"`    // Index within page
    PageNumber  int                    `json:"pageNumber"`  // Page containing row (0-based)
    TotalRows   int                    `json:"totalRows"`   // Total rows in dataset
    RowData     map[string]interface{} `json:"rowData"`     // Actual row data
    SearchField string                 `json:"searchField"` // Field that matched
    SearchValue interface{}            `json:"searchValue"` // Value that matched
}

// Pagination calculation
pageSize := 25 // Standard page size
pageNumber := foundIndex / pageSize
rowIndex := foundIndex % pageSize
```

## Implementation Examples

### Example 1: Statements → Transactions (Fast Loading)

**Configuration in `pkg/types/exports/config.go`**:
```go
"statements": {
    Name:          "Statements",
    Store:         "statements",
    DividerBefore: false,
    Fields:        getStatementsFields(),
    Actions:       []string{},
    HeaderActions: []string{"export"},
    RendererTypes: "panel",
    RowAction:     types.NewRowActionNavigation("exports", "transactions", "hash", "transactionHash"),
},
```

**Backend Handler in `pkg/types/exports/exports.go`**:
```go
func (c *ExportsCollection) searchInTransactions(searchCriteria map[string]interface{}, payload *types.RowActionPayload) (*TargetRowInfo, error) {
    if c.transactionsFacet == nil {
        return nil, fmt.Errorf("transactions facet not initialized")
    }

    store := c.transactionsFacet.GetStore()
    transactions := store.GetItems()
    
    if len(transactions) == 0 {
        // Trigger async fetch with proper address context
        if payload.Address != "" {
            freshPayload := &types.Payload{
                Collection: payload.Collection,
                DataFacet:  ExportsTransactions,
                Chain:      payload.Chain,
                Address:    payload.Address,
                Period:     payload.Period,
            }
            freshCollection := GetExportsCollection(freshPayload)
            go func() {
                freshCollection.FetchByFacet(ExportsTransactions)
            }()
        }
        return nil, fmt.Errorf("transactions data not yet loaded - navigating to transactions facet where data will be fetched with address: %s", payload.Address)
    }

    // Search for matching transaction
    pageSize := 25
    for i, transaction := range transactions {
        for field, expectedValue := range searchCriteria {
            var actualValue interface{}
            switch field {
            case "transactionHash", "hash":
                actualValue = transaction.Hash
            case "blockNumber":
                actualValue = transaction.BlockNumber
            case "transactionIndex":
                actualValue = transaction.TransactionIndex
            }
            
            if valuesMatch(actualValue, expectedValue) {
                return &TargetRowInfo{
                    RowIndex:    i % pageSize,
                    PageNumber:  i / pageSize,
                    TotalRows:   len(transactions),
                    RowData:     transactionToMap(*transaction),
                    SearchField: field,
                    SearchValue: expectedValue,
                }, nil
            }
        }
    }
    
    return nil, fmt.Errorf("no matching row found in transactions")
}
```

### Example 2: Statements → Traces (Comprehensive Data)

**Configuration Alternative**:
```go
"statements": {
    // ... same as above
    RowAction: types.NewRowActionNavigation("exports", "traces", "hash", "transactionHash"),
},
```

**Backend Handler**:
```go
func (c *ExportsCollection) searchInTraces(searchCriteria map[string]interface{}, payload *types.RowActionPayload) (*TargetRowInfo, error) {
    // Similar pattern but searches through traces data
    // Uses trace.TransactionHash for matching instead of transaction.Hash
    // Same pagination and row targeting logic
}
```

## Critical Lessons Learned

### 1. Address Context is Essential
**Problem**: Initial implementation failed with "Please specify at least one valid Ethereum address" errors.

**Root Cause**: When triggering async data fetches, the address context from the original row action payload was not being passed to the new collection instance.

**Solution**: Always create fresh collections with the complete payload including address:
```go
if payload.Address != "" {
    freshPayload := &types.Payload{
        Collection: payload.Collection,
        DataFacet:  targetFacet,
        Chain:      payload.Chain,
        Address:    payload.Address,  // Must be included
        Period:     payload.Period,
    }
    freshCollection := GetExportsCollection(freshPayload)
}
```

### 2. Graceful Error Handling
**Problem**: Strict error handling prevented navigation when row targeting failed.

**Solution**: Log warnings but allow navigation to continue:
```go
targetRowInfo, err := c.findTargetRow(targetFacet, searchCriteria, payload)
if err != nil {
    // Log warning but don't block navigation
    fmt.Printf("Row targeting warning: %v\n", err)
    targetRowInfo = nil
}
// Navigation continues even without specific row targeting
```

### 3. Async Data Loading Timing
**Problem**: Row actions executed before target facet data was loaded.

**Solution**: Trigger async loading and provide informative feedback:
```go
if len(targetData) == 0 {
    // Start async fetch for future use
    go func() {
        collection.FetchByFacet(targetFacet)
    }()
    
    // Return informative error but allow navigation
    return nil, fmt.Errorf("target data not yet loaded - navigating to facet where data will be fetched")
}
```

### 4. Collection Caching and Key Management
**Problem**: Collections are cached by key, and improper key generation could lead to stale data.

**Understanding**: The `GetExportsCollection()` function caches collections based on a key derived from the payload. This ensures that collections with the same address/chain combination reuse cached data but different addresses get fresh collections.

### 5. Tab Highlighting Synchronization
**Problem**: Mantine tabs didn't update highlights when facet changed via row actions.

**Solution**: Update TabView to listen to `lastFacetMap` changes:
```typescript
// TabView.tsx - ensure tab highlights update on intra-view navigation
useEffect(() => {
    // Tab highlighting logic that responds to lastFacetMap changes
}, [lastFacetMap, currentDataFacet]);
```

## Potential Failure Points

### 1. Data Type Mismatches
**Risk**: Field names or types differ between source and target facets.
**Mitigation**: 
- Use flexible field mapping in search criteria extraction
- Handle multiple field name variations (e.g., "hash" vs "transactionHash")
- Implement type conversion where necessary

### 2. Large Dataset Performance
**Risk**: Searching through large datasets for matching rows could be slow.
**Mitigation**: 
- Consider indexing strategies for frequently searched fields
- Implement early termination when first match is found
- Use pagination-aware search algorithms

### 3. Network Connectivity Issues
**Risk**: Async data fetching could fail due to network issues.
**Mitigation**: 
- Implement retry logic in fetch operations
- Provide user feedback during long-running operations
- Graceful degradation when data unavailable

### 4. Memory Consumption
**Risk**: Keeping multiple large datasets in memory simultaneously.
**Mitigation**: 
- Monitor memory usage with large collections
- Consider lazy loading strategies
- Implement data cleanup for unused collections

### 5. State Synchronization
**Risk**: Frontend and backend state could become out of sync during navigation.
**Mitigation**: 
- Use event-driven architecture for state updates
- Implement proper error boundaries in React components
- Ensure consistent state update patterns

## Performance Considerations

### Speed Comparison: Transactions vs Traces
**Transactions Facet**: 
- Faster loading (chosen as default)
- Smaller data size per record
- Better user experience for quick navigation

**Traces Facet**:
- More comprehensive data
- Slower loading due to data complexity
- Better for detailed analysis workflows

### Optimization Strategies
1. **Preload Target Data**: Load likely target facets in background
2. **Intelligent Caching**: Cache frequently accessed data longer
3. **Pagination Optimization**: Only load pages near target row
4. **Search Indexing**: Build indexes on commonly searched fields

## Implementation Steps

### Step 1: Configure Row Action
```go
// pkg/types/exports/config.go
RowAction: types.NewRowActionNavigation("exports", "transactions", "hash", "transactionHash"),
```

### Step 2: Implement Collection Handler
```go
// pkg/types/exports/exports.go
func (c *ExportsCollection) HandleRowAction(payload *types.RowActionPayload) error {
    // Implementation with proper error handling and address context
}
```

### Step 3: Add Search Methods
```go
// Implement searchInTransactions and/or searchInTraces methods
// Include pagination calculation and row targeting
```

### Step 4: Update TypeScript Bindings
```bash
wails generate module
```

### Step 5: Test Thoroughly
- Test with loaded and unloaded target data
- Test address context preservation
- Test error handling scenarios
- Test UI state synchronization

## Testing Strategy

### Critical Test Cases

#### Address Context Tests
- [ ] Navigation works when target data already loaded
- [ ] Navigation works when target data needs to be fetched
- [ ] Address context properly passed to fresh collections
- [ ] Error handling when address missing or invalid

#### Row Targeting Tests  
- [ ] Exact row match found and highlighted
- [ ] Pagination calculation correct for target row
- [ ] Graceful handling when no match found
- [ ] Multiple matches handled appropriately

#### Performance Tests
- [ ] Navigation responsive with large datasets
- [ ] Memory usage reasonable with multiple facets loaded
- [ ] Network error handling during async fetches
- [ ] UI remains responsive during data loading

#### UI State Tests
- [ ] Tab highlighting updates correctly
- [ ] Loading states displayed during transitions
- [ ] Error messages user-friendly and informative
- [ ] Navigation history preserved appropriately

## Success Metrics

### Functional Success
- ✅ Row actions navigate between facets reliably
- ✅ Target rows found and highlighted when data available
- ✅ Address context preserved for proper data fetching
- ✅ Graceful degradation when targeting fails

### Performance Success
- ✅ Navigation completes within 200ms when data loaded
- ✅ Async data loading completes within reasonable time
- ✅ Memory usage remains stable during navigation
- ✅ UI responsive throughout navigation process

### User Experience Success
- ✅ Navigation feels immediate and intuitive
- ✅ Error states provide helpful guidance
- ✅ Tab highlighting clearly indicates current facet
- ✅ No unexpected behavior or state corruption

## Future Enhancements

### Immediate Opportunities
1. **Bidirectional Navigation**: Navigate from transactions/traces back to statements
2. **Multi-Target Actions**: Configure multiple target facets per source facet
3. **Conditional Targeting**: Choose target based on data availability or user preferences

### Advanced Features
1. **Preview Mode**: Show target data in popover before navigation
2. **Batch Navigation**: Handle multiple selected rows simultaneously
3. **Smart Preloading**: Predict likely navigation targets and preload data
4. **Navigation History**: Breadcrumb trail for complex navigation paths

### System Integration
1. **Deep Linking**: URL parameters for direct navigation to specific rows
2. **Search Integration**: Use navigation context for enhanced filtering
3. **Export Integration**: Include navigation metadata in exported data
4. **Analytics**: Track navigation patterns for UX optimization

## Conclusion

The intra-view navigation system with row targeting provides a robust, extensible foundation for facet-to-facet navigation. The collection-specific pattern ensures maintainability, while the sophisticated row targeting and address context management provide a smooth user experience. The lessons learned during implementation provide valuable insights for avoiding common pitfalls and ensuring reliable operation across diverse usage scenarios.

Key takeaways:
- **Address context is critical** for proper data fetching
- **Graceful error handling** enables better user experience
- **Collection-specific patterns** provide cleaner architecture
- **Async data loading** requires careful timing consideration
- **Performance trade-offs** between speed and data completeness

This system serves as a model for implementing similar navigation capabilities across other views and collections in the application.

---

## Current Implementation Status (For Future Reference)

### ✅ **What Was Successfully Implemented**

1. **Helper Function**: `NewRowActionNavigation()` in `pkg/types/view_config.go`
2. **Environment Variable**: `TB_ALLVIEWS` override in `pkg/types/ordering.go`
3. **Row Action Configuration**: Added to statements facet in `pkg/types/exports/config.go`
4. **Collection-Specific Handlers**: Complete implementation in `pkg/types/exports/exports.go`
   - `HandleRowAction()` method with graceful error handling
   - `searchInTransactions()` and `searchInTraces()` methods
   - Row targeting with pagination calculation
   - Address context preservation for async data fetching
5. **App Layer Delegation**: `HandleExportsRowAction()` in `app/api_exports.go`
6. **Frontend Integration**: Event handling in `Exports.tsx` and tab highlighting fixes
7. **TypeScript Bindings**: Generated and updated multiple times

### ❌ **What Didn't Work / Why It Failed**

1. **Timing Issues**: Row actions executed before target facet data was loaded
2. **Address Context Bugs**: Initial implementation lost address context during async fetches
3. **Complex State Management**: Multiple layers of async operations created race conditions
4. **User Experience Problems**: Navigation felt broken when targeting failed
5. **Over-Engineering**: System became complex with many moving parts
6. **Testing Difficulties**: Hard to test all async state combinations reliably

### 🔧 **Key Files That Were Modified**

- `pkg/types/exports/config.go` - Row action configuration
- `pkg/types/exports/exports.go` - Collection handlers (75+ lines added)
- `pkg/types/view_config.go` - Helper function
- `pkg/types/ordering.go` - Environment variable override
- `app/api_exports.go` - App layer delegation
- `frontend/src/components/TabView.tsx` - Tab highlighting fixes

### 📝 **Configuration Currently in Place**

The statements facet is currently configured to navigate to transactions facet:
```go
RowAction: types.NewRowActionNavigation("exports", "transactions", "hash", "transactionHash"),
```

### 🚨 **Critical Issues to Address in Future Attempts**

1. **Data Loading Race Conditions**: Need deterministic way to ensure target data is loaded
2. **User Feedback**: Better communication when navigation can't complete
3. **Simplification**: Reduce complexity by focusing on core use case first
4. **Error Recovery**: More robust handling of partial failures
5. **Testing Strategy**: Need comprehensive test coverage for async scenarios

---

## Addendum: Alternative Button-Based Navigation Approach

*This section outlines an alternative implementation strategy that could be more reliable and user-friendly than the current row action approach.*

### Overview

Instead of automatic navigation on row selection, implement explicit navigation buttons that:
- Only become enabled when target data is confirmed to be loaded
- Provide clear user feedback about availability
- Allow for more controlled and predictable navigation experience

### Implementation Strategy

#### 1. **Button State Management**

**Frontend Component Structure**:
```typescript
// In each table row or as a separate navigation panel
interface NavigationButtonProps {
  sourceRow: any;
  targetFacet: string;
  transactionHash: string;
}

function NavigationButton({ sourceRow, targetFacet, transactionHash }: NavigationButtonProps) {
  const [isTargetDataLoaded, setIsTargetDataLoaded] = useState(false);
  const [targetRowExists, setTargetRowExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Check if target row exists in loaded data
  useEffect(() => {
    const checkTargetAvailability = async () => {
      setIsChecking(true);
      try {
        const available = await checkTargetRowAvailability(targetFacet, transactionHash);
        setTargetRowExists(available.exists);
        setIsTargetDataLoaded(available.dataLoaded);
      } finally {
        setIsChecking(false);
      }
    };

    checkTargetAvailability();
  }, [targetFacet, transactionHash]);

  return (
    <Button
      disabled={!isTargetDataLoaded || !targetRowExists}
      loading={isChecking}
      onClick={() => navigateToTargetRow(targetFacet, transactionHash)}
      size="xs"
      variant={targetRowExists ? "filled" : "outline"}
    >
      {isChecking ? 'Checking...' : 
       !isTargetDataLoaded ? 'Data Not Loaded' :
       !targetRowExists ? 'No Match' :
       `Go to ${targetFacet}`}
    </Button>
  );
}
```

#### 2. **Backend Target Availability Check**

**New API Endpoint**:
```go
// Add to app/api_exports.go
func (a *App) CheckTargetRowAvailability(payload *types.TargetCheckPayload) (*types.TargetAvailabilityResult, error) {
    collection := exports.GetExportsCollection(&types.Payload{
        Collection: payload.Collection,
        DataFacet:  payload.TargetFacet,
        Chain:      payload.Chain,
        Address:    payload.Address,
        Period:     payload.Period,
    })
    
    return collection.CheckTargetAvailability(payload)
}

// Add to pkg/types/exports/exports.go
func (c *ExportsCollection) CheckTargetAvailability(payload *types.TargetCheckPayload) (*types.TargetAvailabilityResult, error) {
    var store store.Store
    var dataLoaded bool
    
    switch types.DataFacet(payload.TargetFacet) {
    case ExportsTransactions:
        if c.transactionsFacet == nil {
            return &types.TargetAvailabilityResult{DataLoaded: false, RowExists: false}, nil
        }
        store = c.transactionsFacet.GetStore()
        dataLoaded = len(store.GetItems()) > 0
        
    case ExportsTraces:
        if c.tracesFacet == nil {
            return &types.TargetAvailabilityResult{DataLoaded: false, RowExists: false}, nil
        }
        store = c.tracesFacet.GetStore()
        dataLoaded = len(store.GetItems()) > 0
    }
    
    if !dataLoaded {
        return &types.TargetAvailabilityResult{DataLoaded: false, RowExists: false}, nil
    }
    
    // Check if specific row exists
    rowExists := c.findRowByHash(store, payload.SearchHash)
    
    return &types.TargetAvailabilityResult{
        DataLoaded: true, 
        RowExists: rowExists != nil,
        TargetInfo: rowExists,
    }, nil
}
```

#### 3. **Type Definitions**

```go
// Add to pkg/types/payloads.go
type TargetCheckPayload struct {
    Collection  string `json:"collection"`
    TargetFacet string `json:"targetFacet"`
    Chain       string `json:"chain"`
    Address     string `json:"address"`
    Period      string `json:"period,omitempty"`
    SearchHash  string `json:"searchHash"`
}

type TargetAvailabilityResult struct {
    DataLoaded bool          `json:"dataLoaded"`
    RowExists  bool          `json:"rowExists"`
    TargetInfo *TargetRowInfo `json:"targetInfo,omitempty"`
}
```

#### 4. **Integration Points**

**Table Row Integration**:
```typescript
// In BaseTab or similar table component
function TableRow({ row, rowActions }: TableRowProps) {
  return (
    <tr>
      {/* Regular table cells */}
      <td>{row.field1}</td>
      <td>{row.field2}</td>
      
      {/* Navigation button cell */}
      <td>
        {rowActions?.navigation && (
          <NavigationButton
            sourceRow={row}
            targetFacet={rowActions.navigation.targetFacet}
            transactionHash={row.transactionHash}
          />
        )}
      </td>
    </tr>
  );
}
```

**Selected Row Panel**:
```typescript
// Alternative: Show navigation options for currently selected row
function SelectedRowActions({ selectedRow }: { selectedRow: any }) {
  if (!selectedRow) return null;

  return (
    <Paper p="md" mt="md">
      <Text size="sm" fw={500} mb="xs">Navigation Options</Text>
      <Group>
        <NavigationButton
          sourceRow={selectedRow}
          targetFacet="transactions"
          transactionHash={selectedRow.transactionHash}
        />
        <NavigationButton
          sourceRow={selectedRow}
          targetFacet="traces"
          transactionHash={selectedRow.transactionHash}
        />
      </Group>
    </Paper>
  );
}
```

### Advantages of Button Approach

#### **1. User Control and Clarity**
- **Explicit Intent**: User must explicitly choose to navigate
- **Clear Feedback**: Button state indicates exactly what will happen
- **No Surprises**: No unexpected navigation or failed attempts

#### **2. Technical Reliability**
- **Deterministic State**: Only enable when we know navigation will succeed
- **Simple Flow**: No complex async coordination during navigation
- **Easy Testing**: Button states are easy to test and verify

#### **3. Performance Benefits**
- **Lazy Checking**: Only check target availability when needed
- **Cached Results**: Can cache availability checks for performance
- **No Race Conditions**: Check happens before navigation, not during

#### **4. Better Error Handling**
- **Preventive**: Errors prevented rather than handled after the fact
- **Informative**: Button text explains why navigation isn't available
- **Progressive**: Can show loading states during availability checks

### Implementation Phases

#### **Phase 1: Basic Button Integration**
1. Add navigation buttons to table rows
2. Implement basic availability checking
3. Style buttons appropriately for different states

#### **Phase 2: Enhanced UX**
1. Add tooltips explaining button states
2. Implement caching for availability checks
3. Add batch checking for multiple rows

#### **Phase 3: Advanced Features**
1. Preemptive data loading when buttons indicate availability
2. Smart suggestions for which navigation would be most useful
3. Integration with selection state for bulk operations

### Configuration Integration

The button approach can reuse the existing row action configuration:

```go
// Same configuration as current implementation
RowAction: types.NewRowActionNavigation("exports", "transactions", "hash", "transactionHash"),

// But consumed differently - as button configuration rather than automatic action
```

### Conclusion

The button-based approach offers a more controlled and reliable alternative to automatic row action navigation. While it requires additional UI space and user interaction, it provides:

- **Predictable behavior** - buttons only work when they can succeed
- **Better user experience** - clear feedback about what's possible
- **Simpler implementation** - fewer async coordination challenges
- **Easier testing** - deterministic states to test

This approach could be implemented as either a replacement for or complement to the row action system, potentially offering users both automatic navigation (when reliable) and explicit navigation (when more control is needed).

The button approach addresses the core challenges that made the automatic system unreliable while providing a more user-friendly interface for inter-facet navigation.