import { cn } from '../styles/utils'

type Option<T extends string> = {
  value: T
  label: string
}

type Props<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
}

export const SegmentedControl = <T extends string>({ value, onChange, options }: Props<T>) => (
  <div className="inline-flex rounded-xl border border-border bg-bg p-1">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={cn(
          'rounded-lg px-3 py-1 text-xs font-medium transition',
          value === option.value ? 'bg-surface text-text' : 'text-muted hover:text-text'
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
)
