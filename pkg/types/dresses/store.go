// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package dresses

// EXISTING_CODE
import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/fileserver"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/output"
	dalle "github.com/TrueBlocks/trueblocks-dalle/v6"
	"github.com/TrueBlocks/trueblocks-dalle/v6/pkg/model"
	"github.com/TrueBlocks/trueblocks-dalle/v6/pkg/storage"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"
)

type DalleDress = model.DalleDress
type Database = model.Database
type Log = sdk.Log
type Series = dalle.Series

// EXISTING_CODE

var (
	dalledressStore   = make(map[string]*store.Store[DalleDress])
	dalledressStoreMu sync.Mutex

	databasesStore   = make(map[string]*store.Store[Database])
	databasesStoreMu sync.Mutex

	logsStore   = make(map[string]*store.Store[Log])
	logsStoreMu sync.Mutex

	seriesStore   = make(map[string]*store.Store[Series])
	seriesStoreMu sync.Mutex
)

func (c *DressesCollection) getDalleDressStore(payload *types.Payload, facet types.DataFacet) *store.Store[DalleDress] {
	dalledressStoreMu.Lock()
	defer dalledressStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := dalledressStore[storeKey]
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
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *DalleDress) (key string, includeInMap bool) {
			testVal := item.Original + ":" + item.AnnotatedPath
			return testVal, testVal != ""
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		dalledressStore[storeKey] = theStore
	}

	return theStore
}

func (c *DressesCollection) getDatabasesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Database] {
	databasesStoreMu.Lock()
	defer databasesStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := databasesStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Database {
			if it, ok := item.(*Database); ok {
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Database) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		databasesStore[storeKey] = theStore
	}

	return theStore
}

func (c *DressesCollection) getLogsStore(payload *types.Payload, facet types.DataFacet) *store.Store[Log] {
	logsStoreMu.Lock()
	defer logsStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := logsStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Log {
			if it, ok := item.(*Log); ok {
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Log) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		logsStore[storeKey] = theStore
	}

	return theStore
}

func (c *DressesCollection) getSeriesStore(payload *types.Payload, facet types.DataFacet) *store.Store[Series] {
	seriesStoreMu.Lock()
	defer seriesStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := seriesStore[storeKey]
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
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Series) (key string, includeInMap bool) {
			testVal := item.Suffix
			return testVal, testVal != ""
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		seriesStore[storeKey] = theStore
	}

	return theStore
}

func (c *DressesCollection) getStoreName(payload *types.Payload, facet types.DataFacet) string {
	name := ""

	// EXISTING_CODE
	// EXISTING_CODE

	switch facet {
	case DressesGenerator:
		name = "dresses-dalledress"
	case DressesSeries:
		name = "dresses-series"
	case DressesDatabases:
		name = "dresses-databases"
	case DressesEvents:
		name = "dresses-logs"
	case DressesGallery:
		name = "dresses-dalledress"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, payload.ActiveChain, payload.ActiveAddress)
	return name
}

var (
	collections   = make(map[string]*DressesCollection)
	collectionsMu sync.Mutex
)

func GetDressesCollection(payload *types.Payload) *DressesCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	key := getStoreKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewDressesCollection(payload)
	collections[key] = collection
	return collection
}

func getStoreKey(payload *types.Payload) string {
	// EXISTING_CODE
	// EXISTING_CODE
	return fmt.Sprintf("%s_%s", payload.ActiveChain, payload.ActiveAddress)
}

// EXISTING_CODE
// getGalleryItems returns cached items performing incremental scan per series
func (c *DressesCollection) getGalleryItems() (items []*DalleDress) {
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
