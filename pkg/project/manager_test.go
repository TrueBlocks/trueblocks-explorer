package project_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
)

// TestManager tests the functionality of the Manager type
func TestManager(t *testing.T) {
	// Create a new manager
	manager := project.NewManager()

	// Check that there's no active project initially
	if manager.GetActiveProject() != nil {
		t.Error("New manager should not have an active project")
	}

	// Create a new project
	proj := manager.NewProject("test-project", base.ZeroAddr, []string{"mainnet"})

	// Check that the new project is active
	if manager.GetActiveProject() == nil {
		t.Error("GetActiveProject project should not be nil after creation")
	}

	// Create a temporary directory for testing
	tempDir, err := os.MkdirTemp("", "manager-test")
	if err != nil {
		t.Fatalf("Failed to create temp directory: %v", err)
	}
	defer func() { _ = os.RemoveAll(tempDir) }()

	// Save the active project
	tempPath := filepath.Join(tempDir, "test-project.json")
	if err := proj.SaveAs(tempPath); err != nil {
		t.Fatalf("Failed to save project: %v", err)
	}

	// Create another project
	proj2 := manager.NewProject("second-project", base.ZeroAddr, []string{"mainnet"})

	// Verify we now have two open projects
	if len(manager.GetOpenProjectIDs()) != 2 {
		t.Errorf("Expected 2 open projects, got %d", len(manager.GetOpenProjectIDs()))
	}

	// Verify the active project is the second one
	if manager.GetActiveProject() != proj2 {
		t.Error("GetActiveProject project should be the second project")
	}

	// Open the first project again
	reopenedProj, err := manager.Open(tempPath)
	if err != nil {
		t.Fatalf("Failed to open project: %v", err)
	}

	// Verify the active project is now the reopened one
	if manager.GetActiveProject() != reopenedProj {
		t.Error("GetActiveProject project should be the reopened project")
	}

	// Close the active project
	activeID := manager.ActiveID
	if err := manager.Close(activeID); err != nil {
		t.Fatalf("Failed to close project: %v", err)
	}

	// Verify we now have one open project
	if len(manager.GetOpenProjectIDs()) != 1 {
		t.Errorf("Expected 1 open project, got %d", len(manager.GetOpenProjectIDs()))
	}

	// Close all projects
	manager.CloseAll()

	// Verify we have no open projects
	if len(manager.GetOpenProjectIDs()) != 0 {
		t.Errorf("Expected 0 open projects, got %d", len(manager.GetOpenProjectIDs()))
	}
}
