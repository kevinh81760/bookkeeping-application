import { useState } from 'react';
import { Search, Upload, FolderPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FolderRow } from './FolderRow';
import { SegmentedControl } from './SegmentedControl';
import { MultiSelectActionBar } from './MultiSelectActionBar';
import { toast } from 'sonner';

interface Folder {
  id: string;
  name: string;
  itemCount: number;
}

interface FilesListScreenProps {
  onNavigate: (screen: string, id?: string) => void;
  onOpenUpload: () => void;
  onCreateFolder: () => void;
  folders: Folder[];
}

export function FilesListScreen({ onNavigate, onOpenUpload, onCreateFolder, folders }: FilesListScreenProps) {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  const [highlightedFolders, setHighlightedFolders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Add default properties for folders that don't have lastUpdated/status
  const enhancedFolders = folders.map(folder => ({
    ...folder,
    lastUpdated: 'Just now',
    status: 'synced' as const
  }));

  const handleFolderClick = (id: string) => {
    if (isSelectMode) {
      handleFolderSelect(id);
    } else {
      onNavigate('folder-contents', id);
    }
  };

  const handleFolderLongPress = (id: string) => {
    if (!isSelectMode) {
      setIsSelectMode(true);
      setSelectedFolders([id]);
    } else {
      handleFolderSelect(id);
    }
  };

  const handleFolderSelect = (id: string) => {
    setSelectedFolders(prev => 
      prev.includes(id) 
        ? prev.filter(folderId => folderId !== id)
        : [...prev, id]
    );
  };

  const handleSelectModeToggle = () => {
    if (isSelectMode) {
      setIsSelectMode(false);
      setSelectedFolders([]);
    } else {
      setIsSelectMode(true);
    }
  };

  const handleMove = () => {
    toast.success(`${selectedFolders.length} folder${selectedFolders.length > 1 ? 's' : ''} moved`);
    setIsSelectMode(false);
    setSelectedFolders([]);
  };

  const handleRename = () => {
    toast.success(`${selectedFolders.length} folder${selectedFolders.length > 1 ? 's' : ''} renamed`);
    setIsSelectMode(false);
    setSelectedFolders([]);
  };

  const handleDelete = () => {
    toast.success(`${selectedFolders.length} folder${selectedFolders.length > 1 ? 's' : ''} deleted`);
    setIsSelectMode(false);
    setSelectedFolders([]);
  };

  return (
    <div className="h-screen bg-[#F9F9F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-[28px] text-[#1A1A1A]">
            Files
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onCreateFolder}
            className="w-8 h-8 text-[#E85C3C] hover:bg-[#E85C3C]/10"
          >
            <FolderPlus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
          <Input
            placeholder="Search folders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#F2F2F7] border-none rounded-lg h-12 text-[#1A1A1A] placeholder:text-[#6B6B6B]"
          />
        </div>

        {/* Segmented Control */}
        <div className="flex justify-start">
          <SegmentedControl
            selectedView="list"
            onViewChange={(view) => onNavigate(view === 'grid' ? 'files-grid' : 'files-list')}
          />
        </div>
      </div>

      {/* Folder List - iOS Table Style */}
      <div className="flex-1 px-5">
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="divide-y divide-[#E5E5EA]">
            {enhancedFolders.map((folder, index) => (
              <div key={folder.id}>
                <FolderRow
                  id={folder.id}
                  name={folder.name}
                  itemCount={folder.itemCount}
                  lastUpdated={folder.lastUpdated}
                  status={folder.status}
                  onClick={handleFolderClick}
                  onLongPress={handleFolderLongPress}
                  isSelected={selectedFolders.includes(folder.id)}
                  isSelectMode={isSelectMode}
                  isHighlighted={highlightedFolders.includes(folder.id)}
                />
                {/* iOS-style separator line */}
                {index < enhancedFolders.length - 1 && (
                  <div className="h-px bg-[#E5E5EA] ml-14" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />

      {/* Multi-select Action Bar */}
      {isSelectMode && selectedFolders.length > 0 && (
        <MultiSelectActionBar
          selectedCount={selectedFolders.length}
          onMove={handleMove}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}