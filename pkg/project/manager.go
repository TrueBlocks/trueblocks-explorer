// package project contains the data structures and methods for managing project files
package project

import (
	"errors"
	"fmt"
	"path/filepath"
	"strings"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
)

// Manager handles multiple Project instances, maintaining a collection of open projects
// and tracking which one is currently active.
type Manager struct {
	OpenProjects map[string]*Project
	ActiveID     string
}

// NewManager creates a new project manager with no open projects
func NewManager() *Manager {
	return &Manager{
		OpenProjects: make(map[string]*Project),
		ActiveID:     "",
	}
}

// GetActiveProject returns the currently active project, or nil if no project is active
func (m *Manager) GetActiveProject() *Project {
	if m.ActiveID == "" {
		return nil
	}
	return m.OpenProjects[m.ActiveID]
}

// SetActiveProject sets the active project by ID
func (m *Manager) SetActiveProject(id string) error {
	if m.ActiveID == id {
		return nil
	}

	if _, exists := m.OpenProjects[id]; !exists {
		return fmt.Errorf("no project with ID %s exists", id)
	}

	if m.ActiveID != "" {
		prevProject := m.OpenProjects[m.ActiveID]
		if prevProject != nil {
			m.minimizeInactiveProject(prevProject)
		}
	}

	m.ActiveID = id
	msgs.EmitManager("project_activated")
	return nil
}

// minimizeInactiveProject reduces memory usage of inactive projects
// This method provides a framework for memory optimization that can be
// extended in the future as project complexity grows
func (m *Manager) minimizeInactiveProject(project *Project) {
	// This is a hook for future memory optimization
	// For now, we don't have specific memory-intensive structures to clear
	// but having this framework in place allows for easy extension later

	// Example memory optimization patterns that could be implemented:
	// 1. Clear any cached computation results
	// 2. Clear any non-essential data structures that can be rebuilt
	// 3. If T implements a ClearCache() method, call it
}

// NewProject creates a new project with the given name and current address and makes it the active project
func (m *Manager) NewProject(name string, address base.Address, chains []string) *Project {
	project := NewProject(name, address, chains)
	id := name
	m.OpenProjects[id] = project
	m.ActiveID = id
	msgs.EmitManager("project_created")
	return project
}

// Open loads a project from the specified path and makes it the active project
func (m *Manager) Open(path string) (*Project, error) {
	for id, proj := range m.OpenProjects {
		if proj.Path == path {
			m.ActiveID = id
			msgs.EmitManager("project_switched")
			return proj, nil
		}
	}

	project, err := Load(path)
	if err != nil {
		return nil, err
	}

	id := filepath.Base(path)
	m.OpenProjects[id] = project
	m.ActiveID = id

	project.LastOpened = time.Now().Format(time.RFC3339)

	msgs.EmitManager("project_opened")
	return project, nil
}

// Close closes the project with the given ID. If it's the active project,
// the active project becomes nil.
func (m *Manager) Close(id string) error {
	if _, exists := m.OpenProjects[id]; !exists {
		return fmt.Errorf("no project with ID %s exists", id)
	}

	delete(m.OpenProjects, id)

	if m.ActiveID == id {
		m.ActiveID = ""

		for newID := range m.OpenProjects {
			m.ActiveID = newID
			break
		}
	}

	msgs.EmitManager("project_closed")
	return nil
}

// CloseAll closes all open projects
func (m *Manager) CloseAll() {
	m.OpenProjects = make(map[string]*Project)
	m.ActiveID = ""
	msgs.EmitManager("all_projects_closed")
}

// SaveActive saves the currently active project
func (m *Manager) SaveActive() error {
	if m.ActiveID == "" {
		return errors.New("no active project to save")
	}

	project := m.OpenProjects[m.ActiveID]

	if strings.HasPrefix(project.Name, "New Project") {
		return m.SaveActiveAs("")
	}

	err := project.Save()
	if err == nil {
		msgs.EmitManager("project_saved")
	} else {
		msgs.EmitError("SaveProject", err)
	}
	return err
}

// SaveActiveAs saves the currently active project to a new path
func (m *Manager) SaveActiveAs(path string) error {
	if m.ActiveID == "" {
		return errors.New("no active project to save")
	}

	project := m.OpenProjects[m.ActiveID]

	var err error
	if err = project.SaveAs(path); err == nil {
		msgs.EmitManager("project_saved_as")
	} else {
		msgs.EmitError("SaveProjectAs", err)
	}
	return err
}

// GetOpenProjectIDs returns a slice of IDs for all open projects
func (m *Manager) GetOpenProjectIDs() []string {
	ids := make([]string, 0, len(m.OpenProjects))
	for id := range m.OpenProjects {
		ids = append(ids, id)
	}
	return ids
}

// GetProjectByID returns the project with the given ID, or nil if it doesn't exist
func (m *Manager) GetProjectByID(id string) *Project {
	return m.OpenProjects[id]
}

// GetProjectByPath returns the project with the given path, or nil if it doesn't exist
func (m *Manager) GetProjectByPath(path string) *Project {
	for _, project := range m.OpenProjects {
		if project.Path == path {
			return project
		}
	}
	return nil
}
