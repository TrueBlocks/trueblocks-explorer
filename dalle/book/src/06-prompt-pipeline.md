# Prompt Generation Pipeline

## Overview

Prompt layers provide multiple projections of the same attribute set for different downstream uses: captioning, logging, enhancement, and model instruction.

## Layers

| Directory | Purpose |
|-----------|---------|
| `data/` | Raw attribute dump for auditing. |
| `title/` | Composite title (emotion + adverb + adjective + occupation + noun). |
| `terse/` | Short caption placed on annotated image. |
| `prompt/` | Structured base instruction combining attributes into narrative. |
| `enhanced/` | Optional ChatGPT-refined version of base prompt. |

## Templates

Defined in `pkg/prompt/prompt.go` as Go `text/template` instances. Template methods invoked on `DalleDress` (e.g. `{{.Noun true}}`) control short/long formatting.

### Example Snippet (Base Prompt)

```
Draw a {{.Adverb false}} {{.Adjective false}} {{.Noun true}} ...
```

### Literary Style

If a literary style attribute is present (not `none`), extra author persona context (`AuthorTemplate`) precedes enhancement.

## Enhancement

`EnhancePrompt(prompt, authorType)` calls OpenAI Chat with model `gpt-4`. Bypass rules:

- Environment `TB_DALLE_NO_ENHANCE=1`
- Missing `OPENAI_API_KEY`

Output is wrapped with guard text: `DO NOT PUT TEXT IN THE IMAGE` (added both sides) to discourage textual artifacts inside generated images.

## Accessor Semantics

Each accessor on `DalleDress` returns either a short token or expanded annotated string depending on a boolean flag (`short`). Some (Orientation, BackStyle) embed other attribute values.

## Adding A New Layer

1. Create template constant + compiled variable in `prompt.go`.
2. Add pointer in `Context` if persisted similarly.
3. Execute in `MakeDalleDress` and persist like existing layers.
4. Optionally expose accessor or include in API docs.

## Failure Modes

- Missing attribute keys (extending without accessor) → template execution error.
- Enhancement HTTP failure → returns typed `OpenAIAPIError`; generation may still proceed with base prompt.

Next: [Image Request & Annotation](07-image-annotation.md)
