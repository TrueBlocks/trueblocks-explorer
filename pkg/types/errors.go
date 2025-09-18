package types

import (
	"fmt"
)

// ErrorType represents different categories of errors that can occur
type ErrorType string

const (
	ErrorTypeValidation ErrorType = "validation"
	ErrorTypeSDK        ErrorType = "sdk"
	ErrorTypeNetwork    ErrorType = "network"
	ErrorTypeCache      ErrorType = "cache"
	ErrorTypeStore      ErrorType = "store"
	ErrorTypeUnknown    ErrorType = "unknown"
)

// CollectionError provides structured error information with context
type CollectionError struct {
	Type       ErrorType
	Operation  string
	Collection string
	DataFacet  DataFacet
	Underlying error
	Message    string
}

func (e *CollectionError) Error() string {
	if e.Message != "" {
		return e.Message
	}
	return fmt.Sprintf("%s error in %s collection [%s]: %v", e.Type, e.Collection, e.DataFacet, e.Underlying)
}

func (e *CollectionError) Unwrap() error {
	return e.Underlying
}

// NewValidationError creates an error for invalid parameters or configuration
func NewValidationError(collection string, dataFacet DataFacet, operation string, err error) *CollectionError {
	return &CollectionError{
		Type:       ErrorTypeValidation,
		Operation:  operation,
		Collection: collection,
		DataFacet:  dataFacet,
		Underlying: err,
		Message:    fmt.Sprintf("validation failed for %s in %s collection: %v", dataFacet, collection, err),
	}
}

// NewSDKError creates an error for SDK operation failures
func NewSDKError(collection string, dataFacet DataFacet, operation string, err error) *CollectionError {
	return &CollectionError{
		Type:       ErrorTypeSDK,
		Operation:  operation,
		Collection: collection,
		DataFacet:  dataFacet,
		Underlying: err,
		Message:    fmt.Sprintf("SDK operation '%s' failed for %s in %s collection: %v", operation, dataFacet, collection, err),
	}
}

// NewStoreError creates an error for store operation failures
func NewStoreError(collection string, dataFacet DataFacet, operation string, err error) *CollectionError {
	return &CollectionError{
		Type:       ErrorTypeStore,
		Operation:  operation,
		Collection: collection,
		DataFacet:  dataFacet,
		Underlying: err,
		Message:    fmt.Sprintf("store operation '%s' failed for %s in %s collection: %v", operation, dataFacet, collection, err),
	}
}

// NewCacheError creates an error for cache-related failures
func NewCacheError(collection string, dataFacet DataFacet, operation string, err error) *CollectionError {
	return &CollectionError{
		Type:       ErrorTypeCache,
		Operation:  operation,
		Collection: collection,
		DataFacet:  dataFacet,
		Underlying: err,
		Message:    fmt.Sprintf("cache operation '%s' failed for %s in %s collection: %v", operation, dataFacet, collection, err),
	}
}

// IsValidationError checks if an error is a validation error
func IsValidationError(err error) bool {
	if collErr, ok := err.(*CollectionError); ok {
		return collErr.Type == ErrorTypeValidation
	}
	return false
}

// IsSDKError checks if an error is an SDK operation error
func IsSDKError(err error) bool {
	if collErr, ok := err.(*CollectionError); ok {
		return collErr.Type == ErrorTypeSDK
	}
	return false
}

// IsCacheError checks if an error is a cache-related error
func IsCacheError(err error) bool {
	if collErr, ok := err.(*CollectionError); ok {
		return collErr.Type == ErrorTypeCache
	}
	return false
}

// GetErrorContext extracts error context for better user messages
func GetErrorContext(err error) (ErrorType, string, string) {
	if collErr, ok := err.(*CollectionError); ok {
		return collErr.Type, collErr.Collection, string(collErr.DataFacet)
	}
	return ErrorTypeUnknown, "", ""
}
