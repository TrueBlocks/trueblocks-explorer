package dresses

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"

	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/model"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"
)

// loadCurrentDressFromSidecars attempts to reconstruct a model.DalleDress from existing sidecar files
// without triggering any creation. Returns nil if no relevant sidecars exist.
func loadCurrentDressFromSidecars(series, address string) *model.DalleDress {
	if address == "" || series == "" {
		return nil
	}
	addrLower := strings.ToLower(address)
	root := storage.OutputDir()
	filename := sanitizeFilename(addrLower)
	selectorPath := filepath.Join(root, series, "selector", filename+".json")

	var dd *model.DalleDress
	if b, err := os.ReadFile(selectorPath); err == nil {
		tmp := model.DalleDress{}
		if json.Unmarshal(b, &tmp) == nil {
			dd = &tmp
		}
	}

	// If no selector JSON, attempt to assemble prompts directly
	if dd == nil {
		// Minimal reconstruction; seed/attributes intentionally omitted to avoid re-execution logic
		dd = &model.DalleDress{
			Original: address,
			FileName: filename,
		}
		// Attempt to read individual prompt files
		dd.Prompt = readIfExists(filepath.Join(root, series, "prompt", filename+".txt"))
		dd.DataPrompt = readIfExists(filepath.Join(root, series, "data", filename+".txt"))
		dd.TitlePrompt = readIfExists(filepath.Join(root, series, "title", filename+".txt"))
		dd.TersePrompt = readIfExists(filepath.Join(root, series, "terse", filename+".txt"))
		dd.EnhancedPrompt = readIfExists(filepath.Join(root, series, "enhanced", filename+".txt"))
	}

	annotatedPath := filepath.Join(root, series, "annotated", addrLower+".png")
	if _, err := os.Stat(annotatedPath); err == nil {
		dd.AnnotatedPath = annotatedPath
		dd.Completed = true
		dd.CacheHit = true
	}
	return dd
}

// sanitizeFilename mirrors the dalle.validFilename (unexported) logic for our limited needs.
func sanitizeFilename(in string) string {
	replace := []string{"/", "\\", ":", "*", "?", "\"", "<", ">", "|"}
	for _, c := range replace {
		in = strings.ReplaceAll(in, c, "_")
	}
	in = strings.TrimSpace(in)
	for strings.Contains(in, "__") { // collapse doubles produced by replacements
		in = strings.ReplaceAll(in, "__", "_")
	}
	return in
}

func readIfExists(p string) string {
	b, err := os.ReadFile(p)
	if err != nil {
		return ""
	}
	return string(b)
}
