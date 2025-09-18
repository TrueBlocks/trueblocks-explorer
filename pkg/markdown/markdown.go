package markdown

import (
	"embed"
	"errors"
	"fmt"
	"io/fs"
	"strings"
)

func LoadMarkdown(assets embed.FS, basePath, lan, route, tab string) (string, error) {
	subFS, err := fs.Sub(assets, basePath)
	if err != nil {
		return "", err
	}

	route = strings.Replace(strings.ToLower(route), "/", "", 1)
	if route == "" {
		route = "home"
	}
	tab = strings.ToLower(tab)

	filenameLocalizedTab := route + "-" + tab + "." + lan + ".md"
	filenameDefaultTab := route + "-" + tab + ".md"
	filenameLocalized := route + "." + lan + ".md"
	filenameDefault := route + ".md"

	if data, err := fs.ReadFile(subFS, filenameLocalizedTab); err == nil {
		return string(data), nil
	} else if errors.Is(err, fs.ErrNotExist) {
		if data, err := fs.ReadFile(subFS, filenameDefaultTab); err == nil {
			return string(data), nil
		} else if errors.Is(err, fs.ErrNotExist) {
			if data, err := fs.ReadFile(subFS, filenameLocalized); err == nil {
				return string(data), nil
			} else if errors.Is(err, fs.ErrNotExist) {
				if data, err := fs.ReadFile(subFS, filenameDefault); err == nil {
					return string(data), nil
				}
			}
		}
	}

	return "", fmt.Errorf("markdown file not found for %s-%s-%s", route, tab, lan)
}
