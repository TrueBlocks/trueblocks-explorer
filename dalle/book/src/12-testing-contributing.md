# Testing & Contributing

## Test Surfaces

Focus areas:

- Attribute derivation correctness
- Prompt template stability
- Progress phase ordering & metrics updates
- Storage path resolution & cleanup logic
- Error handling for enhancement & image fallback

## Running Tests

```sh
go test ./...
```

Ensure `OPENAI_API_KEY` is unset for deterministic offline tests unless a specific integration test requires it.

## Helpers

- `ResetContextManagerForTest()` – Clears context cache.
- `progress.ResetMetricsForTest()` – Clears phase averages.
- Environment-based toggles (`TB_DALLE_NO_ENHANCE`) to control branches.

## Contributing Workflow

1. Open an issue describing change & rationale.
2. Fork & branch (`feat/<topic>` or `fix/<topic>`).
3. Add or update targeted tests (avoid broad unrelated churn).
4. Run `go vet`, `go fmt` (or rely on editor tooling).
5. Update docs if public behavior changes.
6. Open PR with concise summary and code references.

## Code Style Guidelines

- Prefer early returns over deep nesting.
- Keep exported surface minimal—favor internal helpers.
- Log structured key/value pairs consistent with existing patterns.

## Adding a Database / Attribute

Document the change in the book (Series & Attributes + Prompt Pipeline) and incrementally test attribute selection using deterministic seeds.

## Performance Considerations

Context caching reduces database reload overhead; avoid forcing reloads inside hot loops. Batch image generations to amortize network latency.

Next: [FAQ](13-faq.md)
