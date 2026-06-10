type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className="h-3 overflow-hidden rounded-full border-2 border-[#2f4f4f] bg-white">
      <div className="h-full rounded-full bg-[#ffd700]" style={{ width: `${normalized}%` }} />
    </div>
  );
}
