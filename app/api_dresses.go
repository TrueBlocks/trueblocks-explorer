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
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/dresses"

	//
	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/crud"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"

	// EXISTING_CODE
	"fmt"

	dalle "github.com/TrueBlocks/trueblocks-dalle/v6"
	// EXISTING_CODE
)

func (a *App) GetDressesPage(
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (*dresses.DressesPage, error) {
	collection := dresses.GetDressesCollection(payload)
	ret, err := getCollectionPage[*dresses.DressesPage](collection, payload, first, pageSize, sort, filter)
	// EXISTING_CODE
	// EXISTING_CODE
	return ret, err
}

func (a *App) DressesCrud(
	payload *types.Payload,
	op crud.Operation,
	item *any,
) error {
	collection := dresses.GetDressesCollection(payload)
	return collection.Crud(payload, op, item)
}

func (a *App) GetDressesSummary(payload *types.Payload) types.Summary {
	collection := dresses.GetDressesCollection(payload)
	return collection.GetSummary()
}

func (a *App) ReloadDresses(payload *types.Payload) error {
	collection := dresses.GetDressesCollection(payload)
	collection.Reset(payload.DataFacet)
	collection.FetchByFacet(payload.DataFacet)
	return nil
}

// GetDressesConfig returns the view configuration for dresses
func (a *App) GetDressesConfig(payload types.Payload) (*types.ViewConfig, error) {
	collection := dresses.GetDressesCollection(&payload)
	return collection.GetConfig()
}

// GetDressesBuckets returns bucket visualization data for dresses
func (a *App) GetDressesBuckets(payload *types.Payload) (*types.Buckets, error) {
	collection := dresses.GetDressesCollection(payload)
	return collection.GetBuckets(payload)
}

// EXISTING_CODE
func (a *App) Speak(payload *types.Payload, series string) (string, error) {
	if payload == nil || payload.ActiveAddress == "" {
		return "", nil
	}
	if series == "" {
		series = "empty"
	}
	return dalle.Speak(series, payload.ActiveAddress)
}

func (a *App) ReadToMe(payload *types.Payload, series string) (string, error) {
	if payload == nil || payload.ActiveAddress == "" {
		return "", nil
	}
	if series == "" {
		series = "empty"
	}
	return dalle.ReadToMe(series, payload.ActiveAddress)
}

func (a *App) GetDalleAudioURL(payload *types.Payload, series string) (string, error) {
	if payload == nil || payload.ActiveAddress == "" {
		return "", nil
	}
	if series == "" {
		series = "empty"
	}
	base := ""
	if a.fileServer != nil {
		base = a.fileServer.GetBaseURL()
	}
	return dalle.AudioURL(base, series, payload.ActiveAddress)
}

func (a *App) FromTemplate(payload *types.Payload, templateStr string) (string, error) {
	if payload == nil || payload.ActiveAddress == "" {
		return "", fmt.Errorf("address is required")
	}
	if templateStr == "" {
		return "", fmt.Errorf("template string is required")
	}

	dd, err := a.Dalle.MakeDalleDress(payload.ActiveAddress)
	if err != nil {
		return "", fmt.Errorf("failed to create DalleDress: %w", err)
	}

	return dd.FromTemplate(templateStr)
}

// EXISTING_CODE
