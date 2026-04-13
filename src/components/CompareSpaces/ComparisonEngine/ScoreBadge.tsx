interface ScoreBadgeProps {
  score: number;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const getColors = (s: number) => {
    if (s >= 90) return "text-emerald-600 bg-emerald-50";
    if (s >= 75) return "text-primary bg-primary/5";
    if (s >= 60) return "text-amber-600 bg-amber-50";
    return "text-rose-600 bg-rose-50";
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${getColors(score)}`}>
      Score {score}
    </span>
  );
}
