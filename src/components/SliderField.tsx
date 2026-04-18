type Props = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
};

export const SliderField = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = "",
}: Props) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <label className="block space-y-3 group cursor-pointer">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary transition-colors group-hover:text-text">
          {label}
        </span>
        <span className="font-space font-semibold text-sm tabular-nums text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg transition-colors group-hover:bg-primary/15">
          {value}{suffix}
        </span>
      </div>

      <div className="relative h-7 flex items-center">
        {/* Track background */}
        <div className="absolute w-full h-[5px] rounded-full overflow-hidden bg-border/60">
          {/* Filled portion */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Hidden native input for interaction */}
        <input
          type="range"
          className="absolute w-full h-full opacity-0 cursor-pointer"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
        />

        {/* Custom thumb */}
        <div
          className="absolute h-[18px] w-[18px] rounded-full bg-white border-2 border-primary shadow-md pointer-events-none transition-all duration-100 ease-out group-hover:scale-110 group-hover:shadow-glow group-active:scale-95"
          style={{ left: `calc(${percentage}% - 9px)` }}
        />
      </div>
    </label>
  );
};
