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
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/contracts"

	//
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	// EXISTING_CODE
	// EXISTING_CODE
)

func (a *App) GetContractsPage(
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (*contracts.ContractsPage, error) {
	collection := contracts.GetContractsCollection(payload)
	ret, err := getCollectionPage[*contracts.ContractsPage](collection, payload, first, pageSize, sort, filter)
	// EXISTING_CODE
	// EXISTING_CODE
	return ret, err
}

func (a *App) GetContractsSummary(payload *types.Payload) types.Summary {
	collection := contracts.GetContractsCollection(payload)
	return collection.GetSummary()
}

func (a *App) ReloadContracts(payload *types.Payload) error {
	collection := contracts.GetContractsCollection(payload)
	collection.Reset(payload.DataFacet)
	collection.FetchByFacet(payload.DataFacet)
	return nil
}

// GetContractsConfig returns the view configuration for contracts
func (a *App) GetContractsConfig(payload types.Payload) (*types.ViewConfig, error) {
	collection := contracts.GetContractsCollection(&payload)
	return collection.GetConfig()
}

// GetContractsBuckets returns bucket visualization data for contracts
func (a *App) GetContractsBuckets(payload *types.Payload) (*types.Buckets, error) {
	collection := contracts.GetContractsCollection(payload)
	return collection.GetBuckets(payload)
}

// EXISTING_CODE
// EXISTING_CODE
