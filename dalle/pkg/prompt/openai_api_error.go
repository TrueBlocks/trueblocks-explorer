package prompt

import "fmt"

func indexOf(s, substr string) int {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return i
		}
	}
	return -1
}

// contains is a helper function for string checking
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr ||
		(len(s) > len(substr) &&
			(s[:len(substr)] == substr || s[len(s)-len(substr):] == substr ||
				indexOf(s, substr) >= 0)))
}

// IsRetryableHTTPStatus checks if an HTTP status code indicates a retryable error
func IsRetryableHTTPStatus(statusCode int) bool {
	switch statusCode {
	case 408, 429, 500, 502, 503, 504: // Timeout, Rate limit, Server errors
		return true
	case 400, 401, 403, 404: // Client errors - not retryable
		return false
	default:
		return statusCode >= 500 // Default: retry server errors
	}
}

// IsOpenAIRetryableError determines if an error from OpenAI should be retried
func IsOpenAIRetryableError(err error, statusCode int) bool {
	if err == nil {
		return false
	}

	// Network errors are generally retryable
	errorStr := err.Error()
	if contains(errorStr, "timeout") || contains(errorStr, "connection") ||
		contains(errorStr, "network") || contains(errorStr, "EOF") {
		return true
	}

	// HTTP status-based retry logic
	return IsRetryableHTTPStatus(statusCode)
}

// OpenAIAPIError represents an error from the OpenAI API
type OpenAIAPIError struct {
	Message    string
	StatusCode int
	RequestID  string
	Code       string
}

func (e *OpenAIAPIError) Error() string {
	return fmt.Sprintf("[%s] OpenAI API error (status %d): %s", e.RequestID, e.StatusCode, e.Message)
}

// IsRetryable determines if this error should be retried
func (e *OpenAIAPIError) IsRetryable() bool {
	return IsOpenAIRetryableError(fmt.Errorf("%s", e.Message), e.StatusCode)
}
