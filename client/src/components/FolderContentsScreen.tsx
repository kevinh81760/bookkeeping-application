import { useState } from 'react';
import { ChevronLeft, Upload, FolderPlus, FileText, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from './ui/button';
import { FileRow } from './FileRow';
import { SegmentedControl } from './SegmentedControl';
import { SortFilterChips } from './SortFilterChips';
import { MultiSelectActionBar } from './MultiSelectActionBar';
import { ProgressRing, ProcessedPill } from './ProgressRing';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document';
  size: string;
  dateCreated: string;
  folderId: string | null;
  status: 'synced' | 'processing' | 'error';
  processingProgress?: number;
  thumbnail?: string;
}

interface FolderContentsScreenProps {
  onNavigate: (screen: string, id?: string) => void;
  folderId: string | null;
  folderName?: string;
  previousScreen?: string;
  documents: Document[];
}

export function FolderContentsScreen({ onNavigate, folderId, folderName = 'Unknown Folder', previousScreen, documents }: FolderContentsScreenProps) {
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('list');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [highlightedFiles, setHighlightedFiles] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<'name' | 'updated' | 'items'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'synced' | 'processing' | 'error'>('all');

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleFileClick = (id: string) => {
    if (isSelectMode) {
      handleFileSelect(id);
    } else {
      onNavigate('file-detail', id);
    }
  };

  const handleFileLongPress = (id: string) => {
    if (!isSelectMode) {
      setIsSelectMode(true);
      setSelectedFiles([id]);
    } else {
      handleFileSelect(id);
    }
  };

  const handleFileSelect = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  const handleSelectModeToggle = () => {
    if (isSelectMode) {
      setIsSelectMode(false);
      setSelectedFiles([]);
    } else {
      setIsSelectMode(true);
    }
  };

  const handleMove = () => {
    toast.success(`${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} moved`);
    setIsSelectMode(false);
    setSelectedFiles([]);
  };

  const handleRename = () => {
    toast.success(`${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} renamed`);
    setIsSelectMode(false);
    setSelectedFiles([]);
  };

  const handleDelete = () => {
    toast.success(`${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} deleted`);
    setIsSelectMode(false);
    setSelectedFiles([]);
  };

  const handleSortChange = (sort: 'name' | 'updated' | 'items', direction: 'asc' | 'desc') => {
    setSelectedSort(sort);
    setSortDirection(direction);
  };

  const handleFilterChange = (filter: 'all' | 'synced' | 'processing' | 'error') => {
    setSelectedFilter(filter);
  };

  const handleViewChange = (view: 'grid' | 'list') => {
    setCurrentView(view);
  };

  const handleCreateFolder = () => {
    // Would open create folder modal within this folder
    toast.success('Create folder functionality would open here');
  };

  const handleOpenUpload = () => {
    // Would open upload modal for this folder
    toast.success('Upload functionality would open here');
  };

  return (
    <div className="h-screen bg-[#F9F9F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Determine the correct screen to navigate back to
                let backScreen = previousScreen || 'files-list';
                
                // If the previous screen was a skeleton or intermediate state, 
                // navigate to the appropriate main files screen
                if (backScreen.includes('skeleton') || backScreen.includes('empty')) {
                  backScreen = 'files-grid';
                }
                
                onNavigate(backScreen);
              }}
              className="w-8 h-8 text-[#007AFF] hover:bg-[#007AFF]/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-[20px] text-[#1A1A1A] uppercase tracking-[0.1em]">
              {folderName}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {isSelectMode ? (
              <Button
                variant="ghost"
                onClick={handleSelectModeToggle}
                className="text-[#007AFF] hover:bg-[#007AFF]/10 font-medium"
              >
                Cancel
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={handleSelectModeToggle}
                  className="text-[#007AFF] hover:bg-[#007AFF]/10 font-medium"
                >
                  Select
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCreateFolder}
                  className="w-8 h-8 text-[#007AFF] hover:bg-[#007AFF]/10"
                >
                  <FolderPlus className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleOpenUpload}
                  className="w-8 h-8 text-[#007AFF] hover:bg-[#007AFF]/10"
                >
                  <Upload className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Segmented Control */}
        <div className="flex justify-center mb-4">
          <SegmentedControl
            selectedView={currentView}
            onViewChange={handleViewChange}
          />
        </div>
      </div>

      {/* Sort & Filter */}
      <SortFilterChips
        selectedSort={selectedSort}
        sortDirection={sortDirection}
        selectedFilter={selectedFilter}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
      />

      {/* File List */}
      <div className="flex-1 bg-white mx-5 rounded-xl overflow-hidden">
        {currentView === 'list' ? (
          <div className="divide-y divide-[#E5E5EA]">
            {documents.map((file, index) => (
              <div key={file.id}>
                <FileRow
                  id={file.id}
                  name={file.name}
                  size={file.size}
                  lastUpdated={formatDate(file.dateCreated)}
                  type={file.type}
                  status={file.status === 'synced' ? 'processed' : file.status}
                  processingProgress={file.processingProgress}
                  onClick={handleFileClick}
                  onLongPress={handleFileLongPress}
                  isSelected={selectedFiles.includes(file.id)}
                  isSelectMode={isSelectMode}
                  isHighlighted={highlightedFiles.includes(file.id)}
                />
                {/* iOS-style separator line */}
                {index < documents.length - 1 && (
                  <div className="h-px bg-[#E5E5EA] ml-14" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {documents.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleFileClick(file.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleFileLongPress(file.id);
                  }}
                  className={`relative bg-white border border-[#E5E5EA] rounded-xl p-3 cursor-pointer transition-all duration-150 hover:border-[#E85C3C] active:bg-[#F9F9F9] ${
                    selectedFiles.includes(file.id) 
                      ? 'border-[#E85C3C] bg-[#E85C3C]/5' 
                      : ''
                  } ${
                    highlightedFiles.includes(file.id) 
                      ? 'bg-[#E85C3C]/10' 
                      : ''
                  }`}
                >
                  {/* Progress Ring for processing files (16px, top-right) */}
                  {!isSelectMode && file.status === 'processing' && (
                    <div className="absolute top-2 right-2 z-10">
                      <ProgressRing 
                        progress={file.processingProgress || 0}
                        size={16}
                      />
                    </div>
                  )}
                  
                  {/* Processed Pill for completed files */}
                  {!isSelectMode && file.status === 'synced' && file.processingProgress === 100 && (
                    <div className="absolute top-2 right-2 z-10">
                      <ProcessedPill />
                    </div>
                  )}

                  {/* Selection indicator */}
                  {isSelectMode && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                        selectedFiles.includes(file.id)
                          ? 'bg-[#E85C3C] border-[#E85C3C]'
                          : 'bg-white border-[#E5E5EA]'
                      }`}>
                        {selectedFiles.includes(file.id) && (
                          <Check className="w-3 h-3 text-white stroke-2" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* File icon/preview */}
                  <div className="w-full aspect-[4/3] bg-[#F2F2F7] rounded-lg mb-3 flex items-center justify-center">
                    {file.type === 'pdf' && (
                      <FileText className="w-8 h-8 text-[#6B6B6B] stroke-1" />
                    )}
                    {file.type === 'image' && (
                      <ImageIcon className="w-8 h-8 text-[#6B6B6B] stroke-1" />
                    )}
                    {file.type === 'document' && (
                      <FileText className="w-8 h-8 text-[#6B6B6B] stroke-1" />
                    )}
                  </div>

                  {/* File info */}
                  <div className="space-y-1">
                    <h4 className="font-medium text-[#1A1A1A] text-sm leading-tight line-clamp-2">
                      {file.name}
                    </h4>
                    {/* Optional processing caption */}
                    {file.status === 'processing' && (
                      <p className="text-xs text-[#6B6B6B] font-medium">
                        Processing
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6B6B6B] font-medium">
                        {file.size}
                      </span>
                      <span className="text-xs text-[#6B6B6B] font-medium">
                        {formatDate(file.dateCreated)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />

      {/* Multi-select Action Bar */}
      {isSelectMode && selectedFiles.length > 0 && (
        <MultiSelectActionBar
          selectedCount={selectedFiles.length}
          onMove={handleMove}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}