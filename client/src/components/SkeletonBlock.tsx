import { useState, useEffect } from 'react';

interface SkeletonBlockProps {
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'thumb' | 'card';
  reduceMotion?: boolean;
  className?: string;
}

export function SkeletonBlock({ variant = 'md', reduceMotion = false, className = '' }: SkeletonBlockProps) {
  const [shimmerPosition, setShimmerPosition] = useState(-100);

  useEffect(() => {
    if (reduceMotion) return;

    const animate = () => {
      setShimmerPosition(100);
      setTimeout(() => setShimmerPosition(-100), 900);
    };

    animate();
    const interval = setInterval(animate, 1800);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'xs':
        return 'w-3 h-3';
      case 'sm':
        return 'w-20 h-3';
      case 'md':
        return 'w-35 h-3';
      case 'lg':
        return 'w-55 h-3';
      case 'thumb':
        return 'w-14 h-14 rounded-lg';
      case 'card':
        return 'w-[156px] h-[164px] rounded-xl';
      default:
        return 'w-35 h-3';
    }
  };

  const baseStyles = variant === 'thumb' || variant === 'card' 
    ? 'rounded-lg' 
    : 'rounded-lg';

  return (
    <div 
      className={`${getVariantStyles()} ${baseStyles} bg-[#E5E5EA] relative overflow-hidden ${className}`}
    >
      {!reduceMotion && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F2F2F7] to-transparent w-full h-full"
          style={{
            transform: `translateX(${shimmerPosition}%)`,
            transition: shimmerPosition === 100 ? 'transform 900ms ease-in-out' : 'none'
          }}
        />
      )}
    </div>
  );
}