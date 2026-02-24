import { Info, RotateCcw, Save, Sigma } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  YAxis,
} from "recharts";
import { currency, percent } from "../../app/format";
import { scenarioColor } from "../../domain/scenarios";
import {
  getFinanceDefaults,
  simulateFinance,
  simulateFinanceMonteCarlo,
} from "../../domain/finance";
import type { FinanceInputParams } from "../../domain/types";
import { NumberStepper } from "../../components/NumberStepper";
import { SliderField } from "../../components/SliderField";
import { Toggle } from "../../components/Toggle";
import { SegmentedControl } from "../../components/SegmentedControl";
import { SummaryCard } from "../../components/SummaryCard";
import { ScenarioCards } from "../../components/ScenarioCards";
import { Card } from "../../components/Card";
import {
  loadFinancePresets,
  saveFinancePresets,
  type NamedPreset,
} from "../../storage/customPresets";

type Props = {
  input: FinanceInputParams;
  compareScenarios: boolean;
  onUpdate: (patch: Partial<FinanceInputParams>) => void;
  onToggleCompare: (value: boolean) => void;
  onReset: () => void;
  onSave: (name: string) => void;
};

const presetMap: Record<string, Partial<FinanceInputParams>> = {
  conservative: { annualReturnRate: 6 },
  base: { annualReturnRate: 8 },
  optimistic: { annualReturnRate: 10 },
  aggressive: { annualReturnRate: 12, monthlyContribution: 800, years: 20 },
  careerBreak: {
    annualReturnRate: 6,
    monthlyContribution: 300,
    years: 18,
    shockYear: 4,
    shockPercent: -25,
  },
};
const sensitivityRates = [-2, -1, 0, 1, 2];
const sensitivityContributions = [-200, -100, 0, 100, 200];

export const FinanceSimulator = ({
  input,
  compareScenarios,
  onUpdate,
  onToggleCompare,
  onReset,
  onSave,
}: Props) => {
  const [saveName, setSaveName] = useState("");
  const [preset, setPreset] = useState<string>("base");
  const [customPresetName, setCustomPresetName] = useState("");
  const [customPresets, setCustomPresets] = useState<
    NamedPreset<FinanceInputParams>[]
  >(() => loadFinancePresets());
  const [candidateEnabled, setCandidateEnabled] = useState(false);
  const [candidateInput, setCandidateInput] =
    useState<FinanceInputParams>(input);
  const result = useMemo(() => simulateFinance(input), [input]);

  useEffect(() => {
    saveFinancePresets(customPresets);
  }, [customPresets]);
  const candidateResult = useMemo(
    () => simulateFinance(candidateInput),
    [candidateInput],
  );
  const monteCarlo = useMemo(
    () =>
      input.monteCarloEnabled
        ? simulateFinanceMonteCarlo(input, input.targetFinalValue)
        : null,
    [input],
  );

  const chartData = useMemo(() => {
    const base = result.base.timeline;
    return base.map((point, index) => ({
      label: point.label,
      base: point.metrics.value,
      contributed: point.metrics.contributed,
      growth: point.metrics.growth,
      conservative:
        result.conservative.timeline[index]?.metrics.value ??
        point.metrics.value,
      optimistic:
        result.optimistic.timeline[index]?.metrics.value ?? point.metrics.value,
      real: point.metrics.realValue,
      mcP10: monteCarlo?.timeline[index]?.p10,
      mcP50: monteCarlo?.timeline[index]?.p50,
      mcP90: monteCarlo?.timeline[index]?.p90,
    }));
  }, [result, monteCarlo]);

  const defaults = getFinanceDefaults();
  const changedFields = Object.entries(input)
    .filter(
      ([key, value]) => defaults[key as keyof FinanceInputParams] !== value,
    )
    .map(([key]) => key);
  const targetGap = result.base.summary.finalValue - input.targetFinalValue;
  const targetEtaPoint = result.base.timeline.find(
    (point) => point.metrics.value >= input.targetFinalValue,
  );
  const targetEtaYears = targetEtaPoint ? targetEtaPoint.t / 12 : null;
  const milestone25 = result.base.timeline.find(
    (point) => point.metrics.value >= input.targetFinalValue * 0.25,
  );
  const milestone50 = result.base.timeline.find(
    (point) => point.metrics.value >= input.targetFinalValue * 0.5,
  );
  const milestone75 = result.base.timeline.find(
    (point) => point.metrics.value >= input.targetFinalValue * 0.75,
  );
  const riskProbability = monteCarlo
    ? monteCarlo.successProbability
    : targetGap >= 0
      ? 1
      : 0;
  const candidateDelta =
    candidateResult.base.summary.finalValue - result.base.summary.finalValue;
  const heatmap = useMemo(
    () =>
      sensitivityRates.map((rateShift) =>
        sensitivityContributions.map((contributionShift) => {
          const shifted = {
            ...input,
            annualReturnRate: Math.min(
              30,
              Math.max(0, input.annualReturnRate + rateShift),
            ),
            monthlyContribution: Math.max(
              0,
              input.monthlyContribution + contributionShift,
            ),
          };
          return simulateFinance(shifted).base.summary.finalValue;
        }),
      ),
    [input],
  );
  const allHeatValues = heatmap.flat();
  const heatMin = Math.min(...allHeatValues);
  const heatMax = Math.max(...allHeatValues);

  // Adjusted for new color theme (blue to purple) - more vibrant
  const heatColor = (value: number): string => {
    const normalized =
      heatMax > heatMin ? (value - heatMin) / (heatMax - heatMin) : 0.5;
    // Map to HSL: From 220 (Blue) to 260 (Purple)
    const hue = 220 + normalized * 40;
    // Increasing lightness for better contrast in dark mode, but keeping saturation high
    return `hsl(${hue}, ${70 + normalized * 20}%, ${20 + normalized * 40}%)`;
  };

  return (
    <section className="space-y-6">
      <Card className="bg-gradient-to-r from-surface to-surface-glass border-primary/10">
        <h2 className="text-xl font-bold font-space text-text">
          Savings & Investment Growth
        </h2>
        <p className="mt-1 text-sm text-text-secondary flex items-center gap-2">
          Model monthly compounding and compare scenario outcomes.
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            <Info size={12} /> Formula: balance * (1+r) + monthly contribution
          </span>
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-6">
          <Card title="Configuration" className="space-y-5">
            <div className="space-y-4">
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

            <div className="pt-4 border-t border-border/50 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-text-tertiary">
                Presets
              </p>
              <SegmentedControl
                value={preset}
                onChange={(value) => {
                  setPreset(value);
                  onUpdate(presetMap[value] ?? {});
                }}
                options={[
                  { value: "conservative", label: "Con" }, // Shortened for better fit
                  { value: "base", label: "Base" },
                  { value: "optimistic", label: "Opt" }, // Shortened
                  { value: "aggressive", label: "Agg" }, // Shortened
                  { value: "careerBreak", label: "Brk" }, // Shortened
                ]}
              />

              <div className="rounded-xl border border-border/50 bg-bg/50 p-3 space-y-2">
                <p className="text-xs text-text-tertiary font-medium">
                  Custom preset
                </p>
                <div className="flex gap-2">
                  <input
                    className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    placeholder="Preset name"
                    value={customPresetName}
                    onChange={(event) =>
                      setCustomPresetName(event.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const name = customPresetName.trim();
                      if (!name) return;
                      setCustomPresets((prev) => [
                        {
                          name,
                          values: {
                            annualReturnRate: input.annualReturnRate,
                            monthlyContribution: input.monthlyContribution,
                            years: input.years,
                            shockYear: input.shockYear,
                            shockPercent: input.shockPercent,
                          },
                        },
                        ...prev,
                      ]);
                      setCustomPresetName("");
                    }}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary/90 transition-colors"
                  >
                    Save
                  </button>
                </div>
                {customPresets.length > 0 && (
                  <select
                    className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary font-medium"
                    defaultValue=""
                    onChange={(event) => {
                      const selected = customPresets.find(
                        (item) => item.name === event.target.value,
                      );
                      if (selected) onUpdate(selected.values);
                    }}
                  >
                    <option value="" disabled>
                      Load custom preset
                    </option>
                    {customPresets.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 space-y-3">
              <Toggle
                label="Show inflation-adjusted"
                checked={input.showInflationAdjusted}
                onChange={(checked) =>
                  onUpdate({ showInflationAdjusted: checked })
                }
              />
              <Toggle
                label="Compare scenarios"
                checked={compareScenarios}
                onChange={onToggleCompare}
              />
            </div>
          </Card>

          <Card title="Timeline Events" className="space-y-4">
            <NumberStepper
              label="Contribution step year"
              value={input.contributionStepYear}
              onChange={(value) => onUpdate({ contributionStepYear: value })}
              min={0}
              max={input.years}
            />
            <SliderField
              label="Contribution step %"
              value={input.contributionStepPercent}
              onChange={(value) => onUpdate({ contributionStepPercent: value })}
              min={-50}
              max={100}
              step={1}
              suffix="%"
            />
            <NumberStepper
              label="Shock year"
              value={input.shockYear}
              onChange={(value) => onUpdate({ shockYear: value })}
              min={0}
              max={input.years}
            />
            <SliderField
              label="Shock %"
              value={input.shockPercent}
              onChange={(value) => onUpdate({ shockPercent: value })}
              min={-70}
              max={40}
              step={1}
              suffix="%"
            />
            <NumberStepper
              label="Return shift year"
              value={input.returnShiftYear}
              onChange={(value) => onUpdate({ returnShiftYear: value })}
              min={0}
              max={input.years}
            />
            <SliderField
              label="Return shift %"
              value={input.returnShiftPercent}
              onChange={(value) => onUpdate({ returnShiftPercent: value })}
              min={-10}
              max={10}
              step={0.5}
              suffix="%"
            />
          </Card>

          <Card className="space-y-4">
            <Toggle
              label="Compare current vs candidate"
              checked={candidateEnabled}
              onChange={setCandidateEnabled}
            />
            {candidateEnabled && (
              <div className="animate-fade-in space-y-4 pt-2">
                <NumberStepper
                  label="Candidate contribution"
                  value={candidateInput.monthlyContribution}
                  onChange={(value) =>
                    setCandidateInput((prev) => ({
                      ...prev,
                      monthlyContribution: value,
                    }))
                  }
                  min={0}
                  step={50}
                />
                <SliderField
                  label="Candidate return"
                  value={candidateInput.annualReturnRate}
                  onChange={(value) =>
                    setCandidateInput((prev) => ({
                      ...prev,
                      annualReturnRate: value,
                    }))
                  }
                  min={0}
                  max={30}
                  step={0.5}
                  suffix="%"
                />
                <NumberStepper
                  label="Candidate years"
                  value={candidateInput.years}
                  onChange={(value) =>
                    setCandidateInput((prev) => ({ ...prev, years: value }))
                  }
                  min={1}
                  max={50}
                />
                <button
                  type="button"
                  onClick={() => setCandidateInput(input)}
                  className="w-full rounded-xl border border-border bg-bg/50 px-3 py-2 text-xs font-medium text-text-secondary hover:bg-bg hover:text-text transition-colors"
                >
                  Use current as candidate
                </button>
              </div>
            )}
          </Card>

          <Card className="space-y-4">
            <Toggle
              label="Monte Carlo mode"
              checked={input.monteCarloEnabled}
              onChange={(checked) => onUpdate({ monteCarloEnabled: checked })}
            />
            {input.monteCarloEnabled && (
              <div className="animate-fade-in space-y-4 pt-2">
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
                  onChange={(value) =>
                    onUpdate({ monteCarloVolatility: value })
                  }
                  min={1}
                  max={40}
                  step={1}
                  suffix="%"
                />
              </div>
            )}
          </Card>

          <Card className="space-y-4">
            <label className="block text-sm font-medium text-text-secondary">
              Save current view
              <input
                className="mt-2 w-full rounded-xl border border-border bg-bg/50 px-3 py-2 text-text focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="e.g. Retirement Plan"
                value={saveName}
                onChange={(event) => setSaveName(event.target.value)}
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSave(saveName)}
                className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Save size={14} /> Save
              </button>
              <button
                type="button"
                onClick={onReset}
                className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg hover:text-text transition-colors"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            <p className="text-xs text-text-tertiary text-center pt-2">
              {changedFields.length === 0
                ? "Using defaults"
                : `Changed: ${changedFields.length} fields`}
            </p>
          </Card>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              label="Final value"
              value={currency(result.base.summary.finalValue)}
            />
            <SummaryCard
              label="Final real value"
              value={
                input.showInflationAdjusted
                  ? currency(result.base.summary.finalRealValue)
                  : "Hidden"
              }
            />
            <SummaryCard
              label="Total contributed"
              value={currency(result.base.summary.totalContributed)}
            />
            <SummaryCard
              label="Total growth"
              value={currency(result.base.summary.totalGrowth)}
              tone={
                result.base.summary.totalGrowth >= 0 ? "positive" : "negative"
              }
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {input.monteCarloEnabled && monteCarlo && (
              <Card className="border-l-4 border-l-accent">
                <p className="inline-flex items-center gap-2 font-bold text-text mb-2">
                  <Sigma size={16} className="text-accent" /> Monte Carlo
                  insights
                </p>
                <div className="space-y-1 text-sm text-text-secondary">
                  <div className="flex justify-between">
                    <span>Median final value:</span>
                    <span className="font-semibold text-text">
                      {currency(monteCarlo.finalMedian)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prob. hitting target:</span>
                    <span className="font-semibold text-accent">
                      {percent(monteCarlo.successProbability)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            <Card
              className={`border-l-4 ${
                riskProbability >= 0.7
                  ? "border-l-success bg-success/5"
                  : riskProbability >= 0.4
                    ? "border-l-warning bg-warning/5"
                    : "border-l-destructive bg-destructive/5"
              }`}
            >
              <p className="font-bold text-text mb-2">Target status</p>
              <div className="space-y-1 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>Gap to target:</span>
                  <span className="font-semibold text-text">
                    {currency(targetGap)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ETA to target:</span>
                  <span className="font-semibold text-text">
                    {targetEtaYears
                      ? `${targetEtaYears.toFixed(1)} years`
                      : "Not reached"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-semibold text-text">
                    {percent(riskProbability)}
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Milestones">
              <div className="space-y-1 text-sm text-text-secondary">
                <div className="flex justify-between">
                  <span>25% target:</span>
                  <span className="font-medium text-text">
                    {milestone25
                      ? `${(milestone25.t / 12).toFixed(1)} yr`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>50% target:</span>
                  <span className="font-medium text-text">
                    {milestone50
                      ? `${(milestone50.t / 12).toFixed(1)} yr`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>75% target:</span>
                  <span className="font-medium text-text">
                    {milestone75
                      ? `${(milestone75.t / 12).toFixed(1)} yr`
                      : "-"}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-text-tertiary">
                Events: shift Y{input.contributionStepYear}, shock Y
                {input.shockYear}, return Y{input.returnShiftYear}
              </p>
            </Card>

            {candidateEnabled && (
              <Card title="Current vs Candidate">
                <div className="space-y-2 text-sm text-text-secondary">
                  <div className="flex justify-between items-center">
                    <span>Final Delta</span>
                    <span
                      className={`font-bold ${candidateDelta >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {candidateDelta > 0 ? "+" : ""}
                      {currency(candidateDelta)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="rounded bg-bg p-2">
                      <span className="block text-text-tertiary">Current</span>
                      <span className="font-semibold text-text">
                        {currency(result.base.summary.finalValue)}
                      </span>
                    </div>
                    <div className="rounded bg-bg p-2">
                      <span className="block text-text-tertiary">
                        Candidate
                      </span>
                      <span className="font-semibold text-text">
                        {currency(candidateResult.base.summary.finalValue)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <Card className="min-h-[380px]">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text">Portfolio Value</h3>
                <p className="text-sm text-text-tertiary">
                  Growth over time across scenarios
                </p>
              </div>
            </header>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsla(var(--border) / 0.5)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "hsla(var(--text-secondary))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                  tick={{ fill: "hsla(var(--text-secondary))", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsla(var(--surface-glass))",
                    borderColor: "hsla(var(--border))",
                    borderRadius: "12px",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => currency(Number(value ?? 0))}
                />
                <Legend iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="base"
                  stroke={scenarioColor.base}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                {compareScenarios && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="conservative"
                      stroke={scenarioColor.conservative}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="optimistic"
                      stroke={scenarioColor.optimistic}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </>
                )}
                {input.showInflationAdjusted && (
                  <Line
                    type="monotone"
                    dataKey="real"
                    stroke="#c084fc"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {input.monteCarloEnabled && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="mcP10"
                      stroke="#f43f5e"
                      strokeWidth={1}
                      strokeOpacity={0.6}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="mcP50"
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="mcP90"
                      stroke="#10b981"
                      strokeWidth={1}
                      strokeOpacity={0.6}
                      dot={false}
                    />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Contributed vs Growth" className="min-h-[300px]">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorContributed"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorGrowth"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsla(var(--border) / 0.5)"
                    vertical={false}
                  />
                  <XAxis dataKey="label" hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsla(var(--surface-glass))",
                      borderColor: "hsla(var(--border))",
                      backdropFilter: "blur(12px)",
                      borderRadius: "12px",
                    }}
                    formatter={(value) => currency(Number(value ?? 0))}
                  />
                  <Area
                    type="monotone"
                    dataKey="contributed"
                    stackId="1"
                    stroke="#0ea5e9"
                    fill="url(#colorContributed)"
                  />
                  <Area
                    type="monotone"
                    dataKey="growth"
                    stackId="1"
                    stroke="#22d3ee"
                    fill="url(#colorGrowth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card
              title="Sensitivity Heatmap"
              subtitle="Return rate vs Contribution"
            >
              <div className="grid grid-cols-5 gap-1.5 h-[240px]">
                {heatmap.map((row, rowIndex) =>
                  row.map((cell, cellIndex) => (
                    <div
                      key={`${sensitivityRates[rowIndex]}-${sensitivityContributions[cellIndex]}`}
                      className="rounded-md flex flex-col items-center justify-center text-[10px] text-white/90 transition-transform hover:scale-105"
                      style={{ background: heatColor(cell) }}
                      title={`Return ${sensitivityRates[rowIndex] > 0 ? "+" : ""}${sensitivityRates[rowIndex]}%, Contribution ${sensitivityContributions[cellIndex] > 0 ? "+" : ""}${sensitivityContributions[cellIndex]} => ${currency(cell)}`}
                    >
                      <span className="font-bold opacity-60">
                        {sensitivityRates[rowIndex] > 0 ? "+" : ""}
                        {sensitivityRates[rowIndex]}%
                      </span>
                      <span className="opacity-60">
                        {sensitivityContributions[cellIndex] > 0 ? "+" : ""}
                        {sensitivityContributions[cellIndex]}
                      </span>
                    </div>
                  )),
                )}
              </div>
            </Card>
          </div>

          {compareScenarios ? (
            <ScenarioCards
              data={result}
              metricLabel="Final value"
              metricKey="finalValue"
              format={(value) => currency(value)}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};
