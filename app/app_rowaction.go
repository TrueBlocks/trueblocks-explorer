package app

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// ExecuteRowAction processes configurable row actions (Enter key press on table rows)
func (a *App) ExecuteRowAction(payload *types.RowActionPayload) error {
	if payload.RowAction == nil {
		return fmt.Errorf("row action configuration is required")
	}

	switch payload.RowAction.Type {
	case "navigate":
		return a.handleNavigationAction(payload)
	case "modal":
		return a.handleModalAction(payload)
	case "custom":
		return a.handleCustomAction(payload)
	case "none":
		return nil
	default:
		return fmt.Errorf("unknown row action type: %s", payload.RowAction.Type)
	}
}

// handleNavigationAction processes navigation row actions with <latest> facet support
func (a *App) handleNavigationAction(payload *types.RowActionPayload) error {
	target := payload.RowAction.Target
	if target == nil {
		return fmt.Errorf("navigation target required for navigate action")
	}

	// Process identifiers to extract context values
	contextValues := make(map[string]interface{})
	for _, identifier := range target.Identifiers {
		if value, exists := payload.RowData[identifier.FieldName]; exists {
			contextKey := identifier.ContextKey
			if contextKey == "" {
				contextKey = identifier.Type // Default to type name
			}
			contextValues[contextKey] = value
		}
	}

	// Resolve facet name - handle special <latest> value
	facetName := target.Facet
	if facetName == "<latest>" {
		// Get the last visited facet for the target view from preferences
		lastFacet := a.GetLastFacet(target.View)
		if lastFacet == "" {
			// If no preference exists, get the first available facet from the target view
			fallbackFacet, err := a.getFirstAvailableFacet(target.View)
			if err != nil {
				return fmt.Errorf("no last visited facet found for view '%s' and fallback failed: %v", target.View, err)
			}
			facetName = fallbackFacet
		} else {
			facetName = lastFacet
		}
	}

	// Update payload with resolved target information and processed context
	payload.Collection = target.View
	payload.DataFacet = types.DataFacet(facetName)
	payload.ContextValues = contextValues

	// Emit the complete RowActionPayload with processed context values
	msgs.EmitRowAction(payload)
	return nil
}

// getFirstAvailableFacet returns the first enabled facet for a given view
func (a *App) getFirstAvailableFacet(viewName string) (string, error) {
	// Create a dummy payload to get the view configuration
	dummyPayload := &types.Payload{Collection: viewName}
	collection := a.getCollection(dummyPayload, true)
	if collection == nil {
		return "", fmt.Errorf("view '%s' not found", viewName)
	}

	config, err := collection.GetConfig()
	if err != nil {
		return "", fmt.Errorf("failed to get config for view '%s': %v", viewName, err)
	}

	// Find the first enabled facet in the configured order
	for _, facetKey := range config.FacetOrder {
		if facetConfig, exists := config.Facets[facetKey]; exists && !facetConfig.Disabled {
			return facetKey, nil
		}
	}

	// If no facets in order, try any enabled facet
	for facetKey, facetConfig := range config.Facets {
		if !facetConfig.Disabled {
			return facetKey, nil
		}
	}

	return "", fmt.Errorf("no enabled facets found in view '%s'", viewName)
}

// handleModalAction processes modal row actions (default behavior)
func (a *App) handleModalAction(payload *types.RowActionPayload) error {
	_ = payload
	// Modal actions are handled on the frontend - this is a no-op
	return nil
}

// handleCustomAction processes custom row actions
func (a *App) handleCustomAction(payload *types.RowActionPayload) error {
	// Custom actions could be implemented here based on the CustomHandler field
	// For now, return an error as this is not yet implemented
	return fmt.Errorf("custom row actions not yet implemented: %s", payload.RowAction.CustomHandler)
}
