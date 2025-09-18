package prompt

// DalleResponse1 represents the JSON structure returned by OpenAI image generation endpoints
// that contain either direct URLs or base64-encoded image data. This was previously defined
// privately in the root package as dalleResponse1 and has been moved here for reuse.
type DalleResponse1 struct {
	Data []struct {
		Url     string `json:"url"`
		B64Data string `json:"b64_json"`
	} `json:"data"`
}
