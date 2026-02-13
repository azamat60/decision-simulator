type Props = {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  suffix?: string
}

export const SliderField = ({ label, value, onChange, min, max, step = 1, suffix = '' }: Props) => (
  <label className="block space-y-2">
    <span className="flex items-center justify-between text-sm font-medium text-muted">
      <span>{label}</span>
      <span>
        {value}
        {suffix}
      </span>
    </span>
    <input
      type="range"
      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-border"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
)
