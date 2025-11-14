package preferences

import (
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/filewriter"
)

type UserPreferences struct {
	Version string  `json:"version,omitempty"`
	Name    string  `json:"name,omitempty"`
	Email   string  `json:"email,omitempty"`
	Chains  []Chain `json:"chains,omitempty"`
}

func NewUserPreferences() *UserPreferences {
	return &UserPreferences{
		Version: "1.0",
		Chains:  []Chain{},
	}
}

func (u *UserPreferences) String() string {
	bytes, _ := json.Marshal(u)
	return string(bytes)
}

func GetUserPreferences() (UserPreferences, error) {
	path := getUserPrefsPath()

	if _, err := os.Stat(path); os.IsNotExist(err) {
		defaults := NewUserPreferences()

		if err := SetUserPreferences(defaults); err != nil {
			return UserPreferences{}, err
		}

		return *defaults, nil
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return UserPreferences{}, err
	}

	var userPrefs UserPreferences
	if err := json.Unmarshal(data, &userPrefs); err != nil {
		return UserPreferences{}, err
	}

	if userPrefs.Chains == nil {
		userPrefs.Chains = []Chain{}
	}

	return userPrefs, nil
}

func SetUserPreferences(userPrefs *UserPreferences) error {
	return SetUserPreferencesWithPriority(userPrefs, filewriter.Immediate)
}

func SetUserPreferencesWithPriority(userPrefs *UserPreferences, priority filewriter.Priority) error {
	path := getUserPrefsPath()

	data, err := json.MarshalIndent(userPrefs, "", "  ")
	if err != nil {
		return err
	}

	writer := filewriter.GetGlobalWriter()
	return writer.WriteFile(path, data, priority)
}

func getUserPrefsPath() string {
	return filepath.Join(getConfigBase(), "user_prefs.json")
}
