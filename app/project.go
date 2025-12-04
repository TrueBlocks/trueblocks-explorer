package app

import (
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
)

// NewProject creates a new project with the given name and addresses
func (a *App) NewProject(name string, currentAddress string) error {
	newProject := a.Projects.Create(name, func() *project.Project {
		return project.NewProject(name, base.ZeroAddr, []string{"mainnet"})
	})
	if newProject == nil {
		return fmt.Errorf("failed to create project")
	}

	if currentAddress != "" {
		if err := a.AddAddressesToProject(currentAddress); err != nil {
			return fmt.Errorf("failed to add currentAddress to project: %w", err)
		}
	}

	// Add new project to LastProjects if it has a path (will be added on save if no path yet)
	if projectPath := newProject.GetPath(); projectPath != "" {
		a.addProjectToLastProjects(projectPath)
		a.setActiveProject(projectPath)

		// Save preferences to persist the new project
		if err := a.SetAppPreferences(&a.Preferences.App); err != nil {
			msgs.EmitError("Failed to save preferences after creating project", err)
		}
	}

	// Emit event for frontend synchronization (after everything is complete)
	msgs.EmitManager("project_created")
	return nil
}

// OpenProjectFile opens a project file, optionally showing file picker if no path provided
func (a *App) OpenProjectFile(path string) error {
	if path == "" {
		// Trigger file picker
		selectedPath, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
			Title: "Open Project File",
			Filters: []runtime.FileFilter{
				{
					DisplayName: "Project Files (*.tbx)",
					Pattern:     "*.tbx",
				},
			},
		})
		if err != nil || selectedPath == "" {
			return fmt.Errorf("no file selected")
		}
		path = selectedPath
	}

	if err := a.fileOpen(path); err != nil {
		return err
	}

	// Get the opened project to restore full context
	active := a.GetActiveProject()
	if active == nil {
		return fmt.Errorf("failed to get active project after opening")
	}

	// Add project to LastProjects array (for session restoration)
	a.addProjectToLastProjects(path)

	// Get the active project ID from the manager
	activeProjectID := a.Projects.ActiveID
	if activeProjectID == "" {
		return fmt.Errorf("no active project ID available")
	}

	// Trigger analytical state restoration by restoring project context
	if err := a.RestoreProjectContext(activeProjectID); err != nil {
		return fmt.Errorf("failed to restore project context: %w", err)
	}

	// Emit project opened event for frontend navigation and pagination reset
	lastView := active.GetLastView()
	if lastView == "" {
		lastView = "/" // Default to home if no last view
	}
	msgs.EmitProjectOpened(lastView, map[string]interface{}{
		"projectId":     activeProjectID,
		"projectName":   active.GetName(),
		"activeAddress": active.GetActiveAddress().String(),
		"activeChain":   active.GetActiveChain(),
	})

	msgs.EmitStatus(fmt.Sprintf("project opened: %s - restoring context", active.GetName()))
	return nil
}

// SaveProject saves the active project, showing file dialog if not previously saved
func (a *App) SaveProject() error {
	project := a.GetActiveProject()
	if project == nil {
		return fmt.Errorf("no active project")
	}

	if project.GetPath() == "" {
		// Project hasn't been saved before, need to use SaveAs with file dialog
		path, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
			Title: "Save Project",
			Filters: []runtime.FileFilter{
				{
					DisplayName: "Project Files (*.tbx)",
					Pattern:     "*.tbx",
				},
			},
			DefaultFilename: project.GetName() + ".tbx",
		})
		if err != nil {
			return fmt.Errorf("file dialog error: %w", err)
		}
		if path == "" {
			return fmt.Errorf("save canceled")
		}

		if err := a.Projects.SaveActiveAs(path); err != nil {
			return err
		}

		// Add newly saved project to LastProjects (now it has a path)
		a.addProjectToLastProjects(path)
		a.setActiveProject(path)

		// Save preferences to persist the new project
		if err := a.SetAppPreferences(&a.Preferences.App); err != nil {
			msgs.EmitError("Failed to save preferences after saving project", err)
		}
	} else {
		// Project has a path, use normal save
		if err := a.Projects.SaveActive(); err != nil {
			return err
		}
	}

	a.updateRecentProjects()
	msgs.EmitStatus(fmt.Sprintf("project saved: %s", project.GetName()))
	return nil
}

// HasActiveProject checks if there is an active project loaded
func (a *App) HasActiveProject() bool {
	if a.Projects == nil {
		return false
	}
	return a.Projects.ActiveID != "" && a.GetActiveProject() != nil
}

// ValidateActiveProject checks if active project has valid addresses configured
func (a *App) ValidateActiveProject() bool {
	if !a.HasActiveProject() {
		return false
	}

	project := a.GetActiveProject()
	if project == nil {
		return false
	}

	// Check if project has at least one address and a valid current address
	addresses := project.GetAddresses()
	activeAddr := project.GetActiveAddress()
	return len(addresses) > 0 && activeAddr != base.ZeroAddr
}

// ClearActiveProject clears the active project
func (a *App) ClearActiveProject() error {
	if !a.HasActiveProject() {
		return nil
	}

	project := a.GetActiveProject()
	if project == nil {
		a.Projects.ActiveID = ""
		return nil
	}

	a.Projects.ActiveID = ""
	msgs.EmitManager("active_project_cleared")
	return nil
}

// GetOpenProjects returns a list of all open projects with their metadata
func (a *App) GetOpenProjects() []map[string]interface{} {
	projectIDs := a.Projects.GetOpenIDs()
	result := make([]map[string]interface{}, 0, len(projectIDs))

	for _, id := range projectIDs {
		project, ok := a.Projects.GetItemByID(id)
		if !ok {
			continue
		}

		// Convert addresses to string slice for frontend consumption
		addresses := make([]string, 0, len(project.GetAddresses()))
		for _, addr := range project.GetAddresses() {
			addresses = append(addresses, addr.Hex())
		}

		projectInfo := map[string]interface{}{
			"id":         id,
			"name":       project.GetName(),
			"path":       project.GetPath(),
			"isActive":   id == a.Projects.ActiveID,
			"lastOpened": project.LastOpened,
			"addresses":  addresses,
			"chains":     project.GetChains(),
		}

		result = append(result, projectInfo)
	}

	return result
}

func (a *App) GetActiveProject() *project.Project {
	project, ok := a.Projects.GetActiveItem()
	if !ok {
		return nil
	}
	return project
}

// GetActiveProjectData returns all active project state in a single call
func (a *App) GetActiveProjectData() *types.ProjectPayload {
	project := a.GetActiveProject()
	if project == nil {
		return &types.ProjectPayload{
			HasProject:     false,
			ActiveChain:    "",
			ActiveAddress:  "",
			ActiveContract: "",
			ActivePeriod:   "",
			LastView:       "",
			LastFacetMap:   make(map[string]types.DataFacet),
		}
	}

	// Get the active address as string, converting 0x0 to empty string
	activeAddr := project.GetActiveAddress()
	activeAddrStr := ""
	if activeAddr != base.ZeroAddr {
		activeAddrStr = activeAddr.Hex()
	}

	// Build the last facet map for all registered views
	lastFacetMap := make(map[string]types.DataFacet)
	for _, view := range a.GetRegisteredViews() {
		facetStr := project.GetLastFacet(view)
		if facetStr != "" {
			lastFacetMap[view] = types.DataFacet(facetStr)
		}
	}

	return &types.ProjectPayload{
		HasProject:     true,
		ActiveChain:    project.GetActiveChain(),
		ActiveAddress:  activeAddrStr,
		ActiveContract: project.GetActiveContract(),
		ActivePeriod:   project.GetActivePeriod(),
		LastView:       project.GetLastView(),
		LastFacetMap:   lastFacetMap,
	}
}

// SwitchToProject sets the specified project as the active project
func (a *App) SwitchToProject(id string) error {
	if _, ok := a.Projects.GetItemByID(id); !ok {
		return fmt.Errorf("no project with ID %s exists", id)
	}

	err := a.Projects.SetActiveItem(id)
	if err == nil {
		msgs.EmitManager("project_switched")
	}
	return err
}

// RestoreProjectContext restores the full context for the specified project
func (a *App) RestoreProjectContext(projectID string) error {
	if err := a.SwitchToProject(projectID); err != nil {
		return err
	}

	project := a.GetActiveProject()
	if project == nil {
		return fmt.Errorf("failed to get active project after switching to %s", projectID)
	}

	// Update LastProjects array to mark this project as active
	projectPath := project.GetPath()
	a.setActiveProject(projectPath)

	if err := a.SetAppPreferences(&a.Preferences.App); err != nil {
		return fmt.Errorf("failed to update app preferences: %w", err)
	}

	return nil
}

// CloseProject closes a project, prompting to save if it has unsaved changes
func (a *App) CloseProject(id string) error {
	project, ok := a.Projects.GetItemByID(id)
	if !ok {
		return fmt.Errorf("no project with ID %s exists", id)
	}

	// Get project path before closing
	projectPath := project.GetPath()

	// Close the project
	if err := a.Projects.Close(id); err != nil {
		return err
	}

	// Remove from LastProjects array (for session restoration)
	msgs.EmitStatus(fmt.Sprintf("Removing project from LastProjects: %s", projectPath))
	lenBefore := len(a.Preferences.App.LastProjects)
	a.removeProjectFromLastProjects(projectPath)
	lenAfter := len(a.Preferences.App.LastProjects)
	msgs.EmitStatus(fmt.Sprintf("LastProjects array: %d -> %d items", lenBefore, lenAfter))

	// Save updated preferences
	if err := a.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("Failed to save preferences after closing project", err)
	} else {
		msgs.EmitStatus("Successfully saved preferences after closing project")
	}

	return nil
}

// GetProjectAddress returns the address of the active project
func (a *App) GetProjectAddress() base.Address {
	active := a.GetActiveProject()
	if active == nil {
		return base.ZeroAddr
	}
	return active.GetActiveAddress()
}

// SetProjectAddress sets the address for the active project
func (a *App) SetProjectAddress(addr base.Address) {
	active := a.GetActiveProject()
	if active != nil {
		_ = active.SetActiveAddress(addr)
	}
}

// GetFilename returns the active project (legacy method for compatibility)
func (a *App) GetFilename() *project.Project {
	return a.GetActiveProject()
}

// uniqueProjectName generates a unique project name by appending numbers if needed
func (a *App) uniqueProjectName(baseName string) string {
	projectExists := func(name string) bool {
		for _, project := range a.Projects.GetOpenIDs() {
			if projectObj, ok := a.Projects.GetItemByID(project); ok {
				if projectObj.Name == name {
					return true
				}
			}
		}
		return false
	}

	count := 1
	uniqueName := baseName
	for projectExists(uniqueName) {
		uniqueName = baseName + " " + fmt.Sprintf("%d", count)
		count++
	}

	return uniqueName
}

// addProjectToLastProjects adds a project to the LastProjects array if not already present
func (a *App) addProjectToLastProjects(path string) {
	if path == "" {
		return
	}

	// Check if already exists
	for _, proj := range a.Preferences.App.LastProjects {
		if proj.Path == path {
			return // Already exists, don't add duplicate
		}
	}

	// Add to end of array (preserves tab opening order)
	a.Preferences.App.LastProjects = append(a.Preferences.App.LastProjects,
		preferences.OpenProject{Path: path, IsActive: false})
}

// removeProjectFromLastProjects removes a project from the LastProjects array
func (a *App) removeProjectFromLastProjects(path string) {
	if path == "" {
		return
	}

	for i, proj := range a.Preferences.App.LastProjects {
		if proj.Path == path {
			// Remove from slice
			a.Preferences.App.LastProjects = append(
				a.Preferences.App.LastProjects[:i],
				a.Preferences.App.LastProjects[i+1:]...)
			return
		}
	}
}

// setActiveProject marks the specified project as active and all others as inactive
func (a *App) setActiveProject(path string) {
	if path == "" {
		return
	}

	found := false
	for i := range a.Preferences.App.LastProjects {
		if a.Preferences.App.LastProjects[i].Path == path {
			a.Preferences.App.LastProjects[i].IsActive = true
			found = true
		} else {
			a.Preferences.App.LastProjects[i].IsActive = false
		}
	}

	// If project not in array, add it as active
	if !found {
		a.Preferences.App.LastProjects = append(a.Preferences.App.LastProjects,
			preferences.OpenProject{Path: path, IsActive: true})
	}
}

// restoreLastProjects restores all previously opened projects from the LastProjects array
func (a *App) restoreLastProjects() {
	if len(a.Preferences.App.LastProjects) == 0 {
		return // No projects to restore
	}

	var activeProjectPath string
	validProjects := make([]preferences.OpenProject, 0)

	// Open projects in tab order and identify the active one
	for _, openProj := range a.Preferences.App.LastProjects {
		if openProj.Path == "" {
			continue // Skip invalid entries
		}

		// Try to open the project file
		if err := a.fileOpen(openProj.Path); err != nil {
			msgs.EmitError("Failed to restore project", fmt.Errorf("could not open %s: %w", openProj.Path, err))
			continue // Skip files that can't be opened
		}

		// Project opened successfully, keep it in the list
		validProjects = append(validProjects, openProj)

		// Remember which project should be active
		if openProj.IsActive {
			activeProjectPath = openProj.Path
		}
	}

	// Update the LastProjects array to only include successfully opened projects
	a.Preferences.App.LastProjects = validProjects

	// After all projects are opened, reset the active project based on metadata
	// (the opening process may have changed the active project multiple times)
	if activeProjectPath != "" {
		// Find the project by path and get its ID to set as active
		for _, id := range a.Projects.GetOpenIDs() {
			if project, ok := a.Projects.GetItemByID(id); ok {
				if project.GetPath() == activeProjectPath {
					if err := a.Projects.SetActiveItem(id); err == nil {
						// Update the LastProjects metadata to ensure consistency
						a.setActiveProject(activeProjectPath)
						msgs.EmitStatus(fmt.Sprintf("Restored active project from metadata: %s", project.GetName()))
					}
					break
				}
			}
		}
	} else if len(validProjects) > 0 {
		// No project was marked active in metadata, make the first one active
		firstPath := validProjects[0].Path
		for _, id := range a.Projects.GetOpenIDs() {
			if project, ok := a.Projects.GetItemByID(id); ok {
				if project.GetPath() == firstPath {
					if err := a.Projects.SetActiveItem(id); err == nil {
						// Update the LastProjects array to mark this as active
						a.setActiveProject(firstPath)
						msgs.EmitStatus(fmt.Sprintf("No active project in metadata, set first project as active: %s", project.GetName()))
					}
					break
				}
			}
		}
	}

	// Save updated preferences (cleaned up invalid projects)
	if err := a.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("Failed to save updated project preferences", err)
	}

	if len(validProjects) > 0 {
		msgs.EmitStatus(fmt.Sprintf("Restored %d project(s) from last session", len(validProjects)))
	}
}
