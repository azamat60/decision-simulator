export type SimulatorKind = 'finance' | 'timeRoi'
export type ScenarioName = 'conservative' | 'base' | 'optimistic'

export type TimelinePoint = {
  t: number
  label: string
  metrics: Record<string, number>
}

export type ScenarioResult<TSummary extends Record<string, number>> = {
  scenario: ScenarioName
  timeline: TimelinePoint[]
  summary: TSummary
}

export type MultiScenarioResult<TSummary extends Record<string, number>> = {
  base: ScenarioResult<TSummary>
  conservative: ScenarioResult<TSummary>
  optimistic: ScenarioResult<TSummary>
}

export type MonteCarloPoint = {
  t: number
  label: string
  p10: number
  p50: number
  p90: number
}

export type MonteCarloFinanceResult = {
  timeline: MonteCarloPoint[]
  finalMedian: number
  successProbability: number
}

export type SavedView = {
  id: string
  name: string
  simulator: SimulatorKind
  params: FinanceInputParams | TimeRoiInputParams
  createdAt: string
  updatedAt: string
}

export type FinanceInputParams = {
  initialAmount: number
  monthlyContribution: number
  years: number
  annualReturnRate: number
  inflationRate: number
  showInflationAdjusted: boolean
  monteCarloEnabled: boolean
  monteCarloRuns: number
  monteCarloVolatility: number
  targetFinalValue: number
  contributionStepYear: number
  contributionStepPercent: number
  shockYear: number
  shockPercent: number
  returnShiftYear: number
  returnShiftPercent: number
}

export type TimeRoiInputParams = {
  dailyMinutes: number
  daysPerWeek: number
  durationWeeks: number
  efficiencyGain: number
  skipRate: number
  goalMode: boolean
  goalHours: number
}

export type FinanceSummary = {
  finalValue: number
  finalRealValue: number
  totalContributed: number
  totalGrowth: number
  cagr: number
}

export type TimeRoiSummary = {
  sessionsCompleted: number
  totalHoursInvested: number
  estimatedHoursSaved: number
  netTimeRoi: number
  goalWeeksNeeded: number
}
