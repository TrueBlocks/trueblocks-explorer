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
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/status"

	//
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	// EXISTING_CODE
	// EXISTING_CODE
)

func (a *App) GetStatusPage(
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (*status.StatusPage, error) {
	collection := status.GetStatusCollection(payload)
	return getCollectionPage[*status.StatusPage](collection, payload, first, pageSize, sort, filter)
}

func (a *App) GetStatusSummary(payload *types.Payload) types.Summary {
	collection := status.GetStatusCollection(payload)
	return collection.GetSummary()
}

func (a *App) ReloadStatus(payload *types.Payload) error {
	collection := status.GetStatusCollection(payload)
	collection.Reset(payload.DataFacet)
	collection.LoadData(payload.DataFacet)
	return nil
}

// GetStatusConfig returns the view configuration for status
func (a *App) GetStatusConfig(payload types.Payload) (*types.ViewConfig, error) {
	collection := status.GetStatusCollection(&payload)
	return collection.GetConfig()
}

// EXISTING_CODE
// EXISTING_CODE
