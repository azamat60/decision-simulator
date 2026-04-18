import { Minus, Plus } from "lucide-react";
import { clamp } from "../domain/scenarios";

type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
};

export const NumberStepper = ({
  label,
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  helpText,
}: Props) => {
  const update = (next: number) => onChange(clamp(next, min, max));

  return (
    <label className="block space-y-2 group">
      <span className="text-sm font-medium text-text-secondary transition-colors group-hover:text-text">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => update(value - step)}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-border/70 bg-surface/60 text-text-tertiary transition-all hover:border-primary/40 hover:bg-primary/8 hover:text-primary active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus size={14} />
        </button>
        <input
          className="h-9 flex-1 rounded-xl border border-border/70 bg-surface/60 px-3 py-2 text-center text-sm font-semibold tabular-nums text-text shadow-sm transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/15 focus:outline-none"
          type="number"
          aria-label={label}
          value={value}
          onChange={(e) => update(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
        />
        <button
          type="button"
          onClick={() => update(value + step)}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-border/70 bg-surface/60 text-text-tertiary transition-all hover:border-primary/40 hover:bg-primary/8 hover:text-primary active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
        </button>
      </div>
      {helpText && <p className="text-xs text-text-tertiary">{helpText}</p>}
    </label>
  );
};
