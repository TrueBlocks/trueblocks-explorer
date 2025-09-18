package project

import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// ------------------------------------------------------------------------------------
type ViewStateKey struct {
	ViewName  string          `json:"viewName"`
	FacetName types.DataFacet `json:"facetName"`
}

// MarshalText implements the encoding.TextMarshaler interface
// This allows ViewStateKey to be used as a map key in JSON
func (vsk ViewStateKey) MarshalText() ([]byte, error) {
	return []byte(fmt.Sprintf("%s:%s", vsk.ViewName, vsk.FacetName)), nil
}

// UnmarshalText implements the encoding.TextUnmarshaler interface
// This allows ViewStateKey to be used as a map key in JSON
func (vsk *ViewStateKey) UnmarshalText(text []byte) error {
	str := string(text)
	parts := strings.SplitN(str, ":", 2)
	if len(parts) != 2 {
		return fmt.Errorf("invalid ViewStateKey format: %s", str)
	}
	vsk.ViewName = parts[0]
	vsk.FacetName = types.DataFacet(parts[1])
	return nil
}
