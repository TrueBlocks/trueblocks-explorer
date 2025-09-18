# Advanced Usage & Extensibility

## Custom Image Backend

Replace OpenAI generation by wrapping `GenerateAnnotatedImage`:

1. Call `GenerateAnnotatedImage(series,address,true,0)` (skipImage=true) to produce prompts without network.
2. Read enhanced or base prompt from disk.
3. Use external backend → write PNG to `generated/<filename>.png`.
4. Call `annotate.Annotate` to create annotated version.

## Offline Mode

Without `OPENAI_API_KEY` you still obtain deterministic prompt artifacts; image and enhancement phases become no-ops producing placeholders.

## Adding An Attribute

- Add database file, extend `prompt.DatabaseNames` / `attributeNames`.
- Add accessor on `DalleDress`.
- Update templates to reference new method.
- Regenerate documentation.

## Concurrency Patterns

Generate multiple distinct (series,address) pairs concurrently; per-pair lock prevents duplication. For global throttling, introduce an external worker pool.

## Progress Integration

Poll `GetProgress` asynchronously. Each `ProgressReport` returns a pointer to live `DalleDress` (treat read-only).

## Metrics & Observability

Phase averages are basic; integrate with OpenTelemetry by wrapping generation calls and annotating spans with phase transitions.

## Error Injection Testing

- Invalid API key → expect `OpenAIAPIError`.
- Simulate network timeout with firewall/latency tool; observe `image.post.timeout` log.

## Determinism Considerations

Disable enhancement (`TB_DALLE_NO_ENHANCE=1`) for reproducible regression tests.

## Swapping Templates at Runtime

Use `DalleDress.FromTemplate(customTemplateString)` to experiment. Persist results to a custom directory to avoid interfering with canonical artifacts.

## Security Notes

- Path cleaning already enforced; retain checks if adding new file outputs.
- Keep API key only in environment; avoid embedding in logs (current debug curl masks only by relying on environment—sanitize if extending).

Next: [Testing & Contributing](12-testing-contributing.md)
