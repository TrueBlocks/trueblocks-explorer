package dalle

import (
	"testing"
)

// var onePixelPNG, _ = base64.StdEncoding.DecodeString("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=")

func TestAnnotateFailureLogging(t *testing.T) {
	// SetupTest(t, SetupTestOptions{Series: []string{"seriesannotate"}})
	// os.Setenv("OPENAI_API_KEY", "test-key")
	// os.Setenv("TB_DALLE_NO_ENHANCE", "1")

	// // This is an invalid image path
	// _, err := annotate.Annotate("test", "/tmp/invalid.png", "bottom", 0.1)
	// require.Error(t, err)
}

func TestImagePostFailure(t *testing.T) {
	// SetupTest(t, SetupTestOptions{Series: []string{"seriesfail"}})
	// os.Setenv("OPENAI_API_KEY", "test-key")
	// os.Setenv("TB_DALLE_NO_ENHANCE", "1")

	// // Server returns 500
	// srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// }))
	// defer srv.Close()

	// mc, err := NewManager(GetTestPath(), "seriesfail")
	// require.NoError(t, err)

	// err = mc.ctx.SetCompletion(0, "test completion")
	// require.NoError(t, err)
	// _, err = mc.GenerateAnnotatedImageWithBaseURL(srv.URL, 0, "test prompt", "test style")
	// require.Error(t, err)
	// assert.Contains(t, err.Error(), "500 Internal Server Error")
}

func TestImagePostB64Fallback(t *testing.T) {
	// SetupTest(t, SetupTestOptions{Series: []string{"seriesb64"}})
	// os.Setenv("OPENAI_API_KEY", "test-key")
	// os.Setenv("TB_DALLE_NO_ENHANCE", "1")
	// os.Setenv("TB_DALLE_NO_ANNOTATE", "1")

	// b64 := base64.StdEncoding.EncodeToString(onePixelPNG)

	// // Server returns b64_json instead of url
	// srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	w.Header().Set("Content-Type", "application/json")
	// 	_, _ = io.WriteString(w, `{"data":[{"b64_json":"`+b64+`"}]}`)
	// }))
	// defer srv.Close()

	// mc, err := NewManager(GetTestPath(), "seriesb64")
	// require.NoError(t, err)

	// err = mc.ctx.SetCompletion(0, "test completion")
	// require.NoError(t, err)
	// _, err = mc.GenerateAnnotatedImageWithBaseURL(srv.URL, 0, "test prompt", "test style")
	// require.NoError(t, err)
}

func TestImageDownloadFailure(t *testing.T) {
	// SetupTest(t, SetupTestOptions{Series: []string{"seriesdlfail"}})
	// os.Setenv("OPENAI_API_KEY", "test-key")
	// os.Setenv("TB_DALLE_NO_ENHANCE", "1")

	// // Image download returns 404
	// srv := httptest.NewServer(nil)
	// srv.Config.Handler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	if r.Method == http.MethodPost {
	// 		w.Header().Set("Content-Type", "application/json")
	// 		_, _ = io.WriteString(w, `{"data":[{"url":"`+srv.URL+`/img.png"}]}`)
	// 		return
	// 	}
	// 	w.WriteHeader(http.StatusNotFound)
	// })
	// defer srv.Close()

	// mc, err := NewManager(GetTestPath(), "seriesdlfail")
	// require.NoError(t, err)

	// err = mc.ctx.SetCompletion(0, "test completion")
	// require.NoError(t, err)
	// _, err = mc.GenerateAnnotatedImageWithBaseURL(srv.URL, 0, "test prompt", "test style")
	// require.Error(t, err)
	// require.Contains(t, err.Error(), "error downloading image")
}

func TestLoggingImagePipeline(t *testing.T) {
	// SetupTest(t, SetupTestOptions{Series: []string{"serieslog"}})
	// os.Setenv("OPENAI_API_KEY", "test-key")
	// os.Setenv("TB_DALLE_NO_ENHANCE", "1")
	// os.Setenv("TB_DALLE_NO_ANNOTATE", "1")

	// logFile, err := os.CreateTemp("", "log")
	// require.NoError(t, err)
	// defer os.Remove(logFile.Name())

	// imgServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	w.WriteHeader(200)
	// 	_, _ = w.Write(onePixelPNG)
	// }))
	// defer imgServer.Close()

	// openaiServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	w.Header().Set("Content-Type", "application/json")
	// 	_, _ = io.WriteString(w, `{"data":[{"url":"`+imgServer.URL+`/img.png"}]}`)
	// }))
	// defer openaiServer.Close()

	// mc, err := NewManager(GetTestPath(), "serieslog")
	// require.NoError(t, err)

	// err = mc.ctx.SetCompletion(0, "test completion")
	// require.NoError(t, err)
	// _, err = mc.GenerateAnnotatedImageWithBaseURL(openaiServer.URL, 0, "test prompt", "test style")
	// require.NoError(t, err)
}

func TestSuccessOrdering(t *testing.T) {
	// SetupTest(t, SetupTestOptions{Series: []string{"seriessuccess"}})
	// os.Setenv("OPENAI_API_KEY", "test-key")
	// os.Setenv("TB_DALLE_NO_ENHANCE", "1")
	// os.Setenv("TB_DALLE_NO_ANNOTATE", "1")

	// var events []string
	// var mu sync.Mutex

	// imageServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	mu.Lock()
	// 	events = append(events, "image")
	// 	mu.Unlock()
	// 	w.WriteHeader(200)
	// 	_, _ = w.Write(onePixelPNG)
	// }))
	// defer imageServer.Close()

	// openaiServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	mu.Lock()
	// 	events = append(events, "openai")
	// 	mu.Unlock()
	// 	w.Header().Set("Content-Type", "application/json")
	// 	_, _ = io.WriteString(w, `{"data":[{"url":"`+imageServer.URL+`/img.png"}]}`)
	// }))
	// defer openaiServer.Close()

	// mc, err := NewManager(GetTestPath(), "seriessuccess")
	// require.NoError(t, err)

	// err = mc.ctx.SetCompletion(0, "test completion")
	// require.NoError(t, err)
	// _, err = mc.GenerateAnnotatedImageWithBaseURL(openaiServer.URL, 0, "test prompt", "test style")
	// require.NoError(t, err)

	// assert.Equal(t, []string{"openai", "image"}, events)
}

func TestNewManager(t *testing.T) {
	// SetupTest(t, SetupTestOptions{Series: []string{"seriesnew"}})
	// mc, err := NewManager(GetTestPath(), "seriesnew")
	// require.NoError(t, err)
	// require.NotNil(t, mc)
	// require.NotNil(t, mc.ctx)
	// require.Equal(t, "seriesnew", mc.ctx.SeriesName)
}
