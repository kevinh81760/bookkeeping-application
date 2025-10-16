import { Check, Clock, AlertCircle, Loader2 } from 'lucide-react';

export type StatusType = 'processed' | 'processing' | 'pending' | 'error';

interface StatusPillProps {
  status: StatusType;
  className?: string;
}

export function StatusPill({ status, className = '' }: StatusPillProps) {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'processed':
        return {
          icon: Check,
          text: 'Processed',
          bgColor: 'bg-[#34C759]',
          textColor: 'text-white',
          iconColor: 'text-white'
        };
      case 'processing':
        return {
          icon: Loader2,
          text: 'Processing',
          bgColor: 'bg-[#AEAEB2]',
          textColor: 'text-white',
          iconColor: 'text-white',
          animate: true
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          bgColor: 'bg-[#FF9F0A]',
          textColor: 'text-white',
          iconColor: 'text-white'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Error',
          bgColor: 'bg-[#FF3B30]',
          textColor: 'text-white',
          iconColor: 'text-white'
        };
      default:
        return {
          icon: Clock,
          text: 'Unknown',
          bgColor: 'bg-[#AEAEB2]',
          textColor: 'text-white',
          iconColor: 'text-white'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bgColor} ${className}`}>
      <Icon 
        className={`w-3 h-3 ${config.iconColor} stroke-2 ${config.animate ? 'animate-spin' : ''}`} 
      />
      <span className={`text-xs font-medium tracking-[0.05em] uppercase ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
}