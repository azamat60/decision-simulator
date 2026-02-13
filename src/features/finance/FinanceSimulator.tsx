import { Info, RotateCcw, Save, Sigma } from 'lucide-react'
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
import { getFinanceDefaults, simulateFinance, simulateFinanceMonteCarlo } from '../../domain/finance'
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
  const monteCarlo = useMemo(
    () =>
      input.monteCarloEnabled
        ? simulateFinanceMonteCarlo(input, input.targetFinalValue)
        : null,
    [input]
  )

  const chartData = useMemo(() => {
    const base = result.base.timeline
    return base.map((point, index) => ({
      label: point.label,
      base: point.metrics.value,
      contributed: point.metrics.contributed,
      growth: point.metrics.growth,
      conservative: result.conservative.timeline[index]?.metrics.value ?? point.metrics.value,
      optimistic: result.optimistic.timeline[index]?.metrics.value ?? point.metrics.value,
      real: point.metrics.realValue,
      mcP10: monteCarlo?.timeline[index]?.p10,
      mcP50: monteCarlo?.timeline[index]?.p50,
      mcP90: monteCarlo?.timeline[index]?.p90
    }))
  }, [result, monteCarlo])

  const defaults = getFinanceDefaults()
  const changedFields = Object.entries(input)
    .filter(([key, value]) => defaults[key as keyof FinanceInputParams] !== value)
    .map(([key]) => key)
  const targetGap = result.base.summary.finalValue - input.targetFinalValue
  const targetEtaPoint = result.base.timeline.find((point) => point.metrics.value >= input.targetFinalValue)
  const targetEtaYears = targetEtaPoint ? targetEtaPoint.t / 12 : null
  const milestone25 = result.base.timeline.find((point) => point.metrics.value >= input.targetFinalValue * 0.25)
  const milestone50 = result.base.timeline.find((point) => point.metrics.value >= input.targetFinalValue * 0.5)
  const milestone75 = result.base.timeline.find((point) => point.metrics.value >= input.targetFinalValue * 0.75)
  const riskProbability = monteCarlo ? monteCarlo.successProbability : targetGap >= 0 ? 1 : 0

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
            <NumberStepper
              label="Target final value"
              value={input.targetFinalValue}
              onChange={(value) => onUpdate({ targetFinalValue: value })}
              min={10000}
              step={5000}
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
            <Toggle
              label="Monte Carlo mode"
              checked={input.monteCarloEnabled}
              onChange={(checked) => onUpdate({ monteCarloEnabled: checked })}
            />
            {input.monteCarloEnabled ? (
              <>
                <NumberStepper
                  label="Monte Carlo runs"
                  value={input.monteCarloRuns}
                  onChange={(value) => onUpdate({ monteCarloRuns: value })}
                  min={100}
                  max={2000}
                  step={100}
                />
                <SliderField
                  label="Volatility (annual std dev)"
                  value={input.monteCarloVolatility}
                  onChange={(value) => onUpdate({ monteCarloVolatility: value })}
                  min={1}
                  max={40}
                  step={1}
                  suffix="%"
                />
              </>
            ) : null}
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

          {input.monteCarloEnabled && monteCarlo ? (
            <article className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
              <p className="inline-flex items-center gap-1 font-medium text-text">
                <Sigma size={15} className="text-accent" /> Monte Carlo insights
              </p>
              <p className="mt-2">Median final value: {currency(monteCarlo.finalMedian)}</p>
              <p>
                Probability of hitting target ({currency(input.targetFinalValue)}):{' '}
                <span className="font-semibold text-text">{percent(monteCarlo.successProbability)}</span>
              </p>
            </article>
          ) : null}

          <article
            className={`rounded-2xl border p-4 text-sm shadow-soft ${
              riskProbability >= 0.7
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                : riskProbability >= 0.4
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-100'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-100'
            }`}
          >
            <p className="font-medium">Target status</p>
            <p className="mt-1">
              Gap to target: <span className="font-semibold">{currency(targetGap)}</span>
            </p>
            <p>
              ETA to target:{' '}
              <span className="font-semibold">
                {targetEtaYears ? `${targetEtaYears.toFixed(1)} years` : 'Not reached in selected horizon'}
              </span>
            </p>
            <p>Confidence: {percent(riskProbability)}</p>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
            <p className="font-medium text-text">Milestones</p>
            <p className="mt-1">25% target: {milestone25 ? `${(milestone25.t / 12).toFixed(1)} years` : 'Not reached'}</p>
            <p>50% target: {milestone50 ? `${(milestone50.t / 12).toFixed(1)} years` : 'Not reached'}</p>
            <p>75% target: {milestone75 ? `${(milestone75.t / 12).toFixed(1)} years` : 'Not reached'}</p>
          </article>

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
                {input.monteCarloEnabled ? (
                  <>
                    <Line type="monotone" dataKey="mcP10" stroke="#f43f5e" strokeWidth={1.4} dot={false} />
                    <Line type="monotone" dataKey="mcP50" stroke="#f59e0b" strokeWidth={1.8} dot={false} />
                    <Line type="monotone" dataKey="mcP90" stroke="#10b981" strokeWidth={1.4} dot={false} />
                  </>
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
