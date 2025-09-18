// Package msgs provides a simple event system for communication between different parts of the application.
// It is built on top of Wails' runtime event system but adds a layer for testability.
//
// In production, events are emitted using Wails' runtime.EventsEmit.
// In test mode (enabled by calling SetTestMode(true)), events are dispatched to in-memory listeners.
// This allows tests to subscribe to events and wait for specific events to occur without relying on the Wails runtime.
//
// # Example Usage in Tests
//
// To use this package in tests for collections like AbisCollection, MonitorsCollection, or NamesCollection,
// you can use the WaitForLoadedEvent function to wait for the data to be loaded before making assertions.
//
// First, ensure that test mode is enabled in your test setup:
//
// ```go
//
//	func TestMain(m *testing.M) {
//	 msgs.SetTestMode(true) // Enable test mode
//	 // It's also crucial to initialize the context if your code relies on it,
//	 // even in test mode, as some parts of the msgs package might still try to access it.
//	 // A background context is usually sufficient for tests.
//	 msgs.InitializeContext(context.Background())
//	 os.Exit(m.Run())
//	}
//
// ```
//
// Then, in your test, you can create a collection, load data, and wait for the corresponding "loaded" event:
//
// ```go
// import (
//
//	"testing"
//	"time"
//
//	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
//	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/abis" // or monitors, names
//	"github.com/stretchr/testify/assert"
//
// )
//
//	func TestMyCollectionLoading(t *testing.T) {
//	 // Create a new collection (e.g., AbisCollection)
//	 abisCollection := abis.NewAbisCollection()
//
//	 // Start a goroutine to wait for the "Downloaded" abis to be loaded.
//	 // The string argument to WaitForLoadedEvent ("Downloaded", "Known", "Monitors", "All", etc.)
//	 // must match the 'facetName' or 'dataFacet' string used when msgs.EmitLoaded is called
//	 // by the collection's LoadData method.
//	 doneCh := msgs.WaitForLoadedEvent(string(abis.AbisDownloaded))
//
//	 // Trigger data loading
//	 abisCollection.LoadData(abis.AbisDownloaded)
//
//	 // Wait for the data to be loaded, with a timeout
//	 select {
//	 case <-doneCh:
//	  // Data loaded, proceed with assertions
//	  page, err := abisCollection.GetPage(abis.AbisDownloaded, 0, 10, nil, "")
//	  assert.NoError(t, err)
//	  assert.NotNil(t, page)
//	  // Add more assertions as needed
//	 case <-time.After(5 * time.Second): // Adjust timeout as necessary
//	  t.Fatal("timed out waiting for abis to load")
//	 }
//	}
//
// ```
//
// This pattern ensures that your tests are synchronized with the asynchronous data loading process.
package msgs

import (
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var (
	wailsContext context.Context
	contextMutex sync.RWMutex
)

var (
	testMode      bool
	testModeLock  sync.RWMutex
	listeners     map[EventType][]func(optionalData ...interface{})
	listenersLock sync.RWMutex
)

func init() {
	listeners = make(map[EventType][]func(optionalData ...interface{}))
}

// InitializeContext sets up the context for the messaging system.
// This is typically called once at the start of the application.
// ctx: the context provided by Wails, used for runtime event emission.
func InitializeContext(ctx context.Context) {
	contextMutex.Lock()
	defer contextMutex.Unlock()
	wailsContext = ctx
	log.Println("Messaging context initialized")
}

// emitMessage is the core function for emitting events.
// It sends events through Wails runtime if context is available,
// and always dispatches to local listeners if in test mode.
func emitMessage(messageType EventType, msgText string, payload ...interface{}) {
	contextMutex.RLock()
	ctx := wailsContext
	contextMutex.RUnlock()

	if IsTestMode() {
		dispatchToListeners(messageType, msgText, payload...)
	} else {
		if ctx != nil {
			// Create args slice with message first, then payload
			args := []interface{}{msgText}
			args = append(args, payload...)
			runtime.EventsEmit(ctx, string(messageType), args...)
		}
	}
}

// Sugar

func EmitLoaded(payload types.DataLoadedPayload) {
	emitMessage(EventDataLoaded, payload.Collection, payload)
}

// EmitStatus sends a general status update.
func EmitStatus(msgText string, payload ...interface{}) {
	emitMessage(EventStatus, msgText, payload...)
}

// EmitManager sends a message related to management or administrative tasks.
func EmitManager(msgText string, payload ...interface{}) {
	emitMessage(EventManager, msgText, payload...)
}

// EmitError signals that an error has occurred.
// It formats the error message and includes the original error.
func EmitError(msgText string, err error, payload ...interface{}) {
	msg := fmt.Sprintf("%s: %v", msgText, err)
	emitMessage(EventError, msg, payload...)
}

// EmitProjectOpened signals that a project has been opened and context should be restored.
// This includes navigation to the project's last view and analytical state restoration.
func EmitProjectOpened(lastView string, payload ...interface{}) {
	emitMessage(EventProjectOpened, lastView, payload...)
}

// EmitProjectModal signals project modal related events.
func EmitProjectModal(msgText string, payload ...interface{}) {
	emitMessage(EventProjectModal, msgText, payload...)
}

// On registers a callback function for a specific event type.
// In production, it uses Wails' runtime.EventsOn.
// In test mode, it registers the callback with the internal listener system.
// It returns an unsubscribe function to remove the listener.
func On(eventType EventType, callback func(optionalData ...interface{})) func() {
	if IsTestMode() {
		return registerListener(eventType, callback)
	}

	contextMutex.RLock()
	ctx := wailsContext
	contextMutex.RUnlock()

	if ctx != nil {
		return runtime.EventsOn(ctx, string(eventType), callback)
	}

	return func() {}
}

// WaitForEvent creates a channel that closes when a specific event type occurs once.
// It automatically unregisters the listener after the event is received.
// This is useful for synchronizing asynchronous operations in tests or application logic.
func WaitForEvent(eventType EventType) <-chan bool {
	ch := make(chan bool, 1)

	unsub := On(eventType, func(optionalData ...interface{}) {
		select {
		case ch <- true:
			close(ch)
		default:
			// Channel already closed or full
		}
	})

	go func() {
		<-ch
		unsub()
	}()

	return ch
}

// registerListener adds a callback to the internal list of listeners for a given event type.
// This is used when the system is in test mode.
// It returns an unsubscribe function.
func registerListener(eventType EventType, callback func(optionalData ...interface{})) func() {
	listenersLock.Lock()
	defer listenersLock.Unlock()

	if _, exists := listeners[eventType]; !exists {
		listeners[eventType] = make([]func(optionalData ...interface{}), 0)
	}

	listeners[eventType] = append(listeners[eventType], callback)
	return func() {
		listenersLock.Lock()
		defer listenersLock.Unlock()
		if listenersList, exists := listeners[eventType]; exists {
			for i, registeredCallback := range listenersList {
				if &registeredCallback == &callback {
					lastIndex := len(listenersList) - 1
					if i != lastIndex {
						listenersList[i] = listenersList[lastIndex]
					}
					listeners[eventType] = listenersList[:lastIndex]
					break
				}
			}
		}
	}
}

// dispatchToListeners sends an event to all registered listeners for that event type.
// This is used when the system is in test mode.
// Listeners are called concurrently in separate goroutines.
func dispatchToListeners(eventType EventType, msgText string, payload ...interface{}) {
	listenersLock.RLock()
	defer listenersLock.RUnlock()

	eventListeners, exists := listeners[eventType]
	if !exists || len(eventListeners) == 0 {
		return
	}

	args := []interface{}{msgText}
	args = append(args, payload...)

	for _, listener := range eventListeners {
		go func(callback func(optionalData ...interface{})) {
			defer func() {
				if r := recover(); r != nil {
					log.Printf("Recovered from panic in event listener: %v", r)
				}
			}()
			callback(args...)
		}(listener)
	}
}
