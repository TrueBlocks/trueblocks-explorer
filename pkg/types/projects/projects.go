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
	"github.com/TrueBlocks/trueblocks-explorer/pkg/manager"
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
	manageFacet     *facets.Facet[Project]
	projectsFacets  map[string]*facets.Facet[AddressList]
	projectsManager *manager.Manager[*project.Project]
	summary         types.Summary
	summaryMutex    sync.RWMutex
}

func NewProjectsCollection(payload *types.Payload, projectsManager *manager.Manager[*project.Project]) *ProjectsCollection {
	c := &ProjectsCollection{
		projectsManager: projectsManager,
		projectsFacets:  make(map[string]*facets.Facet[AddressList]),
	}
	c.ResetSummary()
	c.initializeFacets(payload)
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

	if c.projectsManager != nil {
		openIDs := c.projectsManager.GetOpenIDs()
		for _, id := range openIDs {
			types.RegisterDataFacet(types.DataFacet(id))
		}
	}
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

func (c *ProjectsCollection) FetchByFacet(payload *types.Payload) {
	dataFacet := payload.DataFacet
	if !c.NeedsUpdate(payload) {
		return
	}

	go func() {
		switch dataFacet {
		case ProjectsManage:
			if err := c.manageFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		default:
			id := string(dataFacet)
			if _, exists := c.projectsFacets[id]; exists {
				payload := types.Payload{DataFacet: types.DataFacet(id)}
				c.ensureProjectFacet(&payload)
				if facet, exists := c.projectsFacets[id]; exists {
					if err := facet.FetchFacet(); err != nil {
						logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
					}
				}
			} else {
				// Silently ignore requests for unknown facets. This is normal
				// when a facet has been closed but there are still pending data requests
				return
			}
		}
	}()
}

func (c *ProjectsCollection) Reset(payload *types.Payload) {
	switch payload.DataFacet {
	case ProjectsManage:
		c.manageFacet.Reset()
	default:
		id := string(payload.DataFacet)
		if facet, exists := c.projectsFacets[id]; exists {
			facet.Reset()
		}
		return
	}
}

func (c *ProjectsCollection) NeedsUpdate(payload *types.Payload) bool {
	switch payload.DataFacet {
	case ProjectsManage:
		return c.manageFacet.NeedsUpdate()
	default:
		id := string(payload.DataFacet)
		if facet, exists := c.projectsFacets[id]; exists {
			return facet.NeedsUpdate()
		}
		return false
	}
}

func (c *ProjectsCollection) AccumulateItem(item interface{}, summary *types.Summary) {
	// EXISTING_CODE
	// EXISTING_CODE
}

func (c *ProjectsCollection) GetSummary(payload *types.Payload) types.Summary {
	_ = payload // delint
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
		// TODO: Export dynamic facet data
		return "", fmt.Errorf("[ExportData] unsupported projects facet: %s", payload.DataFacet)
	}
}

func (c *ProjectsCollection) ChangeVisibility(payload *types.Payload) error {
	// EXISTING_CODE
	if payload.DataFacet == ProjectsManage {
		return nil
	}
	// EXISTING_CODE
	id := string(payload.DataFacet)
	if c.projectsManager == nil {
		return fmt.Errorf("item manager not available")
	}

	if err := c.projectsManager.Close(id); err != nil {
		return fmt.Errorf("failed to close item %s: %w", id, err)
	}

	delete(c.projectsFacets, id)
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

// OnProjectClosed should be called when a project is closed to clean up its facet
func (c *ProjectsCollection) OnProjectClosed(id string) {
	delete(c.projectsFacets, id)
}

// ensureProjectFacet creates a project facet if it doesn't exist
func (c *ProjectsCollection) ensureProjectFacet(payload *types.Payload) {
	id := string(payload.DataFacet)
	if _, exists := c.projectsFacets[id]; exists {
		return // Already exists
	}

	// Create a new facet for this project
	c.projectsFacets[id] = facets.NewFacet(
		types.DataFacet(id),
		isProject,
		isDupAddressList(),
		c.getAddressListStore(payload),
		"projects",
		c,
		false,
	)
}

// HandleRowAction processes row actions for project addresses (navigation to exports view)
func (c *ProjectsCollection) HandleRowAction(payload *types.RowActionPayload) error {
	// For projects, the row action simply passes through the address context
	// The navigation to exports view with the last opened facet will be handled
	// by the general navigation system. The address from the project will be
	// used to set the active address context for the exports view.
	return nil
}

// EXISTING_CODE
