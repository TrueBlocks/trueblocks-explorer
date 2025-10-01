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
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
)

// AnnotatedTransaction wraps sdk.Transaction with missing/unique flags for frontend rendering
type AnnotatedTransaction struct {
	sdk.Transaction
	Missing bool `json:"missing"`
	Unique  bool `json:"unique"`
}

type Transaction = AnnotatedTransaction

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

	chain := payload.Chain
	address := payload.Address
	storeKey := getStoreKey(chain, address)
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
				case ComparitoorEtherScan:
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
				return it
			}
			return nil
		}

		mappingFunc := func(item *Transaction) (key interface{}, includeInMap bool) {
			// EXISTING_CODE
			// EXISTING_CODE
			return nil, false
		}

		storeName := c.GetStoreName(facet, chain, address)
		theStore = store.NewStore(storeName, queryFunc, processFunc, mappingFunc)

		// EXISTING_CODE
		// EXISTING_CODE

		transactionStore[storeKey] = theStore
	}

	return theStore
}

func (c *ComparitoorCollection) GetStoreName(dataFacet types.DataFacet, chain, address string) string {
	name := ""
	switch dataFacet {
	case ComparitoorComparitoor:
		name = "comparitoor-transaction"
	case ComparitoorChifra:
		name = "comparitoor-transaction"
	case ComparitoorEtherScan:
		name = "comparitoor-transaction"
	case ComparitoorCovalent:
		name = "comparitoor-transaction"
	case ComparitoorAlchemy:
		name = "comparitoor-transaction"
	default:
		return ""
	}
	name = fmt.Sprintf("%s-%s-%s", name, chain, address)
	return name
}

var (
	collections   = make(map[store.CollectionKey]*ComparitoorCollection)
	collectionsMu sync.Mutex
)

func GetComparitoorCollection(payload *types.Payload) *ComparitoorCollection {
	collectionsMu.Lock()
	defer collectionsMu.Unlock()

	pl := *payload

	key := store.GetCollectionKey(&pl)
	if collection, exists := collections[key]; exists {
		return collection
	}

	collection := NewComparitoorCollection(payload)
	collections[key] = collection
	return collection
}

func getStoreKey(chain, address string) string {
	return fmt.Sprintf("%s_%s", chain, address)
}

// EXISTING_CODE
// EXISTING_CODE
