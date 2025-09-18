# Public Interface

**trueblocks-dalle** is designed with a minimal, focused public interface. The following are the primary types and functions you’ll use in most applications:

## Context

The `Context` type is the main entry point for all operations.

```go
ctx := dalle.NewContext()
```

## Image Generation

Generate an image from a text prompt:

```go
img, err := ctx.GenerateImage("A serene mountain lake at dawn")
```

## Image Manipulation

Annotate or modify images using built-in methods:

```go
img.Annotate("Lake Geneva, 2025")
```

## Saving Images

Save images to disk:

```go
err := img.Save("output.png")
```

## Minimal Surface

Only a handful of types and methods are exported. For advanced or internal use, see [Advanced Usage](06-advanced-usage.md).
