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
  <header className="sticky top-0 z-20 border-b border-border/80 bg-bg/80 backdrop-blur">
    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
      <h1 className="text-lg font-semibold tracking-wide">Decision Simulator</h1>
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-1 shadow-soft">
        {(['simulators', 'saved'] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              'rounded-xl px-3 py-1.5 text-sm font-medium transition',
              tab === item
                ? 'bg-gradient-to-r from-accent to-accent2 text-slate-950'
                : 'text-muted hover:bg-bg hover:text-text'
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
        className="rounded-xl border border-border bg-surface p-2 text-muted transition hover:text-text"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  </header>
)
