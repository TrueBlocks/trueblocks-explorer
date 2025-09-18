package store

import (
	"sync"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
)

var (
	globalContextManager *ContextManager
	initOnce             sync.Once
)

type ContextManager struct {
	renderCtxs      map[string]*output.RenderCtx
	renderCtxsMutex sync.RWMutex
}

// GetContextManager returns the singleton context manager
func GetContextManager() *ContextManager {
	initOnce.Do(func() {
		globalContextManager = &ContextManager{
			renderCtxs: make(map[string]*output.RenderCtx),
		}
	})
	return globalContextManager
}

// RegisterContext registers a new RenderCtx for a given key
func RegisterContext(key string) *output.RenderCtx {
	cm := GetContextManager()
	cm.renderCtxsMutex.Lock()
	defer cm.renderCtxsMutex.Unlock()

	if existingCtx := cm.renderCtxs[key]; existingCtx != nil {
		existingCtx.Cancel()
	}

	rCtx := output.NewStreamingContext()
	cm.renderCtxs[key] = rCtx
	return rCtx
}

// UnregisterContext removes and cancels the context for a given key
func UnregisterContext(key string) (int, bool) {
	cm := GetContextManager()
	cm.renderCtxsMutex.Lock()
	defer cm.renderCtxsMutex.Unlock()

	if len(cm.renderCtxs) == 0 {
		return 0, false
	}
	if cm.renderCtxs[key] == nil {
		return 0, false
	}

	cm.renderCtxs[key].Cancel()
	delete(cm.renderCtxs, key)
	return 1, true
}

func CancelFetch(contextKey string) {
	cm := GetContextManager()
	cm.renderCtxsMutex.Lock()
	defer cm.renderCtxsMutex.Unlock()

	for key, ctx := range cm.renderCtxs {
		if key == contextKey && ctx != nil {
			ctx.Cancel()
			delete(cm.renderCtxs, key)
		}
	}
}

func CancelAllFetches() int {
	cm := GetContextManager()
	cm.renderCtxsMutex.Lock()
	defer cm.renderCtxsMutex.Unlock()

	cancelledCount := 0
	for key, ctx := range cm.renderCtxs {
		if ctx != nil {
			ctx.Cancel()
			cancelledCount++
		}
		delete(cm.renderCtxs, key)
	}
	return cancelledCount
}

func ctxCount(key string) int {
	cm := GetContextManager()
	cm.renderCtxsMutex.RLock()
	defer cm.renderCtxsMutex.RUnlock()

	if ctx, exists := cm.renderCtxs[key]; exists && ctx != nil {
		return 1
	}
	return 0
}

func ctxCountTotal() int {
	cm := GetContextManager()
	cm.renderCtxsMutex.RLock()
	defer cm.renderCtxsMutex.RUnlock()
	return len(cm.renderCtxs)
}
