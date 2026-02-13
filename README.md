# Decision Simulator - What If? Engine

Created by **Azamat Altymyshev**.

Decision Simulator is a frontend-only micro-SaaS style web app for scenario modeling. It lets you tweak assumptions and instantly see how outcomes change across multiple timelines, charts, and side-by-side comparisons.

## Why this project is interesting

Most calculators give a single answer. This app is built around **decision exploration**:

- baseline vs conservative vs optimistic scenario layers
- timeline events (shocks and parameter shifts) to model real-life surprises
- target milestones, confidence signals, and expected time-to-goal
- Monte Carlo uncertainty simulation for finance outcomes
- current vs candidate setup comparison for fast decision tradeoffs
- sensitivity heatmap to visualize which levers matter most

## Author

**Azamat Altymyshev**

Footer in app: `Created By Azamat Altymyshev`.

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS
- Zustand
- Recharts
- Lucide icons
- Vitest + React Testing Library

## Product modules

### 1) Savings & Investment Growth

Models compound growth with monthly contributions and inflation context.

Includes:
- scenario layers (base/conservative/optimistic)
- Monte Carlo mode with percentile bands and success probability
- target mode with milestone checkpoints and confidence alerts
- timeline events:
  - contribution step change on a selected year
  - market shock on a selected year
  - return-rate regime shift on a selected year
- sensitivity heatmap (`return rate x contribution`)
- current vs candidate comparison cards
- built-in and custom presets

### 2) Productivity Time ROI

Models how daily habits compound into invested hours and estimated saved time.

Includes:
- scenario layers (base/conservative/optimistic)
- goal mode (estimate weeks needed to hit target hours)
- current vs candidate comparison cards
- built-in and custom presets

## Data model and architecture

```text
src/
  app/            # top-level layout and orchestration
  components/     # reusable UI controls and cards
  domain/         # pure simulation logic (typed)
  features/       # finance and time ROI feature modules
  state/          # Zustand app store
  storage/        # localStorage helpers (views + custom presets)
  styles/         # utility styling helpers
  tests/          # domain + component tests
```

Design principle: calculation code in `/domain` remains pure and deterministic for reliable testing.

## Core formulas (high-level)

### Finance

Per month:

- `balance_next = balance * (1 + monthly_rate) + monthly_contribution`
- `growth = balance - contributed`
- `real_value = nominal / inflation_factor`

Monte Carlo mode samples monthly return shocks around expected return to produce percentile trajectories (P10/P50/P90).

### Time ROI

- `sessions_per_week = days_per_week * (1 - skip_rate)`
- `weekly_invested_hours = sessions_per_week * daily_minutes / 60`
- `weekly_saved_hours = weekly_invested_hours * efficiency_gain`
- `net_roi = total_saved - total_invested`

## Persistence

No backend is required.

Stored locally in browser via `localStorage`:
- theme preference
- simulator input state
- saved views (export/import JSON)
- custom presets

## Local development

```bash
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

## Testing and quality checks

```bash
npm run test
npm run lint
npm run build
```

The repository includes:
- unit tests for finance and time ROI engines
- component tests for simulator updates, scenario toggle, and saved view import/export

## Build for production

```bash
npm run build
npm run preview
```

## Screenshots (suggested capture set)

1. Finance simulator with Monte Carlo enabled
2. Finance sensitivity heatmap and timeline events
3. Time ROI with goal mode + candidate comparison
4. Saved Views tab with JSON import/export
5. Light theme and dark theme variants

---

If you are using this project as a base for productization, useful next upgrades include route-level code splitting by tab, richer report export (CSV/PDF), and optional sync backend for team scenarios.
