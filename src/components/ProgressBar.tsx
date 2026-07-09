"use client";

type ProgressBarProps = {
  value: number;
  label?: string;
  tone?: "blue" | "green" | "red" | "amber";
};

const tones = {
  blue: "bg-civic",
  green: "bg-mint",
  red: "bg-coral",
  amber: "bg-amberline"
};

export function ProgressBar({ value, label, tone = "blue" }: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {label ? <p className="mb-2 text-sm font-semibold text-slate-600">{label}</p> : null}
      <div className="h-3 overflow-hidden rounded-full bg-slate-200" aria-label={label ?? `Fortschritt ${width} Prozent`}>
        <div className={`h-full rounded-full transition-all ${tones[tone]}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
