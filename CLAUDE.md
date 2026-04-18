# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # tsc -b && vite build
npm run lint         # ESLint (flat config)
npm run test         # vitest run (single pass)
npm run test:watch   # vitest (watch mode)
npm run preview      # Preview production build
```

Run a single test file:
```bash
npx vitest run src/tests/finance.domain.test.ts
```

## Architecture

**Stack:** React 19 + TypeScript (strict) + Vite + Zustand + Tailwind CSS 3 + Recharts

The app is a client-only decision simulator with two feature modules and no backend — all state lives in Zustand with `persist` middleware writing to localStorage.

### Layer structure

| Directory | Role |
|-----------|------|
| `src/domain/` | Pure simulation engines — no React, no side effects. `finance.ts` (compound growth, Monte Carlo, targets) and `timeRoi.ts` (habit modeling, efficiency gains). These are the right place to add calculation logic. |
| `src/features/` | Simulator UI modules (`finance/`, `timeRoi/`), lazy-loaded via `React.lazy()`. Each module owns its own inputs, charts, and summary cards. |
| `src/state/appStore.ts` | Single Zustand store. Holds all simulator inputs, active tab, saved views, and toast queue. Mutations are Zustand actions, not local state. |
| `src/storage/` | localStorage helpers for saved views and custom presets (JSON export/import). |
| `src/components/` | Shared UI primitives: `SliderField`, `NumberStepper`, `SegmentedControl`, `Toggle`, `Card`, `Toast`, etc. |
| `src/app/` | Entry orchestration: `App.tsx` renders tab layout (simulators vs saved views); `format.ts` has display formatters; `types.ts` has app-level types. |

### Data flow

User input → Zustand store → domain function → Recharts + summary cards

Scenario layers (conservative/base/optimistic) live in `src/domain/scenarios.ts` and apply ±2% deltas for finance, ±5% for time ROI.

### Styling

Tailwind with a custom HSL color system (`--bg`, `--primary`, `--surface`, etc. defined as CSS variables). Dark mode uses the `class` strategy. Use the `cn()` helper from `src/styles/utils.ts` (clsx + tailwind-merge) for conditional class composition.

### Testing

Tests live in `src/tests/`. Domain tests (`*.domain.test.ts`) are pure logic; component tests (`*.component.test.tsx`) use React Testing Library + jsdom. When adding simulator features, add domain tests alongside the logic.
