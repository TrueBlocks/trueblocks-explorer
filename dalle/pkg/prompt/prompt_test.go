package prompt

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
	"testing"
)

type mockRoundTripper struct {
	Resp *http.Response
	Err  error
}

func (m *mockRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	return m.Resp, m.Err
}

type badReader struct{}

func (badReader) Read([]byte) (int, error) { return 0, errors.New("read error") }
func (badReader) Close() error             { return nil }

func TestEnhancePrompt_Success(t *testing.T) {
	mockBody := `{"choices":[{"message":{"content":"Enhanced prompt!"}}]}`
	client := &http.Client{
		Transport: &mockRoundTripper{
			Resp: &http.Response{
				StatusCode: 200,
				Body:       io.NopCloser(bytes.NewBufferString(mockBody)),
				Header:     make(http.Header),
			},
		},
	}
	result, err := enhancePromptWithClient("prompt", "author", client, "test-key", json.Marshal)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if result != "Enhanced prompt!" {
		t.Errorf("expected 'Enhanced prompt!', got '%s'", result)
	}
}

func TestEnhancePrompt_JSONMarshalError(t *testing.T) {
	client := &http.Client{}
	badMarshal := func(v interface{}) ([]byte, error) { return nil, errors.New("marshal error") }
	_, err := enhancePromptWithClient("prompt", "author", client, "key", badMarshal)
	if err == nil || err.Error() != "marshal error" {
		t.Errorf("expected marshal error, got %v", err)
	}
}

func TestEnhancePrompt_HTTPError(t *testing.T) {
	client := &http.Client{
		Transport: &mockRoundTripper{Err: errors.New("network error")},
	}
	_, err := enhancePromptWithClient("prompt", "author", client, "key", json.Marshal)
	if err == nil || !strings.Contains(err.Error(), "network error") {
		t.Errorf("expected error containing 'network error', got %v", err)
	}
}

func TestEnhancePrompt_BodyReadError(t *testing.T) {
	errReadCloser := io.NopCloser(badReader{})
	client := &http.Client{
		Transport: &mockRoundTripper{
			Resp: &http.Response{
				StatusCode: 200,
				Body:       errReadCloser,
				Header:     make(http.Header),
			},
		},
	}
	_, err := enhancePromptWithClient("prompt", "author", client, "key", json.Marshal)
	if err == nil || err.Error() != "read error" {
		t.Errorf("expected read error, got %v", err)
	}
}

func TestEnhancePrompt_UnmarshalError(t *testing.T) {
	client := &http.Client{
		Transport: &mockRoundTripper{
			Resp: &http.Response{
				StatusCode: 200,
				Body:       io.NopCloser(bytes.NewBufferString("not json")),
				Header:     make(http.Header),
			},
		},
	}
	_, err := enhancePromptWithClient("prompt", "author", client, "key", json.Marshal)
	if err == nil {
		t.Errorf("expected unmarshal error, got nil")
	}
}

func TestEnhancePrompt_EmptyAPIKey(t *testing.T) {
	client := &http.Client{
		Transport: &mockRoundTripper{
			Resp: &http.Response{
				StatusCode: 200,
				Body:       io.NopCloser(bytes.NewBufferString(`{"choices":[{"message":{"content":"Enhanced!"}}]}`)),
				Header:     make(http.Header),
			},
		},
	}
	result, err := enhancePromptWithClient("prompt", "author", client, "", json.Marshal)
	if err != nil || result != "Enhanced!" {
		t.Errorf("expected 'Enhanced!', got '%v', err: %v", result, err)
	}
}

func TestEnhancePromptWithEmptyChoices(t *testing.T) {
	original := "test prompt"
	client := &http.Client{Transport: &mockRoundTripper{Resp: &http.Response{StatusCode: 200, Body: io.NopCloser(bytes.NewBufferString(`{"choices":[]}`)), Header: make(http.Header)}}}
	out, err := enhancePromptWithClient(original, "", client, "fake-key", json.Marshal)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if out != original {
		t.Fatalf("expected fallback to original prompt, got %q", out)
	}
}

func TestEnhancePromptWithNon200(t *testing.T) {
	original := "another prompt"
	client := &http.Client{Transport: &mockRoundTripper{Resp: &http.Response{StatusCode: 500, Body: io.NopCloser(bytes.NewBufferString(`internal error`)), Header: make(http.Header)}}}
	_, err := enhancePromptWithClient(original, "", client, "fake-key", json.Marshal)
	if err == nil {
		t.Fatal("expected error for non-200 status")
	}
}
