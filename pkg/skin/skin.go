package skin

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
)

// Skin represents a hybrid Mantine-focused visual theme with enhanced visual properties
type Skin struct {
	// Metadata
	Name        string `json:"name"`
	DisplayName string `json:"displayName"`
	Description string `json:"description"`
	Author      string `json:"author,omitempty"`
	Version     string `json:"version,omitempty"`
	IsBuiltIn   bool   `json:"isBuiltIn"`

	// Mantine color arrays (9 shades each)
	Primary []string `json:"primary"` // Main theme color
	Success []string `json:"success"` // Green variants
	Warning []string `json:"warning"` // Yellow variants
	Error   []string `json:"error"`   // Red variants

	// Typography (visually impactful)
	FontFamily     string `json:"fontFamily"`     // Main font family
	FontFamilyMono string `json:"fontFamilyMono"` // Monospace font family

	// Border Radius System (dramatic visual impact)
	DefaultRadius string            `json:"defaultRadius"` // Default border radius (xs, sm, md, lg, xl)
	Radius        map[string]string `json:"radius"`        // Custom radius values

	// Shadow System (depth and elevation)
	Shadows map[string]string `json:"shadows"` // Shadow definitions (xs, sm, md, lg, xl)

	// Gradient System (for accent elements)
	DefaultGradient map[string]interface{} `json:"defaultGradient"` // {from: "color", to: "color", deg: number}

	// Visual Enhancement Options
	AutoContrast bool `json:"autoContrast"` // Automatic text contrast adjustment

	// Legacy size properties (maintain compatibility)
	SmallSize  string `json:"smallSize"`
	NormalSize string `json:"normalSize"`
}

// SkinMetadata provides basic information about a skin without full content
type SkinMetadata struct {
	Name        string `json:"name"`
	DisplayName string `json:"displayName"`
	Description string `json:"description"`
	Author      string `json:"author,omitempty"`
	Version     string `json:"version,omitempty"`
	IsBuiltIn   bool   `json:"isBuiltIn"`
}

// SkinManager handles loading, saving, and managing skins
type SkinManager struct {
	configPath  string
	builtInPath string
	userPath    string
	skins       map[string]*Skin
}

// NewSkinManager creates a new skin manager with the specified config directory
func NewSkinManager(configPath string) *SkinManager {
	return &SkinManager{
		configPath:  configPath,
		builtInPath: filepath.Join(configPath, "skins", "built-in"),
		userPath:    filepath.Join(configPath, "skins", "user"),
		skins:       make(map[string]*Skin),
	}
}

// Initialize sets up the skin directories and loads all skins
func (sm *SkinManager) Initialize() error {
	// Create directories if they don't exist
	if err := os.MkdirAll(sm.builtInPath, 0755); err != nil {
		return fmt.Errorf("failed to create built-in skins directory: %w", err)
	}
	if err := os.MkdirAll(sm.userPath, 0755); err != nil {
		return fmt.Errorf("failed to create user skins directory: %w", err)
	}

	// Create built-in skins if they don't exist
	if err := sm.createBuiltInSkins(); err != nil {
		return fmt.Errorf("failed to create built-in skins: %w", err)
	}

	// Load all skins
	return sm.LoadAllSkins()
}

// LoadAllSkins loads all skins from built-in and user directories
func (sm *SkinManager) LoadAllSkins() error {
	sm.skins = make(map[string]*Skin)

	// Load built-in skins
	if err := sm.loadSkinsFromDirectory(sm.builtInPath, true); err != nil {
		return fmt.Errorf("failed to load built-in skins: %w", err)
	}

	// Load user skins
	if err := sm.loadSkinsFromDirectory(sm.userPath, false); err != nil {
		return fmt.Errorf("failed to load user skins: %w", err)
	}

	return nil
}

// loadSkinsFromDirectory loads all .json files from a directory as skins
func (sm *SkinManager) loadSkinsFromDirectory(dir string, isBuiltIn bool) error {
	if !file.FolderExists(dir) {
		return nil // Directory doesn't exist, which is ok
	}

	entries, err := os.ReadDir(dir)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".json") {
			continue
		}

		// Skip manifest.json file - it's not a skin
		if entry.Name() == "manifest.json" {
			continue
		}

		skinPath := filepath.Join(dir, entry.Name())
		skin, err := sm.loadSkinFromFile(skinPath, isBuiltIn)
		if err != nil {
			return fmt.Errorf("failed to load skin from %s: %w", skinPath, err)
		}

		sm.skins[skin.Name] = skin
	}

	return nil
}

// loadSkinFromFile loads a single skin from a JSON file
func (sm *SkinManager) loadSkinFromFile(filePath string, isBuiltIn bool) (*Skin, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	var skin Skin
	if err := json.Unmarshal(data, &skin); err != nil {
		return nil, err
	}

	// Set built-in flag
	skin.IsBuiltIn = isBuiltIn

	// Validate required fields
	if skin.Name == "" {
		return nil, fmt.Errorf("skin name is required")
	}

	return &skin, nil
}

// GetAvailableSkins returns metadata for all available skins
func (sm *SkinManager) GetAvailableSkins() []SkinMetadata {
	var skins []SkinMetadata
	for _, skin := range sm.skins {
		skins = append(skins, SkinMetadata{
			Name:        skin.Name,
			DisplayName: skin.DisplayName,
			Description: skin.Description,
			Author:      skin.Author,
			Version:     skin.Version,
			IsBuiltIn:   skin.IsBuiltIn,
		})
	}
	return skins
}

// GetSkinByName returns a specific skin by name
func (sm *SkinManager) GetSkinByName(name string) (*Skin, error) {
	skin, exists := sm.skins[name]
	if !exists {
		return nil, fmt.Errorf("skin not found: %s", name)
	}

	return skin, nil
}

// GetAllSkins returns all loaded skins
func (sm *SkinManager) GetAllSkins() map[string]*Skin {
	// Return a copy to prevent external modification
	result := make(map[string]*Skin)
	for name, skin := range sm.skins {
		result[name] = skin
	}
	return result
}

// ImportSkin imports a skin from JSON data
func (sm *SkinManager) ImportSkin(skinData []byte) error {
	var skin Skin
	if err := json.Unmarshal(skinData, &skin); err != nil {
		return fmt.Errorf("invalid skin JSON: %w", err)
	}

	// Validate required fields
	if skin.Name == "" {
		return fmt.Errorf("skin name is required")
	}

	// Prevent overwriting built-in skins
	if existing, exists := sm.skins[skin.Name]; exists && existing.IsBuiltIn {
		return fmt.Errorf("cannot overwrite built-in skin: %s", skin.Name)
	}

	// Save to user directory
	skin.IsBuiltIn = false
	skinPath := filepath.Join(sm.userPath, skin.Name+".json")

	prettyData, err := json.MarshalIndent(skin, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal skin: %w", err)
	}

	if err := os.WriteFile(skinPath, prettyData, 0644); err != nil {
		return fmt.Errorf("failed to save skin: %w", err)
	}

	// Add to loaded skins
	sm.skins[skin.Name] = &skin

	return nil
}

// DeleteCustomSkin deletes a user-created skin
func (sm *SkinManager) DeleteCustomSkin(name string) error {
	skin, exists := sm.skins[name]
	if !exists {
		return fmt.Errorf("skin not found: %s", name)
	}

	if skin.IsBuiltIn {
		return fmt.Errorf("cannot delete built-in skin: %s", name)
	}

	// Remove file
	skinPath := filepath.Join(sm.userPath, name+".json")
	if err := os.Remove(skinPath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to delete skin file: %w", err)
	}

	// Remove from loaded skins
	delete(sm.skins, name)

	return nil
}

// createBuiltInSkins creates the default built-in skins from embedded files
func (sm *SkinManager) createBuiltInSkins() error {
	return sm.initializeEmbeddedSkins()
}
