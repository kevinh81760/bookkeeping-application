import { useState, useEffect } from 'react';

interface InlineProgressProps {
  progress: number; // 0-100
  caption?: string;
  isVisible?: boolean;
  className?: string;
}

export function InlineProgress({ 
  progress, 
  caption,
  isVisible = true,
  className = '' 
}: InlineProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Smooth animation to target progress
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(0);
    }
  }, [progress, isVisible]);

  if (!isVisible) {
    return null;
  }

  const defaultCaption = progress < 100 ? `Extracting ${Math.round(progress)}%` : 'Complete';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* iOS-style thin progress bar */}
      <div className="flex-1 bg-[#E5E5EA] rounded-full h-0.5 overflow-hidden">
        <div 
          className="h-full bg-[#E85C3C] rounded-full transition-all duration-300 ease-out"
          style={{ 
            width: `${displayProgress}%`,
            transform: `translateX(${displayProgress === 0 ? '-100%' : '0%'})` 
          }}
        />
      </div>
      
      {/* Progress caption */}
      <span className="text-xs font-medium text-[#6B6B6B] tracking-[0.02em] min-w-0 flex-shrink-0">
        {caption || defaultCaption}
      </span>
    </div>
  );
}