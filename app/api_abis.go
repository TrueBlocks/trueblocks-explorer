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
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/abis"

	//
	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/crud"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
	// EXISTING_CODE
	// EXISTING_CODE
)

func (a *App) GetAbisPage(
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (*abis.AbisPage, error) {
	collection := abis.GetAbisCollection(payload)
	ret, err := getCollectionPage[*abis.AbisPage](collection, payload, first, pageSize, sort, filter)
	// EXISTING_CODE
	if err == nil {
		for i := range ret.Abis {
			address := ret.Abis[i].Address.Hex()
			if namePtr, ok := a.NameFromAddress(address); ok && namePtr != nil {
				ret.Abis[i].Name = namePtr.Name
			}
		}
	}
	// EXISTING_CODE
	return ret, err
}

func (a *App) AbisCrud(
	payload *types.Payload,
	op crud.Operation,
	item *any,
) error {
	collection := abis.GetAbisCollection(payload)
	return collection.Crud(payload, op, item)
}

func (a *App) GetAbisSummary(payload *types.Payload) types.Summary {
	collection := abis.GetAbisCollection(payload)
	return collection.GetSummary(payload)
}

func (a *App) ReloadAbis(payload *types.Payload) error {
	collection := abis.GetAbisCollection(payload)
	collection.Reset(payload)
	collection.FetchByFacet(payload)
	return nil
}

// GetAbisConfig returns the view configuration for abis
func (a *App) GetAbisConfig(payload types.Payload) (*types.ViewConfig, error) {
	collection := abis.GetAbisCollection(&payload)
	return collection.GetConfig()
}

// GetAbisBuckets returns bucket visualization data for abis
func (a *App) GetAbisBuckets(payload *types.Payload) (*types.Buckets, error) {
	collection := abis.GetAbisCollection(payload)
	return collection.GetBuckets(payload)
}

// EXISTING_CODE
// EXISTING_CODE
