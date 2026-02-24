import { Moon, Sun } from "lucide-react";
import { cn } from "../styles/utils";
import type { AppTab } from "../app/types";

type Props = {
  tab: AppTab;
  setTab: (tab: AppTab) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
};

export const TopNav = ({ tab, setTab, theme, toggleTheme }: Props) => (
  <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6">
    <div className="glass rounded-2xl px-4 py-3 shadow-lg ring-1 ring-border/50 transition-all duration-300 hover:ring-primary/20 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white shadow-md">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-text">
            Decision<span className="text-primary">Simulator</span>
          </h1>
          <span className="hidden rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary sm:inline-block">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-2">
          <nav className="flex rounded-xl bg-surface/50 p-1 shadow-inner ring-1 ring-border/50">
            {(["simulators", "saved"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  tab === item
                    ? "bg-surface text-primary shadow-sm ring-1 ring-border/50"
                    : "text-text-secondary hover:bg-surface/50 hover:text-text",
                )}
              >
                {item === "simulators" ? "Simulators" : "Saved Views"}
              </button>
            ))}
          </nav>

          <div className="h-6 w-px bg-border/50" />

          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="group rounded-xl border border-transparent p-2 text-text-secondary transition-all hover:bg-surface hover:text-primary active:scale-95"
          >
            {theme === "dark" ? (
              <Sun
                size={18}
                className="transition-transform duration-500 group-hover:rotate-90"
              />
            ) : (
              <Moon
                size={18}
                className="transition-transform duration-500 group-hover:-rotate-12"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  </header>
);
