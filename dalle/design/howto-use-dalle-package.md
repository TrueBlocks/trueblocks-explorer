# How to Integrate the `trueblocks-dalle` Package in a New Application

## 1. Introduction

This document serves as a guide for developers looking to integrate the `trueblocks-dalle` Go package into a new application. It is based on an analysis of the existing `dalleserver` and the `dalle` package it uses. The goal is to clarify the separation of concerns between the library and the server and to provide a clear path for reusing the core image generation logic.

## 2. Architectural Overview: Library vs. Server

The `trueblocks-dalleserver` repository contains two main components:

1.  **The `dalle` Package (the Library)**: Located in the `dalle/` directory, this is a self-contained Go package responsible for the core logic of generating AI artwork based on blockchain data. It is designed to be portable and reusable.
2.  **The `dalleserver` (the Application)**: The root of the repository, this is a web server that exposes the functionality of the `dalle` package through an HTTP API.

The key design principle is **separation of concerns**:

*   The **`dalle` package** handles the "what" and "how" of image generation.
*   The **`dalleserver`** handles the "where" and "when" of exposing that functionality over the web.

## 3. What the `dalle` Package Provides Out-of-the-Box

When you import and use the `dalle` package in your own Go application, you automatically get several powerful features without needing to re-implement them. These are primarily managed by the `dalle.Manager` (`dalle/manager.go`).

The main entrypoint you will use is:

```go
dalle.GenerateAnnotatedImage(series, address string, skipImage bool, lockTTL time.Duration) (string, error)
```

Calling this function gives you:

*   **Context Management**: The package automatically caches the data contexts (`dalle.Context`) needed for generation. It uses an efficient in-memory LRU (Least Recently Used) cache with a TTL (Time To Live) to manage memory. Your application does not need to worry about loading, caching, or expiring these contexts.
*   **Request Locking & Deduplication**: The package ensures that only one generation process for a specific `(series, address)` pair can run at a time. If your application calls `GenerateAnnotatedImage` for a job that is already in progress, the function will return quickly without starting a duplicate process. This prevents resource waste.
*   **Stateful Progress Updates**: The package tracks the state of the generation process (e.g., enhancing prompt, downloading image, annotating). It updates this state in a shared progress manager.

## 4. What Your New Application is Responsible For

The `dalle` package intentionally leaves a few responsibilities to the consuming application to ensure flexibility.

### Responsibility 1: Asynchronous Execution

`dalle.GenerateAnnotatedImage` is a **synchronous, blocking function**. It will not return until the image generation is complete or has failed.

The `dalleserver` runs this function in a new goroutine (`go func() { ... }`) because, as an HTTP server, it must handle requests in a non-blocking manner.

Your new application must decide on its own concurrency model:

*   **For a command-line tool or a script**: You might call the function synchronously and simply wait for it to finish.

    ```go
    // Simple, synchronous call
    imagePath, err := dalle.GenerateAnnotatedImage("my-series", "0x...", false, 5 * time.Minute)
    if err != nil {
        log.Fatalf("Generation failed: %v", err)
    }
    fmt.Printf("Image generated at: %s\n", imagePath)
    ```

*   **For a GUI, web service, or other concurrent application**: You will likely want to run the generation in a background goroutine to keep your application responsive.

    ```go
    // Asynchronous call
    go func() {
        imagePath, err := dalle.GenerateAnnotatedImage("my-series", "0x...", false, 5 * time.Minute)
        if err != nil {
            // Log the error or send a notification
            return
        }
        // Notify that the job is done
    }()
    ```

### Responsibility 2: Progress Reporting (The UI)

While the `dalle` package *updates* the progress state, it does not know how you want to *present* that progress to the user.

Your application is responsible for polling for progress and displaying it. You can do this by using the `progress` sub-package.

```go
import "github.com/TrueBlocks/trueblocks-dalle/v2/pkg/progress"

// After starting a generation job...

// You can poll this function periodically
func checkProgress(series, address string) {
    report := progress.GetProgress(series, address)
    if report == nil {
        fmt.Println("Generation has not started yet.")
        return
    }

    if report.Done {
        fmt.Printf("Generation complete! Final state: %s\n", report.CurrentPhase)
    } else {
        fmt.Printf("In progress... Current phase: %s (%d%%)\n", report.CurrentPhase, report.Percent)
    }
}
```

## 5. When to Use the Library vs. the Server API

You have two options for integrating `dalle`'s functionality:

1.  **Use the `dalle` package as a Go library.**
2.  **Communicate with the `dalleserver` via its HTTP API.**

Here’s how to choose:

*   **Use the `dalle` package directly (as a library) if:**
    *   Your new application is written in **Go**.
    *   You need **tight integration** and control over the generation process.
    *   You are building a desktop/CLI tool or a system where running an external server is inconvenient.
    *   You want to perform complex operations, like batch processing, that are not exposed by the API.

*   **Communicate with the `dalleserver` (via its API) if:**
    *   Your new application is written in a **different language** (e.g., Python, JavaScript, Rust).
    *   Your application runs on a **different machine** from the generation service.
    *   You are happy with a simple "fire-and-forget" mechanism and can poll an HTTP endpoint for status.
    *   You prefer to manage the generation service as a separate, standalone process.

## 6. Summary: A How-To Guide

To use the `dalle` package in a new Go application:

1.  **Add the dependency**: Make sure your `go.mod` file correctly references the `trueblocks-dalle` package. You may need a `replace` directive if you are developing locally.

    ```
    replace github.com/TrueBlocks/trueblocks-dalle/v2 => ../path/to/your/dalle/submodule
    ```

2.  **Configure the Manager (Optional)**: You can override the default context cache settings if needed.

    ```go
    import dalle "github.com/TrueBlocks/trueblocks-dalle/v2"

    func main() {
        opts := dalle.ManagerOptions{
            MaxContexts: 50, // Cache up to 50 series contexts
            ContextTTL:  1 * time.Hour, // Keep them for 1 hour
        }
        dalle.ConfigureManager(opts)
        // ... rest of your app
    }
    ```

3.  **Initiate Image Generation**: Decide on your concurrency model (sync or async) and call `dalle.GenerateAnnotatedImage`.

4.  **Report Progress (Optional)**: If your application needs to show progress, set up a poller that calls `progress.GetProgress(series, address)` and displays the returned information to the user.
