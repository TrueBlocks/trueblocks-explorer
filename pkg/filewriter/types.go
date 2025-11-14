package filewriter

type Priority int

const (
	Immediate Priority = iota
	Batched
	OnShutdown
)

func (p Priority) String() string {
	switch p {
	case Immediate:
		return "immediate"
	case Batched:
		return "batched"
	case OnShutdown:
		return "onshutdown"
	default:
		return "unknown"
	}
}

type WriteRequest struct {
	FilePath string
	Data     []byte
	Priority Priority
	ErrChan  chan error
}

type WriteMetrics struct {
	TotalRequests   int64
	ImmediateWrites int64
	BatchedWrites   int64
	CoalescedWrites int64
	Errors          int64
}
