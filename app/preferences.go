package app

import (
	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
)

// GetUserPreferences returns the current user preferences
func (a *App) GetUserPreferences() *preferences.UserPreferences {
	return &a.Preferences.User
}

// SetUserPreferences updates and persists user preferences
func (a *App) SetUserPreferences(userPrefs *preferences.UserPreferences) error {
	a.Preferences.User = *userPrefs
	return preferences.SetUserPreferences(userPrefs)
}

// GetOrgPreferences returns the current organization preferences
func (a *App) GetOrgPreferences() *preferences.OrgPreferences {
	return &a.Preferences.Org
}

// SetOrgPreferences updates and persists organization preferences
func (a *App) SetOrgPreferences(orgPrefs *preferences.OrgPreferences) error {
	a.Preferences.Org = *orgPrefs
	return preferences.SetOrgPreferences(orgPrefs)
}

// GetAppPreferences returns a copy of current application preferences with thread safety
func (a *App) GetAppPreferences() *preferences.AppPreferences {
	a.prefsMu.RLock()
	defer a.prefsMu.RUnlock()
	appPrefsCopy := a.Preferences.App
	return &appPrefsCopy
}

// SetAppPreferences updates and persists application preferences with thread safety
func (a *App) SetAppPreferences(appPrefs *preferences.AppPreferences) error {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()

	a.Preferences.App = *appPrefs
	return preferences.SetAppPreferences(appPrefs)
}

// GetDefaultAppPreferences returns the default AppPreferences values
// This ensures frontend and backend use the same defaults without duplication
func (a *App) GetDefaultAppPreferences() *preferences.AppPreferences {
	defaults := preferences.NewAppPreferences()
	return defaults
}

// GetLanguage returns the currently selected language
func (a *App) GetLanguage() string {
	a.prefsMu.RLock()
	defer a.prefsMu.RUnlock()
	return a.Preferences.App.LastLanguage
}

// SetLanguage updates the application language preference
func (a *App) SetLanguage(language string) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()

	a.Preferences.App.LastLanguage = language
	if err := preferences.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("failed to save language preference", err)
	}
}

// GetTheme returns the currently selected theme
func (a *App) GetTheme() string {
	a.prefsMu.RLock()
	defer a.prefsMu.RUnlock()
	return a.Preferences.App.LastTheme
}

// SetTheme updates the application theme preference
func (a *App) SetTheme(theme string) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()

	a.Preferences.App.LastTheme = theme
	if err := preferences.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("failed to save theme preference", err)
	}
}

// GetSkin returns the currently selected skin
func (a *App) GetSkin() string {
	a.prefsMu.RLock()
	defer a.prefsMu.RUnlock()
	if a.Preferences.App.LastSkin == "" {
		return "default"
	}
	return a.Preferences.App.LastSkin
}

// SetSkin updates the application skin preference
func (a *App) SetSkin(skin string) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()

	a.Preferences.App.LastSkin = skin
	if err := preferences.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("failed to save skin preference", err)
	}
}

// GetFormat returns the currently selected export format
func (a *App) GetFormat() string {
	a.prefsMu.RLock()
	defer a.prefsMu.RUnlock()
	if a.Preferences.App.LastFormat == "" {
		return "csv"
	}
	return a.Preferences.App.LastFormat
}

// SetFormat updates the application export format preference
func (a *App) SetFormat(format string) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()
	a.Preferences.App.LastFormat = format
	if err := preferences.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("failed to save format preference", err)
	}
}

// IsDialogSilenced checks if a specific dialog is silenced
func (a *App) IsDialogSilenced(dialogKey string) bool {
	a.prefsMu.RLock()
	defer a.prefsMu.RUnlock()
	return a.Preferences.App.SilencedDialogs[dialogKey]
}

// SilenceDialog marks a dialog as silenced
func (a *App) SilenceDialog(dialogKey string) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()
	if a.Preferences.App.SilencedDialogs == nil {
		a.Preferences.App.SilencedDialogs = make(map[string]bool)
	}
	a.Preferences.App.SilencedDialogs[dialogKey] = true
	if err := preferences.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("failed to save dialog silence preference", err)
	}
}

// GetActiveProjectPath returns the path of the most recently used project
func (a *App) GetActiveProjectPath() string {
	a.prefsMu.RLock()
	defer a.prefsMu.RUnlock()
	if len(a.Preferences.App.RecentProjects) == 0 {
		return ""
	}
	return a.Preferences.App.RecentProjects[0]
}

// SetActiveProjectPath adds a project path to the recent projects list
func (a *App) SetActiveProjectPath(path string) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()
	_ = a.Preferences.AddRecentProject(path)
}

// updateRecentProjects updates the recent projects list with the active project path
func (a *App) updateRecentProjects() {
	activeProject := a.GetActiveProject()
	if activeProject == nil || activeProject.GetPath() == "" {
		return
	}

	path := activeProject.GetPath()

	if err := a.Preferences.AddRecentProject(path); err != nil {
		msgs.EmitError("add recent project failed", err)
		return
	}

	msgs.EmitManager("update_recent_projects")
}

// GetDebugCollapsed returns the current debug mode setting
func (a *App) GetDebugCollapsed() bool {
	a.prefsMu.RLock()
	defer a.prefsMu.RUnlock()
	return a.Preferences.App.DebugCollapsed
}

// SetDebugCollapsed updates the debug mode preference
func (a *App) SetDebugCollapsed(collapse bool) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()

	a.Preferences.App.DebugCollapsed = collapse
	if err := preferences.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("failed to save debug collapsed preference", err)
	}
}

// SetHelpCollapsed updates the help panel collapsed state
func (a *App) SetHelpCollapsed(collapse bool) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()

	a.Preferences.App.HelpCollapsed = collapse
	if err := preferences.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("failed to save help collapsed preference", err)
	}
}

// SetMenuCollapsed updates the menu panel collapsed state
func (a *App) SetMenuCollapsed(collapse bool) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()

	a.Preferences.App.MenuCollapsed = collapse
	if err := preferences.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("failed to save menu collapsed preference", err)
	}
}

// SetChromeCollapsed updates the chrome collapsed state
func (a *App) SetChromeCollapsed(collapse bool) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()

	a.Preferences.App.ChromeCollapsed = collapse
	if err := preferences.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("failed to save chrome collapsed preference", err)
	}
}

// GetChunksMetric returns the selected metric for a specific chunks facet
func (a *App) GetChunksMetric(facet string) string {
	a.prefsMu.RLock()
	defer a.prefsMu.RUnlock()

	if a.Preferences.App.ChunksMetrics == nil {
		return ""
	}
	return a.Preferences.App.ChunksMetrics[facet]
}

// SetChunksMetric updates the selected metric for a specific chunks facet
func (a *App) SetChunksMetric(facet string, metric string) {
	a.prefsMu.Lock()
	defer a.prefsMu.Unlock()

	if a.Preferences.App.ChunksMetrics == nil {
		a.Preferences.App.ChunksMetrics = make(map[string]string)
	}
	a.Preferences.App.ChunksMetrics[facet] = metric
	if err := preferences.SetAppPreferences(&a.Preferences.App); err != nil {
		msgs.EmitError("failed to save chunks metric preference", err)
	}
}
