# Decision Simulator — What If? Engine

Frontend-only micro-SaaS style simulator built with React, TypeScript, Vite, Tailwind CSS, Recharts, and Zustand.

## Run

```bash
npm install
npm run dev
```

## Test

```bash
npm run test
```

## Build

```bash
npm run build
npm run preview
```

## Features

- Dark-first UI with light mode toggle
- Two simulator modules:
  - Savings & Investment Growth
  - Productivity Time ROI
- Scenario comparison (base, conservative, optimistic)
- Saved views with localStorage persistence
- Import/export views as JSON
- Recharts visualizations + summary cards
- Formula hints and presets

## Formula Notes

### Finance

For each month:

- `balance_next = balance * (1 + annualRate/12) + monthlyContribution`
- `contributed += monthlyContribution`
- `growth = balance - contributed`
- `realValue = balance / (1 + inflationRate/12)^month`

Scenarios adjust annual return by `-2% / 0% / +2%`.

### Time ROI

- `completionRate = 1 - skipRate`
- `sessionsPerWeek = daysPerWeek * completionRate`
- `weeklyInvestedHours = sessionsPerWeek * dailyMinutes / 60`
- `weeklySavedHours = weeklyInvestedHours * efficiencyGain`
- `netROI = totalSaved - totalInvested`

Scenarios adjust efficiency and skip:

- Conservative: efficiency `-5%`, skip `+5%`
- Base: unchanged
- Optimistic: efficiency `+5%`, skip `-5%`

## Architecture

- `src/domain`: pure typed simulation engine and scenario logic
- `src/features/finance`: finance simulator UI + charts
- `src/features/timeRoi`: time ROI simulator UI + charts
- `src/components`: shared UI controls and layout blocks
- `src/state`: Zustand app store and persisted state
- `src/storage`: JSON import/export helpers and storage key
- `src/tests`: domain and component tests

## Screenshots

1. Run `npm run dev`
2. Open `http://localhost:5173`
3. Capture:
   - Simulators page in dark mode
   - Finance scenario comparison
   - Time ROI goal mode
   - Saved Views tab
