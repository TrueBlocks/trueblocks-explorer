package types

import (
	"strings"
	"sync"
)

type DataFacet string

var (
	AllDataFacets = []struct {
		Value  DataFacet `json:"value"`
		TSName string    `json:"tsname"`
	}{}
	dataFacetMap = map[DataFacet]bool{}
	dfMutex      sync.Mutex
)

func RegisterDataFacet(df DataFacet) {
	dfMutex.Lock()
	defer dfMutex.Unlock()

	if _, exists := dataFacetMap[df]; exists {
		return
	}
	dataFacetMap[df] = true

	AllDataFacets = append(AllDataFacets, struct {
		Value  DataFacet `json:"value"`
		TSName string    `json:"tsname"`
	}{
		df,
		strings.ToUpper(string(df)),
	})
}
