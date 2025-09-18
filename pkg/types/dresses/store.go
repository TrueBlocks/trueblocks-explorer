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
	"sort"
	"strings"
	"sync"

	// EXISTING_CODE
	dalle "github.com/TrueBlocks/trueblocks-dalle/v2"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/model"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"

	// EXISTING_CODE
	"github.com/TrueBlocks/trueblocks-explorer/pkg/fileserver"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// EXISTING_CODE
// EXISTING_CODE

type Log = sdk.Log
type DalleDress = model.DalleDress
type Database = model.Database
type Series = dalle.Series

var (
	logsStore   *store.Store[Log]
	logsStoreMu sync.Mutex

	dressesStore   *store.Store[DalleDress]
	dressesStoreMu sync.Mutex

	databasesStore   *store.Store[Database]
	databasesStoreMu sync.Mutex

	seriesStore   *store.Store[Series]
	seriesStoreMu sync.Mutex
)

func (c *DalleDressCollection) getLogsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Log] {
	logsStoreMu.Lock()
	defer logsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.Chain
	address := payload.Address
	theStore := logsStore
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Log {
			if it, ok := item.(*Log); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Log) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		logsStore = theStore
	}

	return theStore
}

func (c *DalleDressCollection) getDalleDressStore(payload *types.Payload, facet types.DataFacet) *store.Store[DalleDress] {
	dressesStoreMu.Lock()
	defer dressesStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.Chain
	address := payload.Address
	theStore := dressesStore
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			items := c.getGalleryItems()
			for i, gi := range items {
				if gi == nil || gi.Original == "" {
					continue
				}
				dd := loadCurrentDressFromSidecars(gi.Series, gi.Original)
				if dd == nil {
					filename := sanitizeFilename(gi.Original)
					annotatedPath := filepath.Join(storage.OutputDir(), gi.AnnotatedPath)
					dd = &DalleDress{
						Original:      gi.Original,
						FileName:      filename,
						AnnotatedPath: annotatedPath,
						Completed:     true,
						CacheHit:      true,
					}
				}
				if dd.AnnotatedPath == "" && gi.AnnotatedPath != "" {
					dd.AnnotatedPath = filepath.Join(storage.OutputDir(), gi.AnnotatedPath)
				}
				if gi.ImageURL != "" {
					dd.ImageURL = gi.ImageURL
				} else if gi.AnnotatedPath != "" {
					base := fileserver.CurrentBaseURL()
					if base != "" {
						served := strings.ReplaceAll(gi.AnnotatedPath, string(filepath.Separator), "/")
						dd.ImageURL = base + served
					}
				}
				theStore.AddItem(dd, i)
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *DalleDress {
			if it, ok := item.(*DalleDress); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *DalleDress) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			if item != nil {
				k := item.Original + ":" + item.AnnotatedPath
				return k, true
			}
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		dressesStore = theStore
	}

	return theStore
}

func (c *DalleDressCollection) getDatabasesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Database] {
	databasesStoreMu.Lock()
	defer databasesStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.Chain
	address := payload.Address
	theStore := databasesStore
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Database {
			if it, ok := item.(*Database); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Database) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		databasesStore = theStore
	}

	return theStore
}

func (c *DalleDressCollection) getSeriesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Series] {
	seriesStoreMu.Lock()
	defer seriesStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	chain := payload.Chain
	address := payload.Address
	theStore := seriesStore
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			seriesDir := filepath.Join(storage.DataDir(), "series")
			models, _ := dalle.LoadSeriesModels(seriesDir)
			_ = dalle.SortSeries(models, sdk.SortSpec{
				Fields: []string{"suffix"},
				Order:  []sdk.SortOrder{sdk.Asc},
			},
			)
			for i, m := range models {
				theStore.AddItem(&m, i)
			}
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Series {
			if it, ok := item.(*Series); ok {
				return it
			}
			return nil
		}

		mappingFunc := func(item *Series) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			if item != nil && item.Suffix != "" {
				return item.Suffix, true
			}
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		seriesStore = theStore
	}

	return theStore
}

func (c *DalleDressCollection) GetStoreName(dataFacet types.DataFacet, chain, address string) string {
	_ = chain
	_ = address
	name := ""
	switch dataFacet {
	case DalleDressGenerator:
		name = "dresses-dresses"
	case DalleDressSeries:
		name = "dresses-series"
	case DalleDressDatabases:
		name = "dresses-databases"
	case DalleDressEvents:
		name = "dresses-logs"
	case DalleDressGallery:
		name = "dresses-dresses"
	default:
		return ""
	}
	return name
}

var (
	collections   = make(map[store.CollectionKey]*DalleDressCollection)
	collectionsMu sync.Mutex
)

func GetDalleDressCollection(payload *types.Payload) *DalleDressCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	pl.Address = ""

	key := store.GetCollectionKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewDalleDressCollection(payload)
	collections[key] = collection
	return collection
}

// EXISTING_CODE
// getGalleryItems returns cached items performing incremental scan per series
func (c *DalleDressCollection) getGalleryItems() (items []*DalleDress) {
	root := storage.OutputDir()
	seriesList := make([]*DalleDress, 0, 512)

	entries, err := os.ReadDir(root)
	if err == nil {
		for _, e := range entries {
			if !e.IsDir() {
				continue
			}
			series := e.Name()
			if seriesItems, err := collectGalleryItemsForSeries(root, series); err == nil && len(seriesItems) > 0 {
				seriesList = append(seriesList, seriesItems...)
			}
		}
	}

	sort.SliceStable(seriesList, func(i, j int) bool {
		if seriesList[i].Series == seriesList[j].Series {
			return seriesList[i].FileName < seriesList[j].FileName
		}
		return seriesList[i].Series < seriesList[j].Series
	})

	return seriesList
}

// EXISTING_CODE
