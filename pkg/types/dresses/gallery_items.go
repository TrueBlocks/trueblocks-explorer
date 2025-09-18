package dresses

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/fileserver"
)

var addrPattern = regexp.MustCompile(`0x[0-9a-fA-F]{40}`)

func collectGalleryItemsForSeries(outputDir, series string) ([]*DalleDress, error) {
	annotated := filepath.Join(outputDir, series, "annotated")
	entries, err := os.ReadDir(annotated)
	if err != nil {
		return nil, nil
	}
	baseURL := fileserver.CurrentBaseURL()
	items := make([]*DalleDress, 0, len(entries))
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		name := e.Name()
		if !strings.HasSuffix(strings.ToLower(name), ".png") {
			continue
		}
		address := ""
		if m := addrPattern.FindString(name); m != "" {
			address = strings.ToLower(m)
		}
		info, ierr := e.Info()
		modTime := time.Now().Unix()
		size := int64(0)
		if ierr == nil {
			modTime = info.ModTime().Unix()
			size = info.Size()
		}
		annotatedPath := filepath.Join(series, "annotated", name)
		served := strings.ReplaceAll(annotatedPath, string(filepath.Separator), "/")
		url := "file://" + outputDir + "/" + served
		if baseURL != "" {
			url = baseURL + served
		}
		items = append(items, &DalleDress{
			Series:        series,
			Original:      address,
			ImageURL:      url,
			AnnotatedPath: annotatedPath,
			FileName:      name,
			ModifiedAt:    modTime,
			FileSize:      size,
		})
	}
	return items, nil
}
