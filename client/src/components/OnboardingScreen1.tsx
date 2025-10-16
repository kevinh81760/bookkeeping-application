import { Button } from './ui/button';
import { CameraIllustration } from './illustrations/CameraIllustration';

interface OnboardingScreen1Props {
  onNext: () => void;
  onSkip: () => void;
}

export function OnboardingScreen1({ onNext, onSkip }: OnboardingScreen1Props) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Skip button */}
      <div className="flex justify-end px-6 pt-12 safe-area-top">
        <button
          onClick={onSkip}
          className="text-[16px] font-medium text-[#E85C3C] uppercase tracking-[0.1em] hover:underline"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Illustration */}
        <div className="mb-12">
          <CameraIllustration />
        </div>

        {/* Title */}
        <h1 className="text-[22px] font-bold text-[#1A1A1A] mb-4 tracking-[0.1em] uppercase">
          Snap receipts
        </h1>

        {/* Body */}
        <p className="text-[16px] font-medium text-[#6B7280] mb-12 leading-[1.4] max-w-[280px]">
          Fast capture with edge auto-detect.
        </p>
      </div>

      {/* Page dots */}
      <div className="flex justify-center gap-2 mb-8">
        <div className="w-2 h-2 rounded-full bg-[#E85C3C]" />
        <div className="w-2 h-2 rounded-full bg-[#E5E5EA]" />
        <div className="w-2 h-2 rounded-full bg-[#E5E5EA]" />
      </div>

      {/* Next button */}
      <div className="px-6 pb-8 safe-area-bottom">
        <Button
          onClick={onNext}
          className="w-full h-11 bg-[#E85C3C] hover:bg-[#d54a2a] text-white text-[16px] font-medium rounded-xl"
        >
          Next
        </Button>
      </div>
    </div>
  );
}