import { Check } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface UploadSuccessProps {
  onClose: () => void;
  onNavigate: (screen: string) => void;
  importedCount: number;
}

export function UploadSuccess({ onClose, onNavigate, importedCount }: UploadSuccessProps) {
  const handleDone = () => {
    onClose();
    onNavigate('files');
    
    // Show success toast with completion info
    setTimeout(() => {
      toast.success(`Imported ${importedCount} items`, {
        description: 'Files are ready to process',
        duration: 3000,
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={handleDone}
      />
      
      {/* Modal container - 80% height bottom sheet */}
      <div className="relative w-full max-w-md h-[80%] bg-white rounded-t-xl flex flex-col animate-in slide-in-from-bottom duration-250 ease-out">
        {/* Top drag handle */}
        <div className="flex-shrink-0 pt-3 pb-8">
          <div className="w-12 h-1 bg-[#E5E5EA] rounded-full mx-auto"></div>
        </div>

        {/* Success content - centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          {/* Success icon */}
          <div className="w-16 h-16 bg-[#34C759] rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-white stroke-2" />
          </div>

          {/* Success message */}
          <h2 className="font-bold text-[#1A1A1A] text-xl tracking-[0.05em] mb-2">
            Imported {importedCount} item{importedCount !== 1 ? 's' : ''}
          </h2>
          
          <p className="text-[#6B6B6B] font-medium text-base leading-relaxed">
            Your files have been successfully imported and are ready to process.
          </p>
        </div>

        {/* Bottom action */}
        <div className="flex-shrink-0 p-4">
          <Button
            onClick={handleDone}
            className="w-full h-12 bg-[#E85C3C] hover:bg-[#D54B2A] active:bg-[#C24B2A] text-white font-semibold rounded-xl transition-all duration-150"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}