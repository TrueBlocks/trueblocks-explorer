// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package dresses

import (
	"fmt"
	"sync"
	"time"

	// EXISTING_CODE

	// EXISTING_CODE
	"github.com/TrueBlocks/trueblocks-explorer/pkg/facets"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/logging"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

const (
	DressesGenerator types.DataFacet = "generator"
	DressesSeries    types.DataFacet = "series"
	DressesDatabases types.DataFacet = "databases"
	DressesEvents    types.DataFacet = "events"
	DressesGallery   types.DataFacet = "gallery"
)

func init() {
	types.RegisterDataFacet(DressesGenerator)
	types.RegisterDataFacet(DressesSeries)
	types.RegisterDataFacet(DressesDatabases)
	types.RegisterDataFacet(DressesEvents)
	types.RegisterDataFacet(DressesGallery)
}

type DressesCollection struct {
	generatorFacet *facets.Facet[DalleDress]
	seriesFacet    *facets.Facet[Series]
	databasesFacet *facets.Facet[Database]
	eventsFacet    *facets.Facet[Log]
	galleryFacet   *facets.Facet[DalleDress]
	summary        types.Summary
	summaryMutex   sync.RWMutex
}

func NewDressesCollection(payload *types.Payload) *DressesCollection {
	c := &DressesCollection{}
	c.ResetSummary()
	c.initializeFacets(payload)
	return c
}

func (c *DressesCollection) initializeFacets(payload *types.Payload) {
	c.generatorFacet = facets.NewFacet(
		DressesGenerator,
		isGenerator,
		isDupDalleDress(),
		c.getDalleDressStore(payload, DressesGenerator),
		"dresses",
		c,
	)

	c.seriesFacet = facets.NewFacet(
		DressesSeries,
		isSeries,
		isDupSeries(),
		c.getSeriesStore(payload, DressesSeries),
		"dresses",
		c,
	)

	c.databasesFacet = facets.NewFacet(
		DressesDatabases,
		isDatabase,
		isDupDatabase(),
		c.getDatabasesStore(payload, DressesDatabases),
		"dresses",
		c,
	)

	c.eventsFacet = facets.NewFacet(
		DressesEvents,
		isEvent,
		isDupLog(),
		c.getLogsStore(payload, DressesEvents),
		"dresses",
		c,
	)

	c.galleryFacet = facets.NewFacet(
		DressesGallery,
		isGallery,
		isDupDalleDress(),
		c.getDalleDressStore(payload, DressesGallery),
		"dresses",
		c,
	)
}

func isGenerator(item *DalleDress) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isSeries(item *Series) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isDatabase(item *Database) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isEvent(item *Log) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isGallery(item *DalleDress) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isDupDalleDress() func(existing []*DalleDress, newItem *DalleDress) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupDatabase() func(existing []*Database, newItem *Database) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupLog() func(existing []*Log, newItem *Log) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupSeries() func(existing []*Series, newItem *Series) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func (c *DressesCollection) LoadData(dataFacet types.DataFacet) {
	if !c.NeedsUpdate(dataFacet) {
		return
	}

	go func() {
		switch dataFacet {
		case DressesGenerator:
			if err := c.generatorFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case DressesSeries:
			if err := c.seriesFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case DressesDatabases:
			if err := c.databasesFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case DressesEvents:
			if err := c.eventsFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case DressesGallery:
			if err := c.galleryFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		default:
			logging.LogError("LoadData: unexpected dataFacet: %v", fmt.Errorf("invalid dataFacet: %s", dataFacet), nil)
			return
		}
	}()
}

func (c *DressesCollection) Reset(dataFacet types.DataFacet) {
	switch dataFacet {
	case DressesGenerator:
		c.generatorFacet.GetStore().Reset()
	case DressesSeries:
		c.seriesFacet.GetStore().Reset()
	case DressesDatabases:
		c.databasesFacet.GetStore().Reset()
	case DressesEvents:
		c.eventsFacet.GetStore().Reset()
	case DressesGallery:
		c.galleryFacet.GetStore().Reset()
	default:
		return
	}
}

func (c *DressesCollection) NeedsUpdate(dataFacet types.DataFacet) bool {
	switch dataFacet {
	case DressesGenerator:
		return c.generatorFacet.NeedsUpdate()
	case DressesSeries:
		return c.seriesFacet.NeedsUpdate()
	case DressesDatabases:
		return c.databasesFacet.NeedsUpdate()
	case DressesEvents:
		return c.eventsFacet.NeedsUpdate()
	case DressesGallery:
		return c.galleryFacet.NeedsUpdate()
	default:
		return false
	}
}

func (c *DressesCollection) GetSupportedFacets() []types.DataFacet {
	return []types.DataFacet{
		DressesGenerator,
		DressesSeries,
		DressesDatabases,
		DressesEvents,
		DressesGallery,
	}
}

func (c *DressesCollection) AccumulateItem(item interface{}, summary *types.Summary) {
	// EXISTING_CODE
	// EXISTING_CODE
}

func (c *DressesCollection) GetSummary() types.Summary {
	c.summaryMutex.RLock()
	defer c.summaryMutex.RUnlock()

	summary := c.summary
	summary.FacetCounts = make(map[types.DataFacet]int)
	for k, v := range c.summary.FacetCounts {
		summary.FacetCounts[k] = v
	}

	if c.summary.CustomData != nil {
		summary.CustomData = make(map[string]interface{})
		for k, v := range c.summary.CustomData {
			summary.CustomData[k] = v
		}
	}

	return summary
}

func (c *DressesCollection) ResetSummary() {
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()
	c.summary = types.Summary{
		TotalCount:  0,
		FacetCounts: make(map[types.DataFacet]int),
		CustomData:  make(map[string]interface{}),
		LastUpdated: time.Now().Unix(),
	}
}

func (c *DressesCollection) ExportData(payload *types.Payload) (string, error) {
	switch payload.DataFacet {
	case DressesGenerator:
		return c.generatorFacet.ExportData(payload, string(DressesGenerator))
	case DressesSeries:
		return c.seriesFacet.ExportData(payload, string(DressesSeries))
	case DressesDatabases:
		return c.databasesFacet.ExportData(payload, string(DressesDatabases))
	case DressesEvents:
		return c.eventsFacet.ExportData(payload, string(DressesEvents))
	case DressesGallery:
		return c.galleryFacet.ExportData(payload, string(DressesGallery))
	default:
		return "", fmt.Errorf("[ExportData] unsupported dresses facet: %s", payload.DataFacet)
	}
}

// EXISTING_CODE
// EXISTING_CODE
