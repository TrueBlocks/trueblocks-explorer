// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
package app

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/utils"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// ExportData handles export requests with full context logging and CSV creation
func (a *App) ExportData(payload *types.Payload) error {
	activeProject := a.Projects.GetActiveProject()
	if activeProject == nil {
		err := fmt.Errorf("no active project")
		msgs.EmitError("export failed: no active project", err)
		return err
	}
	payload.ProjectPath = activeProject.Path

	collection := getCollection(payload, false)
	if collection == nil {
		err := fmt.Errorf("[ExportData] unsupported collection type: %s", payload.Collection)
		msgs.EmitError("unsupported collection type", err)
		return err
	}

	exportFilename, err := collection.ExportData(payload)
	if err != nil {
		msgs.EmitError("failed to export data", err)
		return fmt.Errorf("failed to export data: %w", err)
	}

	cmd := "open \"" + exportFilename + "\""
	exitCode := utils.System(cmd)
	if exitCode != 0 {
		logging.LogBEError(fmt.Sprintf("Failed to open export file, exit code: %d", exitCode))
	}

	statusMsg := fmt.Sprintf("Export completed: %s %s data", payload.Collection, payload.DataFacet)
	if payload.Address != "" && payload.Address != "0x0" {
		statusMsg += fmt.Sprintf(" for %s", payload.Address[:10]+"...")
	}
	if payload.Chain != "" {
		statusMsg += fmt.Sprintf(" on %s", payload.Chain)
	}
	msgs.EmitStatus(statusMsg)

	return nil
}
