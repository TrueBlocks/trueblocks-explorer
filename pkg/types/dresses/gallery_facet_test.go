package dresses

import (
	"testing"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

func TestDressesGalleryPageUsesDresses(t *testing.T) {
	payload := &types.Payload{Collection: "dresses", DataFacet: DressesGallery}
	coll := GetDressesCollection(payload)
	coll.FetchByFacet(DressesGallery)
	pageAny, err := coll.GetPage(payload, 0, 25, sdk.SortSpec{}, "")
	if err != nil {
		t.Fatalf("GetPage gallery failed: %v", err)
	}
	page, ok := pageAny.(*DressesPage)
	if !ok {
		t.Fatalf("unexpected page type: %T", pageAny)
	}
	if page.DalleDress == nil {
		t.Fatalf("expected Dresses slice to be non-nil")
	}
	if len(page.Logs) != 0 {
		t.Fatalf("expected Logs empty for gallery facet, got %d", len(page.Logs))
	}
}

func TestDressesEventsPageStillUsesLogs(t *testing.T) {
	payload := &types.Payload{Collection: "dresses", DataFacet: DressesEvents}
	coll := GetDressesCollection(payload)
	coll.FetchByFacet(DressesEvents)
	pageAny, err := coll.GetPage(payload, 0, 25, sdk.SortSpec{}, "")
	if err != nil {
		t.Fatalf("GetPage events failed: %v", err)
	}
	page, ok := pageAny.(*DressesPage)
	if !ok {
		t.Fatalf("unexpected page type: %T", pageAny)
	}
	if page.Logs == nil {
		t.Fatalf("expected Logs slice non-nil for events facet")
	}
	if len(page.DalleDress) != 0 {
		t.Fatalf("expected Dresses nil or empty for events facet; got len=%d", len(page.DalleDress))
	}
}
