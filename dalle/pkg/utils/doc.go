// Package utils provides narrowly-scoped helpers shared across packages:
//
//   - Filename sanitation (ValidFilename)
//   - Simple string transforms (Reverse)
//   - Debug/diagnostic helpers (DebugCurl)
//   - File cleanup helpers (Clean)
//
// Keep this package small and only for cross-cutting helpers that do not
// deserve their own domain package.
package utils
