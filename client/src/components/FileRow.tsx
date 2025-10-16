import { ChevronRight, CheckCircle2, FileText, Image } from 'lucide-react';
import { ProgressRing, ProcessedPill } from './ProgressRing';

export type FileStatus = 'processed' | 'processing' | 'pending' | 'error';

interface FileRowProps {
  id: string;
  name: string;
  size: string;
  lastUpdated: string;
  type: 'image' | 'pdf' | 'doc';
  status?: FileStatus;
  processingProgress?: number;
  onClick: (id: string) => void;
  onLongPress: (id: string) => void;
  isSelected?: boolean;
  isSelectMode?: boolean;
  isHighlighted?: boolean;
}

export function FileRow({
  id,
  name,
  size,
  lastUpdated,
  type,
  status = 'processed',
  processingProgress = 0,
  onClick,
  onLongPress,
  isSelected = false,
  isSelectMode = false,
  isHighlighted = false,
}: FileRowProps) {
  const handlePress = () => {
    if (isSelectMode) {
      onLongPress(id);
    } else {
      onClick(id);
    }
  };

  const handleLongPress = () => {
    if (!isSelectMode) {
      onLongPress(id);
    }
  };

  const getFileIcon = () => {
    switch (type) {
      case 'image':
        return <Image className="w-7 h-7 text-[#007AFF]" />;
      case 'pdf':
        return <FileText className="w-7 h-7 text-[#FF3B30]" />;
      case 'doc':
        return <FileText className="w-7 h-7 text-[#007AFF]" />;
      default:
        return <FileText className="w-7 h-7 text-[#6B6B6B]" />;
    }
  };

  const getProcessingCaption = () => {
    if (status === 'processing') {
      return `Extracting ${Math.round(processingProgress)}%`;
    }
    return null;
  };

  const processingCaption = getProcessingCaption();

  return (
    <div
      className={`h-16 px-5 flex items-center gap-3 transition-all duration-150 active:bg-[#F2F2F7] ${
        isHighlighted 
          ? 'bg-[#E85C3C]/8' 
          : 'hover:bg-[#F9F9F9] active:bg-[#F2F2F7]'
      } ${
        isSelectMode && isSelected 
          ? 'bg-[#E85C3C]/5' 
          : ''
      }`}
      onClick={handlePress}
      onMouseDown={(e) => {
        // Simple long press simulation
        const timer = setTimeout(handleLongPress, 500);
        const cleanup = () => {
          clearTimeout(timer);
          document.removeEventListener('mouseup', cleanup);
        };
        document.addEventListener('mouseup', cleanup);
      }}
    >
      {/* Selection Checkbox */}
      {isSelectMode && (
        <div className="w-5 h-5 rounded-full border-2 border-[#E5E5EA] bg-white flex items-center justify-center flex-shrink-0">
          {isSelected && (
            <CheckCircle2 className="w-4 h-4 text-[#E85C3C]" />
          )}
        </div>
      )}

      {/* File Icon */}
      <div className="flex-shrink-0">
        {getFileIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base text-[#1A1A1A] leading-tight truncate">
          {name}
        </h3>
        {processingCaption ? (
          <div className="space-y-1">
            <p className="text-[13px] text-[#6B6B6B] font-normal truncate">
              {size} • {lastUpdated}
            </p>
            <p className="text-xs text-[#6B6B6B] font-medium">
              {processingCaption}
            </p>
          </div>
        ) : (
          <p className="text-[13px] text-[#6B6B6B] font-normal truncate">
            {size} • {lastUpdated}
          </p>
        )}
      </div>

      {/* Trailing element - Progress Ring, Processed Pill, or Chevron */}
      {!isSelectMode && (
        <div className="flex-shrink-0">
          {status === 'processing' ? (
            <ProgressRing 
              progress={processingProgress} 
              size={24}
            />
          ) : status === 'processed' && processingProgress === 100 ? (
            <ProcessedPill />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#AEAEB2]" />
          )}
        </div>
      )}
    </div>
  );
}