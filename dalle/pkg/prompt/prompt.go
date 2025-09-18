package prompt

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"text/template"

	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/utils"
)

// Template strings and compiled templates
const promptTemplateStr = `{{.LitPrompt false}}Here's the prompt:

Draw a {{.Adverb false}} {{.Adjective false}} {{.Noun true}} with human-like
characteristics feeling {{.Emotion false}}{{.Occupation false}}.

Noun: {{.Noun false}} with human-like characteristics.
Emotion: {{.Emotion false}}.
Occupation: {{.Occupation false}}.
Action: {{.Action false}}.
Artistic style: {{.ArtStyle false 1}}.
{{if .HasLitStyle}}Literary Style: {{.LitStyle false}}.
{{end}}Use only the colors {{.Color true 1}} and {{.Color true 2}}.
{{.Orientation false}}.
{{.BackStyle false}}.

Emphasize the emotional aspect of the image. Look deeply into and expand upon the
many connotative meanings of "{{.Noun true}}," "{{.Emotion true}}," "{{.Adjective true}}",
and "{{.Adverb true}}." Find the representation that most closely matches all the data.

Focus on the emotion, the noun, and the styles.`

const dataTemplateStr = `
Adverb:             {{.Adverb true}}
Adjective:          {{.Adjective true}}
Noun:               {{.Noun true}}
Emotion:            {{.Emotion true}}
Occupation:         {{.Occupation true}}
Action:        	    {{.Action true}}
ArtStyle 1:         {{.ArtStyle true 1}}
ArtStyle 2:         {{.ArtStyle true 2}}
{{if .HasLitStyle}}LitStyle:           {{.LitStyle false}}
{{end}}Orientation:        {{.Orientation true}}
Gaze:               {{.Gaze true}}
BackStyle:          {{.BackStyle true}}
Color 1:            {{.Color false 1}}
Color 2:            {{.Color false 2}}
Color 3:            {{.Color false 3}}
------------------------------------------
Original:           {{.Original}}
Filename:           {{.Filename}}
Seed:               {{.Seed}}
Adverb (full):      {{.Adverb false}}
Adjective (full):   {{.Adjective false}}
Noun (full):        {{.Noun false}}
Emotion (full):     {{.Emotion false}}
Occupation (full):  {{.Occupation false}}
Action (full):      {{.Action false}}
ArtStyle 1 (full):  {{.ArtStyle false 1}}
ArtStyle 2 (full):  {{.ArtStyle false 2}}
{{if .HasLitStyle}}LitStyle (full):    {{.LitStyle true}}
{{end}}Orientation (full): {{.Orientation false}}
Gaze (full):        {{.Gaze false}}
BackStyle:          {{.BackStyle false}}`

const terseTemplateStr = `{{.Adverb false}} {{.Adjective false}} {{.Noun true}} with human-like characteristics feeling {{.Emotion false}}{{.Occupation false}} in the style of {{.ArtStyle true 1}}`

const titleTemplateStr = `{{.Emotion true}} {{.Adverb true}} {{.Adjective true}} {{.Occupation true}} {{.Noun true}}`

const authorTemplateStr = `{{if .HasLitStyle}}You are an award winning author who writes in the literary
style called {{.LitStyle true}}. Take on the persona of such an author.
{{.LitStyle true}} is a genre or literary style that {{.LitStyleDescr}}.{{end}}`

var (
	PromptTemplate = template.Must(template.New("prompt").Parse(promptTemplateStr))
	DataTemplate   = template.Must(template.New("data").Parse(dataTemplateStr))
	TerseTemplate  = template.Must(template.New("terse").Parse(terseTemplateStr))
	TitleTemplate  = template.Must(template.New("title").Parse(titleTemplateStr))
	AuthorTemplate = template.Must(template.New("author").Parse(authorTemplateStr))
)

// EnhancePrompt calls the OpenAI API to enhance a prompt using the given author type.
func EnhancePrompt(prompt, authorType string) (string, error) {
	if os.Getenv("TB_DALLE_NO_ENHANCE") == "1" {
		return prompt, nil
	}
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" { // no key: skip enhancement silently
		return prompt, nil
	}
	return enhancePromptWithClient(prompt, authorType, &http.Client{}, apiKey, json.Marshal)
}

// enhancePromptWithClient is like EnhancePrompt but allows injecting an HTTP client, API key, and marshal function (for testing).
func enhancePromptWithClient(prompt, authorType string, client *http.Client, apiKey string, marshal func(v interface{}) ([]byte, error)) (string, error) {
	_ = authorType
	url := "https://api.openai.com/v1/chat/completions"

	payload := Request{Model: "gpt-4", Seed: 1337, Tempature: 0.2}
	payload.Messages = append(payload.Messages, Message{Role: "system", Content: prompt})
	payloadBytes, err := marshal(payload)
	if err != nil {
		return "", err
	}

	ctx, cancel := context.WithTimeout(context.Background(), deadline)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	utils.DebugCurl("OPENAI CHAT (EnhancePrompt)", "POST", url, map[string]string{
		"Content-Type":  "application/json",
		"Authorization": "Bearer " + apiKey,
	}, payload)

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer func() { _ = resp.Body.Close() }()
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		if len(bodyBytes) > 512 { // truncate to keep logs readable
			bodyBytes = bodyBytes[:512]
		}
		// Try to parse error code from JSON
		var openaiErr struct {
			Error struct {
				Code    string `json:"code"`
				Message string `json:"message"`
				Type    string `json:"type"`
			} `json:"error"`
		}
		code := "OPENAI_ERROR"
		msg := string(bodyBytes)
		if err := json.Unmarshal(bodyBytes, &openaiErr); err == nil && openaiErr.Error.Code != "" {
			code = openaiErr.Error.Code
			msg = openaiErr.Error.Message
			fmt.Printf("[DEBUG] OpenAI error code parsed: %s, message: %s\n", code, msg)
		} else {
			fmt.Printf("[DEBUG] OpenAI error code NOT parsed, fallback code: %s, raw body: %s\n", code, string(bodyBytes))
		}
		// Return a proper OpenAIAPIError so metrics and logging can extract the code
		return "", &OpenAIAPIError{
			Message:    fmt.Sprintf("enhance prompt: %s", msg),
			StatusCode: resp.StatusCode,
			RequestID:  "unused",
			Code:       code,
		}
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	type response struct {
		Choices []struct {
			Message Message `json:"message"`
		} `json:"choices"`
	}
	var r response
	if err := json.Unmarshal(body, &r); err != nil {
		return "", err
	}
	if len(r.Choices) == 0 {
		return prompt, nil
	}
	content := r.Choices[0].Message.Content
	if content == "" { // defensive
		return prompt, nil
	}
	return content, nil
}
