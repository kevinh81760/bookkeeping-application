interface HapticTagProps {
  type: 'lightImpact' | 'mediumImpact' | 'heavyImpact' | 'successNotification' | 'errorNotification' | 'warningNotification';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function HapticTag({ type, position = 'top-right', className = '' }: HapticTagProps) {
  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-2 left-2';
      case 'top-right':
        return 'top-2 right-2';
      case 'bottom-left':
        return 'bottom-2 left-2';
      case 'bottom-right':
        return 'bottom-2 right-2';
      default:
        return 'top-2 right-2';
    }
  };

  return (
    <div 
      className={`absolute ${getPositionStyles()} bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium z-50 pointer-events-none ${className}`}
      style={{ fontSize: '10px' }}
    >
      HAPTIC: {type}
    </div>
  );
}