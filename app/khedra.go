package app

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

// GetKhedraControl discovers the Khedra control service and fetches the dashboard HTML
func (a *App) GetKhedraControlURL() (string, error) {
	return a.discoverControlService()
}

func (a *App) discoverControlService() (string, error) {
	// Get the metadata file path
	var metadataPath string
	if customDir := os.Getenv("KHEDRA_RUN_DIR"); customDir != "" {
		metadataPath = filepath.Join(customDir, "control.json")
	} else {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			return "", fmt.Errorf("failed to get user home directory: %w", err)
		}
		metadataPath = filepath.Join(homeDir, ".khedra", "run", "control.json")
	}

	log.Printf("Reading Khedra control metadata from: %s", metadataPath)

	// Read the metadata file
	data, err := os.ReadFile(metadataPath)
	if err != nil {
		return "", fmt.Errorf("control metadata file not found at %s: %w", metadataPath, err)
	}

	log.Printf("Successfully read metadata file, length: %d", len(data))

	// Parse the metadata
	var metadata struct {
		Schema  int    `json:"schema"`
		PID     int    `json:"pid"`
		Port    int    `json:"port"`
		Version string `json:"version"`
		Started string `json:"started"`
	}

	if err := json.Unmarshal(data, &metadata); err != nil {
		return "", fmt.Errorf("failed to parse control metadata: %w", err)
	}

	log.Printf("Parsed metadata - Schema: %d, PID: %d, Port: %d", metadata.Schema, metadata.PID, metadata.Port)

	if metadata.Schema == 0 {
		return "", fmt.Errorf("invalid metadata schema")
	}

	// Return the dashboard URL
	dashboardURL := fmt.Sprintf("http://localhost:%d/dashboard?embed=1&debug=0", metadata.Port)
	log.Printf("Returning dashboard URL: %s", dashboardURL)
	return dashboardURL, nil
}
