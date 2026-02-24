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
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => update(value - step)}
          className="rounded-xl border border-border bg-surface p-2.5 text-text-secondary transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary active:scale-95 disabled:opacity-50"
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          <Minus size={16} />
        </button>
        <div className="relative flex-1">
          <input
            className="w-full rounded-xl border border-border bg-surface/50 px-3 py-2 text-center text-text font-medium shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            type="number"
            aria-label={label}
            value={value}
            onChange={(event) => update(Number(event.target.value))}
            min={min}
            max={max}
            step={step}
          />
        </div>
        <button
          type="button"
          onClick={() => update(value + step)}
          className="rounded-xl border border-border bg-surface p-2.5 text-text-secondary transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary active:scale-95 disabled:opacity-50"
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >
          <Plus size={16} />
        </button>
      </div>
      {helpText ? (
        <p className="text-xs text-text-tertiary">{helpText}</p>
      ) : null}
    </label>
  );
};
