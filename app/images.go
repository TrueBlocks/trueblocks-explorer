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

// ChangeImageStorageLocation updates the base path for the file server
func (a *App) ChangeImageStorageLocation(newPath string) error {
	if a.fileServer == nil {
		return fmt.Errorf("file server not initialized")
	}
	return a.fileServer.UpdateBasePath(newPath)
}
