# Series & Attribute Databases

## Purpose

A `Series` constrains or themes generations by restricting which rows from each logical *database* may be selected during attribute derivation. It also names the output namespace (folder suffix).

## Database Order

Defined in `prompt.DatabaseNames` (order is significant for deterministic mapping):

```
adverbs, adjectives, nouns, emotions, occupations, actions,
artstyles, artstyles, litstyles,
colors, colors, colors,
orientations, gazes, backstyles
```

Duplicated entries (artstyles, colors) allow multiple independent selections without custom logic.

## Raw Rows

Each database loads as a slice of strings (CSV lines, version prefixes stripped). Rows are treated as opaque until later parsed by accessor methods in `DalleDress` (splitting on commas, trimming pieces, etc.).

## Series JSON Schema (excerpt)

```jsonc
{
  "suffix": "demo",
  "adverbs": ["swiftly", "boldly"],
  "adjectives": [],
  "nouns": [],
  "emotions": ["joy"],
  "deleted": false
}
```

Only non-empty slices act as filters. If a slice is empty, no filtering occurs for that category.

## Filtering Logic

For each database:
1. Load full slice (cache index → fallback CSV)
2. If the corresponding `Series` slice is non-empty, retain rows containing *any* filter substring
3. If the resulting slice is empty, insert a sentinel `"none"` to avoid selection panics

Substring containment (not exact match) enables flexible partial filters but may admit unintended rows; prefer distinctive tokens.

## Attribute Construction Recap

`prompt.NewAttribute(dbs, index, bytes)`:

- Interprets 6 hex chars as number → factor in [0,1)
- Scales to database length to pick selector index
- Captures value string; accessor methods later format for prompt templates

## Extending with a New Attribute

1. Add a database file & loader logic (mirroring existing ones)
2. Append names to `DatabaseNames` and `attributeNames` in the same positional slot
3. Add a slice field to `Series` (exported, plural) for potential filtering
4. Create accessor on `DalleDress` (e.g. `func (d *DalleDress) Weather(short bool) string`)
5. Update templates (`promptTemplateStr`, etc.) to include the new semantic
6. Regenerate docs

Changing the *order* of `DatabaseNames` is a breaking change to deterministic mapping and should be avoided after release.

## Pitfalls

- Over-filtering (e.g. selecting a single emotion) reduces variety and can cause visually repetitive outputs.
- Adding a new attribute without updating templates yields unused entropy.
- Removing an attribute breaks existing cached serialized `DalleDress` JSON consumers expecting that field.

## Example Filter Use Case

To produce a cohesive color-themed series—populate `colors` slice in the series JSON with a shortlist (e.g. `"ultramarine"`, `"amber"`). Those rows will dominate selection while other attributes still vary.

Next: [Prompt Generation Pipeline](06-prompt-pipeline.md)
