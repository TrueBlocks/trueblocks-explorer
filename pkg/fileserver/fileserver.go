package fileserver

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path"
	"strings"
	"sync"
	"time"
)

// FileServer handles serving generated images via HTTP
type FileServer struct {
	server    *http.Server
	basePath  string
	port      int
	running   bool
	urlPrefix string
	mutex     sync.Mutex
}

// currentInstance holds a reference to the most recently started file server.
var currentInstance *FileServer

// NewFileServer creates a new file server instance
func NewFileServer(basePath string) *FileServer {
	return &FileServer{
		basePath:  basePath,
		port:      0, // Will be determined
		running:   false,
		urlPrefix: "/images/",
	}
}

// Start initializes and starts the file server
func (fs *FileServer) Start() error {
	fs.mutex.Lock()
	defer fs.mutex.Unlock()

	if fs.running {
		return nil // Already running
	}

	if fs.basePath == "" {
		return fmt.Errorf("file server requires basePath")
	}
	if stat, err := os.Stat(fs.basePath); err != nil || !stat.IsDir() {
		return fmt.Errorf("file server basePath invalid: %s", fs.basePath)
	}

	// Find available port
	port, err := findAvailablePort(8090)
	if err != nil {
		return fmt.Errorf("failed to find available port: %w", err)
	}
	fs.port = port

	// Create server
	mux := http.NewServeMux()
	fileHandler := http.FileServer(http.Dir(fs.basePath))

	// Apply middleware for security and logging
	handler := LoggingMiddleware(SecurityMiddleware(http.StripPrefix(fs.urlPrefix, fileHandler)))
	mux.Handle(fs.urlPrefix, handler)

	// Configure server
	fs.server = &http.Server{
		Addr:    fmt.Sprintf("127.0.0.1:%d", fs.port),
		Handler: mux,
	}

	// Start server in goroutine
	go func() {
		fs.running = true
		currentInstance = fs
		log.Printf("File server started at http://127.0.0.1:%d serving files from %s", fs.port, fs.basePath)
		if err := fs.server.ListenAndServe(); err != http.ErrServerClosed {
			log.Printf("File server error: %v", err)
		}
		fs.running = false
		if currentInstance == fs { // reset global if this instance stops
			currentInstance = nil
		}
	}()

	return nil
}

// Stop gracefully shuts down the file server
func (fs *FileServer) Stop() error {
	fs.mutex.Lock()
	defer fs.mutex.Unlock()

	if !fs.running || fs.server == nil {
		return nil // Not running, nothing to do
	}

	// Create a context with timeout for shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	log.Printf("Stopping file server on port %d", fs.port)

	// Shutdown the server
	err := fs.server.Shutdown(ctx)
	if err != nil {
		return fmt.Errorf("error shutting down file server: %w", err)
	}

	fs.running = false
	return nil
}

// UpdateBasePath changes the base directory and restarts the server
func (fs *FileServer) UpdateBasePath(newPath string) error {
	fs.mutex.Lock()
	defer fs.mutex.Unlock()
	if newPath == "" {
		return fmt.Errorf("new path empty")
	}
	if stat, err := os.Stat(newPath); err != nil || !stat.IsDir() {
		return fmt.Errorf("invalid new path: %s", newPath)
	}
	if fs.running && fs.server != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := fs.server.Shutdown(ctx); err != nil {
			return fmt.Errorf("shutdown: %w", err)
		}
		fs.running = false
	}
	fs.basePath = newPath
	if fs.server != nil {
		return fs.Start()
	}
	return nil
}

// GetBasePath returns the current base path of the file server
func (fs *FileServer) GetBasePath() string {
	fs.mutex.Lock()
	defer fs.mutex.Unlock()
	return fs.basePath
}

// GetBaseURL returns the base URL (including trailing slash) for the active file server instance.
func (fs *FileServer) GetBaseURL() string {
	fs.mutex.Lock()
	defer fs.mutex.Unlock()
	if !fs.running || fs.port == 0 {
		return ""
	}
	return fmt.Sprintf("http://127.0.0.1:%d%s", fs.port, fs.urlPrefix)
}

// CurrentBaseURL returns the base URL for the globally tracked running file server, if any.
func CurrentBaseURL() string {
	if currentInstance == nil {
		return ""
	}
	return currentInstance.GetBaseURL()
}

// Helper function to find an available port
func findAvailablePort(basePort int) (int, error) {
	for port := basePort; port < basePort+100; port++ {
		addr := fmt.Sprintf("127.0.0.1:%d", port)
		ln, err := net.Listen("tcp", addr)
		if err == nil {
			_ = ln.Close()
			return port, nil
		}
	}
	return 0, fmt.Errorf("no available ports found in range %d-%d", basePort, basePort+100)
}

// GetURL returns the URL for accessing a specific image
func (fs *FileServer) GetURL(relativePath string) string {
	// No need for locking here - we're just reading values
	if !fs.running || fs.port == 0 {
		return "" // Server not running, can't generate URL
	}

	// Clean the path to prevent directory traversal
	relativePath = path.Clean(relativePath)

	// Ensure the path doesn't start with a slash
	relativePath = strings.TrimPrefix(relativePath, "/")

	// Construct the URL
	return fmt.Sprintf("http://127.0.0.1:%d%s%s",
		fs.port, fs.urlPrefix, relativePath)
}
