import { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface UploadUploadingProps {
  onClose: () => void;
  onStateChange: (state: 'modal' | 'permissions' | 'uploading' | 'error' | 'success') => void;
  selectedItems: any[];
  onNavigate: (screen: string) => void;
  onUploadComplete: (uploadedItems: any[]) => void;
}

interface UploadProgress {
  id: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export function UploadUploading({ onClose, onStateChange, selectedItems, onNavigate, onUploadComplete }: UploadUploadingProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    // Initialize progress for all selected items
    const initialProgress = selectedItems.map(item => ({
      id: item.id,
      progress: 0,
      status: 'uploading' as const
    }));
    setUploadProgress(initialProgress);

    // Simulate upload progress
    const intervals = selectedItems.map((item, index) => {
      return setInterval(() => {
        setUploadProgress(prev => {
          const updated = prev.map(p => {
            if (p.id === item.id && p.status === 'uploading') {
              const newProgress = Math.min(p.progress + Math.random() * 20 + 5, 100);
              return {
                ...p,
                progress: newProgress,
                status: newProgress >= 100 ? 'complete' : 'uploading'
              };
            }
            return p;
          });

          // Calculate overall progress
          const totalProgress = updated.reduce((sum, p) => sum + p.progress, 0);
          const avgProgress = totalProgress / updated.length;
          setOverallProgress(avgProgress);

          // Check if all complete
          const allComplete = updated.every(p => p.status === 'complete');
          if (allComplete) {
            // Transition to success state
            setTimeout(() => {
              onStateChange('success');
            }, 500);
            // Notify upload completion
            onUploadComplete(selectedItems);
          }

          return updated;
        });
      }, 150 + index * 100); // Stagger the start times
    });

    // Cleanup intervals
    return () => {
      intervals.forEach(clearInterval);
    };
  }, [selectedItems, onStateChange, onUploadComplete]);

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
      />
      
      {/* Modal container - 80% height bottom sheet */}
      <div className="relative w-full max-w-md h-[80%] bg-white rounded-t-xl flex flex-col animate-in slide-in-from-bottom duration-250 ease-out">
        {/* Top drag handle and header */}
        <div className="flex-shrink-0 px-4 pt-3 pb-4">
          {/* Drag handle */}
          <div className="w-12 h-1 bg-[#E5E5EA] rounded-full mx-auto mb-4"></div>
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#1A1A1A] text-xl tracking-[0.1em] uppercase">
              UPLOADING
            </h2>
          </div>
        </div>

        {/* Progress section */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          {/* Individual file progress */}
          <div className="space-y-3">
            {uploadProgress.map((item) => {
              const fileData = selectedItems.find(f => f.id === item.id);
              if (!fileData) return null;

              return (
                <div key={item.id} className="p-3 bg-[#F9F9F9] rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Status icon */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.status === 'complete' 
                        ? 'bg-[#34C759]' 
                        : item.status === 'error'
                        ? 'bg-[#FF3B30]'
                        : 'bg-[#F2F2F7]'
                    }`}>
                      {item.status === 'complete' ? (
                        <Check className="w-4 h-4 text-white stroke-2" />
                      ) : item.status === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-white stroke-2" />
                      ) : (
                        <div className="w-3 h-3 bg-[#E85C3C] rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* File info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#1A1A1A] text-sm truncate">
                        {fileData.name}
                      </h3>
                      <p className="text-[#6B6B6B] text-xs">
                        {item.status === 'complete' ? 'Complete' : 
                         item.status === 'error' ? 'Failed' :
                         `Uploading… ${Math.round(item.progress)}%`}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar for individual files */}
                  {item.status === 'uploading' && (
                    <div className="w-full bg-[#E5E5EA] rounded-full h-0.5">
                      <div 
                        className="bg-[#E85C3C] h-0.5 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Keep app open message */}
          <div className="mt-6 p-3 bg-[#F2F2F7] rounded-xl">
            <p className="text-[#6B6B6B] text-sm text-center font-medium">
              Keep the app open while uploading.
            </p>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex-shrink-0 p-4 border-t border-[#E5E5EA] bg-white">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="w-full h-12 text-[#6B6B6B] font-medium bg-transparent hover:bg-[#F2F2F7] active:bg-[#E5E5EA] rounded-xl transition-all duration-150"
          >
            Cancel all
          </Button>
        </div>
      </div>
    </div>
  );
}