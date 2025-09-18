# Image Request & Annotation

## Request Flow

`image.RequestImage` steps:

1. Build `prompt.Request` with model (currently `dall-e-3`).
2. Infer size from orientation keywords (landscape/horizontal/vertical) else square.
3. Early placeholder file if `OPENAI_API_KEY` missing.
4. POST to OpenAI images endpoint (override via baseURL parameter upstream).
5. Parse response: URL path OR base64 fallback (`b64_json`).
6. Download or decode → write `generated/<file>.png`.
7. Annotate with terse prompt via `annotate.Annotate` → write `annotated/<file>.png`.
8. Update progress phases (wait → download → annotate) and DalleDress fields (ImageURL, DownloadMode, paths).

## Download Modes

- `url` direct HTTP GET
- `b64` inline base64 decode (when no URL provided)

## Annotation Mechanics

`annotate.Annotate`:

- Validates source path contains `/generated/`
- Reads image, computes dominant colors (top 3 frequency) → average background
- Chooses contrasting text (white/black) via lightness threshold
- Draws separator line + wraps caption text
- Writes sibling file swapping `generated` → `annotated`

## Error Handling

- Network or decode failure returns error; upstream marks progress failure.
- Annotation failure aborts after raw image write (annotated artifact missing).
- Missing API key: annotated placeholder is empty file (still allows cache semantics).

## Customization Points

- Change model: patch selection logic near `modelName` variable.
- Bypass annotation: replace `annotateFunc` var in tests or fork logic.
- Add watermark: extend `Annotate` to composite additional graphics.

Next: [Progress Tracking](08-progress.md)
