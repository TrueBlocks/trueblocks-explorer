package filewriter

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestNewWriter(t *testing.T) {
	writer := NewWriter()
	if writer == nil {
		t.Fatal("NewWriter returned nil")
	}

	if writer.writeChan == nil {
		t.Error("writeChan not initialized")
	}

	if writer.pending == nil {
		t.Error("pending map not initialized")
	}

	if writer.ctx == nil {
		t.Error("context not initialized")
	}
}

func TestImmediateWrite(t *testing.T) {
	tempDir := t.TempDir()
	testFile := filepath.Join(tempDir, "test.txt")
	testData := []byte("test data")

	writer := NewWriter()
	writer.Start()
	defer func() {
		_ = writer.Shutdown()
	}()

	err := writer.WriteFile(testFile, testData, Immediate)
	if err != nil {
		t.Fatalf("WriteFile failed: %v", err)
	}

	if _, err := os.Stat(testFile); os.IsNotExist(err) {
		t.Error("File was not created")
	}

	content, err := os.ReadFile(testFile)
	if err != nil {
		t.Fatalf("Failed to read file: %v", err)
	}

	if string(content) != string(testData) {
		t.Errorf("File content mismatch: got %q, want %q", string(content), string(testData))
	}
}

func TestBatchedWriteCoalescing(t *testing.T) {
	tempDir := t.TempDir()
	testFile := filepath.Join(tempDir, "test.txt")

	writer := NewWriterWithConfig(Config{
		BatchInterval:   50 * time.Millisecond,
		ChannelBuffer:   10,
		ShutdownTimeout: 100 * time.Millisecond,
	})
	writer.Start()
	defer func() {
		_ = writer.Shutdown()
	}()

	errChan1 := make(chan error, 1)
	errChan2 := make(chan error, 1)
	errChan3 := make(chan error, 1)

	go func() {
		req := WriteRequest{FilePath: testFile, Data: []byte("first"), Priority: Batched, ErrChan: errChan1}
		writer.writeChan <- req
	}()

	go func() {
		req := WriteRequest{FilePath: testFile, Data: []byte("second"), Priority: Batched, ErrChan: errChan2}
		writer.writeChan <- req
	}()

	go func() {
		req := WriteRequest{FilePath: testFile, Data: []byte("third"), Priority: Batched, ErrChan: errChan3}
		writer.writeChan <- req
	}()

	<-errChan1
	<-errChan2
	<-errChan3

	time.Sleep(80 * time.Millisecond)

	metrics := writer.GetMetrics()
	t.Logf("Metrics: Total=%d, Immediate=%d, Batched=%d, Coalesced=%d",
		metrics.TotalRequests, metrics.ImmediateWrites, metrics.BatchedWrites, metrics.CoalescedWrites)

	if metrics.BatchedWrites == 0 {
		t.Error("Expected at least one batched write")
	}
}

func TestShutdownFlushes(t *testing.T) {
	tempDir := t.TempDir()
	testFile := filepath.Join(tempDir, "test.txt")
	testData := []byte("shutdown test")

	writer := NewWriterWithConfig(Config{
		BatchInterval:   10 * time.Millisecond,
		ChannelBuffer:   10,
		ShutdownTimeout: 100 * time.Millisecond,
	})
	writer.Start()

	_ = writer.WriteFile(testFile, testData, OnShutdown)

	err := writer.Shutdown()
	if err != nil {
		t.Fatalf("Shutdown failed: %v", err)
	}

	if _, err := os.Stat(testFile); os.IsNotExist(err) {
		t.Error("OnShutdown write was not flushed during shutdown")
	}
}

func TestPriorityHandling(t *testing.T) {
	tempDir := t.TempDir()

	writer := NewWriterWithConfig(Config{
		BatchInterval:   10 * time.Millisecond,
		ChannelBuffer:   10,
		ShutdownTimeout: 50 * time.Millisecond,
	})
	writer.Start()
	defer func() {
		_ = writer.Shutdown()
	}()

	_ = writer.WriteFile(filepath.Join(tempDir, "test1.txt"), []byte("immediate"), Immediate)
	_ = writer.WriteFile(filepath.Join(tempDir, "test2.txt"), []byte("batched"), Batched)
	_ = writer.WriteFile(filepath.Join(tempDir, "test3.txt"), []byte("shutdown"), OnShutdown)

	time.Sleep(5 * time.Millisecond)

	metrics := writer.GetMetrics()
	if metrics.ImmediateWrites == 0 {
		t.Error("Expected immediate writes to be processed")
	}
}
