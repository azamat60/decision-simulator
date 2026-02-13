import { lazy, Suspense, useEffect } from 'react'
import { SavedViewsPanel } from '../components/SavedViewsPanel'
import { SimulatorSelector } from '../components/SimulatorSelector'
import { Toast } from '../components/Toast'
import { TopNav } from '../components/TopNav'
import { useAppStore } from '../state/appStore'

const FinanceSimulator = lazy(() =>
  import('../features/finance/FinanceSimulator').then((module) => ({ default: module.FinanceSimulator }))
)
const TimeRoiSimulator = lazy(() =>
  import('../features/timeRoi/TimeRoiSimulator').then((module) => ({ default: module.TimeRoiSimulator }))
)

export const App = () => {
  const {
    theme,
    activeTab,
    selectedSimulator,
    compareScenarios,
    finance,
    timeRoi,
    savedViews,
    toast,
    setActiveTab,
    setSelectedSimulator,
    setCompareScenarios,
    updateFinance,
    updateTimeRoi,
    resetSimulator,
    saveCurrentView,
    loadSavedView,
    renameSavedView,
    deleteSavedView,
    overwriteSavedViews,
    toggleTheme,
    clearToast,
    pushToast
  } = useAppStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = setTimeout(clearToast, 2000)
    return () => clearTimeout(timer)
  }, [clearToast, toast])

  return (
    <div className="min-h-screen">
      <TopNav tab={activeTab} setTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {activeTab === 'simulators' ? (
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <SimulatorSelector selected={selectedSimulator} onSelect={setSelectedSimulator} />
            <div>
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted shadow-soft">
                    Loading simulator...
                  </div>
                }
              >
                {selectedSimulator === 'finance' ? (
                  <FinanceSimulator
                    input={finance}
                    compareScenarios={compareScenarios}
                    onUpdate={updateFinance}
                    onToggleCompare={setCompareScenarios}
                    onReset={() => resetSimulator('finance')}
                    onSave={saveCurrentView}
                  />
                ) : (
                  <TimeRoiSimulator
                    input={timeRoi}
                    compareScenarios={compareScenarios}
                    onUpdate={updateTimeRoi}
                    onToggleCompare={setCompareScenarios}
                    onReset={() => resetSimulator('timeRoi')}
                    onSave={saveCurrentView}
                  />
                )}
              </Suspense>
            </div>
          </div>
        ) : (
          <SavedViewsPanel
            views={savedViews}
            onLoad={loadSavedView}
            onRename={renameSavedView}
            onDelete={deleteSavedView}
            onImport={(views) => {
              overwriteSavedViews(views)
              pushToast('Updated: imported saved views')
            }}
          />
        )}
      </main>

      <footer className="border-t border-border py-5 text-center text-xs text-muted">
        Created By Azamat Altymyshev
      </footer>

      <Toast toast={toast} />
    </div>
  )
}
