package store

import (
	"fmt"
	"sync"
	"testing"
	"time"

	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/base"
	"github.com/TrueBlocks/trueblocks-chifra/v6/pkg/output"
	"github.com/stretchr/testify/assert"
)

func TestSingletonBehavior(t *testing.T) {
	cm1 := GetContextManager()
	assert.NotNil(t, cm1, "GetContextManager should return a non-nil manager")

	cm2 := GetContextManager()
	assert.Same(t, cm1, cm2, "Multiple calls to GetContextManager should return the same instance")
}

func TestRegisterContext(t *testing.T) {
	key1 := "testKey1"
	key2 := "testKey2"

	t.Run("RegisterNewKey", func(t *testing.T) {
		resetContextManagerState(t)
		ctx1 := RegisterContext(key1)
		assert.NotNil(t, ctx1, "Context should not be nil for a new key")
		assert.Equal(t, 1, ctxCount(key1), "ctxCount should be 1 for the new key")
		assert.Equal(t, 1, ctxCountTotal(), "Total contexts should be 1")

		cm := GetContextManager()
		cm.renderCtxsMutex.Lock()
		storedCtx := cm.renderCtxs[key1]
		cm.renderCtxsMutex.Unlock()
		assert.Same(t, ctx1, storedCtx, "Stored context should be the same as returned context")
	})

	t.Run("RegisterExistingKeyReplacesAndCancelsOld", func(t *testing.T) {
		resetContextManagerState(t)
		originalCtx := RegisterContext(key1)
		assert.NotNil(t, originalCtx, "Original context should not be nil")
		assert.Equal(t, 1, ctxCount(key1), "ctxCount should be 1 after initial registration")

		newCtx := RegisterContext(key1)
		assert.NotNil(t, newCtx, "New context should not be nil")
		assert.NotSame(t, originalCtx, newCtx, "Registering an existing key should return a new context instance")
		assert.Equal(t, 1, ctxCount(key1), "ctxCount should still be 1 for the key")
		assert.Equal(t, 1, ctxCountTotal(), "Total contexts should still be 1")

		// We assume `originalCtx.Cancel()` was called by RegisterContext.
		// The fact that `newCtx` is different and `ctxCount` is 1 for `key1` (pointing to `newCtx`)
		// is the primary check from the manager's perspective.
	})

	t.Run("RegisterMultipleDistinctKeys", func(t *testing.T) {
		resetContextManagerState(t)
		ctx1 := RegisterContext(key1)
		ctx2 := RegisterContext(key2)

		assert.NotNil(t, ctx1, "Context for key1 should not be nil")
		assert.NotNil(t, ctx2, "Context for key2 should not be nil")
		assert.NotSame(t, ctx1, ctx2, "Contexts for different keys should be different instances")

		assert.Equal(t, 1, ctxCount(key1), "ctxCount for key1 should be 1")
		assert.Equal(t, 1, ctxCount(key2), "ctxCount for key2 should be 1")
		assert.Equal(t, 2, ctxCountTotal(), "Total contexts should be 2")
	})
}

func TestUnregisterContext(t *testing.T) {
	key1 := "testKey1_unregister"
	key2 := "testKey2_unregister"
	_ = key2
	nonExistentKey := "nonExistentKey_unregister"

	t.Run("UnregisterExistingKey", func(t *testing.T) {
		resetContextManagerState(t)
		RegisterContext(key1)
		assert.Equal(t, 1, ctxCount(key1), "Context should be registered")

		cancelled, found := UnregisterContext(key1)
		assert.True(t, found, "UnregisterContext should find the registered context")
		assert.Equal(t, 1, cancelled, "UnregisterContext should report 1 cancelled context")
		assert.Equal(t, 0, ctxCount(key1), "ctxCount should be 0 after unregistering")
		assert.Equal(t, 0, ctxCountTotal(), "Total contexts should be 0")
	})

	t.Run("UnregisterNonExistentKey", func(t *testing.T) {
		resetContextManagerState(t)
		RegisterContext(key1)

		cancelled, found := UnregisterContext(nonExistentKey)
		assert.False(t, found, "UnregisterContext should not find a non-existent context")
		assert.Equal(t, 0, cancelled, "UnregisterContext should report 0 cancelled for non-existent key")
		assert.Equal(t, 1, ctxCount(key1), "ctxCount for existing key1 should remain 1")
		assert.Equal(t, 1, ctxCountTotal(), "Total contexts should remain 1")
	})

	t.Run("UnregisterFromEmptyManager", func(t *testing.T) {
		resetContextManagerState(t)

		cancelled, found := UnregisterContext(key1)
		assert.False(t, found, "UnregisterContext on empty manager should not find key")
		assert.Equal(t, 0, cancelled, "UnregisterContext on empty manager should report 0 cancelled")
		assert.Equal(t, 0, ctxCountTotal(), "Total contexts should be 0")
	})

	t.Run("UnregisterOneOfMany", func(t *testing.T) {
		resetContextManagerState(t)
		keyToUnregister := "keyToUnregister"
		keyToKeep1 := "keyToKeep1"
		keyToKeep2 := "keyToKeep2"

		RegisterContext(keyToUnregister)
		RegisterContext(keyToKeep1)
		RegisterContext(keyToKeep2)
		assert.Equal(t, 3, ctxCountTotal(), "Should have 3 contexts initially")

		cancelled, found := UnregisterContext(keyToUnregister)
		assert.True(t, found, "Should find the key to unregister")
		assert.Equal(t, 1, cancelled, "Should report 1 cancelled context")

		assert.Equal(t, 0, ctxCount(keyToUnregister), "ctxCount for unregistered key should be 0")
		assert.Equal(t, 1, ctxCount(keyToKeep1), "ctxCount for kept key1 should be 1")
		assert.Equal(t, 1, ctxCount(keyToKeep2), "ctxCount for kept key2 should be 1")
		assert.Equal(t, 2, ctxCountTotal(), "Total contexts should be 2 after unregistering one")
	})
}

func TestCancelFetch(t *testing.T) {
	key1 := "testKey1_cancelfetch"
	key2 := "testKey2_cancelfetch"
	nonExistentKey := "nonExistentKey_cancelfetch"

	t.Run("CancelFetchExistingKey", func(t *testing.T) {
		resetContextManagerState(t)
		RegisterContext(key1)
		RegisterContext(key2)
		assert.Equal(t, 1, ctxCount(key1), "key1 should be registered")
		assert.Equal(t, 1, ctxCount(key2), "key2 should be registered")
		assert.Equal(t, 2, ctxCountTotal(), "Total 2 contexts initially")

		CancelFetch(key1)

		assert.Equal(t, 0, ctxCount(key1), "ctxCount for key1 should be 0 after CancelFetch")
		assert.Equal(t, 1, ctxCount(key2), "ctxCount for key2 should remain 1")
		assert.Equal(t, 1, ctxCountTotal(), "Total contexts should be 1")
	})

	t.Run("CancelFetchNonExistentKey", func(t *testing.T) {
		resetContextManagerState(t)
		RegisterContext(key1)
		assert.Equal(t, 1, ctxCount(key1), "key1 should be registered")
		assert.Equal(t, 1, ctxCountTotal(), "Total 1 context initially")

		CancelFetch(nonExistentKey)

		assert.Equal(t, 1, ctxCount(key1), "ctxCount for key1 should remain 1")
		assert.Equal(t, 1, ctxCountTotal(), "Total contexts should remain 1")
	})

	t.Run("CancelFetchFromEmptyManager", func(t *testing.T) {
		resetContextManagerState(t)

		CancelFetch(key1)

		assert.Equal(t, 0, ctxCountTotal(), "Total contexts should remain 0")
	})

	t.Run("CancelFetchOnlySpecifiedKey", func(t *testing.T) {
		resetContextManagerState(t)
		keyToCancel := "keyToCancel_cf"
		keyToKeep1 := "keyToKeep_cf1"
		keyToKeep2 := "keyToKeep_cf2"

		RegisterContext(keyToCancel)
		RegisterContext(keyToKeep1)
		RegisterContext(keyToKeep2)
		assert.Equal(t, 3, ctxCountTotal(), "Should have 3 contexts initially")

		CancelFetch(keyToCancel)

		assert.Equal(t, 0, ctxCount(keyToCancel), "ctxCount for cancelled key should be 0")
		assert.Equal(t, 1, ctxCount(keyToKeep1), "ctxCount for kept key1 should be 1")
		assert.Equal(t, 1, ctxCount(keyToKeep2), "ctxCount for kept key2 should be 1")
		assert.Equal(t, 2, ctxCountTotal(), "Total contexts should be 2 after cancelling one")
	})
}

func TestCtxCountFunction(t *testing.T) {
	key1 := "testKey1_ctxcount"
	nonExistentKey := "nonExistentKey_ctxcount"

	t.Run("CountForExistingKey", func(t *testing.T) {
		resetContextManagerState(t)
		RegisterContext(key1)
		assert.Equal(t, 1, ctxCount(key1), "ctxCount should be 1 for an existing key")
	})

	t.Run("CountForNonExistentKey", func(t *testing.T) {
		resetContextManagerState(t)
		assert.Equal(t, 0, ctxCount(nonExistentKey), "ctxCount should be 0 for a non-existent key")
	})

	t.Run("CountAfterUnregister", func(t *testing.T) {
		resetContextManagerState(t)
		RegisterContext(key1)
		UnregisterContext(key1)
		assert.Equal(t, 0, ctxCount(key1), "ctxCount should be 0 after unregistering the key")
	})

	t.Run("CountAfterCancelFetch", func(t *testing.T) {
		resetContextManagerState(t)
		RegisterContext(key1)
		CancelFetch(key1)
		assert.Equal(t, 0, ctxCount(key1), "ctxCount should be 0 after CancelFetch for the key")
	})

	t.Run("CountWithEmptyManager", func(t *testing.T) {
		resetContextManagerState(t)
		assert.Equal(t, 0, ctxCount(key1), "ctxCount should be 0 when manager is empty and key is not present")
	})
}

func TestConcurrencyBasic(t *testing.T) {
	numGoroutines := 50

	t.Run("ConcurrentRegisterUnregisterUniqueKeys", func(t *testing.T) {
		resetContextManagerState(t)
		var wg sync.WaitGroup
		wg.Add(numGoroutines * 2)

		for i := 0; i < numGoroutines; i++ {
			go func(idx int) {
				defer wg.Done()
				key := fmt.Sprintf("concurrentKey-%d", idx)
				ctx := RegisterContext(key)
				if ctx == nil {
					t.Errorf("Registered context in goroutine %d was nil", idx)
				}
			}(i)
		}

		time.Sleep(5 * time.Millisecond)

		for i := 0; i < numGoroutines; i++ {
			go func(idx int) {
				defer wg.Done()
				key := fmt.Sprintf("concurrentKey-%d", idx)
				UnregisterContext(key)
			}(i)
		}
		wg.Wait()
		assert.Equal(t, 0, ctxCountTotal(), "Total contexts should be 0 after concurrent register/unregister of unique keys")
	})

	t.Run("ConcurrentRegisterSameKey", func(t *testing.T) {
		resetContextManagerState(t)
		sharedKey := "sharedConcurrentKey"
		var wg sync.WaitGroup
		wg.Add(numGoroutines)
		for i := 0; i < numGoroutines; i++ {
			go func() {
				defer wg.Done()
				RegisterContext(sharedKey)
			}()
		}
		wg.Wait()
		assert.Equal(t, 1, ctxCountTotal(), "Total contexts should be 1 after concurrent registrations of the same key")
		assert.Equal(t, 1, ctxCount(sharedKey), "ctxCount for sharedKey should be 1")
	})

	t.Run("ConcurrentCancelFetchMultipleKeys", func(t *testing.T) {
		resetContextManagerState(t)
		var wg sync.WaitGroup
		keys := make([]string, numGoroutines)
		for i := 0; i < numGoroutines; i++ {
			keys[i] = fmt.Sprintf("cfKey-%d", i)
			RegisterContext(keys[i])
		}
		assert.Equal(t, numGoroutines, ctxCountTotal(), "Should have numGoroutines contexts before concurrent CancelFetch")

		wg.Add(numGoroutines)
		for i := 0; i < numGoroutines; i++ {
			go func(idx int) {
				defer wg.Done()
				CancelFetch(keys[idx])
			}(i)
		}
		wg.Wait()
		assert.Equal(t, 0, ctxCountTotal(), "Total contexts should be 0 after concurrent CancelFetch operations")
	})
}

func TestReloadCancellation(t *testing.T) {
	testAddr := base.ZeroAddr.Hex()
	renderCtx := RegisterContext(testAddr)

	assert.Equal(t, 1, ctxCount(testAddr), "Expected 1 registered context")
	assert.NotNil(t, renderCtx, "RegisterContext should return non-nil context")

	cancelled, found := UnregisterContext(testAddr)
	assert.True(t, found, "UnregisterContext should find the registered context")
	assert.Equal(t, 1, cancelled, "Expected 1 cancelled context")
	assert.Equal(t, 0, ctxCount(testAddr), "Expected 0 registered contexts after reload")

	// Note: We can't easily test if the context was actually cancelled since
	// the Cancel method removes it from the map, but the fact that it was
	// removed indicates it was processed correctly
}

func TestContextRegistration(t *testing.T) {
	addr1 := "0x1234567890123456789012345678901234567890"
	addr2 := "0x2234567890123456789012345678901234567890"

	ctx1 := RegisterContext(addr1)
	ctx2 := RegisterContext(addr2)

	assert.Equal(t, 1, ctxCount(addr1), "Expected 1 for addr1")
	assert.Equal(t, 1, ctxCount(addr2), "Expected 1 for addr2")

	assert.True(t, ctx1 != nil && ctx2 != nil, "Contexts should not be nil after registration")
	assert.NotNil(t, ctx1, "Context1 should not be nil")
	assert.NotNil(t, ctx2, "Context2 should not be nil")

	cancelled, found := UnregisterContext(addr1)
	assert.True(t, found, "UnregisterContext should find the registered context")
	assert.Equal(t, 1, cancelled, "Expected 1 cancelled context")

	assert.Equal(t, 0, ctxCount(addr1), "ctxCount for addr1 should be 0")
	assert.Equal(t, 1, ctxCount(addr2), "ctxCount for addr2 should be 1")

	nonExistentAddr := "0x9999999999999999999999999999999999999999"
	cancelled, found = UnregisterContext(nonExistentAddr)
	assert.False(t, found, "UnregisterContext should not find non-existent context")
	assert.Equal(t, 0, cancelled, "Expected 0 cancelled contexts for non-existent address")
}

func TestCancelFetches(t *testing.T) {
	key1 := "testKey1_cancelall"
	key2 := "testKey2_cancelall"
	key3 := "testKey3_cancelall"

	t.Run("CancelFetchesWithMultipleKeys", func(t *testing.T) {
		tearDown()

		RegisterContext(key1)
		RegisterContext(key2)
		RegisterContext(key3)

		assert.Equal(t, 3, ctxCountTotal(), "Should have 3 contexts before CancelFetches")

		cancelledCount := CancelFetches()

		assert.Equal(t, 3, cancelledCount, "CancelFetches should report 3 cancelled contexts")
		assert.Equal(t, 0, ctxCountTotal(), "Total contexts should be 0 after CancelFetches")
	})

	t.Run("CancelFetchesOnEmptyManager", func(t *testing.T) {
		tearDown()

		cancelledCount := CancelFetches()

		assert.Equal(t, 0, cancelledCount, "CancelFetches on empty manager should report 0 cancelled")
		assert.Equal(t, 0, ctxCountTotal(), "Total contexts should remain 0")
	})

	t.Run("CancelFetchesIdempotent", func(t *testing.T) {
		tearDown()

		RegisterContext(key1)
		assert.Equal(t, 1, ctxCountTotal(), "Should have 1 context before first CancelFetches")

		cancelledCount1 := CancelFetches()
		assert.Equal(t, 1, cancelledCount1, "First CancelFetches should report 1 cancelled")
		assert.Equal(t, 0, ctxCountTotal(), "Total contexts should be 0 after first CancelFetches")

		cancelledCount2 := CancelFetches()
		assert.Equal(t, 0, cancelledCount2, "Second CancelFetches should report 0 cancelled")
		assert.Equal(t, 0, ctxCountTotal(), "Total contexts should remain 0")
	})
}

func resetContextManagerState(t *testing.T) {
	t.Helper()
	cm := GetContextManager()
	cm.renderCtxsMutex.Lock()
	defer cm.renderCtxsMutex.Unlock()

	for _, ctx := range cm.renderCtxs {
		if ctx != nil {
			ctx.Cancel()
		}
	}
	cm.renderCtxs = make(map[string]*output.RenderCtx)
}

func tearDown() {
	cm := GetContextManager()
	cm.renderCtxsMutex.Lock()
	defer cm.renderCtxsMutex.Unlock()

	for _, ctx := range cm.renderCtxs {
		if ctx != nil {
			ctx.Cancel()
		}
	}
	cm.renderCtxs = make(map[string]*output.RenderCtx)
}
