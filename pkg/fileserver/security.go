package fileserver

import (
	"mime"
	"net/http"
)

func init() {
	// Register common image MIME types
	_ = mime.AddExtensionType(".png", "image/png")
	_ = mime.AddExtensionType(".jpg", "image/jpeg")
	_ = mime.AddExtensionType(".jpeg", "image/jpeg")
	_ = mime.AddExtensionType(".gif", "image/gif")
	_ = mime.AddExtensionType(".webp", "image/webp")
	_ = mime.AddExtensionType(".svg", "image/svg+xml")
	_ = mime.AddExtensionType(".avif", "image/avif")
}

// SecurityMiddleware adds security headers to responses
func SecurityMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set security headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Content-Security-Policy", "default-src 'self'")

		// Allow CORS from Wails app
		w.Header().Set("Access-Control-Allow-Origin", "*") // For local development
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle OPTIONS requests for CORS
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// LoggingMiddleware logs information about requests
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		next.ServeHTTP(w, r)
	})
}
