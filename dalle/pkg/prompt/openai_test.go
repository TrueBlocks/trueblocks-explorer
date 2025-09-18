package prompt

import (
	"encoding/json"
	"testing"
)

func TestDalleRequest_String(t *testing.T) {
	req := &Request{
		Input:     "input text",
		Prompt:    "prompt text",
		N:         1,
		Quality:   "standard",
		Model:     "gpt-4",
		Style:     "vivid",
		Size:      "1024x1024",
		Seed:      42,
		Tempature: 0.5,
		Messages:  []Message{{Role: "system", Content: "hello"}},
	}
	jsonStr := req.String()
	if len(jsonStr) == 0 {
		t.Error("String() returned empty JSON string")
	}
	var out map[string]interface{}
	if err := json.Unmarshal([]byte(jsonStr), &out); err != nil {
		t.Errorf("String() did not return valid JSON: %v", err)
	}
	if out["Prompt"] != "prompt text" && out["prompt"] != "prompt text" {
		t.Errorf("Expected prompt field in JSON map")
	}
}

func TestDalleResponse1_Unmarshal(t *testing.T) {
	jsonData := `{"data":[{"url":"http://example.com/image.png"}]}`
	var resp DalleResponse1
	if err := json.Unmarshal([]byte(jsonData), &resp); err != nil {
		t.Fatalf("Failed to unmarshal dalleResponse1: %v", err)
	}
	if len(resp.Data) != 1 || resp.Data[0].Url != "http://example.com/image.png" {
		t.Errorf("Unexpected data in dalleResponse1: %+v", resp)
	}
}
