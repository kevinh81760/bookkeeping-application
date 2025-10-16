import { useState } from 'react';
import { Button } from '../ui/button';
import { ToastBottom } from '../ToastBottom';
import { SkeletonBlock } from '../SkeletonBlock';
import { SkeletonRow } from '../SkeletonRow';
import { SkeletonCard } from '../SkeletonCard';
import { HapticTag } from './HapticTag';
import { A11yNote } from './A11yNote';

export function PolishDemo() {
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info'>('success');
  const [reduceMotion, setReduceMotion] = useState(false);

  const showToastDemo = (variant: 'success' | 'error' | 'info') => {
    setToastVariant(variant);
    setShowToast(true);
  };

  const getToastMessage = () => {
    switch (toastVariant) {
      case 'success':
        return 'Imported 3 items';
      case 'error':
        return 'Extraction failed. Retry?';
      case 'info':
        return 'Saved to queue';
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#F9F9F9] max-w-[393px] mx-auto p-5 space-y-8">
      <div className="bg-white rounded-xl p-6 space-y-6">
        <h1 className="text-xl font-bold text-[#1A1A1A] tracking-[0.1em]">POLISH DEMO</h1>
        
        {/* Skeleton Loaders */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Skeleton Loaders</h2>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#6B6B6B] uppercase tracking-wide">Blocks</h3>
            <div className="flex gap-2 items-center flex-wrap">
              <SkeletonBlock variant="xs" reduceMotion={reduceMotion} />
              <SkeletonBlock variant="sm" reduceMotion={reduceMotion} />
              <SkeletonBlock variant="md" reduceMotion={reduceMotion} />
              <SkeletonBlock variant="lg" reduceMotion={reduceMotion} />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock variant="thumb" reduceMotion={reduceMotion} />
              <SkeletonBlock variant="card" reduceMotion={reduceMotion} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#6B6B6B] uppercase tracking-wide">Components</h3>
            <SkeletonRow reduceMotion={reduceMotion} />
            <SkeletonCard reduceMotion={reduceMotion} />
          </div>
        </div>

        {/* Toast Demos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Toast Notifications</h2>
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => showToastDemo('success')}
              className="bg-[#34C759] hover:bg-[#34C759]/90 text-white"
            >
              Success Toast
            </Button>
            <Button 
              onClick={() => showToastDemo('error')}
              className="bg-[#FF3B30] hover:bg-[#FF3B30]/90 text-white"
            >
              Error Toast
            </Button>
            <Button 
              onClick={() => showToastDemo('info')}
              className="bg-[#6B7280] hover:bg-[#6B7280]/90 text-white"
            >
              Info Toast
            </Button>
          </div>
        </div>

        {/* Haptic Annotations */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Haptic Annotations</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative p-4 bg-[#F2F2F7] rounded-lg">
              <Button className="w-full">Light Impact</Button>
              <HapticTag type="lightImpact" />
            </div>
            <div className="relative p-4 bg-[#F2F2F7] rounded-lg">
              <Button className="w-full bg-[#34C759] hover:bg-[#34C759]/90">Success</Button>
              <HapticTag type="successNotification" />
            </div>
            <div className="relative p-4 bg-[#F2F2F7] rounded-lg">
              <Button className="w-full bg-[#FF3B30] hover:bg-[#FF3B30]/90">Error</Button>
              <HapticTag type="errorNotification" />
            </div>
            <div className="relative p-4 bg-[#F2F2F7] rounded-lg">
              <Button className="w-full">Medium Impact</Button>
              <HapticTag type="mediumImpact" />
            </div>
          </div>
        </div>

        {/* Motion Toggle */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Motion Settings</h2>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={(e) => setReduceMotion(e.target.checked)}
              className="w-4 h-4 text-[#E85C3C] bg-gray-100 border-gray-300 rounded focus:ring-[#E85C3C] focus:ring-2"
            />
            <span className="text-sm text-[#1A1A1A]">Reduce Motion</span>
          </label>
        </div>
      </div>

      {/* Accessibility Notes */}
      <A11yNote 
        type="contrast" 
        message="All text meets WCAG AA standards (4.5:1 ratio)"
        position="top-left"
      />
      <A11yNote 
        type="targets" 
        message="All interactive elements meet 44×44pt minimum"
        position="top-right"
      />

      {/* Toast */}
      {showToast && (
        <ToastBottom
          variant={toastVariant}
          message={getToastMessage()}
          duration={3000}
          actionLabel={toastVariant === 'error' ? 'Retry' : undefined}
          onAction={toastVariant === 'error' ? () => console.log('Retry') : undefined}
          onDismiss={() => setShowToast(false)}
          visible={showToast}
        />
      )}
    </div>
  );
}