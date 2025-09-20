package app

import (
	"encoding/json"
	"fmt"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/skin"
)

// GetAvailableSkins returns metadata for all available skins
func (a *App) GetAvailableSkins() []skin.SkinMetadata {
	if a.skinManager == nil {
		return []skin.SkinMetadata{}
	}
	return a.skinManager.GetAvailableSkins()
}

// GetSkinByName returns a specific skin by name
func (a *App) GetSkinByName(name string) (*skin.Skin, error) {
	if a.skinManager == nil {
		return nil, fmt.Errorf("skin manager not initialized")
	}
	return a.skinManager.GetSkinByName(name)
}

// GetAllSkins returns all loaded skins
func (a *App) GetAllSkins() map[string]*skin.Skin {
	if a.skinManager == nil {
		return make(map[string]*skin.Skin)
	}
	return a.skinManager.GetAllSkins()
}

// ImportSkin imports a skin from JSON data
func (a *App) ImportSkin(skinDataStr string) error {
	if a.skinManager == nil {
		return fmt.Errorf("skin manager not initialized")
	}
	return a.skinManager.ImportSkin([]byte(skinDataStr))
}

// DeleteCustomSkin deletes a user-created skin
func (a *App) DeleteCustomSkin(name string) error {
	if a.skinManager == nil {
		return fmt.Errorf("skin manager not initialized")
	}
	return a.skinManager.DeleteCustomSkin(name)
}

// ExportSkin exports a skin as JSON string
func (a *App) ExportSkin(name string) (string, error) {
	if a.skinManager == nil {
		return "", fmt.Errorf("skin manager not initialized")
	}

	skin, err := a.skinManager.GetSkinByName(name)
	if err != nil {
		return "", err
	}

	data, err := json.MarshalIndent(skin, "", "  ")
	if err != nil {
		return "", fmt.Errorf("failed to marshal skin: %w", err)
	}

	return string(data), nil
}

// ReloadSkins reloads all skins from disk
func (a *App) ReloadSkins() error {
	if a.skinManager == nil {
		return fmt.Errorf("skin manager not initialized")
	}
	return a.skinManager.LoadAllSkins()
}
