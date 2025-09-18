# Progress Tracking

## Purpose

Real-time insight & metrics for the generation lifecycle with ETA estimates grounded in moving average phase durations.

## Phases

Ordered list (`progress.OrderedPhases`):

```
setup → base_prompts → enhance_prompt → image_prep → image_wait → image_download → annotate → failed/completed
```

`image_prep` currently acts as a transitional placeholder (timing can be extended in future).

## Data Structures

- `ProgressManager` singleton keyed by `series:address`
- `progressRun` internal mutable state
- `ProgressReport` externally returned snapshot
- Exponential moving average per phase (`alpha=0.2`)

## Percent & ETA Calculation

1. Sum average durations of non-terminal phases → total
2. Accumulate averages of completed phases + capped elapsed of current phase → done
3. percent = done/total * 100; ETA = (total - done)

Cache hits skip average updates and are immediately marked completed.

## Archival & Metrics Persistence

Phase averages stored in `<DataDir>/metrics/progress_phase_stats.json`. Set `TB_DALLE_ARCHIVE_RUNS=1` to serialize per-run snapshots under `metrics/runs/`.

## Public Functions

- `GetProgress(series,address)` returns (and prunes when completed)
- `ActiveProgressReports()` returns active snapshots

## Failure Path

On error: current phase ends, run transitions to `failed`, summary log emitted, and (if archival enabled) snapshot saved.

## Extending

Add a new phase by appending to `OrderedPhases`, initializing timing in `StartRun`, and inserting transitions in generation code. Consider metrics implications (initial averages start undefined until one run completes that phase).

Next: [Text-to-Speech](09-text2speech.md)
