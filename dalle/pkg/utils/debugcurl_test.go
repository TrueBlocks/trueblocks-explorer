package utils

import (
	"bytes"
	"io"
	"os"
	"regexp"
	"strings"
	"testing"
)

// captureStdout runs f while capturing stdout, returning what was printed.
func captureStdout(f func()) string {
	old := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	f()
	_ = w.Close()
	os.Stdout = old
	var buf bytes.Buffer
	_, _ = io.Copy(&buf, r)
	return buf.String()
}

func TestDebugCurlDisabled(t *testing.T) {
	t.Setenv("TB_DEBUG_CURL", "")
	out := captureStdout(func() {
		DebugCurl("LABEL", "POST", "https://example.com", map[string]string{"Authorization": "Bearer sk-test"}, map[string]string{"a": "b"})
	})
	if out != "" {
		t.Fatalf("expected no output when disabled, got: %s", out)
	}
}

func TestDebugCurlRedactsKey(t *testing.T) {
	t.Setenv("TB_DEBUG_CURL", "1")
	t.Setenv("TB_DEBUG_CURL_REVEAL_KEY", "")
	out := captureStdout(func() {
		DebugCurl("LABEL", "POST", "https://example.com", map[string]string{"Authorization": "Bearer sk-live-abcdef"}, map[string]string{"a": "b"})
	})
	if !strings.Contains(out, "curl -sS -X POST https://example.com") {
		t.Fatalf("missing curl line: %s", out)
	}
	if strings.Contains(out, "sk-live-abcdef") {
		t.Fatalf("API key should have been redacted: %s", out)
	}
	if !strings.Contains(out, "Bearer $OPENAI_API_KEY") {
		t.Fatalf("expected env token reference, got: %s", out)
	}
}

func TestDebugCurlRevealKey(t *testing.T) {
	t.Setenv("TB_DEBUG_CURL", "1")
	t.Setenv("TB_DEBUG_CURL_REVEAL_KEY", "1")
	key := "sk-live-abcdef"
	out := captureStdout(func() {
		DebugCurl("LABEL", "POST", "https://example.com", map[string]string{"Authorization": "Bearer " + key}, map[string]string{"a": "b"})
	})
	if !strings.Contains(out, key) {
		t.Fatalf("expected key to be visible when reveal set: %s", out)
	}
}

func TestDebugCurlEscaping(t *testing.T) {
	t.Setenv("TB_DEBUG_CURL", "1")
	t.Setenv("TB_DEBUG_CURL_REVEAL_KEY", "")
	body := map[string]string{"quote": "O'Reilly"}
	out := captureStdout(func() {
		DebugCurl("LABEL", "POST", "https://example.com", map[string]string{"Authorization": "Bearer sk-x"}, body)
	})
	// Ensure single quote was escaped in output
	escRe := regexp.MustCompile(`O'"'"'Reilly`)
	if !escRe.MatchString(out) {
		t.Fatalf("expected escaped single quote, got: %s", out)
	}
}
