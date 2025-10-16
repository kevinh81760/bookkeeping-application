import React from 'react';

export interface ProgressRingProps {
  progress: number; // 0-100
  size?: 16 | 24;
  showLabel?: boolean;
  className?: string;
}

export function ProgressRing({ 
  progress, 
  size = 24, 
  showLabel = false,
  className = '' 
}: ProgressRingProps) {
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  
  // Calculate circle properties
  const radius = size === 16 ? 6 : 9;
  const strokeWidth = size === 16 ? 1.5 : 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E5E5EA"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E85C3C"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      
      {/* Optional percentage label */}
      {showLabel && size === 24 && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-[#1A1A1A] leading-none">
          {Math.round(normalizedProgress)}%
        </span>
      )}
    </div>
  );
}

export interface ProcessedPillProps {
  className?: string;
}

export function ProcessedPill({ className = '' }: ProcessedPillProps) {
  return (
    <div className={`inline-flex items-center px-2 py-0.5 bg-[#EAF9EF] rounded-full ${className}`}>
      <span className="text-[13px] font-medium text-[#34C759] leading-none">
        Processed
      </span>
    </div>
  );
}