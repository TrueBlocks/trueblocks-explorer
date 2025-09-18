package markdown

import (
	"embed"
	"testing"
)

//go:embed testdata/*
var testAssets embed.FS

func TestLoadMarkdown(t *testing.T) {
	tests := []struct {
		name        string
		basePath    string
		route       string
		language    string
		expected    string
		expectError bool
	}{
		{
			name:        "Localized file exists",
			basePath:    "testdata",
			route:       "example",
			language:    "en",
			expected:    "# Localized content\n",
			expectError: false,
		},
		{
			name:        "Default file exists",
			basePath:    "testdata",
			route:       "example",
			language:    "fr",
			expected:    "# Default content\n",
			expectError: false,
		},
		{
			name:        "File does not exist",
			basePath:    "testdata",
			route:       "nonexistent",
			language:    "en",
			expected:    "",
			expectError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			content, err := LoadMarkdown(testAssets, tt.basePath, tt.language, tt.route, "")
			if (err != nil) != tt.expectError {
				t.Errorf("expected error: %v, got: %v", tt.expectError, err)
			}
			if content != tt.expected {
				t.Errorf("expected content: %q, got: %q", tt.expected, content)
			}
		})
	}
}
