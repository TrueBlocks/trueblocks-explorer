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
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"

	//
	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/crud"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
	// EXISTING_CODE
	// EXISTING_CODE
)

func (a *App) GetNamesPage(
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (*names.NamesPage, error) {
	collection := names.GetNamesCollection(payload)
	ret, err := getCollectionPage[*names.NamesPage](collection, payload, first, pageSize, sort, filter)
	// EXISTING_CODE
	// EXISTING_CODE
	return ret, err
}

func (a *App) NamesCrud(
	payload *types.Payload,
	op crud.Operation,
	item *any,
) error {
	collection := names.GetNamesCollection(payload)
	return collection.Crud(payload, op, item)
}

func (a *App) GetNamesSummary(payload *types.Payload) types.Summary {
	collection := names.GetNamesCollection(payload)
	return collection.GetSummary()
}

func (a *App) ReloadNames(payload *types.Payload) error {
	collection := names.GetNamesCollection(payload)
	collection.Reset(payload.DataFacet)
	collection.FetchByFacet(payload.DataFacet)
	return nil
}

// GetNamesConfig returns the view configuration for names
func (a *App) GetNamesConfig(payload types.Payload) (*types.ViewConfig, error) {
	collection := names.GetNamesCollection(&payload)
	return collection.GetConfig()
}

// GetNamesBuckets returns bucket visualization data for names
func (a *App) GetNamesBuckets(payload *types.Payload) (*types.Buckets, error) {
	collection := names.GetNamesCollection(payload)
	return collection.GetBuckets(payload)
}

// EXISTING_CODE
// EXISTING_CODE
