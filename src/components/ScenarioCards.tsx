import { scenarioColor, scenarioOrder } from "../domain/scenarios";
import type { MultiScenarioResult } from "../domain/types";
import { Card } from "./Card";

type Props<TSummary extends Record<string, number>> = {
  data: MultiScenarioResult<TSummary>;
  metricLabel: string;
  metricKey: keyof TSummary;
  format: (value: number) => string;
};

export const ScenarioCards = <TSummary extends Record<string, number>>({
  data,
  metricLabel,
  metricKey,
  format,
}: Props<TSummary>) => (
  <div className="grid gap-3 md:grid-cols-3">
    {scenarioOrder.map((scenario) => (
      <Card
        key={scenario}
        className="hover:scale-105 transition-transform duration-300"
      >
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-tertiary">
          <span
            className="inline-block h-2 w-2 rounded-full shadow-sm"
            style={{
              backgroundColor: scenarioColor[scenario],
              boxShadow: `0 0 8px ${scenarioColor[scenario]}`,
            }}
          />
          {scenario}
        </div>
        <p className="text-xs text-text-secondary">{metricLabel}</p>
        <p className="mt-1 text-lg font-bold font-space text-text tracking-tight">
          {format(data[scenario].summary[metricKey] as number)}
        </p>
      </Card>
    ))}
  </div>
);
