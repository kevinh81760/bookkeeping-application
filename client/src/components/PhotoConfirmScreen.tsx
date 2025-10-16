import { useState } from 'react';
import { X, RotateCcw, Crop, Check } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import exampleImage from 'figma:asset/f1a33f328249be44eebc73da5e54d36d704e0259.png';

interface PhotoConfirmScreenProps {
  onNavigate: (screen: string) => void;
  onSavePhoto: (photo: any) => void;
  capturedImage?: string;
}

export function PhotoConfirmScreen({ onNavigate, onSavePhoto, capturedImage }: PhotoConfirmScreenProps) {
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  
  const imageSource = capturedImage || exampleImage;

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleCrop = () => {
    setIsCropping(!isCropping);
  };

  const handleConfirm = () => {
    // Mock saving the photo with current settings
    const photoData = {
      id: Date.now().toString(),
      image: imageSource,
      rotation,
      timestamp: new Date().toISOString(),
    };
    
    onSavePhoto(photoData);
    toast.success('Receipt saved successfully!');
    onNavigate('files-list');
  };

  const handleRetake = () => {
    onNavigate('camera');
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden">
      {/* Photo Preview */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full h-full max-w-md max-h-[70vh] bg-gray-900 rounded-2xl overflow-hidden">
          {/* Crop overlay */}
          {isCropping && (
            <div className="absolute inset-4 border-2 border-[#E85C3C] bg-[#E85C3C]/10 rounded-lg z-10">
              <div className="absolute inset-0 border border-dashed border-white/30"></div>
              {/* Corner handles */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#E85C3C]"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#E85C3C]"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#E85C3C]"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#E85C3C]"></div>
            </div>
          )}
          
          <img
            src={imageSource}
            alt="Captured receipt"
            className="w-full h-full object-cover"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease-in-out'
            }}
          />
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-12 left-4 right-4 flex justify-between items-center z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRetake}
          className="w-10 h-10 bg-black/30 backdrop-blur-sm text-white hover:text-white hover:bg-black/50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </Button>
        
        <div className="text-center">
          <p className="text-white/80 font-medium tracking-[0.1em] uppercase">
            REVIEW & CONFIRM
          </p>
        </div>
        
        <div className="w-10 h-10"></div> {/* Spacer for centering */}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-0 right-0 px-6 z-20">
        {/* Action Buttons Row */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotate}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm text-white hover:text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCrop}
            className={`w-12 h-12 backdrop-blur-sm rounded-xl transition-colors ${
              isCropping 
                ? 'bg-[#E85C3C] text-white hover:bg-[#D54B2A]' 
                : 'bg-white/10 text-white hover:text-white hover:bg-white/20'
            }`}
          >
            <Crop className="w-6 h-6" />
          </Button>
        </div>

        {/* Primary Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleRetake}
            className="text-white/70 hover:text-white hover:bg-white/10 font-medium"
          >
            Retake
          </Button>
          
          <Button
            onClick={handleConfirm}
            size="lg"
            className="bg-[#E85C3C] hover:bg-[#D54B2A] text-white px-8 py-3 rounded-xl font-medium shadow-lg"
          >
            <Check className="w-5 h-5 mr-2" />
            Save Receipt
          </Button>
          
          <div className="w-16"></div> {/* Spacer for balance */}
        </div>
      </div>
    </div>
  );
}