package fileserver

import (
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
)

func CreateSampleFiles(targetDir string) error {
	sampleDir := filepath.Join(targetDir, "samples")
	if err := os.MkdirAll(sampleDir, 0755); err != nil {
		return fmt.Errorf("failed to create samples directory: %w", err)
	}

	entries, err := os.ReadDir(sampleDir)
	if err != nil || len(entries) == 0 {
		return createSamplePNGs(sampleDir)
	}

	return nil
}

func createSamplePNGs(sampleDir string) error {
	// 10x10 red PNG (base64-encoded)
	redPNG := "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVQoU2NkYGD4z0AEYBxVSFUAAgwAAQYAAZ2Qn8wAAAAASUVORK5CYII="
	// 10x10 blue PNG (base64-encoded)
	bluePNG := "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVQoU2NkYGBg+A8EGIYwCjAAAgwAAQYAAZ2Qn8wAAAAASUVORK5CYII="

	sampleFiles := map[string]string{
		"sample1.png": redPNG,
		"sample2.png": bluePNG,
		"sample3.png": redPNG,
	}

	for filename, b64 := range sampleFiles {
		filePath := filepath.Join(sampleDir, filename)
		content, err := base64.StdEncoding.DecodeString(b64)
		if err != nil {
			return fmt.Errorf("failed to decode PNG for %s: %w", filename, err)
		}
		if err := os.WriteFile(filePath, content, 0644); err != nil {
			return fmt.Errorf("failed to create sample file %s: %w", filename, err)
		}
	}

	return nil
}
