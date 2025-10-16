import { useState } from 'react';
import { ChevronLeft, X, FolderOpen, FileText, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from './ui/button';

interface UploadFullscreenProps {
  onClose: () => void;
  onBack: () => void;
  selectedItems: any[];
  onSelectedItemsChange: (items: any[]) => void;
}

// Mock nested folder structure
const mockFolders = [
  { id: 'folder-1', name: 'Documents', itemCount: 24, type: 'folder' },
  { id: 'folder-2', name: 'Downloads', itemCount: 12, type: 'folder' },
  { id: 'folder-3', name: 'Desktop', itemCount: 8, type: 'folder' },
];

const mockFiles = [
  { id: 'file-1', name: 'Contract_Final.pdf', type: 'PDF', size: '2.4 MB', date: 'Oct 15, 2024' },
  { id: 'file-2', name: 'Invoice_2024_Q3.xlsx', type: 'XLSX', size: '856 KB', date: 'Oct 14, 2024' },
  { id: 'file-3', name: 'Receipt_Archive.zip', type: 'ZIP', size: '12.1 MB', date: 'Oct 13, 2024' },
  { id: 'file-4', name: 'Business_Card_Scan.jpg', type: 'JPG', size: '1.8 MB', date: 'Oct 12, 2024' },
  { id: 'file-5', name: 'Meeting_Notes.docx', type: 'DOCX', size: '445 KB', date: 'Oct 11, 2024' },
];

export function UploadFullscreen({ 
  onClose, 
  onBack, 
  selectedItems, 
  onSelectedItemsChange 
}: UploadFullscreenProps) {
  const [currentPath, setCurrentPath] = useState(['Files']);
  const [currentItems, setCurrentItems] = useState([...mockFolders, ...mockFiles]);

  const handleItemSelect = (item: any) => {
    const isSelected = selectedItems.find(selected => selected.id === item.id);
    if (isSelected) {
      onSelectedItemsChange(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      onSelectedItemsChange([...selectedItems, item]);
    }
  };

  const isItemSelected = (item: any) => {
    return selectedItems.find(selected => selected.id === item.id) !== undefined;
  };

  const getSelectionNumber = (item: any) => {
    const index = selectedItems.findIndex(selected => selected.id === item.id);
    return index >= 0 ? index + 1 : null;
  };

  const handleFolderOpen = (folder: any) => {
    setCurrentPath([...currentPath, folder.name]);
    // In a real app, this would load the folder contents
    setCurrentItems(mockFiles); // Simplified for demo
  };

  const handlePathNavigation = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    // In a real app, this would load the appropriate folder contents
    if (newPath.length === 1) {
      setCurrentItems([...mockFolders, ...mockFiles]);
    } else {
      setCurrentItems(mockFiles);
    }
  };

  const getFileIcon = (type: string) => {
    if (['JPG', 'PNG', 'GIF', 'WEBP'].includes(type)) {
      return <ImageIcon className="w-5 h-5 text-[#6B6B6B] stroke-1" />;
    }
    return <FileText className="w-5 h-5 text-[#6B6B6B] stroke-1" />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F9F9F9] flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-[#E5E5EA]">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="w-10 h-10 bg-transparent text-[#E85C3C] hover:bg-[#F2F2F7] rounded-full transition-all duration-150"
          >
            <ChevronLeft className="w-6 h-6 stroke-2" />
          </Button>
          
          <h1 className="font-bold text-[#1A1A1A] text-lg tracking-[0.1em] uppercase">
            IMPORT FILES
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-10 h-10 bg-transparent text-[#6B6B6B] hover:bg-[#F2F2F7] rounded-full transition-all duration-150"
          >
            <X className="w-6 h-6 stroke-2" />
          </Button>
        </div>

        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {currentPath.map((pathItem, index) => (
            <div key={index} className="flex items-center gap-2">
              <button
                onClick={() => handlePathNavigation(index)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-150 ${
                  index === currentPath.length - 1
                    ? 'bg-[#E85C3C] text-white'
                    : 'text-[#6B6B6B] hover:bg-[#F2F2F7] hover:text-[#1A1A1A]'
                }`}
              >
                {pathItem}
              </button>
              {index < currentPath.length - 1 && (
                <span className="text-[#6B6B6B] text-sm">/</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* File/Folder list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="divide-y divide-[#E5E5EA]">
            {currentItems.map((item) => {
              const isSelected = isItemSelected(item);
              const selectionNumber = getSelectionNumber(item);
              const isFolder = item.type === 'folder';
              
              return (
                <button
                  key={item.id}
                  onClick={() => isFolder ? handleFolderOpen(item) : handleItemSelect(item)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-[#F9F9F9] active:bg-[#F2F2F7] transition-all duration-150 text-left"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 bg-[#F2F2F7] rounded-xl flex items-center justify-center flex-shrink-0">
                    {isFolder ? (
                      <FolderOpen className="w-5 h-5 text-[#6B6B6B] stroke-1" />
                    ) : (
                      getFileIcon(item.type)
                    )}
                  </div>
                  
                  {/* File/Folder info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#1A1A1A] text-sm truncate">
                      {item.name}
                    </h3>
                    <p className="text-[#6B6B6B] text-xs">
                      {isFolder 
                        ? `${item.itemCount} items`
                        : `${item.size} • ${item.date}`
                      }
                    </p>
                  </div>
                  
                  {/* Selection indicator or chevron */}
                  {isFolder ? (
                    <ChevronLeft className="w-5 h-5 text-[#6B6B6B] stroke-1 rotate-180 flex-shrink-0" />
                  ) : isSelected ? (
                    <div className="w-6 h-6 bg-[#E85C3C] text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold">{selectionNumber}</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-[#E5E5EA] rounded-full flex-shrink-0"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="bg-white border-t border-[#E5E5EA] p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="px-6 py-3 h-12 text-[#6B6B6B] font-medium bg-transparent hover:bg-[#F2F2F7] active:bg-[#E5E5EA] rounded-xl transition-all duration-150"
          >
            Back to Files
          </Button>
          
          <Button
            onClick={() => {
              // Navigate back with selected items
              onBack();
            }}
            disabled={selectedItems.length === 0}
            className={`px-6 py-3 h-12 font-semibold rounded-xl transition-all duration-150 ${
              selectedItems.length === 0
                ? 'bg-[#F2F2F7] text-[#6B6B6B] cursor-not-allowed'
                : 'bg-[#E85C3C] text-white hover:bg-[#D54B2A] active:bg-[#C24B2A]'
            }`}
          >
            Selected ({selectedItems.length})
          </Button>
        </div>
      </div>
    </div>
  );
}