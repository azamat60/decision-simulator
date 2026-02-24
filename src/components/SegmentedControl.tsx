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
  <div className="flex w-full rounded-xl border border-border bg-surface/50 p-1 shadow-inner">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={cn(
          "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
          value === option.value
            ? "bg-gradient-to-br from-primary to-accent text-white shadow-sm scale-[1.02]"
            : "text-text-secondary hover:bg-surface hover:text-text",
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);
