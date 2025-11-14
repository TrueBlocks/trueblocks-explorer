package preferences

import (
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/filewriter"
)

type OrgPreferences struct {
	Version       string `json:"version,omitempty"`
	Telemetry     bool   `json:"telemetry,omitempty"`
	Theme         string `json:"theme,omitempty"`
	Language      string `json:"language,omitempty"`
	DeveloperName string `json:"developerName,omitempty"`
	LogLevel      string `json:"logLevel,omitempty"`
	Experimental  bool   `json:"experimental,omitempty"`
	SupportURL    string `json:"supportUrl,omitempty"`
}

func (o *OrgPreferences) String() string {
	bytes, _ := json.Marshal(o)
	return string(bytes)
}

// NewOrgPreferences creates a new OrgPreferences instance with default values
func NewOrgPreferences() *OrgPreferences {
	return &OrgPreferences{
		Version:       "1.0",
		Telemetry:     false,
		Theme:         "dark",
		Language:      "en",
		DeveloperName: configOrgName,
		LogLevel:      "info",
		Experimental:  false,
		SupportURL:    "https://" + configBaseDomain + "/support",
	}
}

// The app has only a single instance of OrgPreferences
var theOrg = NewOrgPreferences()

func GetOrgPreferences() (OrgPreferences, error) {
	path := getOrgPrefsPath()

	if _, err := os.Stat(path); os.IsNotExist(err) {
		if err := SetOrgPreferences(theOrg); err != nil {
			return OrgPreferences{}, err
		}

		return *theOrg, nil
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return OrgPreferences{}, err
	}

	var orgPrefs OrgPreferences
	if err := json.Unmarshal(data, &orgPrefs); err != nil {
		return OrgPreferences{}, err
	}

	return orgPrefs, nil
}

func SetOrgPreferences(orgPrefs *OrgPreferences) error {
	return SetOrgPreferencesWithPriority(orgPrefs, filewriter.Immediate)
}

func SetOrgPreferencesWithPriority(orgPrefs *OrgPreferences, priority filewriter.Priority) error {
	path := getOrgPrefsPath()

	data, err := json.MarshalIndent(orgPrefs, "", "  ")
	if err != nil {
		return err
	}

	writer := filewriter.GetGlobalWriter()
	return writer.WriteFile(path, data, priority)
}

func getOrgPrefsPath() string {
	return filepath.Join(getConfigBase(), "org_prefs.json")
}
