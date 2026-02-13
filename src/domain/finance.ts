import { clamp } from './scenarios'
import type {
  FinanceInputParams,
  FinanceSummary,
  MonteCarloFinanceResult,
  MultiScenarioResult,
  ScenarioName,
  ScenarioResult,
  TimelinePoint
} from './types'

const toYearlyTimeline = (timeline: TimelinePoint[]): TimelinePoint[] => {
  if (timeline.length <= 120) {
    return timeline
  }

  return timeline.filter((point) => point.t % 12 === 0)
}

const percentile = (values: number[], p: number): number => {
  if (values.length === 0) {
    return 0
  }

  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)))
  return sorted[index]
}

const makeSeededRandom = (seed: number): (() => number) => {
  let state = seed >>> 0
  return () => {
    state = (1664525 * state + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const randomNormal = (rand: () => number): number => {
  let u = 0
  let v = 0
  while (u === 0) u = rand()
  while (v === 0) v = rand()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

const getScenarioInput = (params: FinanceInputParams, scenario: ScenarioName): FinanceInputParams => {
  const delta = scenario === 'base' ? 0 : scenario === 'conservative' ? -2 : 2
  return {
    ...params,
    annualReturnRate: clamp(params.annualReturnRate + delta, 0, 30)
  }
}

const simulateSingle = (
  params: FinanceInputParams,
  scenario: ScenarioName
): ScenarioResult<FinanceSummary> => {
  const scenarioParams = getScenarioInput(params, scenario)
  const months = scenarioParams.years * 12
  const monthlyRate = scenarioParams.annualReturnRate / 100 / 12
  const monthlyInflation = scenarioParams.inflationRate / 100 / 12

  let balance = scenarioParams.initialAmount
  let contributed = scenarioParams.initialAmount
  const timeline: TimelinePoint[] = []

  for (let month = 1; month <= months; month += 1) {
    balance = balance * (1 + monthlyRate) + scenarioParams.monthlyContribution
    contributed += scenarioParams.monthlyContribution

    const yearsElapsed = month / 12
    const discountFactor = Math.pow(1 + monthlyInflation, month)
    const realValue = discountFactor > 0 ? balance / discountFactor : balance

    timeline.push({
      t: month,
      label: `Y${yearsElapsed.toFixed(1)}`,
      metrics: {
        value: balance,
        realValue,
        contributed,
        growth: balance - contributed
      }
    })
  }

  const final = timeline[timeline.length - 1]
  const finalValue = final?.metrics.value ?? 0
  const totalContributed = final?.metrics.contributed ?? 0
  const totalGrowth = finalValue - totalContributed
  const finalRealValue = final?.metrics.realValue ?? finalValue

  const cagrBase = scenarioParams.initialAmount > 0 ? scenarioParams.initialAmount : 1
  const cagr = Math.pow(finalValue / cagrBase, 1 / scenarioParams.years) - 1

  return {
    scenario,
    timeline: toYearlyTimeline(timeline),
    summary: {
      finalValue,
      finalRealValue,
      totalContributed,
      totalGrowth,
      cagr: Number.isFinite(cagr) ? cagr : 0
    }
  }
}

export const simulateFinance = (params: FinanceInputParams): MultiScenarioResult<FinanceSummary> => ({
  conservative: simulateSingle(params, 'conservative'),
  base: simulateSingle(params, 'base'),
  optimistic: simulateSingle(params, 'optimistic')
})

export const simulateFinanceMonteCarlo = (
  params: FinanceInputParams,
  targetFinalValue: number
): MonteCarloFinanceResult => {
  const runs = Math.max(50, Math.min(2000, Math.floor(params.monteCarloRuns)))
  const months = params.years * 12
  const meanMonthly = params.annualReturnRate / 100 / 12
  const sigmaMonthly = (params.monteCarloVolatility / 100) / Math.sqrt(12)
  const paths: number[][] = Array.from({ length: months }, () => [])
  const finalValues: number[] = []

  for (let run = 0; run < runs; run += 1) {
    const rand = makeSeededRandom(123456 + run)
    let balance = params.initialAmount

    for (let month = 1; month <= months; month += 1) {
      const shock = randomNormal(rand)
      const monthlyReturn = meanMonthly + sigmaMonthly * shock
      balance = balance * (1 + monthlyReturn) + params.monthlyContribution
      paths[month - 1].push(balance)
    }

    finalValues.push(balance)
  }

  const timeline = paths.map((monthValues, index) => ({
    t: index + 1,
    label: `Y${((index + 1) / 12).toFixed(1)}`,
    p10: percentile(monthValues, 0.1),
    p50: percentile(monthValues, 0.5),
    p90: percentile(monthValues, 0.9)
  }))

  const successes = finalValues.filter((value) => value >= targetFinalValue).length

  return {
    timeline: toYearlyTimeline(
      timeline.map((point) => ({
        t: point.t,
        label: point.label,
        metrics: { p10: point.p10, p50: point.p50, p90: point.p90 }
      }))
    ).map((point) => ({
      t: point.t,
      label: point.label,
      p10: point.metrics.p10,
      p50: point.metrics.p50,
      p90: point.metrics.p90
    })),
    finalMedian: percentile(finalValues, 0.5),
    successProbability: runs > 0 ? successes / runs : 0
  }
}

export const getFinanceDefaults = (): FinanceInputParams => ({
  initialAmount: 10000,
  monthlyContribution: 500,
  years: 15,
  annualReturnRate: 8,
  inflationRate: 2,
  showInflationAdjusted: true,
  monteCarloEnabled: false,
  monteCarloRuns: 400,
  monteCarloVolatility: 12
})
