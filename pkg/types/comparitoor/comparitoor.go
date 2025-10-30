// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package comparitoor

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
	ComparitoorComparitoor types.DataFacet = "comparitoor"
	ComparitoorChifra      types.DataFacet = "chifra"
	ComparitoorEtherscan   types.DataFacet = "etherscan"
	ComparitoorCovalent    types.DataFacet = "covalent"
	ComparitoorAlchemy     types.DataFacet = "alchemy"
)

func init() {
	types.RegisterDataFacet(ComparitoorComparitoor)
	types.RegisterDataFacet(ComparitoorChifra)
	types.RegisterDataFacet(ComparitoorEtherscan)
	types.RegisterDataFacet(ComparitoorCovalent)
	types.RegisterDataFacet(ComparitoorAlchemy)
}

type ComparitoorCollection struct {
	comparitoorFacet *facets.Facet[Transaction]
	chifraFacet      *facets.Facet[Transaction]
	etherscanFacet   *facets.Facet[Transaction]
	covalentFacet    *facets.Facet[Transaction]
	alchemyFacet     *facets.Facet[Transaction]
	summary          types.Summary
	summaryMutex     sync.RWMutex
}

func NewComparitoorCollection(payload *types.Payload) *ComparitoorCollection {
	c := &ComparitoorCollection{}
	c.ResetSummary()
	c.initializeFacets(payload)
	return c
}

func (c *ComparitoorCollection) initializeFacets(payload *types.Payload) {
	c.comparitoorFacet = facets.NewFacet(
		ComparitoorComparitoor,
		isComparitoor,
		isDupTransaction(),
		c.getTransactionStore(payload, ComparitoorComparitoor),
		"comparitoor",
		c,
		false,
	)

	c.chifraFacet = facets.NewFacet(
		ComparitoorChifra,
		isChifra,
		isDupTransaction(),
		c.getTransactionStore(payload, ComparitoorChifra),
		"comparitoor",
		c,
		false,
	)

	c.etherscanFacet = facets.NewFacet(
		ComparitoorEtherscan,
		isEtherscan,
		isDupTransaction(),
		c.getTransactionStore(payload, ComparitoorEtherscan),
		"comparitoor",
		c,
		false,
	)

	c.covalentFacet = facets.NewFacet(
		ComparitoorCovalent,
		isCovalent,
		isDupTransaction(),
		c.getTransactionStore(payload, ComparitoorCovalent),
		"comparitoor",
		c,
		false,
	)

	c.alchemyFacet = facets.NewFacet(
		ComparitoorAlchemy,
		isAlchemy,
		isDupTransaction(),
		c.getTransactionStore(payload, ComparitoorAlchemy),
		"comparitoor",
		c,
		false,
	)
}

func isComparitoor(item *Transaction) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isChifra(item *Transaction) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isEtherscan(item *Transaction) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isCovalent(item *Transaction) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isAlchemy(item *Transaction) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isDupTransaction() func(existing []*Transaction, newItem *Transaction) bool {
	// EXISTING_CODE
	return func(existing []*Transaction, newItem *Transaction) bool {
		if newItem == nil {
			return true
		}
		for _, it := range existing {
			if it == nil {
				continue
			}
			if it.BlockNumber == newItem.BlockNumber && it.TransactionIndex == newItem.TransactionIndex {
				return true
			}
		}
		return false
	}
	// EXISTING_CODE
}

func (c *ComparitoorCollection) FetchByFacet(dataFacet types.DataFacet) {
	if !c.NeedsUpdate(dataFacet) {
		return
	}

	go func() {
		switch dataFacet {
		case ComparitoorComparitoor:
			if err := c.comparitoorFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ComparitoorChifra:
			if err := c.chifraFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ComparitoorEtherscan:
			if err := c.etherscanFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ComparitoorCovalent:
			if err := c.covalentFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case ComparitoorAlchemy:
			if err := c.alchemyFacet.FetchFacet(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		default:
			logging.LogError("LoadData: unexpected dataFacet: %v", fmt.Errorf("invalid dataFacet: %s", dataFacet), nil)
			return
		}
	}()
}

func (c *ComparitoorCollection) Reset(dataFacet types.DataFacet) {
	switch dataFacet {
	case ComparitoorComparitoor:
		c.comparitoorFacet.Reset()
	case ComparitoorChifra:
		c.chifraFacet.Reset()
	case ComparitoorEtherscan:
		c.etherscanFacet.Reset()
	case ComparitoorCovalent:
		c.covalentFacet.Reset()
	case ComparitoorAlchemy:
		c.alchemyFacet.Reset()
	default:
		return
	}
}

func (c *ComparitoorCollection) NeedsUpdate(dataFacet types.DataFacet) bool {
	switch dataFacet {
	case ComparitoorComparitoor:
		return c.comparitoorFacet.NeedsUpdate()
	case ComparitoorChifra:
		return c.chifraFacet.NeedsUpdate()
	case ComparitoorEtherscan:
		return c.etherscanFacet.NeedsUpdate()
	case ComparitoorCovalent:
		return c.covalentFacet.NeedsUpdate()
	case ComparitoorAlchemy:
		return c.alchemyFacet.NeedsUpdate()
	default:
		return false
	}
}

func (c *ComparitoorCollection) AccumulateItem(item interface{}, summary *types.Summary) {
	// EXISTING_CODE
	if summary == nil {
		return
	}
	if summary.FacetCounts == nil {
		summary.FacetCounts = make(map[types.DataFacet]int)
	}
	summary.TotalCount++
	// We cannot easily know which facet invoked this from here without extra context; leave hook.
	// Optionally could classify by inspecting item fields later.
	// EXISTING_CODE
}

func (c *ComparitoorCollection) GetSummary() types.Summary {
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

func (c *ComparitoorCollection) ResetSummary() {
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()
	c.summary = types.Summary{
		TotalCount:  0,
		FacetCounts: make(map[types.DataFacet]int),
		CustomData:  make(map[string]interface{}),
		LastUpdated: time.Now().Unix(),
	}
}

func (c *ComparitoorCollection) ExportData(payload *types.Payload) (string, error) {
	switch payload.DataFacet {
	case ComparitoorComparitoor:
		return c.comparitoorFacet.ExportData(payload, string(ComparitoorComparitoor))
	case ComparitoorChifra:
		return c.chifraFacet.ExportData(payload, string(ComparitoorChifra))
	case ComparitoorEtherscan:
		return c.etherscanFacet.ExportData(payload, string(ComparitoorEtherscan))
	case ComparitoorCovalent:
		return c.covalentFacet.ExportData(payload, string(ComparitoorCovalent))
	case ComparitoorAlchemy:
		return c.alchemyFacet.ExportData(payload, string(ComparitoorAlchemy))
	default:
		return "", fmt.Errorf("[ExportData] unsupported comparitoor facet: %s", payload.DataFacet)
	}
}

// EXISTING_CODE
// EXISTING_CODE
