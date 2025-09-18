# Context & Manager

This chapter drills into context construction, caching, and lifecycle management.

## Context Responsibilities

`context.go` defines `Context` which bundles:

- Templates (prompt, data, title, terse, author)
- In-memory `Databases` (map: database name -> slice of CSV row strings)
- `Series` metadata (filters & suffix)
- `DalleCache` (address -> *DalleDress)

The context owns *pure prompt state*; it **does not** perform network calls (image generation and enhancement are separate functions using the context’s outputs).

## Building a Context

`NewContext()`:

1. Loads cache manager (`storage.GetCacheManager().LoadOrBuild()`)
2. Initializes template pointers from `prompt` package variables
3. Creates empty maps
4. Calls `ReloadDatabases("empty")` to seed initial series

## Database Loading

`ReloadDatabases(filter string)`:

- Loads `Series` via `loadSeries(filter)`
- For each name in `prompt.DatabaseNames` tries cached binary index → falls back to CSV
- Applies optional per-field filtering from `Series.GetFilter(fieldName)`
- Ensures at least one row ("none") to avoid zero-length selection panics

## Constructing a DalleDress

`MakeDalleDress(address string)`:

- Normalizes key (filename-safe) and returns cached instance if present
- Builds a `seed` = original + reverse(original); enforces length >= 66; strips `0x`
- Iteratively slices 6 hex chars every 8 chars; maps them into attributes until databases exhausted
- Builds prompt layers by executing templates; conditionally loads an `enhanced` prompt from disk if present
- Stores under both original and normalized cache keys for future hits

## Thread Safety

`CacheMutex` protects `DalleCache`. Additional `saveMutex` guards concurrent file writes in `reportOn`.

## Manager Layer

`manager.go` adds an LRU+TTL around contexts so each *series* has at most one resident context. Key pieces:

- `managedContext` struct holds context + lastUsed timestamp
- Global `contextManager` map + order slice
- `ManagerOptions` (MaxContexts, ContextTTL) adjustable via `ConfigureManager`
- Eviction: contexts older than TTL are dropped; if still above capacity, least-recently-used removed

## Generation Entry Point

`GenerateAnnotatedImage(series, address, skipImage, lockTTL)`:

1. Early return if annotated image already exists (synthetic cache hit progress run created)
2. Acquire per-(series,address) lock with TTL to avoid duplicate concurrent generations
3. Build / fetch context and `DalleDress`
4. Start and transition progress phases (base prompts → enhance → image...) unless `skipImage`
5. Delegate to `Context.GenerateImageWithBaseURL` for image pipeline
6. Mark completion, update metrics

`skipImage=true` still produces prompt artifacts but bypasses network phases.

## Locks

A map of `requestLocks` with TTL prevents burst duplicate work. Expired locks are cleaned opportunistically.

## Cache Hit Shortcut

If `annotated/<address>.png` exists the system:

- Builds `DalleDress` (ensures consistent metadata)
- Starts a progress run (if one doesn’t already exist)
- Marks cacheHit + completed without regenerating

## Cleaning Artifacts

`Clean(series, address)` removes the generated set: annotated png, raw image, selector JSON, audio, and prompt text files across all prompt subdirectories.

## When to Add a New Context Field

Add new fields only if they reflect deterministic state or necessary caches. Side-effectful network concerns belong outside.

## Extension Strategies

- **Alternate Persistence:** wrap `reportOn` or post-process after `GenerateAnnotatedImage`.
- **Custom Prompt Layers:** execute additional templates with `DalleDress.FromTemplate`.
- **Series Variants:** manage multiple series suffixes and rely on manager eviction for memory control.

Next: [Series & Attribute Databases](05-series-attributes.md)
