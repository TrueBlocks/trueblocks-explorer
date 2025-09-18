# Changelog / Design Notes

A narrative of why the system looks the way it does. Organized by themes instead of strict time order (the Git history is the authoritative chronological record).

---

## Core Goals
- Deterministic scaffold around inherently stochastic model calls.
- Small, inspectable codebase (favor clarity over abstraction).
- File‑system artifact transparency (every stage leaves a tangible trace).
- Graceful degradation (disable enhancement, still useful; skip TTS, still complete).

## Guiding Principles
1. Code First Documentation – Book regenerated from code truths (no speculative claims).
2. Single Responsibility – Each package holds a narrow concern (prompting, annotation, progress, etc.).
3. Observable by Default – Prompts, titles, annotated outputs, progress snapshots all persisted.
4. Conservative Concurrency – Simplicity beats micro‑optimizing parallel fetches at this scale.
5. Extensibility via Composition – Add new artifact stages by composing functions, not subclassing.

## Key Decisions & Trade‑Offs

### Deterministic Attribute Selection
Pros: Reproducible prompt scaffold; enables cache hits and diffable changes.
Cons: Less surprise/novelty without enhancement; requires curated attribute pools.
Alternative rejected: Pure random selection every run (harder to test and reason about regressions).

### Optional Enhancement Layer
Rationale: Keep base system self‑contained while still offering higher quality prompts when desired.
Failure mode: Enhancement adds latency and an external dependency surface; disabled in CI / tests.

### File System as Persistence & Log
Pros: Zero extra service dependencies; easy manual inspection; supports archival & reproducibility.
Cons: No query semantics; potential disk churn. Mitigation: run pruning or archiving env var.
Alternative: Database or object store abstraction (deferred until scale justifies).

### EMA for Progress Estimation
Chosen over naive fixed weights: adapts to evolving performance characteristics (network latency, model changes).
Trade‑off: Early runs yield noisy estimates until EMA stabilizes.

### Single Image Pipeline (Sequential Variant Handling)
Instead of parallel HTTP requests: simpler error handling and deterministic progress order. Parallelization could be added later behind a flag if throughput becomes critical.

### Annotation Banner Styling
Dynamic contrast analysis for legibility vs. fixed palette. Chosen to accommodate diverse image backgrounds without manual curation.

### Minimal Interface Surface
Public API intentionally thin (manager functions + a few constructors). Internal refactors less likely to trigger downstream breakage.

## Evolution Highlights
- Initial scaffold: context + prompt templates + image request.
- Added deterministic attribute engine (seed slicing) improving reproducibility.
- Introduced progress phase tracking; later augmented with EMA statistics.
- Added annotation stage for immediate visual branding / metadata embedding.
- Integrated optional prompt enhancement (OpenAI chat) with opt‑out flag.
- Added text‑to‑speech for richer multimodal artifact sets.
- Documentation rewrite to align with real behavior (this book).

## Potential Future Enhancements
| Area | Idea | Rationale |
|------|------|-----------|
| Backend abstraction | Interface for image provider | Swap OpenAI with local or alternative APIs. |
| Streaming progress | WebSocket or SSE emitter | Real‑time UI updates without polling. |
| Partial resilience | Skip failed image variants | Improve success rate under transient network errors. |
| Caching layer | Hash → image reuse | Avoid regeneration for identical final prompts. |
| Local validation | Lint prompt templates | Detect missing template fields early. |
| Security hardening | Strict network client wrapper | Uniform retry / backoff / logging policy. |
| Benchmark suite | Performance regression tests | Track latency and resource trends. |
| Metrics export | Prometheus counters | Operational observability for long‑running service. |

## Anti‑Goals (for now)
- Full local model replication (scope creep; focus stays orchestration layer).
- Complex plugin system (YAGNI; composition suffices).
- Database dependence (file artifacts adequate until scale pressure). 

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Upstream API contract changes | Breaks generation | Version pin + response struct adaptation tests. |
| Disk growth | Exhaust storage | Scheduled pruning / archival compression. |
| Attribute list drift | Unintended prompt shifts | Version control + diff review on list edits. |
| Enhancement latency spikes | Slower UX | Optional disable flag + timeout wrapping. |
| Progress misestimation | Poor UX feedback | EMA smoothing + UI disclaimers. |

## Testing Philosophy
- Deterministic layers (attribute mapping, template expansion) thoroughly unit tested.
- Network edges minimized & stubbed in tests; external calls out of critical logic for testability.
- Visual artifact tests kept lightweight (e.g., hash banner size or presence rather than pixel perfection).

## Refactoring Guidelines
1. Preserve public function signatures unless strong justification.
2. Introduce new feature flags / env vars for opt‑in behavior changes.
3. Update documentation (this book) in the same commit as semantic changes.
4. Maintain deterministic surfaces—if you introduce randomness, gate it behind an explicit parameter.

## Changelog (High‑Level Summary)
(This section intentionally summarizes; consult Git log for exact commits.)
- v0.1: Base context, prompt templates, image generation.
- v0.2: Attribute seed mapping + series filtering.
- v0.3: Progress tracking + EMA.
- v0.4: Annotation banner & color analysis.
- v0.5: Prompt enhancement opt‑in.
- v0.6: Text‑to‑speech integration.
- v0.7: Comprehensive documentation rewrite (current state).

## Glossary
- Dress / DalleDress – Structured concept derived from seed & attributes feeding templates.
- Enhancement – Model‑driven rewrite of base prompt.
- EMA – Exponential Moving Average used for phase duration estimation.
- Run GUID – Unique identifier for one full generation pipeline execution.

## How to Contribute Design Changes
Open an issue outlining: Problem → Proposed Change → Alternatives → Impact on determinism → Migration considerations. Link directly to affected code lines (permalinks). Update this file if rationale extends beyond a short commit message.

---

Next: (End) – You have reached the final chapter.
