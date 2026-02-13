import type { ScenarioName } from './types'

export const scenarioOrder: ScenarioName[] = ['conservative', 'base', 'optimistic']

export const scenarioLabel: Record<ScenarioName, string> = {
  conservative: 'Conservative',
  base: 'Base',
  optimistic: 'Optimistic'
}

export const scenarioColor: Record<ScenarioName, string> = {
  conservative: '#f59e0b',
  base: '#60a5fa',
  optimistic: '#22d3ee'
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))
