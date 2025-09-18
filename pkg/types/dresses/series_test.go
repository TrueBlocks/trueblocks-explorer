// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package dresses

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/crud"
	dalle "github.com/TrueBlocks/trueblocks-dalle/v2"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

// helper to wait briefly for async listener goroutines
func wait() { time.Sleep(50 * time.Millisecond) }

func TestSeriesCrudEmitsOperation(t *testing.T) {
	th := msgs.NewTestHelpers()
	defer th.Cleanup()

	tmp, err := os.MkdirTemp("", "series-crud-*")
	if err != nil {
		t.Fatalf("temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmp) }()

	_ = os.Setenv("TRUEBLOCKS_DALLE_DATA_DIR", tmp)
	defer func() { _ = os.Unsetenv("TRUEBLOCKS_DALLE_DATA_DIR") }()
	payload := &types.Payload{Collection: "dresses", DataFacet: DalleDressSeries, ProjectPath: tmp}
	coll := GetDalleDressCollection(payload)

	gotOps := []string{}
	unsub := msgs.On(msgs.EventDataLoaded, func(args ...interface{}) {
		// args[0] = msgText (collection), args[1] = payload struct
		if len(args) < 2 {
			return
		}
		if p, ok := args[1].(types.DataLoadedPayload); ok {
			if p.DataFacet == DalleDressSeries && p.Operation != "" {
				gotOps = append(gotOps, p.Operation)
			}
		}
	})
	defer unsub()

	series := &Series{Suffix: "alpha", Last: 1}
	if err := coll.Crud(payload, crud.Create, series); err != nil {
		t.Fatalf("create: %v", err)
	}
	wait()
	series.Last = 2
	if err := coll.Crud(payload, crud.Update, series); err != nil {
		t.Fatalf("update: %v", err)
	}
	wait()
	if err := coll.Crud(payload, crud.Remove, &Series{Suffix: "alpha"}); err != nil {
		t.Fatalf("remove: %v", err)
	}
	wait()

	want := []string{"create", "update", "remove"}
	if len(gotOps) < len(want) {
		t.Fatalf("expected at least %d ops, got %v", len(want), gotOps)
	}
	// verify order prefix
	for i, w := range want {
		if gotOps[i] != w {
			t.Fatalf("op %d = %s want %s (all ops %v)", i, gotOps[i], w, gotOps)
		}
	}
}

func TestSeriesExportCSV(t *testing.T) {
	tmp, err := os.MkdirTemp("", "series-export-*")
	if err != nil {
		t.Fatalf("temp dir: %v", err)
	}
	defer func() { _ = os.RemoveAll(tmp) }()

	_ = os.Setenv("TRUEBLOCKS_DALLE_DATA_DIR", tmp)
	defer func() { _ = os.Unsetenv("TRUEBLOCKS_DALLE_DATA_DIR") }()
	payload := &types.Payload{Collection: "dresses", DataFacet: DalleDressSeries, ProjectPath: tmp, Format: "csv"}
	coll := GetDalleDressCollection(payload)

	// seed two series
	s1 := &Series{Suffix: "one", Last: 3, Adverbs: []string{"quick"}}
	s2 := &Series{Suffix: "two", Last: 4, Colors: []string{"red", "blue"}}
	if err := coll.Crud(payload, crud.Create, s1); err != nil {
		t.Fatalf("create1: %v", err)
	}
	if err := coll.Crud(payload, crud.Create, s2); err != nil {
		t.Fatalf("create2: %v", err)
	}

	out, err := coll.ExportData(payload)
	if err != nil {
		t.Fatalf("export: %v", err)
	}
	b, err := os.ReadFile(out)
	if err != nil {
		t.Fatalf("read export: %v", err)
	}
	text := string(b)
	if !strings.HasPrefix(text, "suffix,purpose,last,deleted,modifiedAt,") && !strings.HasPrefix(text, "suffix,last,deleted,modifiedAt,") {
		t.Fatalf("unexpected header: %s", text)
	}
	if !strings.Contains(text, "one,,3") && !strings.Contains(text, "one,3") {
		t.Fatalf("row for 'one' missing: %s", text)
	}
	if !strings.Contains(text, "two,,4") && !strings.Contains(text, "two,4") {
		t.Fatalf("row for 'two' missing: %s", text)
	}
	// ensure file is placed under Exports dir
	if !strings.Contains(out, ".Exports") {
		t.Fatalf("expected export path to contain .Exports got %s", out)
	}
	if filepath.Ext(out) != ".csv" {
		t.Fatalf("expected .csv extension got %s", out)
	}
}

// Ensure alias remains in sync with external dalle Series type (compile-time check)
var _ = func(s *Series) *dalle.Series { return (*dalle.Series)(s) }
