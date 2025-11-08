// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package monitors

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
	MonitorsMonitors types.DataFacet = "monitors"
)

func init() {
	types.RegisterDataFacet(MonitorsMonitors)
}

type MonitorsCollection struct {
	monitorsFacet *facets.Facet[Monitor]
	summary       types.Summary
	summaryMutex  sync.RWMutex
}

func NewMonitorsCollection(payload *types.Payload) *MonitorsCollection {
	c := &MonitorsCollection{}
	c.ResetSummary()
	c.initializeFacets(payload)
	return c
}

func (c *MonitorsCollection) initializeFacets(payload *types.Payload) {
	c.monitorsFacet = facets.NewFacet(
		MonitorsMonitors,
		isMonitor,
		isDupMonitor(),
		c.getMonitorsStore(payload, MonitorsMonitors),
		"monitors",
		c,
		false,
	)
}

func isMonitor(item *Monitor) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isDupMonitor() func(existing []*Monitor, newItem *Monitor) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func (c *MonitorsCollection) FetchByFacet(dataFacet types.DataFacet) {
	if !c.NeedsUpdate(dataFacet) {
		return
	}

	go func() {
		switch dataFacet {
		case MonitorsMonitors:
			if err := c.monitorsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		default:
			logging.LogError("LoadData: unexpected dataFacet: %v", fmt.Errorf("invalid dataFacet: %s", dataFacet), nil)
			return
		}
	}()
}

func (c *MonitorsCollection) Reset(dataFacet types.DataFacet) {
	switch dataFacet {
	case MonitorsMonitors:
		c.monitorsFacet.Reset()
	default:
		return
	}
}

func (c *MonitorsCollection) NeedsUpdate(dataFacet types.DataFacet) bool {
	switch dataFacet {
	case MonitorsMonitors:
		return c.monitorsFacet.NeedsUpdate()
	default:
		return false
	}
}

func (c *MonitorsCollection) AccumulateItem(item interface{}, summary *types.Summary) {
	// EXISTING_CODE
	monitor, ok := item.(*Monitor)
	if !ok {
		return
	}

	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()

	summary.TotalCount++

	if summary.FacetCounts == nil {
		summary.FacetCounts = make(map[types.DataFacet]int)
	}

	summary.FacetCounts[MonitorsMonitors]++
	if summary.CustomData == nil {
		summary.CustomData = make(map[string]interface{})
	}

	emptyCount, _ := summary.CustomData["emptyCount"].(int)
	stagedCount, _ := summary.CustomData["stagedCount"].(int)
	deletedCount, _ := summary.CustomData["deletedCount"].(int)
	totalRecords, _ := summary.CustomData["totalRecords"].(int)
	totalFileSize, _ := summary.CustomData["totalFileSize"].(int64)

	if monitor.IsEmpty {
		emptyCount++
	}
	if monitor.IsStaged {
		stagedCount++
	}
	if monitor.Deleted {
		deletedCount++
	}

	totalRecords += int(monitor.NRecords)
	totalFileSize += int64(monitor.FileSize)

	summary.CustomData["emptyCount"] = emptyCount
	summary.CustomData["stagedCount"] = stagedCount
	summary.CustomData["deletedCount"] = deletedCount
	summary.CustomData["totalRecords"] = totalRecords
	summary.CustomData["totalFileSize"] = totalFileSize
	// EXISTING_CODE
}

func (c *MonitorsCollection) GetSummary() types.Summary {
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

func (c *MonitorsCollection) ResetSummary() {
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()
	c.summary = types.Summary{
		TotalCount:  0,
		FacetCounts: make(map[types.DataFacet]int),
		CustomData:  make(map[string]interface{}),
		LastUpdated: time.Now().Unix(),
	}
}

func (c *MonitorsCollection) ExportData(payload *types.Payload) (string, error) {
	switch payload.DataFacet {
	case MonitorsMonitors:
		return c.monitorsFacet.ExportData(payload, string(MonitorsMonitors))
	default:
		return "", fmt.Errorf("[ExportData] unsupported monitors facet: %s", payload.DataFacet)
	}
}

func (c *MonitorsCollection) ChangeVisibility(payload *types.Payload) error {
	return nil
}

// EXISTING_CODE
// EXISTING_CODE
