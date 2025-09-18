# Design & Architecture

**trueblocks-dalle** is built for local-first, privacy-respecting image generation. Here’s a summary of its design:

## Local-First Principle

All image generation and manipulation happens on your machine. No data is sent to external servers.

## Key Components

- **Context**: Manages configuration and orchestrates image generation.
- **Image**: Represents generated or loaded images, with methods for annotation and saving.
- **Prompt Handling**: Converts user prompts into model-ready instructions.
- **Backend**: Abstracts the underlying AI model (can be swapped or extended).

## Extensibility

- The backend is pluggable—swap in different models or engines as needed.
- Annotation and manipulation methods are composable.

## Design Document

For a deeper dive, see the [original design document](https://docs.google.com/document/d/1jNUonGHN6mHT4FqrmI7TlS82epNOqHECcxwobLQGxTo/edit?tab=t.0).
