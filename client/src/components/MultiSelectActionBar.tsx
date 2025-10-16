import { FolderOpen, Edit3, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface MultiSelectActionBarProps {
  selectedCount: number;
  onMove: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function MultiSelectActionBar({
  selectedCount,
  onMove,
  onRename,
  onDelete,
}: MultiSelectActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5EA] px-5 py-4 z-50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#6B6B6B]">
          {selectedCount} selected
        </span>
        
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMove}
            className="flex flex-col items-center gap-1 h-auto p-2 text-[#007AFF] hover:bg-[#007AFF]/10"
          >
            <FolderOpen className="w-5 h-5" />
            <span className="text-xs font-medium">Move</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onRename}
            className="flex flex-col items-center gap-1 h-auto p-2 text-[#007AFF] hover:bg-[#007AFF]/10"
          >
            <Edit3 className="w-5 h-5" />
            <span className="text-xs font-medium">Rename</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="flex flex-col items-center gap-1 h-auto p-2 text-[#FF3B30] hover:bg-[#FF3B30]/10"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-xs font-medium">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}