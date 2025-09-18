package progress

import (
	"fmt"
	"testing"
	"time"

	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/model"
)

// mockClock allows controlling time in tests.
type mockClock struct {
	now time.Time
}

func (c *mockClock) Now() time.Time {
	return c.now
}

func (c *mockClock) Advance(d time.Duration) {
	c.now = c.now.Add(d)
}

// setup sets up a test with a fresh ProgressManager and a mock clock.
func setup() (*ProgressManager, *mockClock) {
	ResetMetricsForTest()
	pm := GetProgressManager()
	clock := &mockClock{now: time.Date(2023, 1, 1, 12, 0, 0, 0, time.UTC)}
	pm.clock = clock
	return pm, clock
}

func TestGetProgressManager_IsSingleton(t *testing.T) {
	pm1 := GetProgressManager()
	pm2 := GetProgressManager()
	if pm1 != pm2 {
		t.Fatal("GetProgressManager should return a singleton instance")
	}
}

func TestProgressManager_StartRun(t *testing.T) {
	pm, _ := setup()
	series, addr := "test-series", "0x123"
	dress := &model.DalleDress{}

	pm.StartRun(series, addr, dress)

	report := pm.GetReport(series, addr)
	if report == nil {
		t.Fatal("expected report for running process")
	}
	if report.Series != series || report.Address != addr {
		t.Errorf("report has wrong series/addr")
	}
	if report.Current != PhaseSetup {
		t.Errorf("expected current phase to be 'setup', got %s", report.Current)
	}

	// Starting again should be a no-op
	pm.StartRun(series, addr, dress)
	if len(pm.runs) != 1 {
		t.Fatal("starting an existing run should not create a new one")
	}
}

func TestProgressManager_Transition(t *testing.T) {
	pm, clock := setup()
	series, addr := "test-series", "0x123"
	dress := &model.DalleDress{}

	pm.StartRun(series, addr, dress)
	clock.Advance(time.Second)
	pm.Transition(series, addr, PhaseBasePrompts)

	report := pm.GetReport(series, addr)
	if report.Current != PhaseBasePrompts {
		t.Errorf("expected current phase to be 'base_prompts', got %s", report.Current)
	}

	setupPhase := report.Phases[0]
	if setupPhase.Name != PhaseSetup {
		t.Fatalf("unexpected phase order")
	}
	if setupPhase.EndedNs == 0 {
		t.Error("expected setup phase to have ended")
	}
	if setupPhase.EndedNs-setupPhase.StartedNs != int64(time.Second) {
		t.Errorf("unexpected phase duration")
	}
}

func TestProgressManager_Complete(t *testing.T) {
	pm, clock := setup()
	series, addr := "test-series", "0x123"
	dress := &model.DalleDress{}

	pm.StartRun(series, addr, dress)
	clock.Advance(time.Second)
	pm.Transition(series, addr, PhaseBasePrompts)
	clock.Advance(time.Second)
	pm.Complete(series, addr)

	report := pm.GetReport(series, addr)
	if !report.Done {
		t.Error("expected run to be done")
	}
	if report.Current != PhaseCompleted {
		t.Errorf("expected current phase to be 'completed', got %s", report.Current)
	}

	// After getting a report for a completed run, it should be pruned
	if _, exists := pm.runs[key(series, addr)]; exists {
		t.Error("completed run should be pruned after report")
	}
}

func TestProgressManager_Fail(t *testing.T) {
	pm, clock := setup()
	series, addr := "test-series", "0x123"
	dress := &model.DalleDress{}
	errMsg := "something went wrong"

	pm.StartRun(series, addr, dress)
	clock.Advance(time.Second)
	pm.Fail(series, addr, fmt.Errorf("%s", errMsg))

	report := pm.GetReport(series, addr)
	if report.Current != PhaseFailed {
		t.Errorf("expected current phase to be 'failed', got %s", report.Current)
	}
	if report.Done {
		t.Error("expected run to NOT be done yet after first fail report")
	}
	if report.Error != errMsg {
		t.Errorf("expected error message '%s', got '%s'", errMsg, report.Error)
	}

	// Second call should return nil because failed run is pruned after first report
	report2 := pm.GetReport(series, addr)
	if report2 != nil {
		t.Error("expected nil report after failed run already reported")
	}
	// Ensure run is pruned
	if _, exists := pm.runs[key(series, addr)]; exists {
		t.Error("failed run should be pruned after first report")
	}
}
