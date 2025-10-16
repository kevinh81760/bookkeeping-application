import { useState } from 'react';
import { X, Folder, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface Folder {
  id: string;
  name: string;
  itemCount?: number;
}

interface FolderSelectionModalProps {
  onClose: () => void;
  onSelectFolder: (folderId: string) => void;
  folders: Folder[];
}

export function FolderSelectionModal({ onClose, onSelectFolder, folders }: FolderSelectionModalProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 150); // Wait for animation to complete
  };

  const handleFolderSelect = (folderId: string) => {
    onSelectFolder(folderId);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'bg-opacity-40' : 'bg-opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full bg-white rounded-t-3xl transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5EA]">
          <div>
            <p className="font-medium text-[#6B6B6B] tracking-[0.1em] uppercase">
              SELECT FOLDER
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="w-8 h-8 text-[#6B6B6B] hover:bg-[#F2F2F7] rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Folder List */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="px-6 py-2">
            {folders.map((folder, index) => (
              <div key={folder.id}>
                <button
                  onClick={() => handleFolderSelect(folder.id)}
                  className="w-full flex items-center justify-between py-4 hover:bg-[#F2F2F7] active:bg-[#E5E5EA] rounded-lg px-3 -mx-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E85C3C] rounded-lg flex items-center justify-center">
                      <Folder className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-[#1A1A1A]">
                        {folder.name}
                      </h3>
                      {folder.itemCount !== undefined && (
                        <p className="text-sm text-[#6B6B6B]">
                          {folder.itemCount} {folder.itemCount === 1 ? 'item' : 'items'}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6B6B6B]" />
                </button>
                
                {/* Separator line */}
                {index < folders.length - 1 && (
                  <div className="h-px bg-[#E5E5EA] ml-13" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom spacing for safe area */}
        <div className="h-8" />
      </div>
    </div>
  );
}