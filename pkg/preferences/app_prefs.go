package preferences

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/kbinani/screenshot"
)

type Bounds struct {
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"width"`
	Height int `json:"height"`
}

func NewBounds() Bounds {
	bounds := screenshot.GetDisplayBounds(0)
	screenW := bounds.Dx()
	screenH := bounds.Dy()

	ret := Bounds{}
	ret.Width = screenW * 3 / 4
	ret.Height = screenH * 3 / 4
	ret.X = (screenW - ret.Width) / 2
	ret.Y = (screenH - ret.Height) / 2
	return ret
}

func (b *Bounds) IsValid() bool {
	return b.X >= 0 && b.Y >= 0 && b.Width > 100 && b.Height > 100
}

type AppPreferences struct {
	Version         string            `json:"version"`
	Name            string            `json:"name"`
	LastTheme       string            `json:"lastTheme"`
	LastSkin        string            `json:"lastSkin"`
	LastFormat      string            `json:"lastFormat"`
	LastLanguage    string            `json:"lastLanguage"`
	LastProject     string            `json:"lastProject"`
	HelpCollapsed   bool              `json:"helpCollapsed"`
	MenuCollapsed   bool              `json:"menuCollapsed"`
	ChromeCollapsed bool              `json:"chromeCollapsed"`
	DetailCollapsed bool              `json:"detailCollapsed"`
	DebugCollapsed  bool              `json:"debugCollapsed"`
	RecentProjects  []string          `json:"recentProjects"`
	SilencedDialogs map[string]bool   `json:"silencedDialogs"`
	ChunksMetrics   map[string]string `json:"chunksMetrics,omitempty"`
	Bounds          Bounds            `json:"bounds,omitempty"`
}

func (p *AppPreferences) String() string {
	bytes, _ := json.Marshal(p)
	return string(bytes)
}

// NewAppPreferences creates a new AppPreferences instance with default values
func NewAppPreferences() *AppPreferences {
	return &AppPreferences{
		Version:         "1.0",
		LastTheme:       "dark",
		LastSkin:        "default",
		LastFormat:      "csv",
		LastLanguage:    "en",
		DetailCollapsed: true,
		HelpCollapsed:   false,
		MenuCollapsed:   false,
		ChromeCollapsed: false,
		DebugCollapsed:  true,
		RecentProjects:  []string{},
		SilencedDialogs: make(map[string]bool),
		ChunksMetrics:   make(map[string]string),
		Bounds:          NewBounds(),
	}
}

func GetAppPreferences() (AppPreferences, error) {
	path := getAppPrefsPath()

	if !file.FileExists(path) {
		defaults := *NewAppPreferences()
		if err := SetAppPreferences(&defaults); err != nil {
			return AppPreferences{}, err
		}
		return defaults, nil
	}

	var appPrefs AppPreferences
	contents := file.AsciiFileToString(path)
	if err := json.Unmarshal([]byte(contents), &appPrefs); err != nil {
		// Log the corruption issue for debugging
		logging.LogBackend(fmt.Sprintf("Warning: App preferences file corrupted (%v), creating new defaults", err))
		logging.LogBackend(fmt.Sprintf("Corrupted content: %s", contents))
		backupPath := path + ".corrupted"
		if backupErr := os.WriteFile(backupPath, []byte(contents), 0644); backupErr == nil {
			logging.LogBackend(fmt.Sprintf("Corrupted file backed up to: %s", backupPath))
		}

		appPrefs = *NewAppPreferences()
		if err = SetAppPreferences(&appPrefs); err != nil {
			return AppPreferences{}, fmt.Errorf("failed to save repaired preferences: %w", err)
		}
		logging.LogBackend("App preferences reset to defaults and saved")
	}

	var needsSave bool
	if appPrefs.RecentProjects == nil {
		appPrefs.RecentProjects = []string{}
		needsSave = true
	}
	if appPrefs.SilencedDialogs == nil {
		appPrefs.SilencedDialogs = make(map[string]bool)
		needsSave = true
	}
	if appPrefs.Version == "" {
		appPrefs.Version = "1.0"
		needsSave = true
	}
	if appPrefs.LastTheme == "" {
		appPrefs.LastTheme = "dark"
		needsSave = true
	}
	if appPrefs.LastLanguage == "" {
		appPrefs.LastLanguage = "en"
		needsSave = true
	}
	if !appPrefs.Bounds.IsValid() {
		appPrefs.Bounds = NewBounds()
		needsSave = true
	}

	if !appPrefs.DetailCollapsed && !appPrefs.DebugCollapsed && !appPrefs.HelpCollapsed && !appPrefs.MenuCollapsed {
		defaults := NewAppPreferences()
		appPrefs.DetailCollapsed = defaults.DetailCollapsed
		appPrefs.DebugCollapsed = defaults.DebugCollapsed
		appPrefs.HelpCollapsed = defaults.HelpCollapsed
		appPrefs.MenuCollapsed = defaults.MenuCollapsed
		needsSave = true
	}

	if needsSave {
		if err := SetAppPreferences(&appPrefs); err != nil {
			logging.LogBackend(fmt.Sprintf("Warning: Could not save corrected app preferences: %v", err))
		}
	}

	return appPrefs, nil
}

func SetAppPreferences(appPrefs *AppPreferences) error {
	if err := validateAppPreferences(appPrefs); err != nil {
		return fmt.Errorf("refusing to save invalid preferences: %w", err)
	}

	path := getAppPrefsPath()

	data, err := json.MarshalIndent(appPrefs, "", "  ")
	if err != nil {
		return err
	}

	err = os.MkdirAll(filepath.Dir(path), 0755)
	if err != nil {
		return err
	}

	return os.WriteFile(path, data, 0644)
}

func validateAppPreferences(appPrefs *AppPreferences) error {
	if appPrefs == nil {
		return fmt.Errorf("preferences cannot be nil")
	}

	if appPrefs.RecentProjects == nil {
		return fmt.Errorf("recentProjects field cannot be nil (suggests memory corruption)")
	}

	if appPrefs.SilencedDialogs == nil {
		return fmt.Errorf("silencedDialogs field cannot be nil (suggests memory corruption)")
	}

	if appPrefs.Bounds.Width < 0 || appPrefs.Bounds.Height < 0 {
		return fmt.Errorf("bounds field has negative dimensions (suggests memory corruption)")
	}

	return nil
}

func getAppPrefsPath() string {
	return filepath.Join(getConfigBase(), ToCamel(configBaseApp), "app_prefs.json")
}
