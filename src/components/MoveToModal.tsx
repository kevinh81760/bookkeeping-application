import React, { useState, useEffect } from 'react';
import { Search, Folder, X, Check } from 'lucide-react';
import { Button } from './ui/button';

interface Folder {
  id: string;
  name: string;
  itemCount: number;
  documentIds: string[];
  dateCreated: string;
  lastUpdated: string;
}

export interface MoveToModalProps {
  folders: Folder[];
  currentFolderId?: string | null;
  onMove: (folderId: string | null, rememberDestination?: boolean) => void;
  onClose: () => void;
}

export function MoveToModal({
  folders,
  currentFolderId,
  onMove,
  onClose,
}: MoveToModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId || null);
  const [rememberDestination, setRememberDestination] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleMove = () => {
    onMove(selectedFolderId, rememberDestination);
    handleClose();
  };

  // Filter folders based on search query
  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add "No Folder" option
  const allOptions = [
    { id: null, name: 'No Folder', itemCount: 0, isNoFolder: true },
    ...filteredFolders.map(folder => ({ ...folder, isNoFolder: false }))
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isVisible ? 'opacity-30' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Bottom Sheet */}
      <div
        className={`
          relative w-full bg-white rounded-t-3xl shadow-2xl
          transform transition-transform duration-200 ease-out
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{ height: '80vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 bg-[#E5E5EA] rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5EA]">
          <h2 className="text-[20px] font-bold text-[#1A1A1A] leading-[20px] uppercase tracking-[0.1em]">
            Move to
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-[#F2F2F7] transition-colors"
          >
            <X className="w-5 h-5 text-[#6B6B6B]" />
          </button>
        </div>
        
        {/* Search */}
        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder="Search folders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-10 pr-4 py-3 bg-[#F2F2F7] rounded-xl border-0 
                text-[16px] font-medium text-[#1A1A1A] leading-[20px]
                placeholder:text-[#6B6B6B] focus:outline-none focus:ring-2 focus:ring-[#E85C3C]
              "
            />
          </div>
        </div>
        
        {/* Folder List */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-2">
            {allOptions.map((option) => (
              <button
                key={option.id || 'no-folder'}
                onClick={() => setSelectedFolderId(option.id)}
                className={`
                  w-full flex items-center gap-3 p-4 rounded-xl border transition-all
                  ${selectedFolderId === option.id 
                    ? 'border-[#E85C3C] bg-[#E85C3C] bg-opacity-5' 
                    : 'border-[#E5E5EA] bg-white hover:bg-[#F2F2F7]'
                  }
                  ${currentFolderId === option.id ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={currentFolderId === option.id}
              >
                {/* Folder Icon */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${option.isNoFolder ? 'bg-[#F2F2F7]' : 'bg-[#E85C3C] bg-opacity-10'}
                `}>
                  <Folder className={`w-5 h-5 ${option.isNoFolder ? 'text-[#6B6B6B]' : 'text-[#E85C3C]'}`} />
                </div>
                
                {/* Folder Info */}
                <div className="flex-1 text-left">
                  <div className="text-[16px] font-medium text-[#1A1A1A] leading-[20px]">
                    {option.name}
                  </div>
                  {!option.isNoFolder && (
                    <div className="text-[13px] font-medium text-[#6B6B6B] leading-[20px]">
                      {option.itemCount} item{option.itemCount !== 1 ? 's' : ''}
                    </div>
                  )}
                  {currentFolderId === option.id && (
                    <div className="text-[13px] font-medium text-[#6B6B6B] leading-[20px]">
                      Current location
                    </div>
                  )}
                </div>
                
                {/* Selection Indicator */}
                {selectedFolderId === option.id && (
                  <Check className="w-5 h-5 text-[#E85C3C]" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E5EA] space-y-4">
          {/* Remember Destination Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={rememberDestination}
                onChange={(e) => setRememberDestination(e.target.checked)}
                className="sr-only"
              />
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                ${rememberDestination 
                  ? 'border-[#E85C3C] bg-[#E85C3C]' 
                  : 'border-[#E5E5EA] bg-white'
                }
              `}>
                {rememberDestination && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
            <span className="text-[16px] font-medium text-[#1A1A1A] leading-[20px]">
              Remember destination
            </span>
          </label>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-12 rounded-xl border-[#E5E5EA] text-[16px] font-medium text-[#1A1A1A] hover:bg-[#F2F2F7]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMove}
              disabled={selectedFolderId === currentFolderId}
              className="flex-1 h-12 rounded-xl bg-[#E85C3C] text-[16px] font-medium text-white hover:bg-[#E85C3C] hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Move here
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}