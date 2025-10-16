import { SkeletonBlock } from './SkeletonBlock';

interface SkeletonRowProps {
  reduceMotion?: boolean;
}

export function SkeletonRow({ reduceMotion = false }: SkeletonRowProps) {
  return (
    <div className="flex items-center px-5 py-4 h-16 bg-white">
      <SkeletonBlock 
        variant="thumb" 
        reduceMotion={reduceMotion}
        className="w-8 h-8 mr-3 flex-shrink-0"
      />
      <div className="flex-1 space-y-2">
        <SkeletonBlock variant="md" reduceMotion={reduceMotion} />
        <SkeletonBlock variant="sm" reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}