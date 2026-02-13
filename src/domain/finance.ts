import { clamp } from './scenarios'
import type {
  FinanceInputParams,
  FinanceSummary,
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

export const getFinanceDefaults = (): FinanceInputParams => ({
  initialAmount: 10000,
  monthlyContribution: 500,
  years: 15,
  annualReturnRate: 8,
  inflationRate: 2,
  showInflationAdjusted: true
})
