import { clamp } from './scenarios'
import type {
  MultiScenarioResult,
  ScenarioName,
  ScenarioResult,
  TimeRoiInputParams,
  TimeRoiSummary,
  TimelinePoint
} from './types'

const getScenarioInput = (params: TimeRoiInputParams, scenario: ScenarioName): TimeRoiInputParams => {
  if (scenario === 'base') {
    return params
  }

  if (scenario === 'conservative') {
    return {
      ...params,
      efficiencyGain: clamp(params.efficiencyGain - 5, 0, 30),
      skipRate: clamp(params.skipRate + 5, 0, 50)
    }
  }

  return {
    ...params,
    efficiencyGain: clamp(params.efficiencyGain + 5, 0, 30),
    skipRate: clamp(params.skipRate - 5, 0, 50)
  }
}

const simulateSingle = (
  params: TimeRoiInputParams,
  scenario: ScenarioName
): ScenarioResult<TimeRoiSummary> => {
  const scenarioParams = getScenarioInput(params, scenario)
  const completionRate = 1 - scenarioParams.skipRate / 100
  const sessionsPerWeek = scenarioParams.daysPerWeek * completionRate
  const weeklyInvestedHours = (sessionsPerWeek * scenarioParams.dailyMinutes) / 60
  const weeklySavedHours = weeklyInvestedHours * (scenarioParams.efficiencyGain / 100)

  const timeline: TimelinePoint[] = []
  let cumulativeInvested = 0
  let cumulativeSaved = 0

  for (let week = 1; week <= scenarioParams.durationWeeks; week += 1) {
    cumulativeInvested += weeklyInvestedHours
    cumulativeSaved += weeklySavedHours

    timeline.push({
      t: week,
      label: `W${week}`,
      metrics: {
        invested: cumulativeInvested,
        saved: cumulativeSaved,
        weeklyInvested: weeklyInvestedHours,
        sessions: sessionsPerWeek
      }
    })
  }

  const totalSessionsCompleted = sessionsPerWeek * scenarioParams.durationWeeks
  const totalHoursInvested = weeklyInvestedHours * scenarioParams.durationWeeks
  const estimatedHoursSaved = weeklySavedHours * scenarioParams.durationWeeks
  const netTimeRoi = estimatedHoursSaved - totalHoursInvested

  const goalWeeksNeeded =
    scenarioParams.goalHours > 0 && weeklyInvestedHours > 0
      ? Math.ceil(scenarioParams.goalHours / weeklyInvestedHours)
      : 0

  return {
    scenario,
    timeline,
    summary: {
      sessionsCompleted: totalSessionsCompleted,
      totalHoursInvested,
      estimatedHoursSaved,
      netTimeRoi,
      goalWeeksNeeded
    }
  }
}

export const simulateTimeRoi = (params: TimeRoiInputParams): MultiScenarioResult<TimeRoiSummary> => ({
  conservative: simulateSingle(params, 'conservative'),
  base: simulateSingle(params, 'base'),
  optimistic: simulateSingle(params, 'optimistic')
})

export const getTimeRoiDefaults = (): TimeRoiInputParams => ({
  dailyMinutes: 45,
  daysPerWeek: 5,
  durationWeeks: 24,
  efficiencyGain: 10,
  skipRate: 15,
  goalMode: false,
  goalHours: 100
})
