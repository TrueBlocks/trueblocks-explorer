// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
package main

import (
	"embed"
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/app"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/abis"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/chunks"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/comparitoor"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/contracts"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/dresses"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/exports"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/monitors"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/names"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/status"
	//
	"github.com/wailsapp/wails/v2"
	wLogger "github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed frontend/dist/* frontend/src/assets/help/* frontend/src/assets/views/* wails.json
var assets embed.FS

func main() {
	preferences.LoadIdentifiers(assets)
	a, menu := app.NewApp(assets)

	opts := options.App{
		Title:         preferences.GetAppId().AppName,
		Width:         1024,
		Height:        768,
		Menu:          menu,
		StartHidden:   true,
		OnStartup:     a.Startup,
		OnDomReady:    a.DomReady,
		OnBeforeClose: a.BeforeClose,
		LogLevel:      wLogger.INFO,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		Bind: []interface{}{
			a,
			&project.Project{},
			&exports.ExportsCollection{},
			&monitors.MonitorsCollection{},
			&abis.AbisCollection{},
			&names.NamesCollection{},
			&chunks.ChunksCollection{},
			&contracts.ContractsCollection{},
			&status.StatusCollection{},
			&dresses.DalleDressCollection{},
			&comparitoor.ComparitoorCollection{},
		},
		EnumBind: []interface{}{
			msgs.AllMessages,
			types.AllDataFacets,
			types.AllCruds,
			types.AllStates,
		},
	}

	if err := wails.Run(&opts); err != nil {
		fmt.Println("Error:", err.Error())
	}
}
