package filewriter

import (
	"sync"
	"time"
)

type Config struct {
	BatchInterval   time.Duration
	ChannelBuffer   int
	ShutdownTimeout time.Duration
}

func DefaultConfig() Config {
	return Config{
		BatchInterval:   DefaultBatchInterval,
		ChannelBuffer:   ChannelBufferSize,
		ShutdownTimeout: ShutdownTimeout,
	}
}

func NewWriterWithConfig(config Config) *Writer {
	writer := NewWriter()
	writer.batchTicker.Stop()
	writer.batchTicker = time.NewTicker(config.BatchInterval)
	return writer
}

var (
	globalWriter *Writer
	once         sync.Once
)

func GetGlobalWriter() *Writer {
	once.Do(func() {
		globalWriter = NewWriter()
		globalWriter.Start()
	})
	return globalWriter
}

func InitializeGlobalWriter(config Config) {
	// Force initialization first
	_ = GetGlobalWriter()

	if globalWriter != nil {
		_ = globalWriter.Shutdown()
	}
	globalWriter = NewWriterWithConfig(config)
	globalWriter.Start()
}

func ShutdownGlobalWriter() error {
	if globalWriter == nil {
		return nil
	}
	return globalWriter.Shutdown()
}
