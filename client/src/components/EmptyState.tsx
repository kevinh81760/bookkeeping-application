import { ReactNode } from 'react';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  body: string;
  primaryCTA?: {
    label: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    label: string;
    onClick: () => void;
    variant?: 'outline' | 'ghost';
  };
  helpLink?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'centered' | 'top' | 'with-help-link';
}

export function EmptyState({
  icon,
  title,
  body,
  primaryCTA,
  secondaryCTA,
  helpLink,
  variant = 'centered'
}: EmptyStateProps) {
  const isTop = variant === 'top';
  const hasHelpLink = variant === 'with-help-link' || helpLink;

  return (
    <div className={`flex flex-col items-center px-6 ${
      isTop 
        ? 'pt-16 pb-8' 
        : 'justify-center min-h-[60vh] text-center'
    }`}>
      {/* Icon/Illustration */}
      {icon && (
        <div className={`mb-6 ${isTop ? 'mb-8' : ''}`}>
          {icon}
        </div>
      )}

      {/* Title */}
      <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-3 tracking-[0.1em] uppercase">
        {title}
      </h2>

      {/* Body */}
      <p className="text-[16px] font-medium text-[#6B7280] mb-8 leading-[1.4] max-w-[280px]">
        {body}
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3 w-full max-w-[280px]">
        {primaryCTA && (
          <Button
            onClick={primaryCTA.onClick}
            className="w-full h-11 bg-[#E85C3C] hover:bg-[#d54a2a] text-white text-[16px] font-medium rounded-xl"
          >
            {primaryCTA.label}
          </Button>
        )}

        {secondaryCTA && (
          <Button
            variant={secondaryCTA.variant || 'outline'}
            onClick={secondaryCTA.onClick}
            className={`w-full h-11 text-[16px] font-medium rounded-xl ${
              secondaryCTA.variant === 'ghost' 
                ? 'text-[#E85C3C] hover:bg-[#E85C3C]/5' 
                : 'border-[#E85C3C] text-[#E85C3C] hover:bg-[#E85C3C] hover:text-white'
            }`}
          >
            {secondaryCTA.label}
          </Button>
        )}
      </div>

      {/* Help Link */}
      {hasHelpLink && helpLink && (
        <button
          onClick={helpLink.onClick}
          className="mt-6 text-[14px] font-medium text-[#E85C3C] uppercase tracking-[0.1em] hover:underline"
        >
          {helpLink.label}
        </button>
      )}
    </div>
  );
}