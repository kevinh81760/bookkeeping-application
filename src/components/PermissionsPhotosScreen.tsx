import { Image } from 'lucide-react';
import { Button } from './ui/button';

interface PermissionsPhotosScreenProps {
  onAllow: () => void;
  onNotNow: () => void;
}

export function PermissionsPhotosScreen({ onAllow, onNotNow }: PermissionsPhotosScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[320px] text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-[#E85C3C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Image className="w-8 h-8 text-[#E85C3C]" />
        </div>

        {/* Title */}
        <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-3 tracking-[0.1em] uppercase">
          Allow Photo Access
        </h2>

        {/* Body */}
        <p className="text-[16px] font-medium text-[#6B7280] mb-8 leading-[1.4]">
          We need photo access to import receipts from your library.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onAllow}
            className="w-full h-11 bg-[#E85C3C] hover:bg-[#d54a2a] text-white text-[16px] font-medium rounded-xl"
          >
            Allow
          </Button>
          
          <Button
            variant="ghost"
            onClick={onNotNow}
            className="w-full h-11 text-[#6B7280] text-[16px] font-medium rounded-xl hover:bg-[#F2F2F7]"
          >
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}