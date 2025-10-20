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
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/exports"

	//
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	// EXISTING_CODE
	// EXISTING_CODE
)

func (a *App) GetExportsPage(
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (*exports.ExportsPage, error) {
	collection := exports.GetExportsCollection(payload)
	ret, err := getCollectionPage[*exports.ExportsPage](collection, payload, first, pageSize, sort, filter)
	// EXISTING_CODE
	// EXISTING_CODE
	return ret, err
}

func (a *App) GetExportsSummary(payload *types.Payload) types.Summary {
	collection := exports.GetExportsCollection(payload)
	return collection.GetSummary()
}

func (a *App) ReloadExports(payload *types.Payload) error {
	collection := exports.GetExportsCollection(payload)
	collection.Reset(payload.DataFacet)
	collection.FetchByFacet(payload.DataFacet)
	return nil
}

// GetExportsConfig returns the view configuration for exports
func (a *App) GetExportsConfig(payload types.Payload) (*types.ViewConfig, error) {
	collection := exports.GetExportsCollection(&payload)
	return collection.GetConfig()
}

// GetExportsBuckets returns bucket visualization data for exports
func (a *App) GetExportsBuckets(payload *types.Payload) (*types.Buckets, error) {
	collection := exports.GetExportsCollection(payload)
	return collection.GetBuckets(payload)
}

// EXISTING_CODE
// EXISTING_CODE
