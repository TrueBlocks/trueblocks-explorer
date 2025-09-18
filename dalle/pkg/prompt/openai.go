package prompt

import (
	"encoding/json"
	"time"
)

var deadline = 60 * time.Second

// Message represents a message for the OpenAI API request.
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// Request represents a request payload for the OpenAI API.
type Request struct {
	Input     string    `json:"input,omitempty"`
	Prompt    string    `json:"prompt,omitempty"`
	N         int       `json:"n,omitempty"`
	Quality   string    `json:"quality,omitempty"`
	Model     string    `json:"model,omitempty"`
	Style     string    `json:"style,omitempty"`
	Size      string    `json:"size,omitempty"`
	Seed      int       `json:"seed,omitempty"`
	Tempature float64   `json:"temperature,omitempty"`
	Messages  []Message `json:"messages,omitempty"`
}

// String returns the JSON representation of the Request.
func (req *Request) String() string {
	bytes, _ := json.MarshalIndent(req, "", "  ")
	return string(bytes)
}
