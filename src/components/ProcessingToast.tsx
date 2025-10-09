import { Check, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

export type ToastType = 'success' | 'error';

interface ProcessingToastProps {
  type: ToastType;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  isVisible: boolean;
}

export function ProcessingToast({ 
  type, 
  message, 
  onRetry, 
  onDismiss,
  isVisible 
}: ProcessingToastProps) {
  const isSuccess = type === 'success';
  const Icon = isSuccess ? Check : AlertCircle;

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 left-4 right-4 z-50 transform transition-all duration-250 ease-out ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="bg-white/90 backdrop-blur-sm border border-[#E5E5EA] rounded-xl p-4 shadow-lg mx-auto max-w-sm">
        <div className="flex items-center gap-3">
          {/* Status icon */}
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
            isSuccess ? 'bg-[#34C759]' : 'bg-[#FF3B30]'
          }`}>
            <Icon className="w-4 h-4 text-white stroke-2" />
          </div>
          
          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-[#1A1A1A] font-medium text-sm leading-tight">
              {message}
            </p>
          </div>
          
          {/* Retry button for errors */}
          {!isSuccess && onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="px-3 py-1.5 h-auto text-[#E85C3C] hover:bg-[#E85C3C]/10 font-medium text-xs tracking-[0.05em] uppercase rounded-lg"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}