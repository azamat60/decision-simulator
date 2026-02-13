import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getFinanceDefaults } from '../domain/finance'
import { getTimeRoiDefaults } from '../domain/timeRoi'
import type { FinanceInputParams, SavedView, SimulatorKind, TimeRoiInputParams } from '../domain/types'
import type { AppTab, Toast } from '../app/types'
import { APP_STORE_KEY } from '../storage/keys'

type ThemeMode = 'dark' | 'light'

type AppState = {
  theme: ThemeMode
  activeTab: AppTab
  selectedSimulator: SimulatorKind
  compareScenarios: boolean
  finance: FinanceInputParams
  timeRoi: TimeRoiInputParams
  savedViews: SavedView[]
  toast: Toast | null
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  setActiveTab: (tab: AppTab) => void
  setSelectedSimulator: (simulator: SimulatorKind) => void
  setCompareScenarios: (value: boolean) => void
  updateFinance: (patch: Partial<FinanceInputParams>) => void
  updateTimeRoi: (patch: Partial<TimeRoiInputParams>) => void
  resetSimulator: (kind: SimulatorKind) => void
  saveCurrentView: (name: string) => void
  loadSavedView: (id: string) => void
  renameSavedView: (id: string, name: string) => void
  deleteSavedView: (id: string) => void
  overwriteSavedViews: (views: SavedView[]) => void
  pushToast: (message: string) => void
  clearToast: () => void
}

const makeId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      activeTab: 'simulators',
      selectedSimulator: 'finance',
      compareScenarios: false,
      finance: getFinanceDefaults(),
      timeRoi: getTimeRoiDefaults(),
      savedViews: [],
      toast: null,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setSelectedSimulator: (selectedSimulator) => set({ selectedSimulator }),
      setCompareScenarios: (compareScenarios) => set({ compareScenarios }),
      updateFinance: (patch) => set({ finance: { ...get().finance, ...patch } }),
      updateTimeRoi: (patch) => set({ timeRoi: { ...get().timeRoi, ...patch } }),
      resetSimulator: (kind) => {
        if (kind === 'finance') {
          set({ finance: getFinanceDefaults() })
          return
        }

        set({ timeRoi: getTimeRoiDefaults() })
      },
      saveCurrentView: (name) => {
        const state = get()
        const now = new Date().toISOString()
        const simulator = state.selectedSimulator
        const params = simulator === 'finance' ? state.finance : state.timeRoi

        const newView: SavedView = {
          id: makeId(),
          name: name.trim() || `View ${state.savedViews.length + 1}`,
          simulator,
          params,
          createdAt: now,
          updatedAt: now
        }

        set({ savedViews: [newView, ...state.savedViews] })
        get().pushToast('Updated: view saved')
      },
      loadSavedView: (id) => {
        const target = get().savedViews.find((view) => view.id === id)
        if (!target) {
          return
        }

        if (target.simulator === 'finance') {
          set({
            selectedSimulator: 'finance',
            finance: { ...getFinanceDefaults(), ...(target.params as Partial<FinanceInputParams>) }
          })
        } else {
          set({ selectedSimulator: 'timeRoi', timeRoi: target.params as TimeRoiInputParams })
        }

        set({ activeTab: 'simulators' })
        get().pushToast('Updated: view loaded')
      },
      renameSavedView: (id, name) =>
        set({
          savedViews: get().savedViews.map((view) =>
            view.id === id
              ? {
                  ...view,
                  name: name.trim() || view.name,
                  updatedAt: new Date().toISOString()
                }
              : view
          )
        }),
      deleteSavedView: (id) => set({ savedViews: get().savedViews.filter((view) => view.id !== id) }),
      overwriteSavedViews: (views) => set({ savedViews: views }),
      pushToast: (message) => set({ toast: { id: Date.now(), message } }),
      clearToast: () => set({ toast: null })
    }),
    {
      name: APP_STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        selectedSimulator: state.selectedSimulator,
        compareScenarios: state.compareScenarios,
        finance: state.finance,
        timeRoi: state.timeRoi,
        savedViews: state.savedViews
      })
    }
  )
)
