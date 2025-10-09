import { Button } from "./ui/button";
import { Smartphone } from "lucide-react";

interface OnboardingScreenProps {
  onNavigate: (screen: string) => void;
}

export function OnboardingScreen({ onNavigate }: OnboardingScreenProps) {
  return (
    <div className="w-full h-full bg-white flex flex-col justify-center items-center px-8 text-center">
      {/* Illustration placeholder */}
      <div className="mb-12">
        <div className="w-32 h-32 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl flex items-center justify-center mb-8">
          <Smartphone className="w-16 h-16 text-[#E85C3C]" />
        </div>
        
        {/* App name */}
        <h1 className="text-3xl font-semibold text-black mb-4">ScanApp</h1>
        <p className="text-lg text-[#6B6B6B] leading-relaxed">
          Capture and organize your receipts with ease
        </p>
      </div>

      {/* Get Started button */}
      <Button
        onClick={() => onNavigate('login')}
        className="w-full h-14 bg-[#E85C3C] hover:bg-[#D54B2A] text-white rounded-xl font-semibold transition-colors"
      >
        Get Started
      </Button>
    </div>
  );
}