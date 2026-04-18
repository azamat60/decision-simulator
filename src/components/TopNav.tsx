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
    <div className="glass rounded-2xl px-5 py-3 shadow-lg ring-1 ring-white/5 transition-all duration-300">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5"
            >
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
            </svg>
          </div>
          <h1 className="font-space text-[15px] font-bold tracking-tight text-text">
            Decision<span className="gradient-text">Simulator</span>
          </h1>
          <span className="hidden rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary sm:inline-block">
            Beta
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Tab nav */}
          <nav className="flex items-center gap-1 rounded-xl bg-surface/40 border border-border/60 p-1">
            {(["simulators", "saved"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "relative rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  tab === item
                    ? "bg-surface text-text shadow-sm ring-1 ring-border/60"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                {item === "simulators" ? "Simulators" : "Saved Views"}
                {tab === item && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-gradient-to-r from-primary to-accent" />
                )}
              </button>
            ))}
          </nav>

          <div className="h-5 w-px bg-border/50" />

          {/* Theme toggle */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="group h-8 w-8 flex items-center justify-center rounded-xl text-text-tertiary transition-all hover:bg-surface/70 hover:text-primary active:scale-95"
          >
            {theme === "dark" ? (
              <Sun size={16} className="transition-transform duration-500 group-hover:rotate-90" />
            ) : (
              <Moon size={16} className="transition-transform duration-500 group-hover:-rotate-12" />
            )}
          </button>
        </div>

      </div>
    </div>
  </header>
);
