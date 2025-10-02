# Creating Series: Design and Motivation

## Motivation

The purpose of the Series system in DalleDress is to empower end users to create their own meaningful, thematically coherent sets of prompt ingredients for generative art. By curating and combining elements from various creative categories (emotions, actions, art styles, etc.), users can define unique "series" that drive the generation of images, stories, or other creative outputs. This design enables:

- **Personalization:** Users can craft series that reflect their own interests, moods, or artistic goals.
- **Reproducibility:** Each series is a named, versioned, and resumable set, making it easy to revisit or extend creative explorations.
- **Combinatorial Power:** By selecting subsets from each category, users can control the breadth and depth of generative variation.

## What is a Series File?

A series file (e.g., `ecstasy-harlem-renaissance-shooting.json`) is a JSON object representing a curated set of prompt ingredients. It is based on the `Series` struct in Go, with fields for each creative category:

- `suffix` (string): The unique name for the series (also the filename stem)
- `last` (int): Index of the last generated item (for resumability)
- `deleted` (bool): Marks the series as inactive (soft delete)
- `modifiedAt` (string): Timestamp of last modification
- Slices for each category: `adverbs`, `adjectives`, `nouns`, `emotions`, `occupations`, `actions`, `artstyles`, `litstyles`, `colors`, `viewpoints`, `gazes`, `backstyles`, `compositions`

Example:
```json
{
  "suffix": "fury",
  "last": 0,
  "adjectives": ["ashen", "erupting"],
  "nouns": ["city", "horizon"],
  "emotions": ["fury"],
  "actions": ["exploding"],
  "artstyles": ["neo-expressionism"],
  "colors": ["scarlet", "smoke gray"],
}
```

## The Databases

The `dalle/databases` folder contains CSV files for each creative category (e.g., `actions.csv`, `adjectives.csv`, `artstyles.csv`, etc.). Each file is a pool of possible tokens for that category. Series files select curated subsets from these pools.

## Naming Patterns

Series filenames are constructed from key category anchors (e.g., emotion-artstyle-action) in kebab-case. The suffix should be unique, descriptive, and reflect the main axes of variation.

## Workflow for Creating a Series

1. **Choose a Theme:** Decide the main axes (e.g., emotion, artstyle, action).
2. **Curate Tokens:** Select meaningful subsets from each relevant CSV.
3. **Assemble the Series:** Populate the `Series` struct with chosen tokens.
4. **Save the Series:** Write the JSON to `series/<suffix>.json` with `last = 0`.
5. **Iterate and Generate:** Use the series to drive prompt generation, incrementing `last` as you go.

## Selection Strategies

- **Curated:** Manually pick a small, cohesive set for each category.
- **Sampled:** Use weighted or random sampling from the CSVs.
- **Cross-Product:** Combine a few items from each of several categories for combinatorial variation.
- **Progressive:** Start small and expand the series over time.

## Best Practices

- Keep slices intentionally ordered and deduped.
- Avoid combinatorial explosion by limiting the number of items in high-variation categories.
- Use the `last` field to track progress and support resumability.
- Use the `deleted` field to retire series without losing history.

## Extending the System

To add new creative categories (e.g., "myth"), see the companion design document `adding-myths.md`.
