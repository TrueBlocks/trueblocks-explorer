# Quick Start

This walkthrough exercises the full pipeline with minimal code and shows where artifacts land on disk.

## 0. Environment

(Optional) choose a data directory. If unset a platform default is chosen.

```sh
set -x TB_DALLE_DATA_DIR /absolute/path/to/dalle-data   # fish shell
```

Set your OpenAI key (required for image, enhancement, speech):

```sh
set -x OPENAI_API_KEY sk-...                            # fish
```

Optionally disable enhancement for faster runs:

```sh
set -x TB_DALLE_NO_ENHANCE 1
```

## 1. Install

```sh
go get github.com/TrueBlocks/trueblocks-dalle/v2@latest
```

## 2. Minimal Program

```go
package main

import (
    "fmt"
    dalle "github.com/TrueBlocks/trueblocks-dalle/v2"
)

func main() {
    series  := "demo"
    address := "0x1234abcd5678ef901234abcd5678ef901234abcd" // any sufficiently long seed-like string

    out, err := dalle.GenerateAnnotatedImage(series, address, false, 0)
    if err != nil { panic(err) }
    fmt.Println("Annotated image:", out)

    if audio, err := dalle.GenerateSpeech(series, address, 0); err == nil && audio != "" {
        fmt.Println("Speech mp3:", audio)
    }

    if pr := dalle.GetProgress(series, address); pr != nil {
        fmt.Printf("Phase: %s cacheHit=%v done=%v\n", pr.Current, pr.CacheHit, pr.Done)
    }
}
```

Run it with:

```sh
go run main.go
```

## 3. Output Layout

`$TB_DALLE_DATA_DIR/output/<series>/`:

- `generated/<address>.png` raw image
- `annotated/<address>.png` captioned image
- `prompt/` `terse/` `title/` `data/` `enhanced/` text artifacts
- `selector/<address>.json` serialized `DalleDress`
- `audio/<address>.mp3` (if TTS ran)

## 4. Re-running

Re-running the same series+address returns immediately (cache hit) once the annotated PNG exists.

## 5. Next

Proceed to [Architecture](03-architecture.md) for a deeper exploration.
