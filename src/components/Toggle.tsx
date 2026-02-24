import { cn } from "../styles/utils";

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Toggle = ({ label, checked, onChange }: Props) => (
  <label className="flex items-center justify-between rounded-xl border border-border bg-surface/50 p-3 transition-colors hover:bg-surface cursor-pointer group">
    <span className="text-sm font-medium text-text-secondary group-hover:text-text transition-colors">
      {label}
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20",
        checked ? "bg-primary shadow-inner" : "bg-border",
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300",
          checked ? "left-[1.6rem]" : "left-1",
        )}
      />
    </button>
  </label>
);
