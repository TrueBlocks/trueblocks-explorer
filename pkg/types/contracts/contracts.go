// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package contracts

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
	ContractsDashboard types.DataFacet = "dashboard"
	ContractsExecute   types.DataFacet = "execute"
	ContractsEvents    types.DataFacet = "events"
)

func init() {
	types.RegisterDataFacet(ContractsDashboard)
	types.RegisterDataFacet(ContractsExecute)
	types.RegisterDataFacet(ContractsEvents)
}

type ContractsCollection struct {
	dashboardFacet *facets.Facet[Contract]
	executeFacet   *facets.Facet[Contract]
	eventsFacet    *facets.Facet[Log]
	summary        types.Summary
	summaryMutex   sync.RWMutex
}

func NewContractsCollection(payload *types.Payload) *ContractsCollection {
	c := &ContractsCollection{}
	c.ResetSummary()
	c.initializeFacets(payload)
	return c
}

func (c *ContractsCollection) initializeFacets(payload *types.Payload) {
	c.dashboardFacet = facets.NewFacet(
		ContractsDashboard,
		isDashboard,
		isDupContract(),
		c.getContractsStore(payload, ContractsDashboard),
		"contracts",
		c,
		false,
	)

	c.executeFacet = facets.NewFacet(
		ContractsExecute,
		isExecute,
		isDupContract(),
		c.getContractsStore(payload, ContractsExecute),
		"contracts",
		c,
		false,
	)

	c.eventsFacet = facets.NewFacet(
		ContractsEvents,
		isEvent,
		isDupLog(),
		c.getLogsStore(payload, ContractsEvents),
		"contracts",
		c,
		false,
	)
}

func isDashboard(item *Contract) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isExecute(item *Contract) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isEvent(item *Log) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isDupContract() func(existing []*Contract, newItem *Contract) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func isDupLog() func(existing []*Log, newItem *Log) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func (c *ContractsCollection) FetchByFacet(dataFacet types.DataFacet) {
	if !c.NeedsUpdate(dataFacet) {
		return
	}

	go func() {
		switch dataFacet {
		case ContractsDashboard:
			if err := c.dashboardFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ContractsExecute:
			if err := c.executeFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ContractsEvents:
			if err := c.eventsFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		default:
			logging.LogError("LoadData: unexpected dataFacet: %v", fmt.Errorf("invalid dataFacet: %s", dataFacet), nil)
			return
		}
	}()
}

func (c *ContractsCollection) Reset(dataFacet types.DataFacet) {
	switch dataFacet {
	case ContractsDashboard:
		c.dashboardFacet.Reset()
	case ContractsExecute:
		c.executeFacet.Reset()
	case ContractsEvents:
		c.eventsFacet.Reset()
	default:
		return
	}
}

func (c *ContractsCollection) NeedsUpdate(dataFacet types.DataFacet) bool {
	switch dataFacet {
	case ContractsDashboard:
		return c.dashboardFacet.NeedsUpdate()
	case ContractsExecute:
		return c.executeFacet.NeedsUpdate()
	case ContractsEvents:
		return c.eventsFacet.NeedsUpdate()
	default:
		return false
	}
}

func (c *ContractsCollection) AccumulateItem(item interface{}, summary *types.Summary) {
	// EXISTING_CODE
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()

	if contractState, ok := item.(*Contract); ok {
		summary.TotalCount++

		if summary.FacetCounts == nil {
			summary.FacetCounts = make(map[types.DataFacet]int)
		}

		summary.FacetCounts[ContractsDashboard]++

		if summary.CustomData == nil {
			summary.CustomData = make(map[string]interface{})
		}

		contractsCount, _ := summary.CustomData["contractsCount"].(int)
		errorCount, _ := summary.CustomData["errorCount"].(int)
		totalFunctions, _ := summary.CustomData["totalFunctions"].(int)

		contractsCount++
		if contractState.ErrorCount > 0 {
			errorCount++
		}
		if contractState.Abi != nil {
			totalFunctions += int(contractState.Abi.NFunctions)
		}

		summary.CustomData["contractsCount"] = contractsCount
		summary.CustomData["errorCount"] = errorCount
		summary.CustomData["totalFunctions"] = totalFunctions
		summary.LastUpdated = time.Now().Unix()
	}
	// EXISTING_CODE
}

func (c *ContractsCollection) GetSummary() types.Summary {
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

func (c *ContractsCollection) ResetSummary() {
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()
	c.summary = types.Summary{
		TotalCount:  0,
		FacetCounts: make(map[types.DataFacet]int),
		CustomData:  make(map[string]interface{}),
		LastUpdated: time.Now().Unix(),
	}
}

func (c *ContractsCollection) ExportData(payload *types.Payload) (string, error) {
	switch payload.DataFacet {
	case ContractsDashboard:
		return c.dashboardFacet.ExportData(payload, string(ContractsDashboard))
	case ContractsExecute:
		return c.executeFacet.ExportData(payload, string(ContractsExecute))
	case ContractsEvents:
		return c.eventsFacet.ExportData(payload, string(ContractsEvents))
	default:
		return "", fmt.Errorf("[ExportData] unsupported contracts facet: %s", payload.DataFacet)
	}
}

func (c *ContractsCollection) ChangeVisibility(payload *types.Payload) error {
	return nil
}

// EXISTING_CODE
// EXISTING_CODE
