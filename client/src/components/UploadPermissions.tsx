import { Image, FolderOpen } from 'lucide-react';
import { Button } from './ui/button';

interface UploadPermissionsProps {
  onClose: () => void;
  onStateChange: (state: 'modal' | 'permissions' | 'uploading' | 'error') => void;
}

export function UploadPermissions({ onClose, onStateChange }: UploadPermissionsProps) {
  const handleAllowAccess = () => {
    // Simulate permission granted, return to modal
    onStateChange('modal');
  };

  const handleNotNow = () => {
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
        {/* Content centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          {/* Icons */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-[#F2F2F7] rounded-xl flex items-center justify-center">
              <Image className="w-8 h-8 text-[#6B6B6B] stroke-1" />
            </div>
            <div className="w-16 h-16 bg-[#F2F2F7] rounded-xl flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-[#6B6B6B] stroke-1" />
            </div>
          </div>

          {/* Title */}
          <h2 className="font-bold text-[#1A1A1A] text-xl mb-4 tracking-[0.1em] uppercase">
            ACCESS PHOTOS & FILES
          </h2>

          {/* Description */}
          <p className="text-[#1A1A1A] text-base font-medium leading-relaxed mb-8">
            Allow access to Photos and Files to import receipts and invoices for processing.
          </p>

          {/* Buttons */}
          <div className="w-full space-y-3">
            <Button
              onClick={handleAllowAccess}
              className="w-full h-12 bg-[#E85C3C] hover:bg-[#D54B2A] active:bg-[#C24B2A] text-white font-semibold rounded-xl transition-all duration-150"
            >
              Allow Access
            </Button>
            
            <Button
              variant="outline"
              onClick={handleNotNow}
              className="w-full h-12 bg-white border border-[#E5E5EA] text-[#6B6B6B] hover:bg-[#F9F9F9] hover:border-[#E85C3C] active:bg-[#F2F2F7] rounded-xl font-medium transition-all duration-150"
            >
              Not Now
            </Button>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}