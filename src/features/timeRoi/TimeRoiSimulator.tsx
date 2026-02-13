import { Info, RotateCcw, Save } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { decimal } from '../../app/format'
import { scenarioColor } from '../../domain/scenarios'
import { getTimeRoiDefaults, simulateTimeRoi } from '../../domain/timeRoi'
import type { TimeRoiInputParams } from '../../domain/types'
import { InfoHint } from '../../components/InfoHint'
import { NumberStepper } from '../../components/NumberStepper'
import { SegmentedControl } from '../../components/SegmentedControl'
import { SliderField } from '../../components/SliderField'
import { SummaryCard } from '../../components/SummaryCard'
import { Toggle } from '../../components/Toggle'
import { ScenarioCards } from '../../components/ScenarioCards'

type Props = {
  input: TimeRoiInputParams
  compareScenarios: boolean
  onUpdate: (patch: Partial<TimeRoiInputParams>) => void
  onToggleCompare: (value: boolean) => void
  onReset: () => void
  onSave: (name: string) => void
}

const presetMap: Record<'learning' | 'fitness' | 'language' | 'side', Partial<TimeRoiInputParams>> = {
  learning: { dailyMinutes: 45, daysPerWeek: 5, durationWeeks: 24, efficiencyGain: 8, skipRate: 18 },
  fitness: { dailyMinutes: 60, daysPerWeek: 4, durationWeeks: 16, efficiencyGain: 5, skipRate: 20 },
  language: { dailyMinutes: 30, daysPerWeek: 6, durationWeeks: 30, efficiencyGain: 12, skipRate: 15 },
  side: { dailyMinutes: 90, daysPerWeek: 5, durationWeeks: 20, efficiencyGain: 15, skipRate: 25 }
}

export const TimeRoiSimulator = ({
  input,
  compareScenarios,
  onUpdate,
  onToggleCompare,
  onReset,
  onSave
}: Props) => {
  const [saveName, setSaveName] = useState('')
  const [preset, setPreset] = useState<'learning' | 'fitness' | 'language' | 'side'>('learning')

  const result = useMemo(() => simulateTimeRoi(input), [input])
  const defaults = getTimeRoiDefaults()

  const changedFields = Object.entries(input)
    .filter(([key, value]) => defaults[key as keyof TimeRoiInputParams] !== value)
    .map(([key]) => key)

  const data = result.base.timeline.map((point, index) => ({
    label: point.label,
    invested: point.metrics.invested,
    saved: point.metrics.saved,
    weeklyInvested: point.metrics.weeklyInvested,
    conservative: result.conservative.timeline[index]?.metrics.saved ?? point.metrics.saved,
    optimistic: result.optimistic.timeline[index]?.metrics.saved ?? point.metrics.saved
  }))

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <h2 className="text-xl font-semibold">Productivity Time ROI</h2>
        <p className="mt-1 text-sm text-muted">
          Track habit consistency and expected reclaimed hours from efficiency improvements.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-4 rounded-2xl border border-border bg-surface p-4 shadow-soft">
          <NumberStepper
            label="Daily time invested (minutes)"
            value={input.dailyMinutes}
            onChange={(value) => onUpdate({ dailyMinutes: value })}
            min={5}
            max={360}
            step={5}
          />
          <NumberStepper
            label="Days per week"
            value={input.daysPerWeek}
            onChange={(value) => onUpdate({ daysPerWeek: value })}
            min={1}
            max={7}
          />
          <NumberStepper
            label="Duration (weeks)"
            value={input.durationWeeks}
            onChange={(value) => onUpdate({ durationWeeks: value })}
            min={1}
            max={260}
          />
          <SliderField
            label="Efficiency gain"
            value={input.efficiencyGain}
            onChange={(value) => onUpdate({ efficiencyGain: value })}
            min={0}
            max={30}
            suffix="%"
          />
          <SliderField
            label="Skip rate"
            value={input.skipRate}
            onChange={(value) => onUpdate({ skipRate: value })}
            min={0}
            max={50}
            suffix="%"
          />

          <div className="space-y-3 border-t border-border pt-3">
            <p className="text-sm font-medium text-muted">Presets</p>
            <SegmentedControl
              value={preset}
              onChange={(value) => {
                setPreset(value)
                onUpdate(presetMap[value])
              }}
              options={[
                { value: 'learning', label: 'Learning' },
                { value: 'fitness', label: 'Fitness' },
                { value: 'language', label: 'Language' },
                { value: 'side', label: 'Side Project' }
              ]}
            />
            <Toggle
              label="Compare scenarios"
              checked={compareScenarios}
              onChange={onToggleCompare}
            />
            <Toggle
              label="Goal mode"
              checked={input.goalMode}
              onChange={(checked) => onUpdate({ goalMode: checked })}
            />
            {input.goalMode ? (
              <NumberStepper
                label="Target hours"
                value={input.goalHours}
                onChange={(value) => onUpdate({ goalHours: value })}
                min={1}
                max={2000}
                step={5}
              />
            ) : null}
          </div>

          <div className="space-y-3 border-t border-border pt-3">
            <label className="block text-sm text-muted">
              Save current view
              <input
                className="mt-2 w-full rounded-xl border border-border bg-bg px-3 py-2 text-text"
                placeholder="e.g. Language Sprint"
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
            <SummaryCard label="Sessions completed" value={decimal(result.base.summary.sessionsCompleted)} />
            <SummaryCard label="Hours invested" value={`${decimal(result.base.summary.totalHoursInvested)} h`} />
            <SummaryCard
              label={
                <span className="inline-flex items-center gap-1">
                  Estimated saved <InfoHint text="Saved hours = invested hours x efficiency gain." />
                </span>
              }
              value={`${decimal(result.base.summary.estimatedHoursSaved)} h`}
              tone="positive"
            />
            <SummaryCard
              label="Net time ROI"
              value={`${decimal(result.base.summary.netTimeRoi)} h`}
              tone={result.base.summary.netTimeRoi >= 0 ? 'positive' : 'negative'}
            />
          </div>

          {input.goalMode ? (
            <article className="rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-soft">
              <Info size={14} className="mr-1 inline" />
              To reach {input.goalHours} hours, estimated duration is{' '}
              <span className="font-semibold text-text">{result.base.summary.goalWeeksNeeded} weeks</span>.
            </article>
          ) : null}

          <article className="h-[330px] rounded-2xl border border-border bg-surface p-4 shadow-soft">
            <p className="mb-3 text-sm text-muted">Cumulative invested vs saved</p>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <Tooltip formatter={(value) => `${decimal(Number(value ?? 0))} h`} />
                <Legend />
                <Line type="monotone" dataKey="invested" stroke="#f59e0b" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="saved" stroke={scenarioColor.base} dot={false} strokeWidth={2.5} />
                {compareScenarios ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="conservative"
                      stroke={scenarioColor.conservative}
                      dot={false}
                      strokeWidth={1.8}
                    />
                    <Line
                      type="monotone"
                      dataKey="optimistic"
                      stroke={scenarioColor.optimistic}
                      dot={false}
                      strokeWidth={1.8}
                    />
                  </>
                ) : null}
              </LineChart>
            </ResponsiveContainer>
          </article>

          <article className="h-[280px] rounded-2xl border border-border bg-surface p-4 shadow-soft">
            <p className="mb-3 text-sm text-muted">Weekly invested hours</p>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <Tooltip formatter={(value) => `${decimal(Number(value ?? 0))} h`} />
                <Bar dataKey="weeklyInvested" fill="#3b82f6aa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </article>

          {compareScenarios ? (
            <ScenarioCards
              data={result}
              metricLabel="Total hours invested"
              metricKey="totalHoursInvested"
              format={(value) => `${decimal(value)} h`}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}
