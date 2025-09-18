package preferences

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type Preferences struct {
	Org  OrgPreferences  `json:"org"`
	User UserPreferences `json:"user"`
	App  AppPreferences  `json:"app"`
	Path string          `json:"-"` // Not serialized, in-memory only
}

// NewPreferences creates a new Preferences instance with default values
func NewPreferences(path string) *Preferences {
	return &Preferences{
		Org:  *NewOrgPreferences(),
		User: *NewUserPreferences(),
		App:  *NewAppPreferences(),
		Path: path,
	}
}

// LoadPreferences loads preferences from the specified file path
func LoadPreferences(path string) (*Preferences, error) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		// File doesn't exist, create new preferences with defaults
		return NewPreferences(path), nil
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read preferences file: %w", err)
	}

	var prefs Preferences
	if err := json.Unmarshal(data, &prefs); err != nil {
		return nil, fmt.Errorf("failed to parse preferences file: %w", err)
	}

	// Set the path (which is not serialized)
	prefs.Path = path

	return &prefs, nil
}

// Save persists the preferences to the file system
func (p *Preferences) Save() error {
	dir := filepath.Dir(p.Path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to ensure directory exists: %w", err)
	}

	data, err := json.MarshalIndent(p, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to serialize preferences: %w", err)
	}

	if err := os.WriteFile(p.Path, data, 0644); err != nil {
		return fmt.Errorf("failed to write preferences file: %w", err)
	}

	return nil
}

// GetOrgPreferences returns the organization preferences
func (p *Preferences) GetOrgPreferences() *OrgPreferences {
	return &p.Org
}

// GetUserPreferences returns the user preferences
func (p *Preferences) GetUserPreferences() *UserPreferences {
	return &p.User
}

// GetAppPreferences returns the application preferences
func (p *Preferences) GetAppPreferences() *AppPreferences {
	return &p.App
}

// AddRecentProject adds a project to the recently used list
func (p *Preferences) AddRecentProject(path string) error {
	// Check if the path is already in the list
	for i, recent := range p.App.RecentProjects {
		if recent == path {
			// If it's already in the list but not at the top, move it to the top
			if i > 0 {
				// Remove from current position
				p.App.RecentProjects = append(p.App.RecentProjects[:i], p.App.RecentProjects[i+1:]...)
				// Add to the beginning
				p.App.RecentProjects = append([]string{path}, p.App.RecentProjects...)
				return p.Save()
			}
			return nil // Already at the top, no need to save
		}
	}

	// Not in the list, add it to the beginning
	p.App.RecentProjects = append([]string{path}, p.App.RecentProjects...)

	// Trim the list if it's too long
	maxRecent := 10 // Maximum number of recent projects to keep
	if len(p.App.RecentProjects) > maxRecent {
		p.App.RecentProjects = p.App.RecentProjects[:maxRecent]
	}

	return p.Save()
}
