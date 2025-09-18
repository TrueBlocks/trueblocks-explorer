package msgs

type TestHelpers struct{}

func NewTestHelpers() *TestHelpers {
	// Enable test mode
	SetTestMode(true)
	return &TestHelpers{}
}

func (t *TestHelpers) Cleanup() {
	listenersLock.Lock()
	listeners = make(map[EventType][]func(optionalData ...interface{}))
	listenersLock.Unlock()

	SetTestMode(false)
}

func SetTestMode(enabled bool) {
	testModeLock.Lock()
	defer testModeLock.Unlock()
	testMode = enabled
}

func IsTestMode() bool {
	testModeLock.RLock()
	defer testModeLock.RUnlock()
	return testMode
}
