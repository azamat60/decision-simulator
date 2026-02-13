import { Minus, Plus } from 'lucide-react'
import { clamp } from '../domain/scenarios'

type Props = {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  helpText?: string
}

export const NumberStepper = ({
  label,
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  helpText
}: Props) => {
  const update = (next: number) => onChange(clamp(next, min, max))

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => update(value - step)}
          className="rounded-xl border border-border bg-bg p-2 text-muted transition hover:text-text"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={14} />
        </button>
        <input
          className="w-full rounded-xl border border-border bg-bg px-3 py-2 text-text"
          type="number"
          aria-label={label}
          value={value}
          onChange={(event) => update(Number(event.target.value))}
          min={min}
          max={max}
          step={step}
        />
        <button
          type="button"
          onClick={() => update(value + step)}
          className="rounded-xl border border-border bg-bg p-2 text-muted transition hover:text-text"
          aria-label={`Increase ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>
      {helpText ? <p className="text-xs text-muted">{helpText}</p> : null}
    </label>
  )
}
