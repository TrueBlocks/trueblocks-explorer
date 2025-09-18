package dalle

import (
	"context"
	"errors"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/logger"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"
)

// TextToSpeech converts the given text to speech using OpenAI's audio API and writes it to the provided output directory.
// It returns the full path of the written mp3 file. If the OPENAI_API_KEY is missing, it returns an empty string and no error.
func TextToSpeech(text string, voice string, series string, address string) (string, error) {
	series = strings.ToLower(series)
	address = strings.ToLower(address)
	if text == "" {
		return "", errors.New("empty text")
	}
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" { // silently skip when no key
		logger.Info("speech.skip_no_api_key", "series", series, "addr", address)
		return "", nil
	}
	if voice == "" {
		voice = "alloy"
	}
	baseDir := filepath.Join(storage.OutputDir(), series, "audio")
	_ = os.MkdirAll(baseDir, 0o750)
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute) // using fixed timeout; TODO consider exposing from prompt pkg (deadline was internal)
	defer cancel()

	reqBody := []byte("{\n\t\"model\": \"tts-1\",\n\t\"input\": " + marshalEscaped(text) + ",\n\t\"voice\": \"" + voice + "\"\n}") // from text2speech.go
	var resp *http.Response
	var err error
	for attempt := 0; ; attempt++ {
		req, reqErr := http.NewRequestWithContext(ctx, "POST", "https://api.openai.com/v1/audio/speech", io.NopCloser(bytesReader(reqBody)))
		if reqErr != nil {
			return "", reqErr
		}
		req.Header.Set("Authorization", "Bearer "+apiKey)
		req.Header.Set("Content-Type", "application/json")
		resp, err = (&http.Client{}).Do(req)
		status := 0
		if resp != nil {
			status = resp.StatusCode
		}
		if err == nil && resp.StatusCode == http.StatusOK {
			break
		}
		if err != nil || resp.StatusCode != http.StatusOK {
			statusStr := "<nil>"
			if resp != nil {
				statusStr = resp.Status
			}
			if err != nil {
				logger.InfoR("speech.retry", "series", series, "addr", address, "attempt", attempt+1, "status", status, "error", err.Error())
			} else {
				logger.InfoR("speech.retry", "series", series, "addr", address, "attempt", attempt+1, "status", statusStr)
			}
			if resp != nil {
				_ = resp.Body.Close() // ignore close error on retry path (gosec G104 handled)
			}
			continue
		}
	}
	defer func() { _ = resp.Body.Close() }()
	name := "speech.mp3"
	if address != "" {
		name = address + ".mp3"
	}
	outPath := filepath.Join(baseDir, name)
	cleanOut := filepath.Clean(outPath)
	if !strings.HasPrefix(cleanOut, filepath.Clean(baseDir)+string(os.PathSeparator)) {
		return "", errors.New("invalid audio output path")
	}
	f, err := os.OpenFile(cleanOut, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o600) // #nosec G304 path validated
	if err != nil {
		return "", err
	}
	defer func() { _ = f.Close() }()
	if _, err := io.Copy(f, resp.Body); err != nil {
		return "", err
	}
	logger.InfoG("speech.write", "series", series, "addr", address, "path", outPath)
	return outPath, nil
}

// marshalEscaped produces a JSON string value (with surrounding quotes) escaping quotes/newlines.
func marshalEscaped(s string) string {
	// Basic escaping; we only handle backslash, quote, and newlines for this use case.
	replacer := strings.NewReplacer(
		"\\", "\\\\",
		"\"", "\\\"",
		"\n", "\\n",
	)
	return "\"" + replacer.Replace(s) + "\""
}

// bytesReader returns an io.Reader for the given bytes without importing bytes explicitly elsewhere.
func bytesReader(b []byte) io.Reader { return &byteReader{b: b} }

type byteReader struct{ b []byte }

func (r *byteReader) Read(p []byte) (int, error) {
	if len(r.b) == 0 {
		return 0, io.EOF
	}
	n := copy(p, r.b)
	r.b = r.b[n:]
	return n, nil
}

// GenerateSpeech ensures a text-to-speech mp3 exists for the enhanced prompt of the given address.
// It returns the path to the mp3. If already generated it returns existing path.
func GenerateSpeech(series, address string, lockTTL time.Duration) (string, error) {
	start := time.Now()
	logger.Info("speech.build.start", "series", series, "addr", address)
	if address == "" {
		return "", errors.New("address required")
	}
	cleanupLocks()
	if lockTTL <= 0 {
		lockTTL = 2 * time.Minute
	}
	key := "speech:" + series + ":" + address
	audioPath := filepath.Join(storage.OutputDir(), series, "audio", address+".mp3")
	if file.FileExists(audioPath) { // fast path
		return audioPath, nil
	}
	if !acquireLock(key, lockTTL) { // another generation in progress
		return audioPath, nil
	}
	defer releaseLock(key)
	mc, err := getContext(series)
	if err != nil {
		return "", err
	}
	dd, err := mc.ctx.MakeDalleDress(address)
	if err != nil {
		return "", err
	}
	text := dd.EnhancedPrompt
	if text == "" {
		text = dd.Prompt
	}
	if text == "" {
		return "", errors.New("no prompt text to speak")
	}
	out, err := TextToSpeech(text, "alloy", series, address)
	if err != nil {
		return "", err
	}
	logger.InfoG("speech.build.end", "series", series, "addr", address, "durMs", time.Since(start).Milliseconds())
	return out, nil
}

// Speak plays (or generates then plays) the speech mp3 for the given series/address.
// Returns the path to the mp3 (even if play fails). Generation is skipped if file exists.
func Speak(series, address string) (string, error) {
	if address == "" {
		return "", errors.New("address required")
	}
	audioPath := filepath.Join(storage.OutputDir(), series, "audio", address+".mp3")
	if !file.FileExists(audioPath) {
		// Generate (ignore lock TTL customization here; use default 0 which GenerateSpeech adjusts)
		p, err := GenerateSpeech(series, address, 0)
		if err != nil {
			return "", err
		}
		audioPath = p
	}
	if audioPath == "" { // nothing generated (likely no API key)
		return "", nil
	}
	return audioPath, nil
}

// ReadToMe ensures the mp3 exists (generating if necessary) and always attempts playback.
// It returns the path if the file exists or was generated, else empty string.
func ReadToMe(series, address string) (string, error) {
	if address == "" {
		return "", errors.New("address required")
	}
	audioPath := filepath.Join(storage.OutputDir(), series, "audio", address+".mp3")
	if !file.FileExists(audioPath) {
		p, err := GenerateSpeech(series, address, 0)
		if err != nil {
			return "", err
		}
		audioPath = p
	}
	if audioPath == "" {
		return "", nil
	}
	return audioPath, nil
}

// AudioURL resolves a relative URL (served by internal file server) for an existing or newly generated mp3.
// Returns empty string if generation not possible or file server base URL unknown.
func AudioURL(baseURL, series, address string) (string, error) {
	if address == "" || baseURL == "" {
		return "", nil
	}
	p, err := Speak(series, address)
	if err != nil || p == "" {
		return "", err
	}
	// Derive relative path segment after output dir root
	rel := strings.TrimPrefix(p, storage.OutputDir()+"/")
	rel = strings.TrimPrefix(rel, "/")
	if rel == "" {
		return "", nil
	}
	if !strings.HasSuffix(baseURL, "/") {
		baseURL += "/"
	}
	return baseURL + rel, nil
}
