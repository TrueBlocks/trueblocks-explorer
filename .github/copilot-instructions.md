# AI Agent Instructions


## Architecture Overview

- **Wails Desktop App**: Go backend (`app/`), React/Mantine frontend (`frontend/src/`).
- **Frontend**: Facet-based views, Mantine UI, TypeScript models auto-generated from Go (`frontend/wailsjs/go/models.ts`).
- **Backend**: API handlers (`app/api_*.go`) expose all data via Wails bindings; Go structs drive frontend types. Facet configs and header actions are defined in backend `viewConfig` (see `app/view_config.go`).

## ABSOLUTE REQUIREMENTS - ZERO TOLERANCE

### Package Management
- **YARN ONLY** - Never use `npm` or `npx`
- Run commands from repo root: `yarn start`, `yarn build`, `yarn test`
- Frontend commands run through root package.json, not `frontend/` directory


### Development Workflow
- **Yarn Only**: All commands (`yarn lint`, `yarn test`) run from repo root.
- **Lint/Test/Build**: Always run `yarn lint && yarn test` after changes. Try to fix errors if they fail. Do not run `yarn start` unless instructed.
- **Go/TS Model Sync**: After backend changes, run `wails generate module` to update TypeScript bindings.
- **Read file contents first** before editing - files change between requests
- **No comments in production code** - only use comments for TODO.
- **Use `Log` from `@utils`** instead of console.log (console.log is invisible in Wails)
- **CRITICAL: Race Condition Prevention**: Always consider race conditions when using async/parallel operations. Multiple async calls that read-modify-write the same data source WILL create race conditions. Use sequential operations or proper locking mechanisms. Common scenarios: parallel API calls updating the same backend state, multiple components calling the same store methods simultaneously, Promise.all() with state-modifying operations. When in doubt, make operations sequential with await chains rather than parallel with Promise.all().
- **CRITICAL: Code Insertion Placement**: NEVER insert code in inappropriate locations. Always respect file structure: package declarations first in Go files, imports grouped properly in TypeScript files, class/function boundaries, etc. When editing files, carefully identify the correct insertion point and include sufficient context in oldString to ensure precise placement. Common mistakes: inserting before package line in Go, inserting between import statements in TS, inserting inside function bodies when adding new functions.
- **Removing files**: If you delete a file, use `rm -f` and ask for confirmation before proceeding. If you need to delete a folder, use `rm -R` (do not include the `-f` flag). Again, Ask for confirmation before proceeding.
- **CRITICAL: After removing files**: When you delete any file with `rm` or `rm -f`, you MUST immediately and explicitly remove it from your context memory. Never allow deleted files to persist in context as this causes them to be recreated as empty files in future chat sessions. State clearly: "File [filename] has been permanently removed from disk and context."

### Code Patterns
- **Use existing patterns**: BaseTab, Table components, DataFacet enums, Collection/Store/Page architecture
- **Follow established architecture**: Import from `@models`, `@components`, `@utils`, `@hooks`
- **No React imports** (implicitly available)
- **No comments** in production code
- **Do not use `any` in TypeScript** - always use specific types (our linter won't allow it)
- **No custom strings for DataFacet** - always use `types.DataFacet.*` values
- **No custom ViewStateKey** - always use `{ viewName: string, tabName: types.DataFacet }`

## Header Actions Contract

Backend provides a single source of truth for header-level actions per facet, and the frontend must treat this as always-present (possibly empty).

### Backend
- Every facet config must define `HeaderActions []string` and it must never be nil. Use `[]` when there are no header actions for a facet.
- All data-table facets must include `export` in `HeaderActions`. A data-table facet is any facet with `isForm == false`.
- Action identifiers must align with the frontend `ActionType` values used by `useActions()` (e.g., `create`, `export`, `publish`, `pin`). Do not invent new strings.
- When you introduce a new action identifier, also expose metadata in the backend `Actions` map (title/label/icon) to keep UI consistent, then run `wails generate module`.
- Per-view notes (in addition to the universal `export` on all non-form facets):
  - Names: all facets include `create` (and `export` by the rule above). The `CUSTOM` facet additionally includes `publish` and `pin`.
  - Exports: all facets include `export` (already satisfied by the rule).
  - Monitors: include `export` (row actions like `delete`, `remove` remain as row-only).
  - Abis, Chunks, Status: include `export` on non-form facets (e.g., abis: all; chunks: stats/index/blooms; status: caches/chains). Form facets like `status` and `manifest` do not include `export`.
  - Contracts: table facets like `events` include `export`. Form facets like `dashboard` and `execute` do not include `export` and manage their own controls.

### Frontend
- Assume `config.headerActions` is always an array. Do not null-check it. Use length checks only, e.g., `if (!config.headerActions.length) return null`.
- Render header actions using the identifiers from `config.headerActions` and map them to handlers from `useActions()` (e.g., `handleAdd`, `handleExport`, `handlePublish`, `handlePin`).
- Do not hard-code action strings; rely on backend-provided identifiers and the `useActions()` wiring.
- If backend header actions change, regenerate models (`wails generate module`) and restart dev mode with `yarn start`.

### Reference: current facets by `isForm`

Data-table facets (must include `export`):
- abis: downloaded, known, functions, events
- names: all, custom, prefund, regular, baddress
- exports: statements, balances, transfers, transactions, withdrawals, assets, logs, traces, receipts
- monitors: monitors
- chunks: stats, index, blooms
- status: caches, chains
- contracts: events

Form facets (do not include `export`):
- status: status
- chunks: manifest
- contracts: dashboard, execute

## View Architecture Pattern

Each view follows this structure:
```
views/[viewname]/
├── [ViewName].tsx     # Main component with sections: Imports, Hooks, Handlers, Render
├── facets.ts          # DataFacet configurations and routing
├── columns.ts         # Table column definitions per facet
└── index.ts           # Exports
```

### Key Patterns
- **DataFacet enum**: Use `types.DataFacet.*` values, never custom strings
- **ViewStateKey**: `{ viewName: string, tabName: types.DataFacet }`
- **Page Data**: Auto-generated types like `monitors.MonitorsPage` with `facet`, `data[]`, `state`
- **BaseTab component**: Handles tables with `data`, `columns`, `viewStateKey`, `loading`, `error`

## Backend Integration

### API Endpoints
- Backend functions in `app/api_*.go` are auto-bound to frontend as `@app` imports
- Page data fetched via functions like `GetMonitorsPage(payload)`
- CRUD operations via `*Crud(action, data)` functions
- Error handling through `types.LoadState` enum

### Auto-Generated Models
- TypeScript types generated from Go structs in `frontend/wailsjs/go/models.ts`
- Import namespaced: `{ monitors, types, msgs } from '@models'`
- Never duplicate these types - always use generated ones

## Development Commands

```bash
# Development (from root)
yarn start              # Wails dev mode (NOT yarn dev)
yarn build             # Production build
yarn test              # Run all tests (Go + TypeScript + Dalle)
yarn lint              # Lint Go and TypeScript

# Testing specific components
yarn test-go           # Go backend tests
yarn test-tsx          # Frontend tests
yarn test-tsx <filename> # Run a single frontend test file
yarn test-dalle        # Dalle module tests
```


## Component & Data Flow
- **BaseTab**: Standard for tables; pass `data`, `columns`, `viewStateKey`, `loading`, `error`, and handlers.
- **Hooks**: Use `useActiveFacet`, `usePayload`, `useActions`, `useFiltering`, `useSorting`, `usePagination`.
- **Renderers**: Use `frontend/src/views/[view]/renderers/` for custom facet UIs.
- **Header Actions**: Always backend-driven via `config.headerActions` (from backend `viewConfig`); map to handlers from `useActions`.
- **Error Handling**: Stop and report on lint/test failures; never guess requirements.

### Examples
- **Table Usage**:
  ```tsx
  <BaseTab
    data={pageData?.monitors || []}
    columns={getColumns(getCurrentDataFacet())}
    viewStateKey={viewStateKey}
    loading={pageData?.isFetching || false}
    error={error}
    onSubmit={handleSubmit}
    onDelete={handleDelete}
  />
  ```
- **Address Conversion**:
  ```tsx
  import { addressToHex, hexToAddress, getDisplayAddress, isValidAddress } from '@utils';
  const hexString = addressToHex(address);
  ```

## Error Handling Protocol

### Stop Conditions
- **Test failures**: Stop, report exact error, await instructions
- **Lint errors**: Stop, report issues, await fixes  
- **Build failures**: Stop, provide full output, await guidance
- **Unclear requirements**: Stop, ask specific questions

### Don't Guess
- Ask "Please clarify: [specific question]" instead of assuming
- Be honest about mock vs. real implementations
- Acknowledge when you don't understand something

### Anti-Bloat Principles
- **Use existing utilities** before creating new ones - check `@utils` first
- **Maintain consistency** with established patterns across the codebase
- **Remove redundant code** when standardizing - don't leave both old and new patterns
- **Check for existing solutions** before implementing custom logic
- **Follow the principle**: "If we've solved this problem once, reuse that solution"

pkg/                   # Go packages for backend functionality
dalle/                 # Separate Go module for AI/image generation

## File Structure References
- `app/`: Go backend, API handlers, business logic, viewConfig.
- `frontend/src/views/`: Facet-based React views and custom renderers.
- `frontend/src/components/`: UI components (BaseTab, Table, etc.).
- `frontend/src/utils/`: Utilities (Log, address helpers).
- `frontend/wailsjs/go/models.ts`: Auto-generated TypeScript types.

## Integration Points

- **Core**: Backend integrates via SDK for blockchain data
- **Wails Bindings**: Auto-generated TypeScript/Go bridge
- **External APIs**: OpenAI integration in `dalle/` module
- **File System**: Project management and preferences via Go backend

Follow these patterns precisely. When in doubt, examine existing views like `monitors/` or `status/` for reference implementations.

## Wails Architecture

Go backend runs in the same process as the frontend
CGO bridge enables direct JavaScript ↔ Go function calls
Webview (like embedded Chromium) hosts the frontend
No separate processes - everything runs in a single process
Direct memory sharing between JS and Go (with serialization at the boundary) So it's even more impressive than IPC! The calls are:

- Synchronous from JS perspective (though Go functions can be async)
- Direct function invocation across the language boundary
- Minimal overhead compared to network calls or traditional IPC
- Shared memory space with serialization only at the JS/Go boundary
This makes the caching discussion even more interesting because:

- Calls are very fast - Direct CGO bridge, not IPC
- But serialization still exists - JSON-like marshaling between JS objects and Go structs
- Caching is still beneficial - Avoids repeated marshaling overhead
- Cache coherence is still the real problem - Backend transforms data without frontend awareness


## Anti-Bloat Principles
- Reuse existing utilities and patterns.
- Remove redundant code when standardizing.
- Prefer most recently refactored views as reference.