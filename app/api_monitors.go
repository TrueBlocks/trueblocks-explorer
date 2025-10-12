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
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/monitors"

	//
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/crud"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	// EXISTING_CODE
	// EXISTING_CODE
)

func (a *App) GetMonitorsPage(
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (*monitors.MonitorsPage, error) {
	collection := monitors.GetMonitorsCollection(payload)
	ret, err := getCollectionPage[*monitors.MonitorsPage](collection, payload, first, pageSize, sort, filter)
	if err != nil {
		return nil, err
	}
	for i := range ret.Monitors {
		address := ret.Monitors[i].Address.Hex()
		if namePtr, ok := a.NameFromAddress(address); ok && namePtr != nil {
			ret.Monitors[i].Name = namePtr.Name
		}
	}
	return ret, nil
}

func (a *App) MonitorsCrud(
	payload *types.Payload,
	op crud.Operation,
	item *any,
) error {
	collection := monitors.GetMonitorsCollection(payload)
	return collection.Crud(payload, op, item)
}

func (a *App) GetMonitorsSummary(payload *types.Payload) types.Summary {
	collection := monitors.GetMonitorsCollection(payload)
	return collection.GetSummary()
}

func (a *App) ReloadMonitors(payload *types.Payload) error {
	collection := monitors.GetMonitorsCollection(payload)
	collection.Reset(payload.DataFacet)
	collection.LoadData(payload.DataFacet)
	return nil
}

// GetMonitorsConfig returns the view configuration for monitors
func (a *App) GetMonitorsConfig(payload types.Payload) (*types.ViewConfig, error) {
	collection := monitors.GetMonitorsCollection(&payload)
	return collection.GetConfig()
}

// GetMonitorsBuckets returns bucket visualization data for monitors
func (a *App) GetMonitorsBuckets(payload *types.Payload) (*types.Buckets, error) {
	collection := monitors.GetMonitorsCollection(payload)
	return collection.GetBuckets(payload)
}

// EXISTING_CODE
func (a *App) MonitorsClean(payload *types.Payload, addresses []string) error {
	collection := monitors.GetMonitorsCollection(payload)
	return collection.Clean(payload, addresses)
}

// EXISTING_CODE
