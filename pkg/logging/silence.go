package logging

import (
	"io"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/logger"
)

func Silence() func() {
	original := logger.GetLoggerWriter()
	logger.SetLoggerWriter(io.Discard)
	return func() {
		logger.SetLoggerWriter(original) // Restore original state
	}
}
