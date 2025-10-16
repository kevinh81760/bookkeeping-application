import { Camera, Image, Zap, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { HapticTag } from "./dev/HapticTag";
import { A11yNote } from "./dev/A11yNote";

interface CameraScreenProps {
  onNavigate: (screen: string, fileId?: string) => void;
  onOpenUpload: () => void;
  onCapturePhoto: () => void;
  onOpenFolderSelection: () => void;
  showDevAnnotations?: boolean;
}

export function CameraScreen({ onNavigate, onOpenUpload, onCapturePhoto, onOpenFolderSelection, showDevAnnotations = false }: CameraScreenProps) {
  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] overflow-hidden">
      {/* Empty state - centered content */}
      <div className="absolute inset-0 flex items-center justify-center pb-32">
        <div className="text-center">
          {/* Thin outline camera icon */}
          <div className="mb-8">
            <Camera className="w-16 h-16 mx-auto text-white/40 stroke-1" />
          </div>
          {/* Uppercase Swiss label */}
          <p className="text-white/60 text-sm tracking-[0.1em] uppercase font-medium">
            SNAP A RECEIPT
          </p>
        </div>
      </div>

      {/* Top controls - minimalist line icons */}
      <div className="absolute top-12 right-4 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
        >
          <Zap className="w-5 h-5 stroke-1" />
        </Button>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-32 left-0 right-0 px-8 z-10">
        <div className="flex items-center justify-between">
          {/* Gallery button - bottom left */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenUpload}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-colors"
            >
              <Image className="w-6 h-6 stroke-1" />
            </Button>
            {showDevAnnotations && <HapticTag type="lightImpact" position="top-right" />}
          </div>

          {/* Large round shutter button with thin accent ring and soft inner highlight */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <button 
                onClick={onCapturePhoto}
                className="relative w-20 h-20 bg-white hover:bg-gray-50 active:bg-gray-100 active:scale-95 rounded-full transition-all duration-150 shadow-lg flex items-center justify-center group"
              >
                {/* Thin accent orange ring */}
                <div className="absolute inset-0 border-2 border-[#E85C3C] rounded-full group-active:border-[#D54B2A] transition-colors duration-150"></div>
                {/* Soft inner highlight with ripple effect */}
                <div className="w-16 h-16 bg-gradient-to-t from-gray-50 to-white rounded-full border border-gray-200 group-active:from-gray-100 group-active:to-gray-50 transition-all duration-150"></div>
                {/* Ripple effect overlay */}
                <div className="absolute inset-2 bg-white/30 rounded-full opacity-0 group-active:opacity-100 group-active:animate-ping transition-opacity duration-150"></div>
              </button>
              {showDevAnnotations && <HapticTag type="lightImpact" position="top-right" />}
            </div>
          </div>

          {/* Files FAB - bottom right */}
          <div className="relative">
            <Button
              onClick={onOpenFolderSelection}
              size="icon"
              className="w-12 h-12 bg-[#E85C3C] hover:bg-[#D54B2A] active:bg-[#C24B2A] text-white rounded-xl shadow-lg transition-all duration-150"
            >
              <FileText className="w-6 h-6 stroke-1" />
            </Button>
            {showDevAnnotations && <HapticTag type="lightImpact" position="top-left" />}
          </div>
        </div>
      </div>

      {/* Accessibility Notes */}
      {showDevAnnotations && (
        <>
          <A11yNote 
            type="contrast" 
            message="White/dark bg meets 4.5:1. Button states have adequate contrast."
            position="top-left"
          />
          <A11yNote 
            type="targets" 
            message="Shutter: 80×80pt (✓), Side buttons: 48×48pt (✓). All exceed 44pt minimum."
            position="bottom-right"
          />
        </>
      )}
    </div>
  );
}