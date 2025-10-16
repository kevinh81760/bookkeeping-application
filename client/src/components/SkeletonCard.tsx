import { SkeletonBlock } from './SkeletonBlock';

interface SkeletonCardProps {
  reduceMotion?: boolean;
}

export function SkeletonCard({ reduceMotion = false }: SkeletonCardProps) {
  return (
    <div className="w-[156px] h-[164px] bg-white rounded-xl p-4 space-y-3">
      <SkeletonBlock 
        variant="card" 
        reduceMotion={reduceMotion}
        className="w-20 h-14 rounded-lg"
      />
      <div className="space-y-2">
        <SkeletonBlock variant="lg" reduceMotion={reduceMotion} />
        <SkeletonBlock variant="sm" reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}