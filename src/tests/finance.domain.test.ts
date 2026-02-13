import { describe, expect, it } from 'vitest'
import { simulateFinance } from '../domain/finance'

describe('simulateFinance', () => {
  it('matches known future value case', () => {
    const result = simulateFinance({
      initialAmount: 1000,
      monthlyContribution: 100,
      years: 1,
      annualReturnRate: 12,
      inflationRate: 0,
      showInflationAdjusted: false,
      monteCarloEnabled: false,
      monteCarloRuns: 400,
      monteCarloVolatility: 12
    })

    expect(result.base.summary.finalValue).toBeCloseTo(2395.08, 1)
    expect(result.base.summary.totalContributed).toBeCloseTo(2200, 2)
    expect(result.base.summary.totalGrowth).toBeGreaterThan(190)
  })
})
