import type { ReactNode } from "react";
import { cn } from "../styles/utils";

type Props = {
  label: ReactNode;
  value: string;
  tone?: "default" | "positive" | "negative";
};

export const SummaryCard = ({ label, value, tone = "default" }: Props) => (
  <article className="glass-card group relative overflow-hidden p-5 hover:ring-1 hover:ring-primary/20 hover:shadow-lg">
    <div className="relative z-10">
      <p className="text-[11px] font-bold uppercase tracking-widest text-text-tertiary transition-colors group-hover:text-primary">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-space text-2xl font-bold tracking-tight",
          tone === "positive"
            ? "text-success"
            : tone === "negative"
              ? "text-destructive"
              : "text-text",
        )}
      >
        {value}
      </p>
    </div>

    {/* Subtle gradient glow on hover */}
    <div
      className={cn(
        "absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-20",
        tone === "positive"
          ? "bg-success"
          : tone === "negative"
            ? "bg-destructive"
            : "bg-primary",
      )}
    />
  </article>
);
