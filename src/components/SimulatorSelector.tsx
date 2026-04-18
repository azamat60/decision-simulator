import { Timer, TrendingUp } from "lucide-react";
import { simulatorMeta } from "../app/types";
import type { SimulatorKind } from "../domain/types";
import { cn } from "../styles/utils";

const meta = {
  finance: { icon: TrendingUp, title: "Finance" },
  timeRoi: { icon: Timer, title: "Time ROI" },
};

type Props = {
  selected: SimulatorKind;
  onSelect: (kind: SimulatorKind) => void;
};

export const SimulatorSelector = ({ selected, onSelect }: Props) => (
  <aside className="space-y-3">
    {(Object.keys(meta) as SimulatorKind[]).map((kind) => {
      const Icon = meta[kind].icon;
      const isActive = selected === kind;
      return (
        <button
          key={kind}
          type="button"
          onClick={() => onSelect(kind)}
          className={cn(
            "relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200",
            isActive
              ? "border-accent/50 bg-gradient-to-br from-accent/15 via-surface to-primary/10 shadow-md shadow-accent/10"
              : "border-border/60 bg-surface/40 hover:-translate-y-0.5 hover:border-border hover:bg-surface/70 hover:shadow-sm",
          )}
        >
          {/* Active left-edge indicator */}
          {isActive && (
            <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b from-primary to-accent" />
          )}

          <div className="mb-2 flex items-center gap-2.5 pl-1">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                isActive
                  ? "bg-gradient-to-br from-primary/20 to-accent/20 text-accent"
                  : "bg-bg/60 text-text-tertiary",
              )}
            >
              <Icon size={15} />
            </span>
            <span
              className={cn(
                "font-semibold text-sm transition-colors",
                isActive ? "text-text" : "text-text-secondary",
              )}
            >
              {meta[kind].title}
            </span>
          </div>
          <p className="pl-1 text-xs leading-relaxed text-text-tertiary">
            {simulatorMeta[kind].description}
          </p>
        </button>
      );
    })}
  </aside>
);
