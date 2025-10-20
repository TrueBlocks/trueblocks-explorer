package types

type StoreState string

const (
	StateStale    StoreState = "stale"    // Needs refresh
	StateFetching StoreState = "fetching" // Currently loading
	StateLoaded   StoreState = "loaded"   // Complete data
)

var AllStates = []struct {
	Value  StoreState `json:"value"`
	TSName string     `json:"tsname"`
}{
	{StateStale, "STALE"},
	{StateFetching, "FETCHING"},
	{StateLoaded, "LOADED"},
}
