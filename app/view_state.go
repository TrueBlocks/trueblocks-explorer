package app

import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// GetLastView returns the last visited view/route in the active project.
func (a *App) GetLastView() string {
	if active := a.GetActiveProject(); active != nil {
		return active.GetLastView()
	}
	return ""
}

// SetLastView sets the last visited view/route in the active project
func (a *App) SetLastView(view string) (string, error) {
	if active := a.GetActiveProject(); active != nil {
		cleanView := strings.Trim(view, "/")
		err := active.SetLastView(view)
		return cleanView, err
	}
	return "", fmt.Errorf("no active project")
}

// SetLastFacet sets the last visited facet for a specific view in the active project
func (a *App) SetLastFacet(view, facet string) (string, error) {
	if active := a.GetActiveProject(); active != nil {
		cleanView := strings.Trim(view, "/")
		err := active.SetLastFacet(view, facet)
		return cleanView, err
	}
	return "", fmt.Errorf("no active project")
}

// SetViewAndFacet atomically sets both the last view and facet in a single operation
func (a *App) SetViewAndFacet(view, facet string) (string, error) {
	if active := a.GetActiveProject(); active != nil {
		cleanView := strings.Trim(view, "/")
		err := active.SetViewAndFacet(view, facet)
		return cleanView, err
	}
	return "", fmt.Errorf("no active project")
}

// GetLastFacet returns the last visited facet for a specific view from the active project
func (a *App) GetLastFacet(view string) string {
	if active := a.GetActiveProject(); active != nil {
		return active.GetLastFacet(view)
	}
	return ""
}

// GetViewFacetState retrieves view facet state for a given key from the active project
func (a *App) GetViewFacetState(key project.ViewStateKey) (project.ViewFacetState, error) {
	if active := a.GetActiveProject(); active != nil {
		if state, exists := active.GetViewFacetState(key); exists {
			return state, nil
		}
	}
	return project.ViewFacetState{}, fmt.Errorf("no active project")
}

// SetViewFacetState sets view facet state for a given key in the active project
func (a *App) SetViewFacetState(key project.ViewStateKey, state project.ViewFacetState) error {
	if active := a.GetActiveProject(); active != nil {
		return active.SetViewFacetState(key, state)
	}
	return fmt.Errorf("no active project")
}

// ClearViewFacetState removes view facet state for a given key from the active project
func (a *App) ClearViewFacetState(key project.ViewStateKey) error {
	if active := a.GetActiveProject(); active != nil {
		return active.ClearViewFacetState(key)
	}
	return fmt.Errorf("no active project")
}

// GetWizardReturn returns the last view without the "wizard" suffix
func (a *App) GetWizardReturn() string {
	return strings.ReplaceAll(a.GetLastView(), "wizard", "")
}

// GetProjectViewState retrieves all view facet states for a given view name from the active project
func (a *App) GetProjectViewState(viewName string) (map[string]project.ViewFacetState, error) {
	if active := a.GetActiveProject(); active != nil {
		return active.GetViewStates(viewName), nil
	}
	return nil, fmt.Errorf("no active project")
}

// SetProjectViewState sets all view facet states for a given view name in the active project
func (a *App) SetProjectViewState(viewName string, states map[string]project.ViewFacetState) error {
	if active := a.GetActiveProject(); active != nil {
		return active.SetViewStates(viewName, states)
	}
	return fmt.Errorf("no active project")
}

// SetActiveChain sets the active chain in the active project
func (a *App) SetActiveChain(chain string) error {
	if active := a.GetActiveProject(); active != nil {
		err := active.SetActiveChain(chain)
		if err == nil {
			msgs.EmitManager("active_chain_changed")
		}
		return err
	}
	return fmt.Errorf("no active project")
}

// ------------------------------------------------------------------------------------
// SetActivePeriod sets the active period in the active project
func (a *App) SetActivePeriod(period types.Period) error {
	if active := a.GetActiveProject(); active != nil {
		err := active.SetActivePeriod(period)
		if err == nil {
			msgs.EmitManager("active_period_changed")
		}
		return err
	}
	return fmt.Errorf("no active project")
}
