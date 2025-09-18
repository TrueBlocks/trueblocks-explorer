package comparitoor

import (
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// AnnotatedTransaction wraps sdk.Transaction with missing/unique flags for frontend rendering
type AnnotatedTransaction struct {
	sdk.Transaction
	Missing bool `json:"missing"`
	Unique  bool `json:"unique"`
}
