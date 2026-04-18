import { cn } from "../styles/utils";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
};

export const SegmentedControl = <T extends string>({
  value,
  onChange,
  options,
}: Props<T>) => (
  <div className="flex w-full rounded-xl border border-border/70 bg-bg/60 p-1 gap-0.5">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={cn(
          "flex-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200",
          value === option.value
            ? "bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/20"
            : "text-text-tertiary hover:bg-surface/80 hover:text-text-secondary",
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);
