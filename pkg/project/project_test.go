package project_test

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
)

// TestProject tests the basic functionality of the Project type
func TestProject(t *testing.T) {
	// Create a new project
	p := project.NewProject("test-project", base.ZeroAddr, []string{"mainnet"})

	// Create a temporary directory for testing
	tempDir, err := os.MkdirTemp("", "project-test")
	if err != nil {
		t.Fatalf("Failed to create temp directory: %v", err)
	}
	defer func() { _ = os.RemoveAll(tempDir) }()

	// Save the project
	tempPath := filepath.Join(tempDir, "test-project.json")
	if err := p.SaveAs(tempPath); err != nil {
		t.Fatalf("Failed to save project: %v", err)
	}

	// Modify the project
	_ = p.SetName("renamed-project")

	// Save again
	if err := p.Save(); err != nil {
		t.Fatalf("Failed to save project after renaming: %v", err)
	}

	// Load the project
	loadedProject, err := project.Load(tempPath)
	if err != nil {
		t.Fatalf("Failed to load project: %v", err)
	}

	// Verify loaded data
	if loadedProject.GetName() != "renamed-project" {
		t.Errorf("Expected project name '%s', got '%s'", "renamed-project", loadedProject.GetName())
	}
}
