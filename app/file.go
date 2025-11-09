package app

import (
	"errors"
	"os"
	"path/filepath"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/file"
	"github.com/wailsapp/wails/v2/pkg/menu"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

// FileNew opens the project selection dialog while keeping current project active
func (a *App) FileNew(_ *menu.CallbackData) {
	msgs.EmitProjectModal("show_project_modal")
	msgs.EmitStatus("new project dialog opened")
}

// FileOpen opens the file picker to select a project file directly
func (a *App) FileOpen(_ *menu.CallbackData) {
	var defaultDirectory string
	if recentPath := a.GetActiveProjectPath(); recentPath != "" {
		defaultDirectory = filepath.Dir(recentPath)
	}

	selectedPath, err := wailsRuntime.OpenFileDialog(a.ctx, wailsRuntime.OpenDialogOptions{
		Title:            "Open Project File",
		DefaultDirectory: defaultDirectory,
		Filters: []wailsRuntime.FileFilter{
			{
				DisplayName: "Project Files (*.tbx)",
				Pattern:     "*.tbx",
			},
		},
	})

	if err != nil {
		msgs.EmitError("file picker error", err)
		return
	}

	if selectedPath == "" {
		msgs.EmitStatus("file open canceled")
		return
	}

	if err := a.OpenProjectFile(selectedPath); err != nil {
		msgs.EmitError("failed to open project", err)
		return
	}

	msgs.EmitStatus("project opened successfully")
}

// FileSave saves the active project to its current file path
func (a *App) FileSave(_ *menu.CallbackData) {
	if err := a.SaveProject(); err != nil {
		msgs.EmitError("save failed", err)
		return
	}
	msgs.EmitStatus("file saved")
}

// FileSaveAs opens a save dialog and saves the project to a new file path
func (a *App) FileSaveAs(_ *menu.CallbackData) {
	path, err := wailsRuntime.SaveFileDialog(a.ctx, wailsRuntime.SaveDialogOptions{
		Title: "Save Project As",
		Filters: []wailsRuntime.FileFilter{
			{
				DisplayName: "Project Files (*.tbx)",
				Pattern:     "*.tbx",
			},
		},
	})
	if err != nil || path == "" {
		msgs.EmitStatus("save As canceled")
		return
	}

	if err := a.fileSaveAs(path, true); err != nil {
		msgs.EmitError("save As failed", err)
		return
	}

	msgs.EmitStatus("file saved as")
}

// FileQuit shuts down the application after saving if needed
func (a *App) FileQuit(_ *menu.CallbackData) {
	msgs.EmitStatus("quitting application")
	os.Exit(0)
}

// Generic errors
var ErrEmptyFilePath = errors.New("empty file path")
var ErrUnsavedChanges = errors.New("unsaved changes")
var ErrFileNotFound = errors.New("file not found")
var ErrOverwriteNotConfirmed = errors.New("file exists, overwrite not confirmed")

// File operation errors
var ErrReadFileFailed = errors.New("failed to read file")
var ErrWriteFileFailed = errors.New("failed to write file")
var ErrSerializeFailed = errors.New("failed to serialize data")
var ErrDeserializeFailed = errors.New("failed to deserialize data")

// fileNew creates a new project with the given address and default settings
func (a *App) fileNew(address base.Address) error {
	a.Projects.NewProject(a.uniqueProjectName("New Project"), address, []string{"mainnet"})
	a.updateRecentProjects()
	return nil
}

// fileSave saves the active project to its current file path
func (a *App) fileSave() error {
	project := a.GetActiveProject()
	if project == nil {
		return errors.New("no active project")
	}

	projectPath := project.GetPath()
	needsSaveAs := projectPath == "" || strings.Contains(filepath.Base(projectPath), "Unknown")
	if needsSaveAs {
		return ErrEmptyFilePath
	}

	if err := a.Projects.SaveActive(); err != nil {
		return err
	}

	a.updateRecentProjects()
	return nil
}

// fileSaveAs saves the active project to a new file path with overwrite handling
func (a *App) fileSaveAs(newPath string, overwriteConfirmed bool) error {
	project := a.GetActiveProject()
	if project == nil {
		return errors.New("no active project")
	}

	if newPath == "" {
		return ErrEmptyFilePath
	}

	if file.FileExists(newPath) && !overwriteConfirmed {
		return ErrOverwriteNotConfirmed
	}

	if err := a.Projects.SaveActiveAs(newPath); err != nil {
		return err
	}

	a.updateRecentProjects()
	return nil
}

// fileOpen opens a project file from the specified path
func (a *App) fileOpen(path string) error {
	if path == "" {
		return ErrEmptyFilePath
	}

	if _, err := os.Stat(path); os.IsNotExist(err) {
		return ErrFileNotFound
	}

	_, err := a.Projects.Open(path)
	if err != nil {
		return err
	}

	a.SetActiveProjectPath(path)
	a.updateRecentProjects()
	return nil
}
