interface A11yNoteProps {
  type: 'contrast' | 'targets' | 'dynamic-type' | 'focus-order' | 'general';
  message: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function A11yNote({ type, message, position = 'bottom-left', className = '' }: A11yNoteProps) {
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
        return 'bottom-2 left-2';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'contrast':
        return 'bg-blue-600';
      case 'targets':
        return 'bg-green-600';
      case 'dynamic-type':
        return 'bg-orange-600';
      case 'focus-order':
        return 'bg-indigo-600';
      case 'general':
        return 'bg-gray-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div 
      className={`absolute ${getPositionStyles()} ${getTypeColor()} text-white text-xs px-3 py-2 rounded-lg font-medium z-50 pointer-events-none max-w-[200px] ${className}`}
      style={{ fontSize: '10px', lineHeight: '1.3' }}
    >
      <div className="font-bold mb-1">A11Y: {type.toUpperCase()}</div>
      <div>{message}</div>
    </div>
  );
}