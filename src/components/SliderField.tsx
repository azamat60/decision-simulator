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
    <label className="block space-y-3 group">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary transition-colors group-hover:text-text">
          {label}
        </span>
        <span className="font-mono text-sm font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-md">
          {value}
          {suffix}
        </span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 bg-secondary rounded-full overflow-hidden bg-border/50">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          className="absolute w-full h-full opacity-0 cursor-pointer"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <div
          className="absolute h-4 w-4 bg-white border-2 border-primary rounded-full shadow-md pointer-events-none transition-all duration-150 ease-out group-hover:scale-110"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </label>
  );
};
