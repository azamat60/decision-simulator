import type { FinanceInputParams, TimeRoiInputParams } from '../domain/types'

export type NamedPreset<T> = {
  name: string
  values: Partial<T>
}

const FINANCE_KEY = 'decision-simulator-finance-presets-v1'
const TIME_ROI_KEY = 'decision-simulator-time-presets-v1'

const load = <T>(key: string): NamedPreset<T>[] => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed
  } catch {
    return []
  }
}

const save = <T>(key: string, presets: NamedPreset<T>[]): void => {
  localStorage.setItem(key, JSON.stringify(presets))
}

export const loadFinancePresets = (): NamedPreset<FinanceInputParams>[] => load<FinanceInputParams>(FINANCE_KEY)
export const saveFinancePresets = (presets: NamedPreset<FinanceInputParams>[]): void =>
  save(FINANCE_KEY, presets)

export const loadTimeRoiPresets = (): NamedPreset<TimeRoiInputParams>[] => load<TimeRoiInputParams>(TIME_ROI_KEY)
export const saveTimeRoiPresets = (presets: NamedPreset<TimeRoiInputParams>[]): void =>
  save(TIME_ROI_KEY, presets)
