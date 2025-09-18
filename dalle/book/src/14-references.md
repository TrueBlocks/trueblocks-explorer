# References

Curated pointers to primary sources. Prefer reading the code itself—these links help you jump quickly.

---

## Internal Modules (Packages / Files)

Core Orchestration:
- `context.go` – Builds templates, derives attributes, composes prompts, initiates image generation.
- `manager.go` – LRU + TTL context cache, concurrency control, high‑level generation entrypoints.
- `series.go` / `series_crud.go` – Series model, filtering & CRUD operations.
- `text2speech.go` – Text to speech orchestration & file persistence.

Prompt & Attributes:
- `pkg/prompt/prompt.go` – Base templates, enhancement invocation.
- `pkg/prompt/attribute.go` – Seed slicing & attribute selection.
- `pkg/prompt/openai.go` / `openai_test.go` – OpenAI request construction & tests.
- `pkg/prompt/openai_api_error.go` – Structured API error type.
- `pkg/prompt/response.go` – Image API response struct(s).

Image & Annotation:
- `pkg/image/image.go` – Image request, orientation logic, annotation integration.
- `pkg/annotate/annotate.go` – Banner rendering, color analysis.

Domain Model:
- `pkg/model/explorer.go` / `types.go` – `DalleDress` struct, accessors & formatting.

Progress & Storage:
- `pkg/progress/progress.go` – Phase state machine, EMA metrics, archiving.
- `pkg/storage/datadir.go` – Data directory resolution and path helpers.

Utilities:
- `pkg/utils/utils.go` / `debugcurl.go` – Generic helpers & debug curl generation.

Design / Documentation Artifacts:
- `design/*.md` – Historical and architectural notes (superseded where conflicts with book).
- `book/src/*.md` – This rewritten documentation set.

---

## Key Types & Functions

Prompts & Attributes:
- `MakeDalleDress(ctx, seed, seriesFilter)` – Constructs the deterministic clothing concept/context.
- `EnhancePrompt(base string)` – (Optional) model‑based prompt rewrite.
- `SelectAttribute(seedSlice, list)` (implicit in attribute code) – Deterministic selection primitive.

Generation & Management:
- `GenerateAnnotatedImage(...)` – High‑level one‑shot artifact pipeline.
- `GenerateAnnotatedImageWithEnhancedPrompt(...)` – Variation including explicit enhancement.
- `ReloadDatabases()` – Refreshes series/attribute sources inside a context.

Image & Annotation:
- `GenerateImageWithBaseURL(dress, orientation)` – Executes OpenAI image call.
- `Annotate(image, text)` – Produces captioned image (see file for exact signature).

Progress:
- `NewProgress(runID)` – Initialize run tracking.
- `UpdatePhase(phase)` – Transition phases + timestamp.
- `Snapshot()` – Serialize current progress metrics.

Text‑to‑Speech:
- `TextToSpeech(text, voice)` – High‑level orchestrator.
- `GenerateSpeech(dress)` – Derived speech synthesis for a dress/title.

Errors & Types:
- `OpenAIAPIError` – Structured upstream error container.
- `DalleResponse1` – Primary image API response mapping.

---

## Environment Variables

- `OPENAI_API_KEY` – Required for any network generation.
- `TB_DALLE_NO_ENHANCE` – Disable model enhancement layer.
- `TB_DALLE_DATA_DIR` – Override artifact root directory.
- `TB_DALLE_ARCHIVE_RUNS` – If set, archive run directories instead of pruning.
- `TB_CMD_LINE` – Flag used in some code paths (e.g. to adjust output verbosity or behavior).

---

## External APIs & Libraries

OpenAI:
- Chat Completions (enhancement) – Provides refined prompt text.
- Images (DALL·E / Images API) – Generates artwork given final prompt.
- Text‑to‑Speech – Converts textual descriptions to audio.

Go Libraries:
- `net/http` – REST calls.
- `encoding/json` – Marshal/unmarshal payloads.
- Imaging stack (e.g. `fogleman/gg`, `go-colorful`) – Color analysis and drawing for annotations.

---

## Data & Directory Layout

Relative to resolved data directory (`pkg/storage/datadir.go`):
- `prompt/` – Base prompt text files.
- `enhanced/` – Enhanced prompt variants.
- `title/` – Full descriptive titles.
- `terse/` – Short titles / slugs.
- `generated/` – Raw downloaded images.
- `annotated/` – Captioned images.
- `audio/` – Speech output (when TTS run).
- `selector/` – Any additional selection or metadata artifacts.

Each file typically named with the run GUID plus an extension (`.txt`, `.png`, `.mp3`, etc.).

---

## Design Rationale Pointers

- Determinism vs. Creativity – See Advanced chapter & Design Notes.
- EMA Progress Estimation – Progress chapter for algorithmic details.
- Seed → Attribute Mapping – Series & Attributes chapter; code in `attribute.go`.
- Orientation Heuristics – Image & Annotation chapter; logic inside `image.go`.
- Annotation Contrast Logic – `annotate.go` (calculates luminance & chooses contrasting text color).

---

## Suggested Reading Order (Recap)
1. Introduction
2. Quick Start
3. Architecture
4. Context & Manager
5. Series & Attributes
6. Prompt Pipeline
7. Image & Annotation
8. Progress
9. Text‑to‑Speech
10. API Reference
11. Advanced Usage & Extensibility
12. Testing & Contributing
13. FAQ
14. References (this page)
15. Changelog / Design Notes

---

Next: Changelog / Design Notes → `15-design-notes.md`
