import { useState, useEffect } from 'react';
import { RotateCw, Grid3X3, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { toast } from 'sonner';

interface CaptureReviewMultipageScreenProps {
  onNavigate: (screen: string) => void;
  onSavePhoto: (photoData: any) => void;
  capturedImage: string | null;
}

export function CaptureReviewMultipageScreen({ onNavigate, onSavePhoto, capturedImage }: CaptureReviewMultipageScreenProps) {
  const [autoCrop, setAutoCrop] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [straightenValue, setStraightenValue] = useState([0]);
  const [aspectRatio, setAspectRatio] = useState('Receipt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);

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

  const handleAddPage = () => {
    // Navigate back to camera to capture next page
    onNavigate('camera');
    // In a real app, this would preserve the current pages and add to the collection
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
        rotation,
        totalPages
      });
      
      // Navigate to files and show success toast
      onNavigate('files-empty-grid');
      toast.success(`Imported ${totalPages} items`);
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

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isProcessing}
            className="bg-[#E85C3C] hover:bg-[#E85C3C]/90 active:bg-[#E85C3C]/80 text-white px-6 h-11 font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70"
          >
            {isProcessing ? 'Saving...' : 'Save'}
          </Button>
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
          {/* Realistic Receipt Content with Page indicator */}
          <div className="p-6 bg-white h-full relative">
            {/* Page indicator overlay */}
            <div className="absolute top-2 right-2 bg-[#E85C3C] text-white px-3 py-1 rounded-lg text-xs font-medium tracking-wide shadow-lg">
              PAGE {currentPage} OF {totalPages}
            </div>

            {/* Store Header */}
            <div className="text-center mb-6 border-b border-gray-200 pb-4">
              <div className="w-12 h-12 bg-[#E85C3C] rounded-lg mx-auto mb-3 flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <div className="h-4 bg-gray-800 rounded-sm mb-2 mx-auto w-32" style={{ backgroundColor: '#1A1A1A' }}></div>
              <div className="h-3 bg-gray-400 rounded-sm w-24 mx-auto mb-1"></div>
              <div className="h-3 bg-gray-400 rounded-sm w-28 mx-auto"></div>
            </div>

            {/* Receipt Items */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-600 rounded-sm w-20"></div>
                <div className="h-3 bg-gray-600 rounded-sm w-12"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-600 rounded-sm w-24"></div>
                <div className="h-3 bg-gray-600 rounded-sm w-14"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-600 rounded-sm w-16"></div>
                <div className="h-3 bg-gray-600 rounded-sm w-10"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-600 rounded-sm w-28"></div>
                <div className="h-3 bg-gray-600 rounded-sm w-16"></div>
              </div>
            </div>

            {/* Subtotal */}
            <div className="border-t border-gray-200 pt-3 mb-3">
              <div className="flex justify-between items-center mb-2">
                <div className="h-3 bg-gray-500 rounded-sm w-16"></div>
                <div className="h-3 bg-gray-500 rounded-sm w-12"></div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="h-3 bg-gray-500 rounded-sm w-12"></div>
                <div className="h-3 bg-gray-500 rounded-sm w-10"></div>
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-800 pt-2">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-800 rounded-sm w-16"></div>
                <div className="h-4 bg-gray-800 rounded-sm w-16"></div>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-6 right-6 text-center">
              <div className="h-2 bg-gray-400 rounded-sm w-20 mx-auto mb-2"></div>
              <div className="h-2 bg-gray-400 rounded-sm w-16 mx-auto"></div>
            </div>
          </div>

          {/* Edge Detection Overlay - Auto-crop ON */}
          {autoCrop && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Dashed polygon border with better positioning */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <filter id="glow-multipage">
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
                  filter="url(#glow-multipage)"
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
          <div className="absolute bottom-52 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/10">
            Pinch to zoom
          </div>
        )}
      </div>

      {/* Page Dots and Add Page Button */}
      <div className="absolute bottom-36 left-0 right-0 flex items-center justify-center space-x-6">
        {/* Page Dots */}
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                i + 1 === currentPage ? 'bg-white shadow-lg' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Add Page Button */}
        <Button
          variant="ghost"
          onClick={handleAddPage}
          className="text-white hover:bg-white/20 active:bg-white/30 px-4 py-2 h-9 text-sm font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span className="tracking-wide">ADD PAGE</span>
        </Button>
      </div>

      {/* Tool Tray */}
      <div className="absolute bottom-24 left-0 right-0 px-5">
        <div className="flex items-center justify-between bg-black/70 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 shadow-2xl">
          {/* Rotate Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotate}
            className="w-12 h-12 text-white hover:bg-white/20 active:bg-white/30 rounded-xl transition-all duration-200"
          >
            <RotateCw className="w-6 h-6" />
          </Button>

          {/* Straighten Slider */}
          <div className="flex-1 mx-6">
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

          {/* Aspect Selector */}
          <div className="flex items-center space-x-1 bg-white/10 rounded-xl p-1 border border-white/10">
            {['Free', 'Receipt', 'A4'].map((aspect) => (
              <button
                key={aspect}
                onClick={() => handleAspectChange(aspect)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[60px] ${
                  aspectRatio === aspect
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/80 hover:bg-white/10 active:bg-white/20'
                }`}
              >
                {aspect}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-center px-5 py-6 pb-8">
          <Button
            onClick={handleSave}
            disabled={isProcessing}
            className="bg-[#E85C3C] hover:bg-[#E85C3C]/90 active:bg-[#E85C3C]/80 text-white px-12 h-12 font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 text-base tracking-wide"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>SAVING...</span>
              </div>
            ) : (
              `SAVE ${totalPages} PAGES`
            )}
          </Button>
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

      {/* Grid Toggle */}
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
    </div>
  );
}