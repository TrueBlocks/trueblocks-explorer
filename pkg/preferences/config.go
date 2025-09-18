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
)

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
	AppName string `json:"appName"`
	OrgName string `json:"orgName"`
	Github  string `json:"github"`
	Domain  string `json:"domain"`
	Twitter string `json:"twitter"`
}

func GetAppId() Id {
	return Id{
		AppName: strings.Join([]string{theOrg.DeveloperName, configBaseApp}, " "),
		OrgName: theOrg.DeveloperName,
		Github:  configBaseGithub,
		Domain:  configBaseDomain,
		Twitter: strings.ToLower(theOrg.DeveloperName),
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

func LoadIdentifiers(embedFS embed.FS) {
	configData, err := embedFS.ReadFile("wails.json")
	if err != nil {
		fmt.Printf("Error reading wails.json: %v\n", err)
		return
	}

	var config WailsConfig
	if err := json.Unmarshal(configData, &config); err != nil {
		fmt.Printf("Error parsing wails.json: %v\n", err)
		return
	}

	// Display the parsed configuration
	fmt.Printf("Wails Configuration:\n")
	fmt.Printf("  Name: %s\n", config.Name)
	fmt.Printf("  Output filename: %s\n", config.OutputFilename)
	fmt.Printf("  Author: %s (%s)\n", config.Author.Name, config.Author.Email)
	fmt.Printf("  Github: %s\n", config.Github)
}
