# AI Agent Instructions

## 1. Environment & Commands

### Package Management (ZERO TOLERANCE)
- **YARN ONLY** - Never use `npm` or `npx`
- **fish shell** - Generate commands for fish, not bash
- All commands run from repo root: `yarn start`, `yarn build`, `yarn test`, `yarn lint`

### Critical Workflow
- **DO NOT RUN YARN COMMANDS** - Never run `yarn lint`, `yarn test`, `yarn start`, or any other yarn commands unless explicitly requested by the user
- **Read file contents first** before editing - files change between requests
- **After backend changes**: Run `wails generate module` to update TypeScript bindings
- **File deletion**: Use `rm -f` for files, `rm -R` for folders, ask confirmation, then explicitly remove from context memory

### Step-by-Step Mode (Alternative Rules of Engagement)
When I say "We want to go into step-by-step" mode, switch to these rules:

🚫 **Never Run:**
- `yarn lint`
- `yarn test`
- `yarn start`

🛑 **Stop Between Steps:**
- Never run amok or jump ahead
- Stop after each step for your review and approval
- Wait for you to say "go ahead" before proceeding

📋 **Planning Process:**
- Show you what I want to do WITHOUT modifying code first
- Explain WHY I want to make each change
- Wait for your approval before making any code changes
- One step at a time with your review

🔒 **PERSISTENCE RULE (CRITICAL):**
- **ONCE IN STEP-BY-STEP MODE, STAY THERE INDEFINITELY**
- Do NOT fall back to normal mode unless explicitly told "exit step-by-step mode"
- If unsure about mode, ask "Should I continue in step-by-step mode?"
- Step-by-step mode persists across multiple requests and conversations
- Every action must be approved individually, no exceptions

### Design Mode (Discussion + Analysis)
When I say "Let's go into design mode" or similar, switch to these rules:

📋 **Lightweight Discussion:**
- NO full codebase scans or comprehensive exploration upfront
- NO telling user about current code state unless specifically asked
- Discussion-focused mode for architectural analysis and planning

🔍 **Just-in-Time File Reading:**
- Before discussing ANY specific file, component, or implementation detail, ALWAYS read that file first
- Check file contents immediately before referencing to ensure accuracy
- Never assume file contents based on previous knowledge - files change between requests
- Only read files when discussion requires specific implementation details

💭 **Discussion + Analysis:**
- Architectural analysis and conceptual discussion
- NO code modifications, builds, tests, or implementations
- Focus on design decisions, trade-offs, and approaches
- Reference actual code patterns only when files have been read

🎯 **Focus Areas:**
- Architecture decisions and trade-offs
- Implementation approaches and design patterns
- Problem analysis and technical feasibility
- Requirements clarification and solution evaluation

📋 **Output Format:**
- Bullet points and structured analysis
- Pros/cons of different approaches
- Clear recommendations with reasoning
- Questions to clarify requirements

🔒 **NO MODIFICATION RULE:**
- Must explicitly exit design mode before making any code changes
- If asked to implement something in design mode, respond: "Still in design mode - should I exit design mode and implement this?"

### VS Code Problems Server Reset
When VS Code shows stale errors for deleted files or incorrect TypeScript diagnostics:
```bash
# Method 1: Restart TypeScript language server (most common)
Cmd+Shift+P → "TypeScript: Restart TS Server"

# Method 2: Reload VS Code window (nuclear option)
Cmd+Shift+P → "Developer: Reload Window"

# Method 3: Clear workspace state and reload
Cmd+Shift+P → "Developer: Reset Workspace State" → "Developer: Reload Window"
```

## 2. Codebase Architecture

### Wails Structure
- **Go backend** (`app/`): API handlers, business logic, viewConfig
- **React frontend** (`frontend/src/`): Facet-based views, Mantine UI
- **Auto-generated models**: TypeScript types from Go structs (`frontend/wailsjs/go/models.ts`)
- **Direct CGO bridge**: JS ↔ Go function calls in same process

### Code Generation Systems
1. **Wails bridge**: Auto-generates frontend/backend bindings
2. **Our codegen**: Protects manual code within `// EXISTING_CODE` pairs
3. **Design docs**: See `./design/` folder for architectural guidance

### Data Flow Architecture
- **Streaming/decoupled fetching**: Pages appear immediately, data streams in progressively
- **Reference**: store, facet, and concrete collection types in Go packages
- **Collection/Store/Page** pattern with auto-generated types like `monitors.MonitorsPage`

### Key Patterns
- **DataFacet enum**: Use `types.DataFacet.*` values, never custom strings
- **ViewStateKey**: `{ viewName: string, tabName: types.DataFacet }`
- **Imports**: From `@models`, `@components`, `@utils`, `@hooks`
- **No React imports** (implicitly available)
- **Use `Log` from `@utils`** instead of console.log (invisible in Wails)

## 3. Development Principles

### Code Quality (CRITICAL)
- **No over-engineering**: Simple, boring code that works beats complex "elegant" solutions
- **STOP and THINK**: Ask "What's the simplest solution?" before coding
- **If solution has >3 moving parts**, it's probably over-engineered
- **No `any` in TypeScript** - always use specific types
- **No comments in production code** - only for TODO items

### Collaboration Protocol
- **Ask early, ask often**: When complexity starts creeping in, stop and discuss
- **Own mistakes**: Don't blame "someone" - broken code is my responsibility
- **Use existing utilities first** - check `@utils` before creating new ones
- **Stop conditions**: Test failures, lint errors, unclear requirements - stop and report

### Race Condition Prevention
- **Sequential over parallel**: Avoid Promise.all() with state-modifying operations
- **Common scenarios**: Multiple API calls updating same backend state, parallel component store calls
- **When in doubt**: Use await chains instead of parallel operations

### React Timing Issues Protocol (CRITICAL - 50% of bugs are timing-related)
- **ASSUMPTION**: Any unexpected UI behavior is likely a React timing/async issue
- **IMMEDIATE RESPONSE**: Add comprehensive logging using `Log` from `@utils` throughout the entire data flow
- **Required logging points**: Action start → State change → API call → Data received → Component re-render → Final result
- **Timing scenarios to suspect**:
  - Data appears/disappears unexpectedly (optimistic updates vs. real data)
  - Navigation happens but selection is wrong (page change vs. data loading)
  - Actions work sometimes but not others (race conditions)
  - State seems "one step behind" (useEffect dependency issues)
- **Debug pattern**: Log every async boundary with timestamps and data snapshots
- **Never assume component state is synchronous** - always consider useEffect timing and data loading phases

## 4. Critical Technical Details

### Header Actions Contract
- **Backend**: Every facet config defines `HeaderActions []string` (never nil, use `[]` if empty)
- **Data-table facets**: Must include `export` in HeaderActions
- **Frontend**: Assume `config.headerActions` is always array - no null checks, only length checks
- **Action alignment**: Backend identifiers must match frontend `ActionType` values from `useActions()`

### Component Usage
```tsx
<BaseTab
  data={pageData?.monitors || []}
  columns={getColumns(getCurrentDataFacet())}
  viewStateKey={viewStateKey}
  loading={pageData?.state === types.StoreState.FETCHING || false}
  error={error}
  onSubmit={handleSubmit}
  onDelete={handleDelete}
/>
```

### View Architecture Pattern
```
views/[viewname]/
├── [ViewName].tsx     # Main component: Imports, Hooks, Handlers, Render
├── facets.ts          # DataFacet configurations and routing
├── columns.ts         # Table column definitions per facet
└── index.ts           # Exports
```

### Code Placement Rules
- **Go files**: Package declarations first, proper import grouping
- **TypeScript**: Imports grouped properly, respect class/function boundaries
- **Include sufficient context** in oldString for precise placement
- **Never insert before package lines** or between import statements

### File Structure References
- `app/`: Go backend, API handlers (`api_*.go`), business logic, viewConfig
- `frontend/src/views/`: Facet-based React views and renderers
- `frontend/src/components/`: UI components (BaseTab, Table, etc.)
- `frontend/wailsjs/go/models.ts`: Auto-generated TypeScript types
- `pkg/`: Go packages for backend functionality

### Development Commands
```bash
yarn start              # Wails dev mode
yarn build             # Production build  
yarn test              # All tests (Go + TypeScript)
yarn lint              # Lint Go and TypeScript
yarn test-go           # Go backend tests only
yarn test-tsx          # Frontend tests only
```