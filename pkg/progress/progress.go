package progress

import (
	"fmt"
	"strings"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
)

const (
	fullPageCount      = 15  // When to switch to steady 10-item increments
	steadyIncrement    = 10  // Items per update after full page
	largeDataThreshold = 300 // When to switch to large data increments
	largeDataIncrement = 47  // Items per update for large datasets
	MaxWaitTime        = 125 * time.Millisecond
	MinTickTime        = 75 * time.Millisecond
)

// Progress manages the logic for sending progress updates.
type Progress struct {
	lastUpdate        time.Time
	nItemsSinceUpdate int
	nextThreshold     int
	dataFacet         types.DataFacet
	onFirstDataFunc   func()
	firstDataSent     bool
	isInSteadyMode    bool
	isInLargeDataMode bool
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
	pr.nextThreshold = 1 // First update after 1 item
	pr.firstDataSent = false
	pr.isInSteadyMode = false
	pr.isInLargeDataMode = false
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

	// Check if we should send an update based on the new progression
	if currentTotalCount >= pr.nextThreshold {
		shouldUpdate = true
		if !pr.firstDataSent {
			isFirstPageEvent = true
		}
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
			if currentTotalCount >= fullPageCount {
				if now.Sub(pr.lastUpdate) >= MinTickTime {
					sendUpdateThisTick = true
				}
			} else {
				sendUpdateThisTick = true
			}
		}
	}

	// Update threshold for next update when we've reached the current one
	if currentTotalCount >= pr.nextThreshold {
		pr.updateThreshold(currentTotalCount)
	}

	if sendUpdateThisTick {
		if pr.collectionName != "" && pr.summaryProvider != nil {
			collectionPayload := types.DataLoadedPayload{
				CurrentCount:  currentTotalCount,
				ExpectedTotal: expectedTotal,
				State:         types.StateFetching,
				Summary:       pr.summaryProvider.GetSummary(nil),
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
	}
}

func (pr *Progress) updateThreshold(currentCount int) {
	if currentCount >= largeDataThreshold {
		pr.nextThreshold = currentCount + largeDataIncrement
	} else if currentCount >= fullPageCount {
		pr.nextThreshold = currentCount + steadyIncrement
	} else {
		switch currentCount {
		case 1:
			pr.nextThreshold = 2
		case 2:
			pr.nextThreshold = 4
		case 4:
			pr.nextThreshold = 6
		case 6:
			pr.nextThreshold = 10
		case 10:
			pr.nextThreshold = 14
		case 14:
			pr.nextThreshold = 15
		default:
			pr.nextThreshold = currentCount + 1
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
				Summary:       pr.summaryProvider.GetSummary(nil),
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
