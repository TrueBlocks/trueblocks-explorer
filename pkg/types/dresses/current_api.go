package dresses

import (
	dalle "github.com/TrueBlocks/trueblocks-dalle/v6"
	"github.com/TrueBlocks/trueblocks-dalle/v6/pkg/model"
	"github.com/TrueBlocks/trueblocks-dalle/v6/pkg/progress"
)

func GetCurrentDressFor(series, address string) *model.DalleDress {
	if address == "" {
		return &model.DalleDress{}
	}
	if series == "" {
		series = "empty"
	}
	// Always attempt creation (cached path is fast if image exists)
	_, _ = dalle.GenerateAnnotatedImage(series, address, false, 0)
	if pr := progress.GetProgress(series, address); pr != nil && pr.DalleDress != nil {
		dd := *pr.DalleDress
		if dd.AnnotatedPath != "" {
			dd.Completed = true
			if pr.CacheHit {
				dd.CacheHit = true
			}
		}
		return &dd
	}
	return &model.DalleDress{}
}
