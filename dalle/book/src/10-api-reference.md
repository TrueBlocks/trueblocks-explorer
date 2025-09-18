# Public API Reference

Primary exported functions/types commonly used by consumers. Consult code for authoritative signatures.

## Generation

- `GenerateAnnotatedImage(series, address string, skipImage bool, lockTTL time.Duration) (string, error)` – Full pipeline; returns annotated image path (may already exist).
- `GenerateAnnotatedImageWithBaseURL(series, address string, skipImage bool, lockTTL time.Duration, baseURL string) (string, error)` – Override image endpoint.
- `GenerateSpeech(series, address string, lockTTL time.Duration) (string, error)` – Ensure mp3.
- `Speak(series, address string) (string, error)` – Generate if missing then return mp3 path.
- `ReadToMe(series, address string) (string, error)` – Alias semantics.

## Context Methods

- `ctx.MakeDalleDress(address)` – Build or fetch internal prompt state.
- `ctx.GetPrompt(address)` / `ctx.GetEnhanced(address)` – Retrieve base/enhanced prompt text.
- `ctx.GenerateImage(address)` – Requires existing `DalleDress` in cache (build first via `MakeDalleDress`).
- `ctx.ReloadDatabases(filter)` – Reload series + filtered databases.

## Series Management

- `ListSeries() []string`
- `LoadSeriesModels(dir)` / `LoadActiveSeriesModels(dir)` / `LoadDeletedSeriesModels(dir)`
- `DeleteSeries(dir, suffix)` (marks deleted + renames output) / `UndeleteSeries(dir, suffix)` / `RemoveSeries(dir, suffix)` (hard delete)

## Progress

- `GetProgress(series,address)` – Snapshot (removed after completion)
- `ActiveProgressReports()` – All active runs

## Utilities / Admin

- `ConfigureManager(ManagerOptions)` – Adjust context cache sizing.
- `Clean(series,address)` – Remove artifacts.
- `ContextCount()` – Number of cached contexts.
- `ResetContextManagerForTest()` – Testing helper.

## Key Types (Selected Fields)

| Type | Important Fields |
|------|------------------|
| `Series` | Suffix, Last, Deleted, filter slices (Adverbs, Adjectives, ...). |
| `DalleDress` | Prompt layers (Prompt, DataPrompt, TitlePrompt, TersePrompt, EnhancedPrompt), Attribs, paths (GeneratedPath, AnnotatedPath), Series, CacheHit, Completed. |
| `Attribute` | Database, Name, Bytes, Number, Factor, Selector, Value. |
| `ProgressReport` | Current, Percent, ETASeconds, Phases[], DalleDress pointer. |
| `ManagerOptions` | MaxContexts, ContextTTL. |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `TB_DALLE_DATA_DIR` | Override base data directory root. |
| `OPENAI_API_KEY` | Enables enhancement, image, and TTS. |
| `TB_DALLE_NO_ENHANCE` | Skip GPT-based enhancement if `1`. |
| `TB_DALLE_ARCHIVE_RUNS` | Archive per-run JSON snapshots if `1`. |
| `TB_CMD_LINE` | If `true`, attempt to `open` annotated image (macOS). |

## Error Types

- `prompt.OpenAIAPIError` – Contains fields: Message, StatusCode, Code.

## Patterns

Typical flow:

```go
path, err := dalle.GenerateAnnotatedImage(series, address, false, 0)
if err != nil { /* handle */ }
if audio, _ := dalle.GenerateSpeech(series, address, 0); audio != "" { /* use mp3 */ }
```

Next: [Advanced Usage & Extensibility](11-advanced.md)
