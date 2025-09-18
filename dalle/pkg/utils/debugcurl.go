package utils

import (
	"encoding/json"
	"fmt"
	"os"
	"sort"
	"strings"
)

// DebugCurl prints a reproducible curl command for an outbound OpenAI request when
// TB_DEBUG_CURL is set. Output is sent directly to stdout (no logger decorations)
// so it can be copy/pasted. Authorization header is redacted unless
// TB_DEBUG_CURL_REVEAL_KEY is set.
func DebugCurl(label, method, url string, headers map[string]string, body any) {
	if os.Getenv("TB_DEBUG_CURL") == "" {
		return
	}

	// Temporarily toggle off logger decorations for clean curl output (function assumed to toggle state each call)
	// Defensive copy & possible redaction
	h := make(map[string]string, len(headers))
	for k, v := range headers {
		if strings.EqualFold(k, "Authorization") {
			if os.Getenv("TB_DEBUG_CURL_REVEAL_KEY") == "" {
				// Replace value with tokenized environment reference to avoid leaking key
				v = "Bearer $OPENAI_API_KEY"
			}
		}
		h[k] = v
	}

	// Deterministic header order
	keys := make([]string, 0, len(h))
	for k := range h {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var payload string
	if body != nil {
		// Pretty JSON for readability. Ignore marshal errors silently (debug only)
		if b, err := json.MarshalIndent(body, "", "  "); err == nil {
			payload = string(b)
		}
	}

	var b strings.Builder
	fmt.Fprintf(&b, "# %s\n", label)
	fmt.Fprintf(&b, "curl -sS -X %s %s \\\n", method, url)
	for _, k := range keys {
		fmt.Fprintf(&b, "  -H '%s: %s' \\\n", k, EscapeSingleQuotes(h[k]))
	}
	if payload != "" {
		fmt.Fprintf(&b, "  -d '%s'\n", EscapeSingleQuotes(payload))
	} else {
		// Drop trailing backslash if no body added (remove final two chars: space + backslash + newline rebuild)
		out := b.String()
		if strings.HasSuffix(out, " \\\n") {
			out = strings.TrimSuffix(out, " \\\n") + "\n"
		}
		fmt.Print(out)
		return
	}
	out := b.String()
	fmt.Print(out) // raw stdout for copy/paste
}

func EscapeSingleQuotes(s string) string {
	// Within single quotes in POSIX shell, close quote, insert escaped single quote, reopen.
	return strings.ReplaceAll(s, "'", "'\"'\"'")
}
