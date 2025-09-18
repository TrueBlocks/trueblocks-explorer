package image

import (
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

var openaiAPIURL = "https://api.openai.com/v1/images/generations"

func TestRequestImage_Success(t *testing.T) {
	// Placeholder: Would require refactoring image.go for full dependency injection to test without side effects.
}

func TestRequestImage_MockSuccess(t *testing.T) {
	// Mock OpenAI API image generation response
	openaiServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		_, _ = w.Write([]byte(`{"data":[{"url":"http://mockimage.com/image.png"}]}`))
	}))
	defer openaiServer.Close()

	// Mock image download server
	imageServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
		_, _ = w.Write([]byte("PNGDATA"))
	}))
	defer imageServer.Close()

	oldHTTPGet := httpGet
	httpGet = func(url string) (*http.Response, error) {
		if strings.Contains(url, "mockimage.com") {
			return http.Get(imageServer.URL)
		}
		return http.Get(url)
	}
	defer func() { httpGet = oldHTTPGet }()

	// Patch file operations
	oldOpenFile := openFile
	oldAnnotate := annotateFunc
	defer func() {
		openFile = oldOpenFile
		annotateFunc = oldAnnotate
	}()

	openFile = func(name string, flag int, perm os.FileMode) (*os.File, error) {
		// Return a fake file that implements Write and Close
		return nil, nil // We'll mock io.Copy below
	}
	// Patch io.Copy to avoid writing to a real file
	oldIoCopy := ioCopy
	ioCopy = func(dst io.Writer, src io.Reader) (written int64, err error) {
		return 7, nil // Simulate writing 7 bytes ("PNGDATA")
	}
	defer func() { ioCopy = oldIoCopy }()

	annotateFunc = func(text, fileName, location string, annoPct float64) (string, error) {
		return strings.Replace(fileName, "generated/", "annotated/", 1), nil
	}

	// Patch OpenAI API endpoint to use our mock server
	oldOpenaiAPIURL := openaiAPIURL
	openaiAPIURL = openaiServer.URL
	defer func() { openaiAPIURL = oldOpenaiAPIURL }()

	// For this test, we assume the code uses the correct endpoint.

	imgData := &ImageData{
		EnhancedPrompt: "enhanced prompt",
		TersePrompt:    "terse",
		TitlePrompt:    "title",
		SeriesName:     "testseries",
		Filename:       "testfile",
	}
	// Create a temporary folder for the test
	outputPath := t.TempDir()
	err := RequestImage(outputPath, imgData, openaiServer.URL)
	if err != nil {
		t.Errorf("RequestImage failed: %v", err)
	}
}
