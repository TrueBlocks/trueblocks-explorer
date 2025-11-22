package exports

// // TestSDKStreamingBehavior tests the SDK Export() method directly to isolate
// // whether the 10+ second delay is in SDK initialization or app-level code
// func TestSDKStreamingBehavior(t *testing.T) {
// 	// Use a known address with transaction data
// 	testAddress := "0xf503017d7baf7fbc0fff7492b751025c6a78179b"
// 	testChain := "mainnet"

// 	fmt.Printf("=== SDK Streaming Test ===\n")
// 	fmt.Printf("Testing address: %s\n", testAddress)
// 	fmt.Printf("Chain: %s\n", testChain)

// 	startTime := time.Now()
// 	fmt.Printf("Test started at: %s\n", startTime.Format("15:04:05.000"))

// 	// Create streaming context exactly like app code does
// 	// Use the store's RegisterContext method to get a proper RenderCtx
// 	renderCtx := store.RegisterContext("sdk-streaming-test")

// 	// Ensure proper cleanup
// 	defer func() {
// 		fmt.Printf("Cleaning up context...\n")
// 		store.UnregisterContext("sdk-streaming-test")
// 	}()

// 	// Track when first item arrives
// 	firstItemReceived := false
// 	itemCount := 0

// 	// Start goroutine to listen for streaming data
// 	streamingDone := make(chan bool, 1)
// 	go func() {
// 		defer func() { streamingDone <- true }()

// 		fmt.Printf("Streaming goroutine started, waiting for data...\n")

// 		for {
// 			select {
// 			case item, ok := <-renderCtx.ModelChan:
// 				if !ok {
// 					fmt.Printf("ModelChan closed. Total items received: %d\n", itemCount)
// 					return
// 				}

// 				// Use the item to avoid unused variable error
// 				_ = item
// 				itemCount++
// 				if !firstItemReceived {
// 					firstItemReceived = true
// 					firstItemTime := time.Now()
// 					delay := firstItemTime.Sub(startTime)
// 					fmt.Printf("*** FIRST ITEM RECEIVED at %s (delay: %v) ***\n",
// 						firstItemTime.Format("15:04:05.000"), delay)
// 				}

// 				// Log every 10th item to track streaming pattern
// 				if itemCount%10 == 0 {
// 					currentTime := time.Now()
// 					elapsed := currentTime.Sub(startTime)
// 					fmt.Printf("Item %d received at %s (elapsed: %v)\n",
// 						itemCount, currentTime.Format("15:04:05.000"), elapsed)
// 				}

// 				// Just log progress, don't forcibly stop
// 				if itemCount >= 100 {
// 					fmt.Printf("Reached %d items, continuing to let SDK finish naturally...\n", itemCount)
// 				}

// 			case err, ok := <-renderCtx.ErrorChan:
// 				if !ok {
// 					fmt.Printf("ErrorChan closed\n")
// 					return
// 				}
// 				if err != nil {
// 					fmt.Printf("Error received: %v\n", err)
// 					return
// 				}
// 			}
// 		}
// 	}()

// 	// Set up SDK options exactly like app code
// 	opts := sdk.ExportOptions{
// 		Globals: sdk.Globals{
// 			Cache:   true,
// 			Verbose: true,
// 			Chain:   testChain,
// 		},
// 		RenderCtx: renderCtx,
// 		Addrs:     []string{testAddress},
// 	}

// 	fmt.Printf("Calling SDK Export() at: %s\n", time.Now().Format("15:04:05.000"))

// 	// Add timeout to prevent infinite hang
// 	done := make(chan error, 1)

// 	go func() {
// 		// Call SDK Export - this is where the delay should occur if it's SDK-related
// 		_, _, err := opts.Export()
// 		done <- err
// 	}()

// 	// Wait for either completion or timeout
// 	var err error
// 	var totalTime time.Duration

// 	select {
// 	case err = <-done:
// 		exportCompleteTime := time.Now()
// 		totalTime = exportCompleteTime.Sub(startTime)
// 		fmt.Printf("SDK Export() completed at: %s (total time: %v)\n",
// 			exportCompleteTime.Format("15:04:05.000"), totalTime)

// 	case <-time.After(30 * time.Second):
// 		exportCompleteTime := time.Now()
// 		totalTime = exportCompleteTime.Sub(startTime)
// 		fmt.Printf("*** SDK Export() TIMED OUT after %v ***\n", totalTime)
// 		t.Errorf("SDK Export() timed out after 30 seconds")
// 		return
// 	}

// 	if err != nil {
// 		t.Fatalf("SDK Export failed: %v", err)
// 	}

// 	// Wait for streaming to complete or timeout
// 	fmt.Printf("Waiting for streaming goroutine to finish...\n")
// 	select {
// 	case <-streamingDone:
// 		fmt.Printf("Streaming goroutine completed normally\n")
// 	case <-time.After(5 * time.Second):
// 		fmt.Printf("Streaming goroutine still running after 5s, continuing...\n")
// 	}

// 	// Don't manually close channels - let UnregisterContext handle it
// 	fmt.Printf("SDK Export completed, channels will be cleaned up by defer\n")

// 	// Wait a moment for goroutine to finish logging
// 	time.Sleep(500 * time.Millisecond)

// 	fmt.Printf("\n=== Test Results ===\n")
// 	fmt.Printf("Total execution time: %v\n", totalTime)
// 	fmt.Printf("First item received: %v\n", firstItemReceived)
// 	fmt.Printf("Total items streamed: %d\n", itemCount)

// 	if !firstItemReceived {
// 		t.Error("No items were received from SDK streaming")
// 	}

// 	// If first item takes more than 2 seconds, that's suspicious
// 	if totalTime > 2*time.Second && itemCount == 0 {
// 		fmt.Printf("WARNING: SDK took >2s and no items received - possible cold start issue\n")
// 	}
// }
