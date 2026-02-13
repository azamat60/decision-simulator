import { Info, RotateCcw, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { currency, percent } from '../../app/format'
import { scenarioColor } from '../../domain/scenarios'
import { getFinanceDefaults, simulateFinance } from '../../domain/finance'
import type { FinanceInputParams } from '../../domain/types'
import { NumberStepper } from '../../components/NumberStepper'
import { SliderField } from '../../components/SliderField'
import { Toggle } from '../../components/Toggle'
import { SegmentedControl } from '../../components/SegmentedControl'
import { SummaryCard } from '../../components/SummaryCard'
import { ScenarioCards } from '../../components/ScenarioCards'

type Props = {
  input: FinanceInputParams
  compareScenarios: boolean
  onUpdate: (patch: Partial<FinanceInputParams>) => void
  onToggleCompare: (value: boolean) => void
  onReset: () => void
  onSave: (name: string) => void
}

const presetValues = {
  conservative: 6,
  base: 8,
  optimistic: 10
} as const

export const FinanceSimulator = ({
  input,
  compareScenarios,
  onUpdate,
  onToggleCompare,
  onReset,
  onSave
}: Props) => {
  const [saveName, setSaveName] = useState('')
  const [preset, setPreset] = useState<'conservative' | 'base' | 'optimistic'>('base')
  const result = useMemo(() => simulateFinance(input), [input])

  const chartData = useMemo(() => {
    const base = result.base.timeline
    return base.map((point, index) => ({
      label: point.label,
      base: point.metrics.value,
      contributed: point.metrics.contributed,
      growth: point.metrics.growth,
      conservative: result.conservative.timeline[index]?.metrics.value ?? point.metrics.value,
      optimistic: result.optimistic.timeline[index]?.metrics.value ?? point.metrics.value,
      real: point.metrics.realValue
    }))
  }, [result])

  const defaults = getFinanceDefaults()
  const changedFields = Object.entries(input)
    .filter(([key, value]) => defaults[key as keyof FinanceInputParams] !== value)
    .map(([key]) => key)

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <h2 className="text-xl font-semibold">Savings & Investment Growth</h2>
        <p className="mt-1 text-sm text-muted">
          Model monthly compounding and compare scenario outcomes.{' '}
          <Info size={13} className="inline text-muted" /> Formula: balance * (1+r) + monthly contribution.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
          <div className="space-y-3">
            <NumberStepper
              label="Initial amount"
              value={input.initialAmount}
              onChange={(value) => onUpdate({ initialAmount: value })}
              min={0}
              step={500}
            />
            <NumberStepper
              label="Monthly contribution"
              value={input.monthlyContribution}
              onChange={(value) => onUpdate({ monthlyContribution: value })}
              min={0}
              step={50}
            />
            <NumberStepper
              label="Years"
              value={input.years}
              onChange={(value) => onUpdate({ years: value })}
              min={1}
              max={50}
            />
            <SliderField
              label="Annual return rate"
              value={input.annualReturnRate}
              onChange={(value) => onUpdate({ annualReturnRate: value })}
              min={0}
              max={30}
              step={0.5}
              suffix="%"
            />
            <SliderField
              label="Inflation rate"
              value={input.inflationRate}
              onChange={(value) => onUpdate({ inflationRate: value })}
              min={0}
              max={15}
              step={0.5}
              suffix="%"
            />
          </div>

          <div className="space-y-3 border-t border-border pt-3">
            <p className="text-sm font-medium text-muted">Return Presets</p>
            <SegmentedControl
              value={preset}
              onChange={(value) => {
                setPreset(value)
                onUpdate({ annualReturnRate: presetValues[value] })
              }}
              options={[
                { value: 'conservative', label: 'Conservative' },
                { value: 'base', label: 'Base' },
                { value: 'optimistic', label: 'Optimistic' }
              ]}
            />
            <Toggle
              label="Show inflation-adjusted"
              checked={input.showInflationAdjusted}
              onChange={(checked) => onUpdate({ showInflationAdjusted: checked })}
            />
            <Toggle
              label="Compare scenarios"
              checked={compareScenarios}
              onChange={onToggleCompare}
            />
          </div>

          <div className="space-y-3 border-t border-border pt-3">
            <label className="block text-sm text-muted">
              Save current view
              <input
                className="mt-2 w-full rounded-xl border border-border bg-bg px-3 py-2 text-text"
                placeholder="e.g. Retirement Plan"
                value={saveName}
                onChange={(event) => setSaveName(event.target.value)}
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSave(saveName)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent2 px-3 py-2 text-sm font-medium text-slate-950"
              >
                <Save size={14} /> Save
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          <p className="rounded-xl border border-border bg-bg p-3 text-xs text-muted">
            What changed? {changedFields.length === 0 ? 'Using defaults.' : changedFields.join(', ')}
          </p>
        </aside>

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Final value" value={currency(result.base.summary.finalValue)} />
            <SummaryCard
              label="Final real value"
              value={input.showInflationAdjusted ? currency(result.base.summary.finalRealValue) : 'Hidden'}
            />
            <SummaryCard label="Total contributed" value={currency(result.base.summary.totalContributed)} />
            <SummaryCard
              label="Total growth"
              value={currency(result.base.summary.totalGrowth)}
              tone={result.base.summary.totalGrowth >= 0 ? 'positive' : 'negative'}
            />
          </div>

          <article className="h-[330px] rounded-2xl border border-border bg-surface p-4 shadow-soft">
            <p className="mb-3 text-sm text-muted">Portfolio value over time</p>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <YAxis tickFormatter={(value) => `$${Math.round(value / 1000)}k`} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <Tooltip formatter={(value) => currency(Number(value ?? 0))} />
                <Legend />
                <Line type="monotone" dataKey="base" stroke={scenarioColor.base} strokeWidth={2.5} dot={false} />
                {compareScenarios ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="conservative"
                      stroke={scenarioColor.conservative}
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="optimistic"
                      stroke={scenarioColor.optimistic}
                      strokeWidth={2}
                      dot={false}
                    />
                  </>
                ) : null}
                {input.showInflationAdjusted ? (
                  <Line type="monotone" dataKey="real" stroke="#c084fc" strokeWidth={1.8} dot={false} />
                ) : null}
              </LineChart>
            </ResponsiveContainer>
          </article>

          <article className="h-[280px] rounded-2xl border border-border bg-surface p-4 shadow-soft">
            <p className="mb-3 text-sm text-muted">Contributed vs growth</p>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <YAxis tickFormatter={(value) => `$${Math.round(value / 1000)}k`} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <Tooltip formatter={(value) => currency(Number(value ?? 0))} />
                <Area type="monotone" dataKey="contributed" stackId="1" stroke="#0ea5e9" fill="#0ea5e955" />
                <Area type="monotone" dataKey="growth" stackId="1" stroke="#22d3ee" fill="#22d3ee66" />
              </AreaChart>
            </ResponsiveContainer>
          </article>

          {compareScenarios ? (
            <ScenarioCards
              data={result}
              metricLabel="Final value"
              metricKey="finalValue"
              format={(value) => currency(value)}
            />
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
              CAGR approx: {percent(result.base.summary.cagr)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
