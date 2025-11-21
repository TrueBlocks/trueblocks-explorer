package app

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// GetImageURL returns a URL for serving an image file, creating sample files if needed
func (a *App) GetImageURL(relativePath string) string {
	if a.fileServer == nil {
		return ""
	}

	basePath := ""
	if path, err := filepath.Abs(a.fileServer.GetBasePath()); err == nil {
		basePath = path
	}

	if basePath == "" {
		return ""
	}

	cleanPath := filepath.Clean(relativePath)
	cleanPath = strings.TrimPrefix(cleanPath, "/")

	pathWithoutQuery := cleanPath
	if idx := strings.Index(cleanPath, "?"); idx > 0 {
		pathWithoutQuery = cleanPath[:idx]
	}

	fullPath := filepath.Join(basePath, pathWithoutQuery)
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		return ""
	}

	url := a.fileServer.GetURL(cleanPath)
	return url
}

// GetImageDebugInfo returns debug information about image paths
func (a *App) GetImageDebugInfo(imageURL string) map[string]string {
	result := map[string]string{
		"imageURL":     imageURL,
		"physicalPath": "",
		"exists":       "false",
		"basePath":     "",
	}

	if a.fileServer == nil {
		result["error"] = "fileServer is nil"
		return result
	}

	if basePath, err := filepath.Abs(a.fileServer.GetBasePath()); err == nil {
		result["basePath"] = basePath

		// Extract relative path from URL
		baseURL := a.fileServer.GetBaseURL()
		if baseURL != "" && strings.HasPrefix(imageURL, baseURL) {
			relativePath := strings.TrimPrefix(imageURL, baseURL)
			// Remove query parameters
			if idx := strings.Index(relativePath, "?"); idx > 0 {
				relativePath = relativePath[:idx]
			}
			cleanPath := filepath.Clean(relativePath)
			cleanPath = strings.TrimPrefix(cleanPath, "/")
			fullPath := filepath.Join(basePath, cleanPath)
			result["physicalPath"] = fullPath

			if _, err := os.Stat(fullPath); err == nil {
				result["exists"] = "true"
			} else {
				result["exists"] = "false"
				result["statError"] = err.Error()
			}
		}
	}

	return result
}

// ChangeImageStorageLocation updates the base path for the file server
func (a *App) ChangeImageStorageLocation(newPath string) error {
	if a.fileServer == nil {
		return fmt.Errorf("file server not initialized")
	}
	return a.fileServer.UpdateBasePath(newPath)
}
