package logging

import (
	"errors"
	"log"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/colors"
)

func LogBackend(msg string) {
	log.Println(colors.BrightBlue+"BACKEND", msg, colors.Off)
}

func LogFrontend(msg string) {
	log.Println(colors.Green+"FRONTEND", msg, colors.Off)
}

// LogError logs an error message with optional exclusion of specific errors using errors.Is
func LogError(msg string, err error, exclude ...error) {
	if err == nil {
		return
	}

	// Check if the error matches any in the exclude list
	for _, excluded := range exclude {
		if excluded != nil && errors.Is(err, excluded) {
			return
		}
	}

	log.Println(colors.Red+"ERROR", msg+":", err.Error(), colors.Off)
}
