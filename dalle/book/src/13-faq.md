# FAQ

A living collection of concrete, code-grounded answers. If something here contradicts code, the code wins and this page should be fixed.

---

## Does generation work without an OpenAI API key?
No. Core image and (optionally) enhancement + text‑to‑speech all rely on OpenAI endpoints. If `OPENAI_API_KEY` is unset the pipeline short‑circuits early with an error. You can still exercise deterministic local pieces (series filtering, attribute selection, template expansion) in tests that stub the network layer, but no image or audio artifacts will be produced.

## What does “deterministic” actually guarantee?
Given the same (seed, series database ordering, enhancement disabled/enabled, template set, orientation flag) you will get identical prompts and therefore (modulo OpenAI’s model randomness) identical requests. Image pixels are not guaranteed because the upstream model is non‑deterministic. Everything up to the HTTP request body is deterministic. Enhancement injects model creativity, so disable it (`TB_DALLE_NO_ENHANCE=1`) for stricter reproducibility.

## How are attributes chosen from the seed?
`pkg/prompt/attribute.go` slices the seed (converted to string, hashed, or both depending on call) across ordered slices of candidate values. Some categories (e.g. colors, art styles) may intentionally duplicate entries to weight their selection frequency. The order of the underlying database lists (loaded from `storage/databases`) is therefore part of the deterministic surface.

## My attribute changes are ignored after editing a database file—why?
The context keeps an in‑memory copy until you call `ReloadDatabases()` (directly or via a new context creation). If you modify on disk JSON/CSV (depending on implementation) you must reload or create a fresh context (TTL eviction in the manager can do this automatically if you wait past expiry).

## When are contexts evicted?
`manager.go` maintains an LRU with a time‑based staleness check. Access (read or generation) refreshes the entry. Once capacity is exceeded or TTL exceeded the least recently used entries are dropped. Any subsequent request causes reconstruction from disk.

## Why can prompt enhancement be slow?
Enhancement is a separate chat completion call that: (1) builds a system + user message set, (2) waits on OpenAI latency, (3) returns a refined string. This adds an entire round trip. For batch runs disable with `TB_DALLE_NO_ENHANCE=1` to save time and remove external variability.

## Do I lose anything by disabling enhancement?
Only the model‑augmented rewrite layer. Base prompt quality still leverages structured templates and seed‑derived attributes. Disable it for: tests, reproducible benchmarks, or rate limit conservation.

## Is orientation always respected?
Orientation is a hint. The code applies simple logic (e.g. width > height desired?) and chooses an `size`/`aspect_ratio` (depending on OpenAI API version) that matches. OpenAI may still perform internal cropping; final pixels can differ subtly.

## Where are intermediate prompts stored?
Under the resolved data directory (see `pkg/storage/datadir.go`) in subfolders: `prompt/` (base), `enhanced/` (post‑enhancement), `terse/` (shortened titles), `title/` (final titles), plus `generated/` (raw images) and `annotated/` (banner overlaid). The manager orchestrates creation; files are named with the request GUID.

## How do I clean up disk usage?
If `TB_DALLE_ARCHIVE_RUNS` is unset, old run directories may accumulate. A periodic external cleanup (e.g. cron) deleting oldest GUID folders beyond retention is safe—artifacts are immutable after creation. Just avoid deleting partial runs that are still in progress (look for absence of a `completed` progress marker file).

## What if enhancement fails but image generation would succeed?
Failure in enhancement logs an error and (depending on implementation details) either falls back to the base prompt or aborts. Current code prefers fail‑fast so you notice silent prompt mutation issues—consult `EnhancePrompt` call sites. You may wrap it to downgrade to a warning if desired.

## How are progress percentages computed?
`pkg/progress/progress.go` tracks durations per phase using an exponential moving average (EMA). Each new observed duration updates the EMA; the sum of EMAs forms a denominator. Active phase elapsed divided by its EMA plus completed EMA sums yield a coarse percent. This self‑calibrates over multiple runs.

## Why does my percent jump backwards occasionally?
If a phase historically was short (small EMA) but a current run is slower, the instantaneous estimate can overshoot then normalize when the phase ends and the EMA updates. User‑facing UIs should treat percentage as approximate and can smooth with an additional client‑side moving average.

## Can I add a new output artifact type?
Yes. Pick a directory name, produce the file (e.g. `sketch/` for line art derivation), and add it to any archival or listing logic referencing known subfolders. Avoid breaking existing readers by leaving current names intact.

## How do I ensure two parallel runs do not collide in filenames?
Each run uses a GUID namespace. Collisions would require a UUIDv4 duplication (practically impossible). Within a run deterministic names are fine because there is only one writer thread.

## What concurrency guarantees does the manager provide?
Single flight per logical request (GUID or composite key) guarded by a lock map. Attribute selection and prompt construction occur inside the critical section; disk writes are sequential per run. Cross‑run concurrency is allowed as long as resources (API quota, disk IO) suffice.

## How do I simulate OpenAI for tests without hitting the network?
Abstract the HTTP client (interfaces or small indirection). Provide a fake that returns canned JSON resembling `DalleResponse1`. Tests in this repository already stub some paths; extend them by injecting your fake into context or image generation code.

## What if an image download partially fails (one of several variants)?
The current code treats image fetch as critical; a single failure can mark the run failed. To implement partial resilience, change the loop to skip failed variants, record an error in progress metadata, and continue annotation for successful images.

## How do I change banner styling in annotations?
Modify `pkg/annotate/annotate.go` (e.g. font face, padding). Colors come from analyzing pixel luminance to choose contrasting text color. You can also precompute a palette and bypass analysis for speed.

## Why is there no local model fallback?
Scope control: The package focuses on orchestration patterns, not reproduction of diffusion models. Adding a local backend would require pluggable interface abstraction (which you can add—see Advanced chapter). The code stays lean by delegating generative complexity.

## Can I stream progress events instead of polling files?
Yes. Add a channel broadcast or WebSocket layer in `progress` when `UpdatePhase` is called. The current system writes snapshots to disk; streaming is an additive feature.

## What licensing constraints exist on generated artifacts?
This code’s LICENSE governs the orchestration logic. Image/audio outputs follow OpenAI’s usage policies, which may evolve. Always review upstream terms; this repository does not override them.

## How do I report or inspect OpenAI errors?
`pkg/prompt/openai_api_error.go` defines `OpenAIAPIError`. When the API returns structured error JSON, it populates this type. Log it or surface to clients verbatim to aid debugging (strip sensitive request IDs if needed).

## Why might enhancement produce an empty string?
Strong safety filters or a mis-structured prompt can cause the model to return minimal content. Guard by validating length and falling back to the base prompt if below a threshold.

## What is the fastest path to “just get an annotated image” in code?
Call `GenerateAnnotatedImage(ctx, seed, seriesFilter, orientation)` on a manager instance (after creating or reusing a context) and then read the `annotated/` image file named with the returned GUID.

---

Next: References → `14-references.md`
