import { Folder, CheckCircle2 } from 'lucide-react';

interface FolderCardProps {
  id: string;
  name: string;
  itemCount: number;
  lastUpdated: string;
  status: 'synced' | 'processing' | 'error';
  onClick: (id: string) => void;
  onLongPress: (id: string) => void;
  isSelected?: boolean;
  isSelectMode?: boolean;
  isHighlighted?: boolean;
}

export function FolderCard({
  id,
  name,
  itemCount,
  lastUpdated,
  status,
  onClick,
  onLongPress,
  isSelected = false,
  isSelectMode = false,
  isHighlighted = false,
}: FolderCardProps) {
  const statusColors = {
    synced: '#34C759',
    processing: '#AEAEB2',
    error: '#FF3B30',
  };

  const statusLabels = {
    synced: 'Synced',
    processing: 'Processing',
    error: 'Error',
  };

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

  return (
    <div
      className={`w-[156px] h-[164px] bg-white rounded-xl p-4 relative transition-all duration-150 active:scale-[0.97] ${
        isHighlighted 
          ? 'bg-[#E85C3C]/8 border border-[#E85C3C]/20' 
          : 'hover:bg-[#F9F9F9] active:bg-[#F2F2F7]'
      } ${
        isSelectMode && isSelected 
          ? 'border-2 border-[#E85C3C] bg-[#E85C3C]/5' 
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
      {/* Status Chip */}
      <div 
        className="absolute top-3 right-3 w-2 h-2 rounded-full"
        style={{ backgroundColor: statusColors[status] }}
        title={statusLabels[status]}
      />

      {/* Selection Checkbox */}
      {isSelectMode && (
        <div className="absolute top-3 left-3 w-5 h-5 rounded-full border-2 border-[#E5E5EA] bg-white flex items-center justify-center">
          {isSelected && (
            <CheckCircle2 className="w-4 h-4 text-[#E85c3C]" />
          )}
        </div>
      )}

      {/* Folder Icon - Apple-style blue folder */}
      <div className="flex justify-center mb-4 mt-2">
        <div className="relative">
          {/* Folder icon with Apple-style blue gradient */}
          <div className="w-16 h-16 relative">
            <svg viewBox="0 0 64 64" className="w-full h-full">
              <defs>
                <linearGradient id="folderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#54C7FC" />
                  <stop offset="100%" stopColor="#007AFF" />
                </linearGradient>
              </defs>
              {/* Folder back */}
              <path
                d="M8 16 L8 48 C8 50.209 9.791 52 12 52 L52 52 C54.209 52 56 50.209 56 48 L56 22 C56 19.791 54.209 18 52 18 L28 18 L24 14 L12 14 C9.791 14 8 15.791 8 18 L8 16 Z"
                fill="url(#folderGradient)"
                stroke="none"
              />
              {/* Folder front highlight */}
              <path
                d="M8 16 L8 18 C8 15.791 9.791 14 12 14 L24 14 L28 18 L52 18 C54.209 18 56 19.791 56 22 L56 20 C56 17.791 54.209 16 52 16 L28 16 L24 12 L12 12 C9.791 12 8 13.791 8 16 Z"
                fill="rgba(255,255,255,0.2)"
                stroke="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Folder Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-base text-[#1A1A1A] leading-tight line-clamp-2">
          {name}
        </h3>
        <p className="text-[13px] text-[#6B6B6B] font-normal">
          {itemCount} item{itemCount !== 1 ? 's' : ''} • {lastUpdated}
        </p>
      </div>
    </div>
  );
}