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
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/comparitoor"

	//
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	// EXISTING_CODE
	// EXISTING_CODE
)

func (a *App) GetComparitoorPage(
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (*comparitoor.ComparitoorPage, error) {
	collection := comparitoor.GetComparitoorCollection(payload)
	ret, err := getCollectionPage[*comparitoor.ComparitoorPage](collection, payload, first, pageSize, sort, filter)
	// EXISTING_CODE
	// EXISTING_CODE
	return ret, err
}

func (a *App) GetComparitoorSummary(payload *types.Payload) types.Summary {
	collection := comparitoor.GetComparitoorCollection(payload)
	return collection.GetSummary()
}

func (a *App) ReloadComparitoor(payload *types.Payload) error {
	collection := comparitoor.GetComparitoorCollection(payload)
	collection.Reset(payload.DataFacet)
	collection.FetchByFacet(payload.DataFacet)
	return nil
}

// GetComparitoorConfig returns the view configuration for comparitoor
func (a *App) GetComparitoorConfig(payload types.Payload) (*types.ViewConfig, error) {
	collection := comparitoor.GetComparitoorCollection(&payload)
	return collection.GetConfig()
}

// GetComparitoorBuckets returns bucket visualization data for comparitoor
func (a *App) GetComparitoorBuckets(payload *types.Payload) (*types.Buckets, error) {
	collection := comparitoor.GetComparitoorCollection(payload)
	return collection.GetBuckets(payload)
}

// EXISTING_CODE
// EXISTING_CODE
