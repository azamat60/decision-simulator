import type { ReactNode } from "react";

type Props = {
  label: ReactNode;
  value: string;
  tone?: "default" | "positive" | "negative";
};

export const SummaryCard = ({ label, value, tone = "default" }: Props) => (
  <article className="rounded-2xl border border-border bg-surface p-4 shadow-soft flex flex-col justify-between">
    <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
    <p
      className={
        tone === "positive"
          ? "mt-2 text-2xl font-semibold text-positive"
          : tone === "negative"
            ? "mt-2 text-2xl font-semibold text-negative"
            : "mt-2 text-2xl font-semibold"
      }
    >
      {value}
    </p>
  </article>
);
