// Package storage centralizes data-directory handling, series metadata persistence,
// and other filesystem-backed concerns (cache, output, metrics) for the DALL·E
// server. By isolating these responsibilities, higher‑level packages avoid
// duplicating path logic or environment bootstrap code.
package dalle
