# Introduction

`trueblocks-dalle` is a Go library that deterministically turns an input *address-like string* (typically an Ethereum address or any hex-ish token) into a structured set of semantic attributes, synthesizes multiple layers of natural-language prompts, optionally enhances those prompts through OpenAI Chat, generates an image through OpenAI's image API, annotates the image with a terse caption, tracks detailed generation progress, and (optionally) produces an mp3 narration of the enhanced prompt.

This is **not** a generic wrapper around OpenAI. It is a *prompt orchestration and artifact pipeline* with the following properties (all derived from code, not prior documentation):

## Core Properties

- Deterministic attribute derivation from a seed derived out of the provided string (`Context.MakeDalleDress`).
- Attribute selection is driven by slicing a reversible seed and mapping 6‑hex-byte windows into indexed rows across a fixed set of *logical databases* (`prompt.DatabaseNames`).
- Layered prompt templates: data, title, terse, full, and optional enhancement (templates in `pkg/prompt/prompt.go`).
- Optional enhancement via OpenAI Chat (`EnhancePrompt`) gated by `OPENAI_API_KEY` and bypassable by `TB_DALLE_NO_ENHANCE=1`.
- Image generation through OpenAI Images API (`image.RequestImage`) with orientation/size heuristics and fallback to base64 decoding.
- On-the-fly PNG annotation with dynamic background and contrast-aware text rendering (`annotate.Annotate`).
- Persistent output tree (under a resolved `DataDir()/output`) storing per-series artifacts: prompts, generated PNG, annotated PNG, JSON selector, audio, etc.
- Series concept (`Series` struct) providing optional *filter lists* restricting which database rows are eligible per attribute class.
- LRU + TTL managed contexts so a large number of series can be used without unbounded memory growth (`manager.go`).
- Fine-grained generation progress tracking with phase timing, ETA estimation, exponential moving averages, and optional archival of runs (`pkg/progress`).
- Text‑to‑speech prompt audio via OpenAI TTS (`tts-1`) if an API key is present (`TextToSpeech`).

## Philosophy

The library treats a user-provided seed as *structured entropy* for art generation. Rather than letting randomness float everywhere, it deterministically selects slices that reproducibly map into curated lists (adverbs, emotions, art styles, colors, etc.). This produces a stable yet rich space of visual identities.

Everything stored on disk becomes verifiable artifacts: the raw prompts, the enhanced prompt (if produced), the annotated image, and a JSON serialization of the `DalleDress` (the internal prompt state object). This encourages introspection, auditing, caching, and reproducibility.

## High-Level Flow

1. Resolve or create a `Context` (through the manager for a given series).
2. Construct (or retrieve from cache) a `DalleDress` for an address: slice seed → build attributes → materialize prompt templates → read any previously enhanced prompt.
3. If enhancement needed: call OpenAI Chat to rewrite the prompt; store enhanced result.
4. Generate image: POST to OpenAI image endpoint; download or decode base64; write `generated/<file>.png`.
5. Annotate: re-open image, compute palette-based background, render terse caption; write to `annotated/<file>.png`.
6. Update progress phases throughout; record metrics; optionally produce audio mp3.

## Key Data Structures

- `Context`: Holds templates, in-memory database slices, per-address `DalleDress` cache.
- `DalleDress`: Complete snapshot of prompt generation state, including selected attribute values and output paths.
- `Series`: JSON-backed filter and metadata object scoping generation (adjectives, nouns, gazes, etc. can be narrowed).
- `Attribute`: A single semantic unit (e.g. emotion) derived from a seed slice and database index.
- `ProgressReport`: Real-time view of generation phases and timing.

## When to Use

Use `trueblocks-dalle` when you need reproducible, inspectable AI image generation pipelines rooted in deterministic seeds, with transparent intermediate artifacts and minimal imperative orchestration code.

## When Not to Use

- If you need streaming multi-image batches per prompt (current code generates exactly one per request).
- If you require offline model execution (the included generation path depends on OpenAI unless you stub `RequestImage`).
- If you need arbitrary prompt mutation outside the existing templates (you can extend, but that’s extra work).

## Next

Jump to the [Quick Start](02-quick-start.md) or dive into the [Architecture](03-architecture.md) if you prefer a systems overview first.
