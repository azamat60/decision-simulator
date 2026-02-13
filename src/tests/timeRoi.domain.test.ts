import { describe, expect, it } from 'vitest'
import { simulateTimeRoi } from '../domain/timeRoi'

describe('simulateTimeRoi', () => {
  it('applies skip rate and efficiency gain to totals', () => {
    const result = simulateTimeRoi({
      dailyMinutes: 60,
      daysPerWeek: 5,
      durationWeeks: 10,
      efficiencyGain: 10,
      skipRate: 20,
      goalMode: true,
      goalHours: 100
    })

    expect(result.base.summary.sessionsCompleted).toBeCloseTo(40, 2)
    expect(result.base.summary.totalHoursInvested).toBeCloseTo(40, 2)
    expect(result.base.summary.estimatedHoursSaved).toBeCloseTo(4, 2)
    expect(result.base.summary.netTimeRoi).toBeCloseTo(-36, 2)
    expect(result.base.summary.goalWeeksNeeded).toBe(25)
  })
})
