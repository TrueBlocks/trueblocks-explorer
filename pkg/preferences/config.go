package preferences

import (
	"embed"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
)

var embeddedConfigData []byte

// SetEmbeddedConfig initializes the embedded configuration data from the main package
func SetEmbeddedConfig(embedFS embed.FS) error {
	data, err := embedFS.ReadFile(".create-local-app.json")
	if err != nil {
		return fmt.Errorf("failed to read embedded .create-local-app.json: %w", err)
	}
	embeddedConfigData = data
	return nil
}

var configBase string

func getConfigBase() string {
	if configBase != "" {
		return configBase
	}

	if xdg := os.Getenv("XDG_CONFIG_HOME"); xdg != "" {
		return filepath.Join(xdg, theOrg.DeveloperName)
	}

	home, err := os.UserHomeDir()
	if err != nil {
		panic("Unable to determine user home directory")
	}

	switch runtime.GOOS {
	case "darwin":
		return filepath.Join(home, "Library", "Application Support", theOrg.DeveloperName)
	case "windows":
		return filepath.Join(os.Getenv("AppData"), theOrg.DeveloperName)
	default:
		return filepath.Join(home, ".config", theOrg.DeveloperName)
	}
}

func GetConfigFolders() (string, string) {
	return getConfigBase(), filepath.Join(getConfigBase(), ToCamel(configBaseApp))
}

func ToProper(s string) string {
	c := cases.Title(language.English)
	return c.String(s)
}

func ToCamel(s string) string {
	// Replace hyphens and underscores with spaces
	s = strings.ReplaceAll(s, "-", " ")
	s = strings.ReplaceAll(s, "_", " ")

	// Split into words and trim whitespace
	words := strings.Fields(strings.TrimSpace(s))
	if len(words) == 0 {
		return ""
	}

	// Initialize title case converter
	titleCaser := cases.Title(language.English)
	lowerCaser := cases.Lower(language.English)

	// Convert first word to lowercase, others to title case
	result := lowerCaser.String(words[0])
	for _, word := range words[1:] {
		result += titleCaser.String(word)
	}

	return result
}

type Id struct {
	AppName  string `json:"appName"`
	BaseName string `json:"baseName"`
	OrgName  string `json:"orgName"`
	Github   string `json:"github"`
	Domain   string `json:"domain"`
	Twitter  string `json:"twitter"`
}

func GetAppId() Id {
	return Id{
		AppName:  strings.Join([]string{theOrg.DeveloperName, configBaseApp}, " "),
		BaseName: configBaseApp,
		OrgName:  theOrg.DeveloperName,
		Github:   configBaseGithub,
		Domain:   configBaseDomain,
		Twitter:  strings.ToLower(theOrg.DeveloperName),
	}
}

const configOrgName = "TrueBlocks"
const configBaseApp = "Explorer"
const configBaseGithub = "github.com/TrueBlocks/trueblocks-core"
const configBaseDomain = "trueblocks.io"

// WailsConfig represents the structure of the wails.json configuration file
type WailsConfig struct {
	Schema           string `json:"$schema"`
	Name             string `json:"name"`
	OutputFilename   string `json:"outputfilename"`
	FrontendInstall  string `json:"frontend:install"`
	FrontendBuild    string `json:"frontend:build"`
	FrontendDevWatch string `json:"frontend:dev:watcher"`
	FrontendDevURL   string `json:"frontend:dev:serverUrl"`
	Author           struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	} `json:"author"`
	Github string `json:"github"`
}

// AppConfig represents the structure of the .create-local-app.json configuration file
type AppConfig struct {
	Organization  string                     `json:"Organization"`
	ProjectName   string                     `json:"ProjectName"`
	Github        string                     `json:"Github"`
	Domain        string                     `json:"Domain"`
	Template      string                     `json:"Template"`
	PreserveFiles []string                   `json:"PreserveFiles"`
	ViewConfig    map[string]ViewConfigEntry `json:"ViewConfig,omitempty"`
}

// ViewConfigEntry represents configuration for a single view in .create-local-app.json
type ViewConfigEntry struct {
	MenuOrder      int             `json:"menuOrder,omitempty"`
	Disabled       bool            `json:"disabled,omitempty"`
	DisabledFacets map[string]bool `json:"disabledFacets,omitempty"`
	FacetOrder     []string        `json:"facetOrder,omitempty"`
}

// LoadAppConfig reads and parses the configuration from .create-local-app.json file,
// falling back to embedded configuration if the file doesn't exist
func LoadAppConfig() (*AppConfig, error) {
	configPath := ".create-local-app.json"

	// First try to read from file system
	if _, err := os.Stat(configPath); err == nil {
		// File exists, read from it
		data, err := os.ReadFile(configPath)
		if err != nil {
			return nil, fmt.Errorf("failed to read .create-local-app.json: %w", err)
		}

		var config AppConfig
		if err := json.Unmarshal(data, &config); err != nil {
			return nil, fmt.Errorf("failed to parse .create-local-app.json: %w", err)
		}

		// Ensure ViewConfig is initialized
		if config.ViewConfig == nil {
			config.ViewConfig = make(map[string]ViewConfigEntry)
		}

		return &config, nil
	}

	// Fall back to embedded configuration
	if embeddedConfigData != nil {
		var config AppConfig
		if err := json.Unmarshal(embeddedConfigData, &config); err != nil {
			return nil, fmt.Errorf("failed to parse embedded configuration: %w", err)
		}

		// Ensure ViewConfig is initialized
		if config.ViewConfig == nil {
			config.ViewConfig = make(map[string]ViewConfigEntry)
		}

		return &config, nil
	}

	// Final fallback to hardcoded default (should not happen in normal operation)
	return getDefaultAppConfig(), nil
}

// getDefaultAppConfig returns the default application configuration
func getDefaultAppConfig() *AppConfig {
	return &AppConfig{
		Organization:  "TrueBlocks, LLC",
		ProjectName:   "explorer",
		Github:        "github.com/TrueBlocks/trueblocks-core",
		Domain:        "trueblocks.io",
		Template:      "default",
		PreserveFiles: []string{},
		ViewConfig: map[string]ViewConfigEntry{
			"exports":     {MenuOrder: 20},
			"monitors":    {MenuOrder: 30},
			"abis":        {MenuOrder: 40},
			"names":       {MenuOrder: 50},
			"chunks":      {MenuOrder: 60},
			"contracts":   {MenuOrder: 70},
			"status":      {MenuOrder: 80},
			"dresses":     {MenuOrder: 90},
			"comparitoor": {MenuOrder: 100},
		},
	}
}

func LoadIdentifiers(embedFS embed.FS) {
	// Initialize embedded configuration
	if err := SetEmbeddedConfig(embedFS); err != nil {
		logging.LogError("Failed to load embedded config", err)
	}

	configData, err := embedFS.ReadFile("wails.json")
	if err != nil {
		logging.LogError("Error reading wails.json", err)
		return
	}

	var config WailsConfig
	if err := json.Unmarshal(configData, &config); err != nil {
		logging.LogError("Error parsing wails.json", err)
		return
	}

	// Display the parsed configuration
	fmt.Printf("Wails Configuration:\n")
	fmt.Printf("  Name: %s\n", config.Name)
	fmt.Printf("  Output filename: %s\n", config.OutputFilename)
	fmt.Printf("  Author: %s (%s)\n", config.Author.Name, config.Author.Email)
	fmt.Printf("  Github: %s\n", config.Github)
}
