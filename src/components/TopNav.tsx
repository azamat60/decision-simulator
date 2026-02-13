import { Moon, Sun } from 'lucide-react'
import { cn } from '../styles/utils'
import type { AppTab } from '../app/types'

type Props = {
  tab: AppTab
  setTab: (tab: AppTab) => void
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

export const TopNav = ({ tab, setTab, theme, toggleTheme }: Props) => (
  <header className="sticky top-0 z-20 border-b border-border/70 bg-bg/75 backdrop-blur-xl">
    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
      <h1 className="text-lg font-semibold tracking-[0.02em]">
        Decision Simulator
        <span className="ml-2 rounded-md bg-gradient-to-r from-accent/20 to-accent2/20 px-2 py-1 text-[10px] uppercase tracking-widest text-muted">
          What-If Engine
        </span>
      </h1>
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface/90 p-1.5 shadow-soft">
        {(['simulators', 'saved'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              'rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200',
              tab === item
                ? 'bg-gradient-to-r from-accent to-accent2 text-slate-950 shadow-sm'
                : 'text-muted hover:-translate-y-0.5 hover:bg-bg hover:text-text'
            )}
          >
            {item === 'simulators' ? 'Simulators' : 'Saved Views'}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="rounded-xl border border-border bg-surface/90 p-2 text-muted transition hover:-translate-y-0.5 hover:text-text"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  </header>
)
