import { Timer, TrendingUp } from 'lucide-react'
import { simulatorMeta } from '../app/types'
import type { SimulatorKind } from '../domain/types'
import { cn } from '../styles/utils'

const meta = {
  finance: { icon: TrendingUp, title: 'Finance' },
  timeRoi: { icon: Timer, title: 'Time ROI' }
}

type Props = {
  selected: SimulatorKind
  onSelect: (kind: SimulatorKind) => void
}

export const SimulatorSelector = ({ selected, onSelect }: Props) => (
  <aside className="space-y-3">
    {(Object.keys(meta) as SimulatorKind[]).map((kind) => {
      const Icon = meta[kind].icon
      return (
        <button
          key={kind}
          type="button"
          onClick={() => onSelect(kind)}
          className={cn(
            'relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200',
            selected === kind
              ? 'border-accent/60 bg-gradient-to-br from-accent/20 via-surface to-accent2/20 shadow-soft'
              : 'border-border bg-surface hover:-translate-y-0.5 hover:border-accent/40'
          )}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-lg bg-bg/80 p-1.5">
              <Icon size={16} className="text-accent" />
            </span>
            <div className="font-semibold">{meta[kind].title}</div>
          </div>
          <p className="text-sm text-muted">{simulatorMeta[kind].description}</p>
        </button>
      )
    })}
  </aside>
)
