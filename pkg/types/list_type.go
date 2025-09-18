package types

type LoadState string

const (
	StateStale    LoadState = "stale"
	StateFetching LoadState = "fetching"
	StatePartial  LoadState = "partial"
	StateLoaded   LoadState = "loaded"
	StatePending  LoadState = "pending"
	StateError    LoadState = "error"
)

var AllStates = []struct {
	Value  LoadState `json:"value"`
	TSName string    `json:"tsname"`
}{
	{StateStale, "STALE"},
	{StateFetching, "FETCHING"},
	{StatePartial, "PARTIAL"},
	{StateLoaded, "LOADED"},
	{StatePending, "PENDING"},
	{StateError, "ERROR"},
}
