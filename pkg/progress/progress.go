package progress

import (
	"fmt"
	"strings"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

const (
	firstPageCount   = 7
	initialIncrement = 10
	incrementGrowth  = 10
	MaxWaitTime      = 125 * time.Millisecond
	MinTickTime      = 75 * time.Millisecond
)

// Progress manages the logic for sending progress updates.
type Progress struct {
	lastUpdate        time.Time
	nItemsSinceUpdate int
	nextThreshold     int
	currentIncrement  int
	dataFacet         types.DataFacet
	onFirstDataFunc   func()
	firstDataSent     bool
	collectionName    string
	summaryProvider   types.SummaryAccumulator
}

// NewProgress creates and initializes a Progress.
func NewProgress(
	dataFacetCfg types.DataFacet,
	onFirstData func(), // Can be nil
) *Progress {
	pr := &Progress{
		dataFacet:       dataFacetCfg,
		onFirstDataFunc: onFirstData,
	}
	// Initialize internal state
	pr.lastUpdate = time.Now()
	pr.nItemsSinceUpdate = 0
	pr.currentIncrement = initialIncrement
	pr.nextThreshold = firstPageCount + pr.currentIncrement
	pr.firstDataSent = false
	return pr
}

func NewProgressWithSummary(
	dataFacetCfg types.DataFacet,
	collectionName string,
	summaryProvider types.SummaryAccumulator,
	onFirstData func(),
) *Progress {
	pr := NewProgress(dataFacetCfg, onFirstData)
	pr.collectionName = collectionName
	pr.summaryProvider = summaryProvider
	return pr
}

func (pr *Progress) Tick(currentTotalCount, expectedTotal int) {
	pr.nItemsSinceUpdate++
	shouldUpdate := false
	isFirstPageEvent := false

	now := time.Now()

	if !pr.firstDataSent && currentTotalCount >= firstPageCount {
		shouldUpdate = true
		isFirstPageEvent = true
	} else if pr.firstDataSent && currentTotalCount >= pr.nextThreshold {
		shouldUpdate = true
	}

	sendUpdateThisTick := false
	if shouldUpdate {
		if isFirstPageEvent {
			sendUpdateThisTick = true
			if pr.onFirstDataFunc != nil {
				go pr.onFirstDataFunc()
			}
			pr.firstDataSent = true
		} else {
			if now.Sub(pr.lastUpdate) >= MinTickTime {
				sendUpdateThisTick = true
			}
		}
	}

	if pr.firstDataSent && !isFirstPageEvent && currentTotalCount >= pr.nextThreshold {
		pr.currentIncrement += incrementGrowth
		pr.nextThreshold = currentTotalCount + pr.currentIncrement
	}

	if sendUpdateThisTick {
		if pr.collectionName != "" && pr.summaryProvider != nil {
			collectionPayload := types.DataLoadedPayload{
				CurrentCount:  currentTotalCount,
				ExpectedTotal: expectedTotal,
				State:         types.StateFetching,
				Summary:       pr.summaryProvider.GetSummary(),
				Timestamp:     time.Now().Unix(),
				EventPhase:    "streaming",
				Operation:     "load",
			}
			collectionPayload.Collection = pr.collectionName
			collectionPayload.DataFacet = pr.dataFacet
			msgs.EmitLoaded(collectionPayload)
		}

		msgs.EmitStatus(progressStr(currentTotalCount, pr.dataFacet, false))

		pr.nItemsSinceUpdate = 0
		pr.lastUpdate = now
		if isFirstPageEvent && currentTotalCount >= pr.nextThreshold {
			pr.currentIncrement += incrementGrowth
			pr.nextThreshold = currentTotalCount + pr.currentIncrement
		}
	}
}

func (pr *Progress) Heartbeat(currentTotalCount, expectedTotal int) {
	now := time.Now()
	if now.Sub(pr.lastUpdate) >= MaxWaitTime && pr.nItemsSinceUpdate > 0 {
		if pr.collectionName != "" && pr.summaryProvider != nil {
			collectionPayload := types.DataLoadedPayload{
				CurrentCount:  currentTotalCount,
				ExpectedTotal: expectedTotal,
				State:         types.StateFetching,
				Summary:       pr.summaryProvider.GetSummary(),
				Timestamp:     time.Now().Unix(),
				EventPhase:    "streaming",
				Operation:     "load",
			}
			collectionPayload.Collection = pr.collectionName
			collectionPayload.DataFacet = pr.dataFacet
			msgs.EmitLoaded(collectionPayload)
		}

		msgs.EmitStatus(progressStr(currentTotalCount, pr.dataFacet, true))

		pr.nItemsSinceUpdate = 0
		pr.lastUpdate = now
	}
}

func progressStr(cnt int, dataFacet types.DataFacet, heartbeat bool) string {
	k := strings.Trim(strings.ToLower(string(dataFacet)), " ")
	if heartbeat {
		return fmt.Sprintf("Loaded %d %s...", cnt, k)
	}
	return fmt.Sprintf("Loaded %d %s.", cnt, k)
}
