import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastBottomProps {
  message: string;
  variant?: 'success' | 'error' | 'info';
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
  duration?: number;
}

export function ToastBottom({
  message,
  variant = 'success',
  actionLabel,
  onAction,
  onClose,
  duration = 4000,
}: ToastBottomProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setIsVisible(true), 50);
    
    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 200);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration, onClose]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-[#34C759]" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-[#FF3B30]" />;
      case 'info':
        return <Info className="w-4 h-4 text-[#E85C3C]" />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-end justify-center px-4 pb-8">
      <div
        className={`
          flex items-center gap-3 bg-white bg-opacity-92 backdrop-blur-sm
          rounded-full px-4 py-3 shadow-lg border border-white border-opacity-20
          transform transition-all duration-200 ease-out pointer-events-auto
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Icon */}
        {getIcon()}
        
        {/* Message */}
        <span className="text-[16px] font-medium text-[#1A1A1A] leading-[20px]">
          {message}
        </span>
        
        {/* Action Button */}
        {actionLabel && onAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="text-[16px] font-medium text-[#E85C3C] leading-[20px] ml-2"
          >
            {actionLabel}
          </button>
        )}
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="ml-1 p-1 rounded-full hover:bg-black hover:bg-opacity-5 transition-colors"
        >
          <X className="w-4 h-4 text-[#6B6B6B]" />
        </button>
      </div>
    </div>
  );
}

// Success preset as requested
export function SuccessToast({
  onMove,
  onClose,
  itemCount = 1,
  folderName = 'January',
}: {
  onMove?: () => void;
  onClose: () => void;
  itemCount?: number;
  folderName?: string;
}) {
  return (
    <ToastBottom
      message={`Saved to ${folderName} • ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
      variant="success"
      actionLabel="Move"
      onAction={onMove}
      onClose={onClose}
      duration={3000}
    />
  );
}