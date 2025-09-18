package image

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/logger"
	coreUtils "github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/utils"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/annotate"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/model"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/progress"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/prompt"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/utils"
)

var (
	openFile     = os.OpenFile
	annotateFunc = annotate.Annotate
	httpGet      = http.Get
	ioCopy       = io.Copy
)

// errString returns the error string or "<nil>" safely
func errString(e error) string {
	if e == nil {
		return "<nil>"
	}
	return e.Error()
}

type ImageData struct {
	EnhancedPrompt string `json:"enhancedPrompt"`
	TersePrompt    string `json:"tersePrompt"`
	TitlePrompt    string `json:"titlePrompt"`
	SeriesName     string `json:"seriesName"`
	Filename       string `json:"filename"`
	Series         string `json:"-"`
	Address        string `json:"-"`
}

// msSince returns elapsed milliseconds since t.
func msSince(t time.Time) int64 { return time.Since(t).Milliseconds() }

func RequestImage(outputPath string, imageData *ImageData, baseURL string) error {
	start := time.Now()
	generated := outputPath
	_ = file.EstablishFolder(generated)
	annotated := strings.ReplaceAll(generated, "/generated", "/annotated")
	_ = file.EstablishFolder(annotated)

	isLandscape := strings.Contains(strings.ToLower(imageData.EnhancedPrompt), "landscape") || strings.Contains(imageData.EnhancedPrompt, "horizontal")
	isPortrait := strings.Contains(strings.ToLower(imageData.EnhancedPrompt), "landscape") || strings.Contains(imageData.EnhancedPrompt, "vertical")

	modelName := "dall-e-3"
	// modelName := "gpt-image-1"

	payload := prompt.Request{
		Prompt: imageData.EnhancedPrompt,
		N:      1,
		Model:  modelName,
	}

	switch modelName {
	case "dall-e-3":
		if isLandscape {
			payload.Size = "1792x1024"
		} else if isPortrait {
			payload.Size = "1024x1792"
		} else {
			payload.Size = "1024x1024"
		}
		payload.Quality = "hd"
		payload.Style = "vivid"
	case "gpt-image-1":
		if isLandscape {
			payload.Size = "1536x1024"
		} else if isPortrait {
			payload.Size = "1024x1536"
		} else {
			payload.Size = "1024x1024"
		}
		payload.Quality = "high"
	default:
		logger.InfoR("image.request.unknown_model", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "model", modelName)
	}

	logger.Info(
		"image.request.start",
		"series", imageData.Series,
		"addr", imageData.Address,
		"file", imageData.Filename,
		"model", modelName,
		"size", payload.Size,
		"quality", payload.Quality,
		"promptLen", len(imageData.EnhancedPrompt),
	)

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal payload: %w", err)
	}

	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		// No key: create a placeholder empty annotated file and return
		placeholder := filepath.Join(annotated, fmt.Sprintf("%s.png", imageData.Filename))
		_ = os.WriteFile(placeholder, []byte{}, 0o600)
		logger.Info("image.request.skip_no_api_key", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "durMs", msSince(start))
		return nil
	}

	imagePostTimeout := 120 * time.Second

	progressMgr := progress.GetProgressManager()
	progressMgr.Transition(imageData.Series, imageData.Address, progress.PhaseImageWait)
	ctx, cancel := context.WithTimeout(context.Background(), imagePostTimeout)
	defer cancel()

	url := baseURL
	if url == "" {
		url = "https://api.openai.com/v1/images/generations"
	}
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)
	utils.DebugCurl("OPENAI IMAGE (RequestImage)", "POST", url, map[string]string{
		"Content-Type":  "application/json",
		"Authorization": "Bearer " + apiKey,
	}, payload)

	client := &http.Client{}
	reqStart := time.Now()
	logger.Info("image.post.send", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename)
	resp, err := client.Do(req)
	if err != nil {
		if ctx.Err() == context.DeadlineExceeded {
			logger.Info("image.post.timeout", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "timeoutMs", imagePostTimeout.Milliseconds())
		}
		return err
	}
	postDur := time.Since(reqStart)

	if resp.StatusCode == http.StatusOK {
		logger.InfoG("image.post.recv", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "status", resp.StatusCode, "durMs", postDur.Milliseconds())
	} else {
		logger.InfoR("image.post.recv", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "status", resp.StatusCode, "durMs", postDur.Milliseconds())
	}

	body, readErr := io.ReadAll(resp.Body)
	if cerr := resp.Body.Close(); cerr != nil && readErr == nil {
		readErr = cerr
	}
	if readErr != nil {
		return readErr
	}
	bodyStr := string(body)
	body = []byte(bodyStr)

	if resp.StatusCode != http.StatusOK {
		var openaiErr struct {
			Error struct {
				Code    string `json:"code"`
				Message string `json:"message"`
				Type    string `json:"type"`
			} `json:"error"`
		}
		code := "OPENAI_ERROR"
		msg := string(body)
		if err := json.Unmarshal(body, &openaiErr); err == nil && openaiErr.Error.Code != "" {
			code = openaiErr.Error.Code
			msg = openaiErr.Error.Message
			logger.InfoR("image.post.error_status", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "code", code, "message", msg)
		} else {
			logger.InfoR("image.openai_error.unparsed", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "code", code, "raw_body", string(body))
		}
		return &prompt.OpenAIAPIError{
			Message:    fmt.Sprintf("image generation: %s", msg),
			StatusCode: resp.StatusCode,
			RequestID:  "unused",
			Code:       code,
		}
	}

	var dalleResp prompt.DalleResponse1
	err = json.Unmarshal(body, &dalleResp)
	if err != nil {
		logger.InfoR("image.post.parse_error", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "error", err.Error())
		return err
	}

	if len(dalleResp.Data) == 0 {
		logger.InfoR("image.post.empty_data", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename)
		return fmt.Errorf("no images returned")
	}

	imageUrl := dalleResp.Data[0].Url
	fn := filepath.Join(generated, fmt.Sprintf("%s.png", imageData.Filename))

	// b64 fallback logic for OpenAI image generate gpt-image-1
	b64Fallback := false
	if imageUrl == "" {
		b64Data := ""
		if len(dalleResp.Data) > 0 {
			b64Data = dalleResp.Data[0].B64Data
		}
		if b64Data != "" {
			decoded, decErr := base64.StdEncoding.DecodeString(b64Data)
			if decErr == nil {
				_ = os.Remove(fn)
				if err := os.WriteFile(fn, decoded, 0o600); err != nil {
					return fmt.Errorf("write b64 image: %w", err)
				}
				logger.InfoG("image.post.b64_fallback", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "bytes", len(decoded))
				progressMgr.UpdateDress(imageData.Series, imageData.Address, func(dd *model.DalleDress) { dd.GeneratedPath = fn; dd.DownloadMode = "b64" })
				progressMgr.Transition(imageData.Series, imageData.Address, progress.PhaseImageDownload)
				logger.Info("image.post.mode", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "mode", "b64")
				b64Fallback = true
			}
		}
		if !b64Fallback { // still missing
			// Log a body snippet (first 200 bytes) to aid debugging
			snippet := bodyStr
			if len(snippet) > 200 {
				snippet = snippet[:200]
			}
			// Error: missing both URL and b64
			logger.InfoR("image.post.missing_url", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "snippet", strings.ReplaceAll(strings.ReplaceAll(snippet, "\n", " "), "\t", " "))
			return fmt.Errorf("image response missing both url and b64_json")
		}
	}
	logger.InfoG("image.post.parsed", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "dataCount", len(dalleResp.Data))
	progressMgr.UpdateDress(imageData.Series, imageData.Address, func(dd *model.DalleDress) { dd.ImageURL = imageUrl })
	if !b64Fallback {
		progressMgr.UpdateDress(imageData.Series, imageData.Address, func(dd *model.DalleDress) { dd.DownloadMode = "url" })
		progressMgr.Transition(imageData.Series, imageData.Address, progress.PhaseImageDownload)
		logger.InfoG("image.post.mode", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "mode", "url")
	}

	dlStart := time.Now()
	if !b64Fallback {
		logger.Info("image.download.start", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename)
		imageResp, err := httpGet(imageUrl)
		if err != nil {
			logger.InfoR("image.download.error", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "error", errString(err))
			return err
		}
		defer func() { _ = imageResp.Body.Close() }()

		_ = os.Remove(fn)
		file, err := openFile(fn, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0o600)
		if err != nil {
			return fmt.Errorf("failed to open file: %s", fn)
		}
		defer func() { _ = file.Close() }()

		written, err := ioCopy(file, imageResp.Body)
		if err != nil {
			logger.InfoR("image.download.read_error", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "error", err.Error())
			return err
		}
		logger.InfoG("image.download.end", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "status", imageResp.StatusCode, "durMs", time.Since(dlStart).Milliseconds(), "bytes", written)
	}

	path, err := annotateFunc(imageData.TersePrompt, fn, "bottom", 0.2)
	if err != nil {
		logger.Info("image.annotate.error", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "error", err.Error())
		return fmt.Errorf("error annotating image: %v", err)
	}
	progressMgr.UpdateDress(imageData.Series, imageData.Address, func(dd *model.DalleDress) { dd.AnnotatedPath = path; dd.GeneratedPath = fn })
	progressMgr.Transition(imageData.Series, imageData.Address, progress.PhaseAnnotate)
	logger.InfoG("image.annotate.end", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "path", strings.TrimSpace(path))
	logger.InfoG("image.request.end", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "durMs", msSince(start))
	if os.Getenv("TB_CMD_LINE") == "true" {
		// utils.System returns exit code (int); treat non-zero as error condition
		if code := coreUtils.System("open " + path); code != 0 {
			logger.InfoR("image.open.error", "series", imageData.Series, "addr", imageData.Address, "file", imageData.Filename, "error", fmt.Sprintf("open command exited with code %d", code))
		}
	}
	return nil
}
