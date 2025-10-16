import { useState, useCallback } from 'react';
import { ToastBottom } from './ToastBottom';

export interface Toast {
  id: string;
  variant: 'success' | 'error' | 'info';
  message: string;
  duration?: 2000 | 3000;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastManagerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastManager({ toasts, onDismiss }: ToastManagerProps) {
  // Only show the latest toast
  const currentToast = toasts[toasts.length - 1];

  if (!currentToast) return null;

  return (
    <ToastBottom
      {...currentToast}
      visible={true}
      onDismiss={() => onDismiss(currentToast.id)}
    />
  );
}

// Hook for managing toasts
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, duration?: 2000 | 3000) => {
    addToast({ variant: 'success', message, duration });
  }, [addToast]);

  const showError = useCallback((message: string, actionLabel?: string, onAction?: () => void, duration?: 3000) => {
    addToast({ variant: 'error', message, duration, actionLabel, onAction });
  }, [addToast]);

  const showInfo = useCallback((message: string, duration?: 2000 | 3000) => {
    addToast({ variant: 'info', message, duration });
  }, [addToast]);

  return {
    toasts,
    dismissToast,
    showSuccess,
    showError,
    showInfo
  };
}