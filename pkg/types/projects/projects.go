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
	// EXISTING_CODE
	"github.com/TrueBlocks/trueblocks-explorer/pkg/facets"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

const (
	ProjectsManage   types.DataFacet = "manage"
	ProjectsProjects types.DataFacet = "projects"
)

func init() {
	types.RegisterDataFacet(ProjectsManage)
	types.RegisterDataFacet(ProjectsProjects)
}

type ProjectsCollection struct {
	manageFacet   *facets.Facet[Project]
	projectsFacet *facets.Facet[AddressList]
	summary       types.Summary
	summaryMutex  sync.RWMutex
}

func NewProjectsCollection(payload *types.Payload) *ProjectsCollection {
	c := &ProjectsCollection{}
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

	c.projectsFacet = facets.NewFacet(
		ProjectsProjects,
		isProject,
		isDupAddressList(),
		c.getAddressListStore(payload, ProjectsProjects),
		"projects",
		c,
		false,
	)
}

func isManage(item *Project) bool {
	// EXISTING_CODE
	// EXISTING_CODE
}

func isProject(item *AddressList) bool {
	// EXISTING_CODE
	// EXISTING_CODE
}

func isDupAddressList() func(existing []*AddressList, newItem *AddressList) bool {
	// EXISTING_CODE
	// EXISTING_CODE
}

func isDupProject() func(existing []*Project, newItem *Project) bool {
	// EXISTING_CODE
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
		case ProjectsProjects:
			if err := c.projectsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		default:
			logging.LogError("LoadData: unexpected dataFacet: %v", fmt.Errorf("invalid dataFacet: %s", dataFacet), nil)
			return
		}
	}()
}

func (c *ProjectsCollection) Reset(dataFacet types.DataFacet) {
	switch dataFacet {
	case ProjectsManage:
		c.manageFacet.Reset()
	case ProjectsProjects:
		c.projectsFacet.Reset()
	default:
		return
	}
}

func (c *ProjectsCollection) NeedsUpdate(dataFacet types.DataFacet) bool {
	switch dataFacet {
	case ProjectsManage:
		return c.manageFacet.NeedsUpdate()
	case ProjectsProjects:
		return c.projectsFacet.NeedsUpdate()
	default:
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
	case ProjectsProjects:
		return c.projectsFacet.ExportData(payload, string(ProjectsProjects))
	default:
		return "", fmt.Errorf("[ExportData] unsupported projects facet: %s", payload.DataFacet)
	}
}

func (c *ProjectsCollection) ChangeVisibility(payload *types.Payload) error {
	return nil
}

// EXISTING_CODE
// EXISTING_CODE
