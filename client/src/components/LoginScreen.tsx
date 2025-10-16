import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Apple } from "lucide-react";

interface LoginScreenProps {
  onNavigate: (screen: string, fileId?: string) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  return (
    <div className="w-full h-full min-h-screen bg-[#F9F9F9] px-8 py-16 flex flex-col justify-center">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Centered logo placeholder at the top */}
        <div className="mb-16">
          <div className="w-12 h-12 bg-foreground rounded-xl mx-auto"></div>
        </div>

        {/* Bold header: "LOG IN" (all caps, SF Pro Bold) */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-[0.1em] uppercase">LOG IN</h1>
        </div>

        {/* Input fields: Email, Password — rounded rectangles with thin 1px borders */}
        <div className="w-full space-y-4 mb-12">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              className="w-full bg-background-card border border-border rounded-xl px-4 py-3 text-base placeholder:text-muted-foreground focus:border-primary focus:ring-0 transition-colors"
            />
          </div>
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              className="w-full bg-background-card border border-border rounded-xl px-4 py-3 text-base placeholder:text-muted-foreground focus:border-primary focus:ring-0 transition-colors"
            />
          </div>
        </div>

        {/* Primary button: large, rounded rectangle, filled with accent orange (#E85C3C), white text */}
        <div className="w-full mb-6">
          <Button
            onClick={() => onNavigate('camera')}
            className="w-full h-12 bg-primary hover:bg-[#D54B2A] active:bg-[#C24B2A] text-primary-foreground font-semibold rounded-xl transition-all duration-150"
          >
            Log In
          </Button>
        </div>

        {/* Small "Forgot Password?" link (uppercase, gray) */}
        <div className="mb-12">
          <button className="text-muted-foreground text-xs tracking-wider uppercase hover:text-primary transition-colors font-medium">
            FORGOT PASSWORD?
          </button>
        </div>

        {/* Apple/Google login buttons (outlined style, subtle rounded corners) */}
        <div className="w-full space-y-3">
          <Button
            variant="outline"
            className="w-full h-12 bg-background-card border border-border text-foreground hover:bg-muted hover:border-primary active:bg-[#F2F2F7] rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-150"
          >
            <Apple className="w-4 h-4" />
            Continue with Apple
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-12 bg-background-card border border-border text-foreground hover:bg-muted hover:border-primary active:bg-[#F2F2F7] rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-150"
          >
            <div className="w-4 h-4 bg-[#4285f4] rounded-full flex items-center justify-center text-white text-xs font-medium">G</div>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}