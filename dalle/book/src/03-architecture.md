# Architecture

This section is a code-first walkthrough of the pipeline. It intentionally mirrors the actual responsibilities present in the repository.

## High-Level Flow

Seed (address) → Context / Series → Attribute Databases → DalleDress → Prompt Templates → (Enhance) → Image Request → Download/Base64 → Annotate → Persist → (TTS) → Progress Metrics

## Core Packages

| Area | Package / File | Responsibility |
|------|----------------|----------------|
| Context lifecycle | `context.go`, `manager.go` | Build & cache contexts, assemble `DalleDress`, orchestrate generation entry points. |
| Series & filters | `series.go`, `series_crud.go` | JSON-backed attribute filters + metadata. |
| Prompt system | `pkg/prompt/*` | Templates, attribute derivation, OpenAI chat enhancement, image API response structs. |
| Image pipeline | `pkg/image/image.go` | OpenAI image request, size heuristics, download, base64 fallback, annotation call, progress transitions. |
| Annotation | `pkg/annotate/annotate.go` | Palette-based banner creation + contrast safe text drawing. |
| Progress tracking | `pkg/progress/*` | Phase timing, EMA metrics, caching, ETA estimation, optional archival. |
| Storage paths | `pkg/storage/datadir.go` | Data dir resolution + directory helpers. |
| Model state | `pkg/model/explorer.go` | Methods over attribute map for templating. |
| Text to speech | `text2speech.go` | OpenAI TTS integration + speech generation helpers. |

## Determinism

Attribute selection depends only on the seed and database contents. Filters in a `Series` reduce candidate rows (still deterministic). Prompt enhancement (if enabled) introduces a non-deterministic step; disabling it yields reproducible full artifact sets.

## Artifact Surfaces

Artifacts emitted per (series,address):

- `data/` raw attribute dump
- `title/` human title
- `terse/` caption text
- `prompt/` structured full prompt
- `enhanced/` optional enhanced prompt
- `generated/` raw image png
- `annotated/` captioned png
- `selector/` json `DalleDress`
- `audio/` mp3 (optional)

## Phases (Progress)

1. setup
2. base_prompts
3. enhance_prompt (optional)
4. image_prep
5. image_wait
6. image_download
7. annotate
8. completed / failed

Each phase completion updates a moving average (unless cache hit). Percent/ETA = (sum elapsed or average)/(sum averages).

## Error Strategies

- Network errors wrap into typed errors where practical (`OpenAIAPIError`).
- Missing API key yields placeholder or skipped enhancement/image steps without failing the pipeline.
- File path traversal is prevented via cleaned absolute path prefix checks.

## Extending

Replace `image.RequestImage` for alternate providers; add new databases + methods on `DalleDress` for extra semantic dimensions; or decorate progress manager for custom telemetry.

Next: [Context & Manager](04-context-manager.md).
