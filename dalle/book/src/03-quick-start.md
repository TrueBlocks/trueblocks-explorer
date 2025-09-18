# Quick Start

Let’s generate an image in just a few lines of Go code.

```go
package main

import (
    "fmt"
    "github.com/TrueBlocks/trueblocks/dalle/v2"
)

func main() {
    // Create a new dalle context
    ctx := dalle.NewContext()

    // Generate an image from a prompt
    img, err := ctx.GenerateImage("A futuristic cityscape at sunset")
    if err != nil {
        panic(err)
    }

    // Save the image to disk
    err = img.Save("cityscape.png")
    if err != nil {
        panic(err)
    }

    fmt.Println("Image saved as cityscape.png")
}
```

This example demonstrates the core workflow: create a context, generate an image, and save it. For more, see [Advanced Usage](06-advanced-usage.md).
