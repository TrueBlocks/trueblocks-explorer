package skin

import (
	"crypto/sha256"
	"embed"
	"encoding/json"
	"fmt"
	"path/filepath"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
)

//go:embed skins/*
var embeddedSkins embed.FS

// SkinManifest represents the manifest file for embedded skins
type SkinManifest struct {
	Version     string                       `json:"version"`
	LastUpdated string                       `json:"lastUpdated"`
	Skins       map[string]SkinManifestEntry `json:"skins"`
}

// SkinManifestEntry represents an entry in the skin manifest
type SkinManifestEntry struct {
	Hash    string `json:"hash"`
	Version string `json:"version"`
	Size    int    `json:"size"`
}

// loadEmbeddedManifest loads the manifest from embedded files
func (sm *SkinManager) loadEmbeddedManifest() (*SkinManifest, error) {
	manifestData, err := embeddedSkins.ReadFile("skins/manifest.json")
	if err != nil {
		return nil, fmt.Errorf("failed to read embedded manifest: %w", err)
	}

	var manifest SkinManifest
	if err := json.Unmarshal(manifestData, &manifest); err != nil {
		return nil, fmt.Errorf("failed to unmarshal manifest: %w", err)
	}

	return &manifest, nil
}

// loadUserManifest loads the manifest from user config folder
func (sm *SkinManager) loadUserManifest() (*SkinManifest, error) {
	manifestPath := filepath.Join(sm.builtInPath, "manifest.json")
	if !file.FileExists(manifestPath) {
		return nil, fmt.Errorf("user manifest not found")
	}

	manifestData := file.AsciiFileToString(manifestPath)

	var manifest SkinManifest
	if err := json.Unmarshal([]byte(manifestData), &manifest); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user manifest: %w", err)
	}

	return &manifest, nil
}

// calculateSkinHash calculates the SHA256 hash of a skin file
func calculateSkinHash(data []byte) string {
	hash := sha256.Sum256(data)
	return fmt.Sprintf("sha256:%x", hash)
}

// shouldUpdateSkins determines if skins should be updated based on manifest comparison
func (sm *SkinManager) shouldUpdateSkins() (bool, error) {
	embeddedManifest, err := sm.loadEmbeddedManifest()
	if err != nil {
		return false, fmt.Errorf("failed to load embedded manifest: %w", err)
	}

	userManifest, err := sm.loadUserManifest()
	if err != nil {
		// If user manifest doesn't exist, we need to update
		logging.LogBackend("User manifest not found, updating skins")
		return true, nil
	}

	// Compare versions first
	if embeddedManifest.Version != userManifest.Version {
		logging.LogBackend(fmt.Sprintf("Manifest version mismatch: embedded=%s, user=%s",
			embeddedManifest.Version, userManifest.Version))
		return true, nil
	}

	// Compare individual skin hashes
	for skinName, embeddedEntry := range embeddedManifest.Skins {
		userEntry, exists := userManifest.Skins[skinName]
		if !exists {
			logging.LogBackend(fmt.Sprintf("Skin %s not found in user manifest", skinName))
			return true, nil
		}

		if embeddedEntry.Hash != userEntry.Hash {
			logging.LogBackend(fmt.Sprintf("Hash mismatch for skin %s: embedded=%s, user=%s",
				skinName, embeddedEntry.Hash, userEntry.Hash))
			return true, nil
		}
	}

	logging.LogBackend("All skins are up to date")
	return false, nil
}

// extractEmbeddedSkins extracts embedded skins to the user config folder
func (sm *SkinManager) extractEmbeddedSkins() error {
	logging.LogBackend("Extracting embedded skins to config folder")

	// Ensure the built-in directory exists
	if err := file.EstablishFolder(sm.builtInPath); err != nil {
		return fmt.Errorf("failed to create built-in skins directory: %w", err)
	}

	// Read the embedded skins directory
	entries, err := embeddedSkins.ReadDir("skins")
	if err != nil {
		return fmt.Errorf("failed to read embedded skins directory: %w", err)
	}

	// Extract each file
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		fileName := entry.Name()
		embeddedPath := filepath.Join("skins", fileName)
		userPath := filepath.Join(sm.builtInPath, fileName)

		// Read embedded file
		data, err := embeddedSkins.ReadFile(embeddedPath)
		if err != nil {
			return fmt.Errorf("failed to read embedded file %s: %w", embeddedPath, err)
		}

		// Write to user config
		if err := file.StringToAsciiFile(userPath, string(data)); err != nil {
			return fmt.Errorf("failed to write file %s: %w", userPath, err)
		}

		logging.LogBackend(fmt.Sprintf("Extracted %s to %s", fileName, userPath))
	}

	logging.LogBackend("Successfully extracted all embedded skins")
	return nil
}

// updateEmbeddedManifestHashes updates the embedded manifest with actual file hashes
func (sm *SkinManager) updateEmbeddedManifestHashes() error {
	logging.LogBackend("Updating embedded manifest with calculated hashes")

	manifestPath := filepath.Join(sm.builtInPath, "manifest.json")

	// Load the current manifest
	manifest, err := sm.loadUserManifest()
	if err != nil {
		return fmt.Errorf("failed to load user manifest for hash update: %w", err)
	}

	// Calculate actual hashes for each skin
	for skinName := range manifest.Skins {
		skinPath := filepath.Join(sm.builtInPath, skinName+".json")
		if !file.FileExists(skinPath) {
			logging.LogBackend(fmt.Sprintf("Warning: skin file %s not found for hash calculation", skinPath))
			continue
		}

		data := file.AsciiFileToString(skinPath)
		if data == "" {
			logging.LogBackend(fmt.Sprintf("Warning: failed to read skin file %s", skinPath))
			continue
		}

		actualHash := calculateSkinHash([]byte(data))
		entry := manifest.Skins[skinName]
		entry.Hash = actualHash
		entry.Size = len(data)
		manifest.Skins[skinName] = entry

		logging.LogBackend(fmt.Sprintf("Updated hash for %s: %s", skinName, actualHash))
	}

	// Save the updated manifest
	manifestData, err := json.MarshalIndent(manifest, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal updated manifest: %w", err)
	}

	if err := file.StringToAsciiFile(manifestPath, string(manifestData)); err != nil {
		return fmt.Errorf("failed to write updated manifest: %w", err)
	}

	logging.LogBackend("Successfully updated manifest hashes")
	return nil
}

// initializeEmbeddedSkins replaces the old createBuiltInSkins method
func (sm *SkinManager) initializeEmbeddedSkins() error {
	logging.LogBackend("Initializing embedded skins system")

	// Check if we need to update skins
	shouldUpdate, err := sm.shouldUpdateSkins()
	if err != nil {
		logging.LogBackend(fmt.Sprintf("Error checking skin update status: %v, proceeding with update", err))
		shouldUpdate = true
	}

	if shouldUpdate {
		// Extract embedded skins to config folder
		if err := sm.extractEmbeddedSkins(); err != nil {
			return fmt.Errorf("failed to extract embedded skins: %w", err)
		}

		// Update manifest with actual hashes
		if err := sm.updateEmbeddedManifestHashes(); err != nil {
			return fmt.Errorf("failed to update manifest hashes: %w", err)
		}
	}

	logging.LogBackend("Embedded skins system initialized successfully")
	return nil
}
