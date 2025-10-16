import { X, AlertCircle, RotateCcw, Check } from 'lucide-react';
import { Button } from './ui/button';

interface UploadErrorProps {
  onClose: () => void;
  onStateChange: (state: 'modal' | 'permissions' | 'uploading' | 'error' | 'success') => void;
  selectedItems: any[];
  failedItems?: any[];
  completedItems?: any[];
}

export function UploadError({ 
  onClose, 
  onStateChange, 
  selectedItems, 
  failedItems = [],
  completedItems = []
}: UploadErrorProps) {
  // Mock data for demonstration if not provided
  const mockFailedItems = failedItems.length > 0 ? failedItems : [
    {
      id: 'photo-1',
      name: 'Receipt 1.jpg',
      error: 'Network error',
      canRetry: true
    },
    {
      id: 'file-2', 
      name: 'Invoice_Template.pdf',
      error: 'Unsupported type',
      canRetry: false
    }
  ];

  const mockCompletedItems = completedItems.length > 0 ? completedItems : [
    {
      id: 'photo-2',
      name: 'Receipt 2.png'
    },
    {
      id: 'photo-3',
      name: 'Business Card.jpg'
    }
  ];

  const retryableItems = mockFailedItems.filter(item => item.canRetry);
  const hasRetryableItems = retryableItems.length > 0;
  const hasCompletedItems = mockCompletedItems.length > 0;

  const handleRetryFailed = () => {
    // Retry only the failed items
    onStateChange('uploading');
  };

  const handleSkipFailed = () => {
    // Skip failed and proceed to success if there are completed items
    if (hasCompletedItems) {
      onStateChange('success');
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
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
              PARTIAL IMPORT
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 bg-transparent text-[#6B6B6B] hover:bg-[#F2F2F7] rounded-full transition-all duration-150"
            >
              <X className="w-5 h-5 stroke-2" />
            </Button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-6">
          {/* Failed items section */}
          {mockFailedItems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-[#FF3B30] rounded-full flex items-center justify-center">
                  <AlertCircle className="w-3 h-3 text-white stroke-2" />
                </div>
                <h3 className="font-bold text-[#1A1A1A] text-sm tracking-[0.1em] uppercase">
                  FAILED ({mockFailedItems.length})
                </h3>
              </div>
              
              <div className="space-y-2">
                {mockFailedItems.map((item) => (
                  <div key={item.id} className="p-3 bg-[#F9F9F9] rounded-xl">
                    <div className="flex items-center gap-3">
                      {/* Error icon */}
                      <div className="w-6 h-6 bg-[#FF3B30] rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-white stroke-2" />
                      </div>

                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#1A1A1A] text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-[#FF3B30] text-xs">
                          {item.error}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed items section */}
          {hasCompletedItems && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-[#34C759] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white stroke-2" />
                </div>
                <h3 className="font-bold text-[#1A1A1A] text-sm tracking-[0.1em] uppercase">
                  COMPLETED ({mockCompletedItems.length})
                </h3>
              </div>
              
              <div className="space-y-2">
                {mockCompletedItems.map((item) => (
                  <div key={item.id} className="p-3 bg-[#F9F9F9] rounded-xl">
                    <div className="flex items-center gap-3">
                      {/* Success icon */}
                      <div className="w-6 h-6 bg-[#34C759] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white stroke-2" />
                      </div>

                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[#1A1A1A] text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-[#34C759] text-xs">
                          Imported successfully
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="flex-shrink-0 p-4 border-t border-[#E5E5EA] bg-white">
          <div className="flex gap-3">
            {hasRetryableItems && (
              <Button
                onClick={handleRetryFailed}
                className="flex-1 h-12 bg-[#E85C3C] hover:bg-[#D54B2A] active:bg-[#C24B2A] text-white font-semibold rounded-xl transition-all duration-150"
              >
                Retry failed
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleSkipFailed}
              className={`${hasRetryableItems ? 'flex-1' : 'w-full'} h-12 bg-white border border-[#E5E5EA] text-[#1A1A1A] hover:bg-[#F9F9F9] hover:border-[#E85C3C] active:bg-[#F2F2F7] rounded-xl font-medium transition-all duration-150`}
            >
              Skip failed
            </Button>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="w-full h-10 mt-2 text-[#6B6B6B] font-medium bg-transparent hover:bg-[#F2F2F7] active:bg-[#E5E5EA] rounded-xl transition-all duration-150"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}