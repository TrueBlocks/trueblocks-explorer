# Text-to-Speech

## Overview

Optional conversion of the enhanced (or base) prompt into an mp3 using OpenAI `tts-1` model.

## Entry Points

- `GenerateSpeech(series,address,lockTTL)` ensures mp3 exists (respects per-address lock)
- `Speak(series,address)` generate-if-missing then returns path
- `ReadToMe(series,address)` same semantics (ensure mp3, return path)

## Conditions

- Skips silently if `OPENAI_API_KEY` unset
- Voice defaults to `alloy`
- 1 minute context timeout; simple retry loop until success or timeout

## Storage

`<DataDir>/output/<series>/audio/<address>.mp3`

## Implementation Notes

- Minimal JSON body manually constructed (lighter than defining structs)
- Escapes quotes/newlines with `marshalEscaped`
- Retries on non-200 logging attempt, status, and any error
- Uses `0600` file permissions

## Customization

Wrap `TextToSpeech` to swap provider or implement local TTS; keep same output path for integration with existing tooling.

Next: [Public API Reference](10-api-reference.md)
