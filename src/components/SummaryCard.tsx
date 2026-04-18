import type { ReactNode } from "react";
import { cn } from "../styles/utils";

type Props = {
  label: ReactNode;
  value: string;
  tone?: "default" | "positive" | "negative";
};

export const SummaryCard = ({ label, value, tone = "default" }: Props) => (
  <article
    className={cn(
      "glass-card group relative overflow-hidden cursor-default",
      tone === "positive" && "hover:shadow-glow-success",
      tone === "negative" && "hover:shadow-glow-destructive",
      tone === "default" && "hover:shadow-glow",
    )}
  >
    {/* Top accent bar */}
    <div
      className={cn(
        "absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300",
        tone === "positive"
          ? "bg-gradient-to-r from-transparent via-success to-transparent opacity-70 group-hover:opacity-100"
          : tone === "negative"
            ? "bg-gradient-to-r from-transparent via-destructive to-transparent opacity-70 group-hover:opacity-100"
            : "bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50 group-hover:opacity-100",
      )}
    />

    <div className="p-5 pt-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-tertiary transition-colors duration-200 group-hover:text-text-secondary">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-space text-xl font-bold leading-tight tracking-tighter tabular-nums",
          tone === "positive"
            ? "gradient-text-success"
            : tone === "negative"
              ? "text-destructive"
              : "text-text",
        )}
      >
        {value}
      </p>
    </div>

    {/* Corner glow blob */}
    <div
      className={cn(
        "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100",
        tone === "positive"
          ? "bg-success/25"
          : tone === "negative"
            ? "bg-destructive/25"
            : "bg-primary/20",
      )}
    />
  </article>
);
