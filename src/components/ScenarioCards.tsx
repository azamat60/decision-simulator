import { scenarioColor, scenarioOrder } from '../domain/scenarios'
import type { MultiScenarioResult } from '../domain/types'

type Props<TSummary extends Record<string, number>> = {
  data: MultiScenarioResult<TSummary>
  metricLabel: string
  metricKey: keyof TSummary
  format: (value: number) => string
}

export const ScenarioCards = <TSummary extends Record<string, number>>({
  data,
  metricLabel,
  metricKey,
  format
}: Props<TSummary>) => (
  <div className="grid gap-3 md:grid-cols-3">
    {scenarioOrder.map((scenario) => (
      <article key={scenario} className="rounded-2xl border border-border bg-surface p-3">
        <div className="mb-2 flex items-center gap-2 text-xs uppercase text-muted">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: scenarioColor[scenario] }} />
          {scenario}
        </div>
        <p className="text-xs text-muted">{metricLabel}</p>
        <p className="mt-1 text-lg font-semibold">{format(data[scenario].summary[metricKey] as number)}</p>
      </article>
    ))}
  </div>
)
