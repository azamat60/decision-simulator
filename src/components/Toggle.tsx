import { cn } from "../styles/utils";

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Toggle = ({ label, checked, onChange }: Props) => (
  <label className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/40 px-4 py-3 transition-all hover:bg-surface/70 hover:border-border cursor-pointer group">
    <span className="text-sm font-medium text-text-secondary group-hover:text-text transition-colors">
      {label}
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[22px] w-10 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 flex-shrink-0",
        checked
          ? "bg-gradient-to-r from-primary to-accent shadow-sm"
          : "bg-border/80",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-md transition-all duration-300",
          checked ? "left-[1.35rem]" : "left-[3px]",
        )}
      />
    </button>
  </label>
);
