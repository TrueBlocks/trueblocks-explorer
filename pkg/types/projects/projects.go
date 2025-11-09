// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package projects

import (
	"fmt"
	"sync"
	"time"

	// EXISTING_CODE
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"
	// EXISTING_CODE
	"github.com/TrueBlocks/trueblocks-explorer/pkg/facets"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

const (
	ProjectsManage types.DataFacet = "manage"
)

func init() {
	types.RegisterDataFacet(ProjectsManage)
}

type ProjectsCollection struct {
	manageFacet      *facets.Facet[Project]
	projectFacets    map[string]*facets.Facet[AddressList]
	projectManager   *project.Manager
	registeredFacets map[string]bool // Track dynamically registered facets
	summary          types.Summary
	summaryMutex     sync.RWMutex
}

func NewProjectsCollection(payload *types.Payload, projectManager *project.Manager) *ProjectsCollection {
	c := &ProjectsCollection{
		projectManager:   projectManager,
		projectFacets:    make(map[string]*facets.Facet[AddressList]),
		registeredFacets: make(map[string]bool),
	}
	c.ResetSummary()
	c.initializeFacets(payload)
	c.registerDynamicFacets()
	return c
}

func (c *ProjectsCollection) initializeFacets(payload *types.Payload) {
	c.manageFacet = facets.NewFacet(
		ProjectsManage,
		isManage,
		isDupProject(),
		c.getProjectsStore(payload, ProjectsManage),
		"projects",
		c,
		false,
	)
}

func isManage(item *Project) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isProject(item *AddressList) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isDupAddressList() func(existing []*AddressList, newItem *AddressList) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupProject() func(existing []*Project, newItem *Project) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func (c *ProjectsCollection) FetchByFacet(dataFacet types.DataFacet) {
	if !c.NeedsUpdate(dataFacet) {
		return
	}

	go func() {
		switch dataFacet {
		case ProjectsManage:
			if err := c.manageFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		default:
			// Check if this is a dynamic project facet
			projectID := string(dataFacet)
			if c.registeredFacets[projectID] {
				// Ensure the project facet exists
				c.ensureProjectFacet(projectID)
				if projectFacet, exists := c.projectFacets[projectID]; exists {
					if err := projectFacet.FetchFacet(); err != nil {
						logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
					}
				}
			} else {
				// Silently ignore requests for unregistered project facets
				// This is normal when a project has been closed but there are still pending data requests
				return
			}
			return
		}
	}()
}

func (c *ProjectsCollection) Reset(dataFacet types.DataFacet) {
	switch dataFacet {
	case ProjectsManage:
		c.manageFacet.Reset()
	default:
		// Check if this is a dynamic project facet
		projectID := string(dataFacet)
		if c.registeredFacets[projectID] {
			if projectFacet, exists := c.projectFacets[projectID]; exists {
				projectFacet.Reset()
			}
		}
		return
	}
}

func (c *ProjectsCollection) NeedsUpdate(dataFacet types.DataFacet) bool {
	switch dataFacet {
	case ProjectsManage:
		return c.manageFacet.NeedsUpdate()
	default:
		// Check if this is a dynamic project facet
		projectID := string(dataFacet)
		if c.registeredFacets[projectID] {
			if projectFacet, exists := c.projectFacets[projectID]; exists {
				return projectFacet.NeedsUpdate()
			}
		}
		return false
	}
}

func (c *ProjectsCollection) AccumulateItem(item interface{}, summary *types.Summary) {
	// EXISTING_CODE
	// EXISTING_CODE
}

func (c *ProjectsCollection) GetSummary() types.Summary {
	c.summaryMutex.RLock()
	defer c.summaryMutex.RUnlock()

	summary := c.summary
	summary.FacetCounts = make(map[types.DataFacet]int)
	for k, v := range c.summary.FacetCounts {
		summary.FacetCounts[k] = v
	}

	if c.summary.CustomData != nil {
		summary.CustomData = make(map[string]interface{})
		for k, v := range c.summary.CustomData {
			summary.CustomData[k] = v
		}
	}

	return summary
}

func (c *ProjectsCollection) ResetSummary() {
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()
	c.summary = types.Summary{
		TotalCount:  0,
		FacetCounts: make(map[types.DataFacet]int),
		CustomData:  make(map[string]interface{}),
		LastUpdated: time.Now().Unix(),
	}
}

func (c *ProjectsCollection) ExportData(payload *types.Payload) (string, error) {
	switch payload.DataFacet {
	case ProjectsManage:
		return c.manageFacet.ExportData(payload, string(ProjectsManage))
	default:
		return "", fmt.Errorf("[ExportData] unsupported projects facet: %s", payload.DataFacet)
	}
}

func (c *ProjectsCollection) ChangeVisibility(payload *types.Payload) error {
	logging.LogBackend(fmt.Sprintf("ChangeVisibility called for facet: %s", payload.DataFacet))

	// Static facets (like "manage") can't be closed
	if payload.DataFacet == ProjectsManage {
		logging.LogBackend("Ignoring close request for manage facet")
		return nil // Ignore attempts to close the manage tab
	}

	// For project facets, the DataFacet should be the project ID
	projectID := string(payload.DataFacet)
	logging.LogBackend(fmt.Sprintf("Attempting to close project: %s", projectID))

	// Close the project using the stored project manager
	if c.projectManager == nil {
		logging.LogError("Project manager not available", fmt.Errorf("project manager is nil"))
		return fmt.Errorf("project manager not available")
	}

	// Close the project first, then unregister the facet
	logging.LogBackend(fmt.Sprintf("Calling project manager Close for: %s", projectID))
	if err := c.projectManager.Close(projectID); err != nil {
		logging.LogError(fmt.Sprintf("Failed to close project %s", projectID), err)
		return fmt.Errorf("failed to close project %s: %w", projectID, err)
	}

	// Unregister the project facet after closing
	logging.LogBackend(fmt.Sprintf("Unregistering project facet: %s", projectID))
	c.unregisterProjectFacet(projectID)

	// The project manager will emit PROJECT_CLOSED events automatically
	logging.LogBackend(fmt.Sprintf("Project close completed: %s", projectID))
	return nil
}

// EXISTING_CODE
func (c *ProjectsCollection) matchesManageFilter(item *Project, filter string) bool {
	_ = item
	_ = filter
	return true
}

func (c *ProjectsCollection) matchesProjectFilter(item *AddressList, filter string) bool {
	_ = item
	_ = filter
	return true
}

// registerDynamicFacets registers facets for currently open projects
func (c *ProjectsCollection) registerDynamicFacets() {
	if c.projectManager == nil {
		return
	}

	openProjectIDs := c.projectManager.GetOpenIDs()
	for _, projectID := range openProjectIDs {
		c.registerProjectFacet(projectID)
	}
}

// registerProjectFacet registers a single project as a DataFacet
func (c *ProjectsCollection) registerProjectFacet(projectID string) {
	if c.registeredFacets[projectID] {
		return // Already registered
	}

	// Register the project ID as a valid DataFacet
	types.RegisterDataFacet(types.DataFacet(projectID))
	c.registeredFacets[projectID] = true
}

// unregisterProjectFacet removes a project facet when project is closed
func (c *ProjectsCollection) unregisterProjectFacet(projectID string) {
	if !c.registeredFacets[projectID] {
		return // Not registered
	}

	// Remove from our tracking
	delete(c.registeredFacets, projectID)
	delete(c.projectFacets, projectID)

	// Note: We don't remove from types.RegisterDataFacet because it doesn't have an unregister method
	// This is okay - the facet just won't be available in GetConfig() anymore
}

// OnProjectClosed should be called when a project is closed to clean up its facet
func (c *ProjectsCollection) OnProjectClosed(projectID string) {
	c.unregisterProjectFacet(projectID)
}

// ensureProjectFacet creates a project facet if it doesn't exist
func (c *ProjectsCollection) ensureProjectFacet(projectID string) {
	if _, exists := c.projectFacets[projectID]; exists {
		return // Already exists
	}

	// Create a new facet for this project
	c.projectFacets[projectID] = facets.NewFacet(
		types.DataFacet(projectID),
		isProject,
		isDupAddressList(),
		c.getAddressListStore(projectID),
		"projects",
		c,
		false,
	)
}

// EXISTING_CODE
