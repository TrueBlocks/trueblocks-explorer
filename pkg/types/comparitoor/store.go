// Copyright 2016, 2026 The Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package comparitoor

// EXISTING_CODE
import (
	"fmt"
	"sync"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/store"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v6"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/output"
)

type Transaction = sdk.Transaction

// EXISTING_CODE

var (
	transactionStore   = make(map[string]*store.Store[Transaction])
	transactionStoreMu sync.Mutex
)

func (c *ComparitoorCollection) getTransactionStore(payload *types.Payload, facet types.DataFacet) *store.Store[Transaction] {
	transactionStoreMu.Lock()
	defer transactionStoreMu.Unlock()

	// EXISTING_CODE
	// EXISTING_CODE

	storeKey := getStoreKey(payload)
	theStore := transactionStore[storeKey]
	if theStore == nil {
		queryFunc := func(ctx *output.RenderCtx) error {
			// EXISTING_CODE
			go func() {
				defer close(ctx.ModelChan)
				defer close(ctx.ErrorChan)
				var src []*Transaction
				// Import mock variables from mocks.go
				// (They are package-level, so no explicit import needed)
				switch facet {
				case ComparitoorChifra:
					src = mockChifra
				case ComparitoorEtherscan:
					src = mockEtherscan
				case ComparitoorCovalent:
					src = mockCovalent
				case ComparitoorAlchemy:
					src = mockAlchemy
				case ComparitoorComparitoor:
					src = append([]*Transaction{}, mockChifra...)
					src = append(src, mockEtherscan...)
					src = append(src, mockCovalent...)
					src = append(src, mockAlchemy...)
				}
				for _, tx := range src {
					ctx.ModelChan <- tx
				}
			}()
			// EXISTING_CODE
			return nil
		}

		processFunc := func(item interface{}) *Transaction {
			if it, ok := item.(*Transaction); ok {
				// EXISTING_CODE
				// EXISTING_CODE
				return it
			}
			return nil
		}

		mappingFunc := func(item *Transaction) (key string, includeInMap bool) {
			return "", false
		}

		storeName := c.getStoreName(payload, facet)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		transactionStore[storeKey] = theStore
	}

	return theStore
}

func (c *ComparitoorCollection) getStoreName(payload *types.Payload, facet types.DataFacet) string {
	name := ""

	// EXISTING_CODE
	// EXISTING_CODE

	switch facet {
	case ComparitoorComparitoor:
		name = "comparitoor-transaction"
	case ComparitoorChifra:
		name = "comparitoor-transaction"
	case ComparitoorEtherscan:
		name = "comparitoor-transaction"
	case ComparitoorCovalent:
		name = "comparitoor-transaction"
	case ComparitoorAlchemy:
		name = "comparitoor-transaction"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, payload.ActiveChain, payload.ActiveAddress)
	return name
}

var (
	collections   = make(map[string]*ComparitoorCollection)
	collectionsMu sync.Mutex
)

func GetComparitoorCollection(payload *types.Payload) *ComparitoorCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload
	key := getStoreKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewComparitoorCollection(payload)
	collections[key] = collection
	return collection
}

func getStoreKey(payload *types.Payload) string {
	// EXISTING_CODE
	// EXISTING_CODE
	return fmt.Sprintf("%s_%s", payload.ActiveChain, payload.ActiveAddress)
}

// EXISTING_CODE
// EXISTING_CODE
