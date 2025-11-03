package app

import (
	"encoding/hex"
	"flag"
	"fmt"
	"path/filepath"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/markdown"

	coreTypes "github.com/TrueBlocks/trueblocks-chifra/v6/pkg/types"
	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/utils"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

// LogFrontend logs a message to the frontend logger
func (a *App) LogFrontend(msg string) {
	logging.LogFrontend(msg)
}

// GetMarkdown loads markdown content for the specified folder, route, and tab
func (a *App) GetMarkdown(folder, route, tab string) string {
	lang := a.Preferences.App.LastLanguage
	if md, err := markdown.LoadMarkdown(a.Assets, filepath.Join("frontend", "src", "assets", folder), lang, route, tab); err != nil {
		return err.Error()
	} else {
		return md
	}
}

// GetNodeStatus retrieves blockchain node metadata for the specified chain
func (a *App) GetNodeStatus(chain string) *coreTypes.MetaData {
	defer logging.Silence()()
	// During tests, avoid invoking SDK which may terminate the process
	if flag.Lookup("test.v") != nil || flag.Lookup("test.run") != nil {
		var fallback coreTypes.MetaData
		a.meta = &fallback
		return &fallback
	}

	defer func() {
		if r := recover(); r != nil {
			a.meta = nil
		}
	}()

	md, err := sdk.GetMetaData(chain)
	if err != nil {
		a.meta = nil
		return nil
	}
	a.meta = md
	return md
}

// Encode packs function parameters into hex-encoded calldata
func (a *App) Encode(fn sdk.Function, params []interface{}) (string, error) {
	packed, err := fn.Pack(params)
	if err != nil {
		return "", fmt.Errorf("failed to pack function call: %w", err)
	}
	return "0x" + hex.EncodeToString(packed), nil
}

// GetChainList returns the list of supported blockchain chains
func (app *App) GetChainList() *utils.ChainList {
	return app.chainList
}
