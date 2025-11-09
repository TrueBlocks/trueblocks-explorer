// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package app

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/projects"

	//
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
	// EXISTING_CODE
	// EXISTING_CODE
)

func (a *App) GetProjectsPage(
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (*projects.ProjectsPage, error) {
	collection := projects.GetProjectsCollection(payload, a.Projects)
	ret, err := getCollectionPage[*projects.ProjectsPage](collection, payload, first, pageSize, sort, filter)
	// EXISTING_CODE
	// EXISTING_CODE
	return ret, err
}

func (a *App) GetProjectsSummary(payload *types.Payload) types.Summary {
	collection := projects.GetProjectsCollection(payload, a.Projects)
	return collection.GetSummary()
}

func (a *App) ReloadProjects(payload *types.Payload) error {
	collection := projects.GetProjectsCollection(payload, a.Projects)
	collection.Reset(payload.DataFacet)
	collection.FetchByFacet(payload.DataFacet)
	return nil
}

// GetProjectsConfig returns the view configuration for projects
func (a *App) GetProjectsConfig(payload types.Payload) (*types.ViewConfig, error) {
	collection := projects.GetProjectsCollection(&payload, a.Projects)
	return collection.GetConfig()
}

// GetProjectsBuckets returns bucket visualization data for projects
func (a *App) GetProjectsBuckets(payload *types.Payload) (*types.Buckets, error) {
	collection := projects.GetProjectsCollection(payload, a.Projects)
	return collection.GetBuckets(payload)
}

// EXISTING_CODE
// HandleProjectsRowAction processes row actions for the projects collection
func (a *App) HandleProjectsRowAction(payload *types.RowActionPayload) error {
	collection := projects.GetProjectsCollection(&types.Payload{
		Collection:    payload.Collection,
		DataFacet:     payload.DataFacet,
		ActiveChain:   payload.ActiveChain,
		ActiveAddress: payload.ActiveAddress, // Critical for data fetching
		ActivePeriod:  payload.ActivePeriod,
	}, a.Projects)
	return collection.HandleRowAction(payload)
}

// EXISTING_CODE
