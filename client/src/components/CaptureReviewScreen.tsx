import { useState, useEffect } from 'react';
import { RotateCw, Grid3X3 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { HapticTag } from './dev/HapticTag';
import { A11yNote } from './dev/A11yNote';

interface CaptureReviewScreenProps {
  onNavigate: (screen: string) => void;
  onSavePhoto: (photoData: any) => void;
  capturedImage: string | null;
  showDevAnnotations?: boolean;
}

export function CaptureReviewScreen({ onNavigate, onSavePhoto, capturedImage, showDevAnnotations = false }: CaptureReviewScreenProps) {
  const [autoCrop, setAutoCrop] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [straightenValue, setStraightenValue] = useState([0]);
  const [aspectRatio, setAspectRatio] = useState('Receipt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Hide pinch to zoom hint after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAutoCropToggle = () => {
    setAutoCrop(!autoCrop);
    if (!autoCrop) {
      onNavigate('capture-review-autocrop-off');
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleStraighten = (value: number[]) => {
    setStraightenValue(value);
  };

  const handleAspectChange = (aspect: string) => {
    setAspectRatio(aspect);
  };

  const handleRetake = () => {
    onNavigate('camera');
  };

  const handleSave = async () => {
    setIsProcessing(true);
    
    // Show processing overlay for 600ms
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate saving photo
      onSavePhoto({
        image: capturedImage,
        autoCrop,
        straighten: straightenValue[0],
        aspectRatio,
        rotation
      });
      
      // Navigate to files and show success toast
      onNavigate('files-grid');
      toast.success('Imported 1 item');
    }, 600);
  };

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1A1A1A] relative overflow-hidden max-w-[393px] mx-auto">
      {/* Top Bar - Overlay Style with iPhone 16 Safe Area */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
        <div className="flex items-center justify-between px-5 pt-14 pb-8">
          {/* Retake Button */}
          <Button
            variant="ghost"
            onClick={handleRetake}
            className="text-white hover:bg-white/20 px-4 h-11 font-medium transition-all duration-200 backdrop-blur-sm rounded-lg"
          >
            Retake
          </Button>

          {/* Auto-crop Toggle Chip */}
          <button
            onClick={handleAutoCropToggle}
            className={`px-4 py-2 rounded-full border-2 transition-all duration-200 backdrop-blur-sm ${
              autoCrop 
                ? 'border-[#E85C3C] text-[#E85C3C] bg-[#E85C3C]/10 shadow-[0_0_0_1px_rgba(232,92,60,0.2)]' 
                : 'border-white/40 text-white/80 bg-black/20'
            }`}
          >
            <span className="text-sm font-medium tracking-wide">
              {autoCrop ? 'AUTO-CROP ON' : 'AUTO-CROP OFF'}
            </span>
          </button>

          {/* Empty space to maintain layout balance */}
          <div className="w-[60px]"></div>
        </div>
      </div>

      {/* Image Preview Area */}
      <div className="relative w-full h-full flex items-center justify-center px-8 pt-8">
        {/* Realistic Receipt Mock */}
        <div 
          className="relative bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-out"
          style={{ 
            width: '300px', 
            height: '420px',
            transform: `rotate(${rotation + straightenValue[0]}deg)`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Realistic Receipt Content */}
          <div className="p-6 bg-white h-full relative text-black" style={{ fontFamily: 'Monaco, "Courier New", monospace', fontSize: '11px', lineHeight: '1.3' }}>
            {/* Store Header */}
            <div className="text-center mb-6 border-b border-gray-300 pb-4">
              <div className="w-12 h-12 bg-[#E85C3C] rounded-lg mx-auto mb-3 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <div className="font-bold text-sm mb-1">CORNER MARKET</div>
              <div className="text-xs text-gray-600 mb-0.5">123 Main Street</div>
              <div className="text-xs text-gray-600">New York, NY 10001</div>
              <div className="text-xs text-gray-600 mt-2">Tel: (555) 123-4567</div>
            </div>

            {/* Receipt Info */}
            <div className="mb-4 text-xs">
              <div className="flex justify-between mb-1">
                <span>Date: 03/15/2024</span>
                <span>Time: 14:32</span>
              </div>
              <div>Cashier: Alex M.</div>
              <div>Register: 001</div>
            </div>

            {/* Receipt Items */}
            <div className="space-y-1 mb-6 text-xs">
              <div className="flex justify-between">
                <span>Milk 2% Gallon</span>
                <span>$4.99</span>
              </div>
              <div className="flex justify-between">
                <span>Bread Whole Wheat</span>
                <span>$3.49</span>
              </div>
              <div className="flex justify-between">
                <span>Bananas (2.1 lbs)</span>
                <span>$2.31</span>
              </div>
              <div className="flex justify-between">
                <span>Coffee Medium Roast</span>
                <span>$8.99</span>
              </div>
              <div className="flex justify-between">
                <span>Orange Juice 64oz</span>
                <span>$4.29</span>
              </div>
            </div>

            {/* Subtotal */}
            <div className="border-t border-gray-300 pt-2 mb-3 text-xs">
              <div className="flex justify-between mb-1">
                <span>Subtotal:</span>
                <span>$24.07</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Tax (8.25%):</span>
                <span>$1.99</span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-800 pt-2 mb-4">
              <div className="flex justify-between font-bold text-sm">
                <span>TOTAL:</span>
                <span>$26.06</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-4 text-xs">
              <div className="flex justify-between mb-1">
                <span>Card Payment:</span>
                <span>$26.06</span>
              </div>
              <div className="text-gray-600">**** **** **** 1234</div>
              <div className="text-gray-600">VISA CREDIT</div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-6 right-6 text-center text-xs text-gray-600">
              <div className="mb-2">Thank you for shopping!</div>
              <div className="text-xs">Receipt #: 2024-0315-001-034</div>
            </div>
          </div>

          {/* Edge Detection Overlay - Auto-crop ON */}
          {autoCrop && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Dashed polygon border with better positioning */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <polygon
                  points="15,20 285,18 288,398 12,402"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="12,6"
                  filter="url(#glow)"
                />
              </svg>
              
              {/* Corner Handles with improved styling */}
              <div className="absolute w-3 h-3 bg-white rounded-full shadow-lg border-2 border-white/50 cursor-grab hover:cursor-grabbing hover:scale-110 transition-transform" style={{ top: '18px', left: '13px' }}></div>
              <div className="absolute w-3 h-3 bg-white rounded-full shadow-lg border-2 border-white/50 cursor-grab hover:cursor-grabbing hover:scale-110 transition-transform" style={{ top: '16px', right: '13px' }}></div>
              <div className="absolute w-3 h-3 bg-white rounded-full shadow-lg border-2 border-white/50 cursor-grab hover:cursor-grabbing hover:scale-110 transition-transform" style={{ bottom: '20px', right: '10px' }}></div>
              <div className="absolute w-3 h-3 bg-white rounded-full shadow-lg border-2 border-white/50 cursor-grab hover:cursor-grabbing hover:scale-110 transition-transform" style={{ bottom: '16px', left: '10px' }}></div>
            </div>
          )}

          {/* Rule of Thirds Grid */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                {/* Vertical lines */}
                <line x1="33%" y1="0%" x2="33%" y2="100%" stroke="white" strokeWidth="1" opacity="0.5" />
                <line x1="66%" y1="0%" x2="66%" y2="100%" stroke="white" strokeWidth="1" opacity="0.5" />
                {/* Horizontal lines */}
                <line x1="0%" y1="33%" x2="100%" y2="33%" stroke="white" strokeWidth="1" opacity="0.5" />
                <line x1="0%" y1="66%" x2="100%" y2="66%" stroke="white" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>
          )}
        </div>

        {/* Pinch to Zoom Hint */}
        {showHint && (
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/10">
            Pinch to zoom
          </div>
        )}
      </div>

      {/* Tool Tray - Improved spacing and contrast */}
      <div className="absolute bottom-24 left-0 right-0 px-5">
        <div className="flex items-center justify-center bg-black/70 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 shadow-2xl">
          {/* Rotate Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotate}
            className="w-12 h-12 text-white hover:bg-white/20 active:bg-white/30 rounded-xl transition-all duration-200 mr-6"
          >
            <RotateCw className="w-6 h-6" />
          </Button>

          {/* Straighten Slider - Improved design */}
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm font-medium w-8 text-center">-5°</span>
              <div className="flex-1 relative">
                <Slider
                  value={straightenValue}
                  onValueChange={handleStraighten}
                  max={5}
                  min={-5}
                  step={0.5}
                  className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-white/20 [&_[role=slider]]:shadow-lg"
                />
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium">
                  {straightenValue[0]}°
                </div>
              </div>
              <span className="text-white text-sm font-medium w-8 text-center">+5°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar - Single action bar only */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-center px-5 py-6 pb-8">
          <div className="relative">
            <Button
              onClick={handleSave}
              disabled={isProcessing}
              className="bg-[#E85C3C] hover:bg-[#E85C3C]/90 active:bg-[#E85C3C]/80 text-white px-16 h-12 font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 text-base tracking-wide"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>SAVING...</span>
                </div>
              ) : (
                'SAVE'
              )}
            </Button>
            {showDevAnnotations && <HapticTag type="successNotification" position="top-right" />}
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-black/90 backdrop-blur-sm rounded-2xl px-8 py-6 flex items-center space-x-4 border border-white/10 shadow-2xl">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white font-medium text-lg tracking-wide">PROCESSING...</span>
          </div>
        </div>
      )}

      {/* Grid Toggle - Better positioned */}
      <div className="relative">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`absolute top-24 right-5 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm border ${
            showGrid 
              ? 'bg-white/20 border-white/30 text-white' 
              : 'bg-black/30 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
        >
          <Grid3X3 className="w-5 h-5" />
        </button>
        {showDevAnnotations && <HapticTag type="lightImpact" position="bottom-left" />}
      </div>

      {/* Accessibility Notes */}
      {showDevAnnotations && (
        <>
          <A11yNote 
            type="focus-order" 
            message="Focus order: Retake → Auto-crop → Grid → Rotate → Slider → Save"
            position="top-left"
          />
          <A11yNote 
            type="dynamic-type" 
            message="Receipt text uses fixed monospace for authenticity. UI controls scale with system font size."
            position="bottom-left"
          />
        </>
      )}
    </div>
  );
}