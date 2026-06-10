type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-emerald-950/10">
      <div className="h-full rounded-full bg-emerald-700 shadow-sm" style={{ width: `${normalized}%` }} />
    </div>
  );
}
