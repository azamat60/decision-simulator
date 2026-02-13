import { cn } from '../styles/utils'

type Props = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export const Toggle = ({ label, checked, onChange }: Props) => (
  <label className="flex items-center justify-between rounded-xl border border-border bg-bg px-3 py-2 text-sm">
    <span>{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition',
        checked ? 'bg-accent' : 'bg-border'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white transition',
          checked ? 'left-[1.4rem]' : 'left-0.5'
        )}
      />
    </button>
  </label>
)
