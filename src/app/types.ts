import type { SimulatorKind } from '../domain/types'

export type AppTab = 'simulators' | 'saved'

export type Toast = {
  id: number
  message: string
}

export const simulatorMeta: Record<SimulatorKind, { title: string; description: string }> = {
  finance: {
    title: 'Savings & Investment Growth',
    description: 'Estimate long-term value with recurring contributions and inflation context.'
  },
  timeRoi: {
    title: 'Productivity Time ROI',
    description: 'Model habit consistency, reclaimed time, and net ROI over weeks.'
  }
}
