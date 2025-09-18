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
	DalleDressGenerator types.DataFacet = "generator"
	DalleDressSeries    types.DataFacet = "series"
	DalleDressDatabases types.DataFacet = "databases"
	DalleDressEvents    types.DataFacet = "events"
	DalleDressGallery   types.DataFacet = "gallery"
)

func init() {
	types.RegisterDataFacet(DalleDressGenerator)
	types.RegisterDataFacet(DalleDressSeries)
	types.RegisterDataFacet(DalleDressDatabases)
	types.RegisterDataFacet(DalleDressEvents)
	types.RegisterDataFacet(DalleDressGallery)
}

type DalleDressCollection struct {
	generatorFacet *facets.Facet[DalleDress]
	seriesFacet    *facets.Facet[Series]
	databasesFacet *facets.Facet[Database]
	eventsFacet    *facets.Facet[Log]
	galleryFacet   *facets.Facet[DalleDress]
	summary        types.Summary
	summaryMutex   sync.RWMutex
}

func NewDalleDressCollection(payload *types.Payload) *DalleDressCollection {
	c := &DalleDressCollection{}
	c.ResetSummary()
	c.initializeFacets(payload)
	return c
}

func (c *DalleDressCollection) initializeFacets(payload *types.Payload) {
	c.generatorFacet = facets.NewFacet(
		DalleDressGenerator,
		isGenerator,
		isDupDalleDress(),
		c.getDalleDressStore(payload, DalleDressGenerator),
		"dresses",
		c,
	)

	c.seriesFacet = facets.NewFacet(
		DalleDressSeries,
		isSeries,
		isDupSeries(),
		c.getSeriesStore(payload, DalleDressSeries),
		"dresses",
		c,
	)

	c.databasesFacet = facets.NewFacet(
		DalleDressDatabases,
		isDatabase,
		isDupDatabase(),
		c.getDatabasesStore(payload, DalleDressDatabases),
		"dresses",
		c,
	)

	c.eventsFacet = facets.NewFacet(
		DalleDressEvents,
		isEvent,
		isDupLog(),
		c.getLogsStore(payload, DalleDressEvents),
		"dresses",
		c,
	)

	c.galleryFacet = facets.NewFacet(
		DalleDressGallery,
		isGallery,
		isDupDalleDress(),
		c.getDalleDressStore(payload, DalleDressGallery),
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

func isDupLog() func(existing []*Log, newItem *Log) bool {
	// EXISTING_CODE
	return nil
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

func isDupSeries() func(existing []*Series, newItem *Series) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func (c *DalleDressCollection) LoadData(dataFacet types.DataFacet) {
	if !c.NeedsUpdate(dataFacet) {
		return
	}

	go func() {
		switch dataFacet {
		case DalleDressGenerator:
			if err := c.generatorFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case DalleDressSeries:
			if err := c.seriesFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case DalleDressDatabases:
			if err := c.databasesFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case DalleDressEvents:
			if err := c.eventsFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case DalleDressGallery:
			if err := c.galleryFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		default:
			logging.LogError("LoadData: unexpected dataFacet: %v", fmt.Errorf("invalid dataFacet: %s", dataFacet), nil)
			return
		}
	}()
}

func (c *DalleDressCollection) Reset(dataFacet types.DataFacet) {
	switch dataFacet {
	case DalleDressGenerator:
		c.generatorFacet.GetStore().Reset()
	case DalleDressSeries:
		c.seriesFacet.GetStore().Reset()
	case DalleDressDatabases:
		c.databasesFacet.GetStore().Reset()
	case DalleDressEvents:
		c.eventsFacet.GetStore().Reset()
	case DalleDressGallery:
		c.galleryFacet.GetStore().Reset()
	default:
		return
	}
}

func (c *DalleDressCollection) NeedsUpdate(dataFacet types.DataFacet) bool {
	switch dataFacet {
	case DalleDressGenerator:
		return c.generatorFacet.NeedsUpdate()
	case DalleDressSeries:
		return c.seriesFacet.NeedsUpdate()
	case DalleDressDatabases:
		return c.databasesFacet.NeedsUpdate()
	case DalleDressEvents:
		return c.eventsFacet.NeedsUpdate()
	case DalleDressGallery:
		return c.galleryFacet.NeedsUpdate()
	default:
		return false
	}
}

func (c *DalleDressCollection) GetSupportedFacets() []types.DataFacet {
	return []types.DataFacet{
		DalleDressGenerator,
		DalleDressSeries,
		DalleDressDatabases,
		DalleDressEvents,
		DalleDressGallery,
	}
}

func (c *DalleDressCollection) AccumulateItem(item interface{}, summary *types.Summary) {
	// EXISTING_CODE
	// EXISTING_CODE
}

func (c *DalleDressCollection) GetSummary() types.Summary {
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

func (c *DalleDressCollection) ResetSummary() {
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()
	c.summary = types.Summary{
		TotalCount:  0,
		FacetCounts: make(map[types.DataFacet]int),
		CustomData:  make(map[string]interface{}),
		LastUpdated: time.Now().Unix(),
	}
}

func (c *DalleDressCollection) ExportData(payload *types.Payload) (string, error) {
	switch payload.DataFacet {
	case DalleDressGenerator:
		return c.generatorFacet.ExportData(payload, string(DalleDressGenerator))
	case DalleDressSeries:
		return c.seriesFacet.ExportData(payload, string(DalleDressSeries))
	case DalleDressDatabases:
		return c.databasesFacet.ExportData(payload, string(DalleDressDatabases))
	case DalleDressEvents:
		return c.eventsFacet.ExportData(payload, string(DalleDressEvents))
	case DalleDressGallery:
		return c.galleryFacet.ExportData(payload, string(DalleDressGallery))
	default:
		return "", fmt.Errorf("[ExportData] unsupported dresses facet: %s", payload.DataFacet)
	}
}

// EXISTING_CODE
// EXISTING_CODE
