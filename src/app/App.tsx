import { lazy, Suspense, useEffect } from "react";
import { SavedViewsPanel } from "../components/SavedViewsPanel";
import { SimulatorSelector } from "../components/SimulatorSelector";
import { Toast } from "../components/Toast";
import { TopNav } from "../components/TopNav";
import { useAppStore } from "../state/appStore";

const FinanceSimulator = lazy(() =>
  import("../features/finance/FinanceSimulator").then((module) => ({
    default: module.FinanceSimulator,
  })),
);
const TimeRoiSimulator = lazy(() =>
  import("../features/timeRoi/TimeRoiSimulator").then((module) => ({
    default: module.TimeRoiSimulator,
  })),
);

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
    pushToast,
  } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(clearToast, 2000);
    return () => clearTimeout(timer);
  }, [clearToast, toast]);

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Ambient Background */}
      <div
        className="ambient-shape bg-primary/25 w-[600px] h-[600px] -top-32 -right-32 animate-pulse"
        style={{ animationDuration: "12s" }}
      />
      <div
        className="ambient-shape bg-accent/20 w-[500px] h-[500px] bottom-10 -left-32 animate-pulse"
        style={{ animationDuration: "18s", animationDelay: "3s" }}
      />
      <div
        className="ambient-shape bg-primary/10 w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 animate-pulse"
        style={{ animationDuration: "22s", animationDelay: "6s" }}
      />

      <TopNav
        tab={activeTab}
        setTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 relative z-10 animate-fade-in">
        {activeTab === "simulators" ? (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <SimulatorSelector
              selected={selectedSimulator}
              onSelect={setSelectedSimulator}
            />
            <div className="animate-scale-in">
              <Suspense
                fallback={
                  <div className="glass-card p-8 text-center text-sm text-text-tertiary">
                    Initializing engine...
                  </div>
                }
              >
                {selectedSimulator === "finance" ? (
                  <FinanceSimulator
                    input={finance}
                    compareScenarios={compareScenarios}
                    onUpdate={updateFinance}
                    onToggleCompare={setCompareScenarios}
                    onReset={() => resetSimulator("finance")}
                    onSave={saveCurrentView}
                  />
                ) : (
                  <TimeRoiSimulator
                    input={timeRoi}
                    compareScenarios={compareScenarios}
                    onUpdate={updateTimeRoi}
                    onToggleCompare={setCompareScenarios}
                    onReset={() => resetSimulator("timeRoi")}
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
              overwriteSavedViews(views);
              pushToast("Updated: imported saved views");
            }}
          />
        )}
      </main>

      <footer className="mt-16 border-t border-border/30 py-6 text-center">
        <p className="text-xs text-text-tertiary">
          Built by{" "}
          <span className="font-medium text-text-secondary">
            Azamat Altymyshev
          </span>
        </p>
      </footer>

      <Toast toast={toast} />
    </div>
  );
};
