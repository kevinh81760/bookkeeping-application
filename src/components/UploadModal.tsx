import { useState, useRef } from 'react';
import { X, Image, FileText, Clock, Check, FolderOpen, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface UploadModalProps {
  onClose: () => void;
  onStateChange: (state: 'modal' | 'permissions' | 'uploading' | 'error' | 'success' | 'fullscreen') => void;
  selectedItems: any[];
  onSelectedItemsChange: (items: any[]) => void;
  documents?: any[]; // Real documents from the app
}

interface FileItem {
  id: string;
  name: string;
  type: string;
  file: File;
  size: string;
  thumbnail?: string;
}

// Empty state component
function EmptyState({ 
  icon: IconComponent, 
  title, 
  description, 
  action 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
      <div className="w-16 h-16 bg-[#F2F2F7] rounded-full flex items-center justify-center mb-4">
        <IconComponent className="w-8 h-8 text-[#6B6B6B] stroke-1" />
      </div>
      <h3 className="font-medium text-[#1A1A1A] text-base mb-2">{title}</h3>
      <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6">{description}</p>
      {action}
    </div>
  );
}

export function UploadModal({ 
  onClose, 
  onStateChange, 
  selectedItems, 
  onSelectedItemsChange, 
  documents = [] 
}: UploadModalProps) {
  const [activeTab, setActiveTab] = useState('photos');
  const [filter, setFilter] = useState('all');
  const [deviceFiles, setDeviceFiles] = useState<FileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to get file type from filename
  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toUpperCase();
    return extension || 'FILE';
  };

  // Create thumbnail for image files
  const createImageThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        resolve(''); // No thumbnail for non-images
      }
    });
  };

  // Handle file selection from device
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: FileItem[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const thumbnail = await createImageThumbnail(file);
      
      const fileItem: FileItem = {
        id: `device-${Date.now()}-${i}`,
        name: file.name,
        type: getFileType(file.name),
        file: file,
        size: formatFileSize(file.size),
        thumbnail: thumbnail || undefined
      };
      
      newFiles.push(fileItem);
    }
    
    setDeviceFiles(prev => [...prev, ...newFiles]);
    
    // Clear the input so same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Trigger file picker
  const handlePickFiles = () => {
    fileInputRef.current?.click();
  };

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

  const handleImport = () => {
    if (selectedItems.length > 0) {
      onStateChange('uploading');
    }
  };

  const handleOpenFullscreen = () => {
    onStateChange('fullscreen');
  };

  // Filter device files for display
  const filteredDeviceFiles = filter === 'all' ? deviceFiles : 
    filter === 'images' ? deviceFiles.filter(p => ['JPG', 'PNG', 'JPEG', 'WEBP', 'GIF'].includes(p.type)) :
    filter === 'pdfs' ? deviceFiles.filter(p => p.type === 'PDF') : deviceFiles;

  // Get recent documents (last 7 days)
  const getRecentDocuments = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return documents
      .filter(doc => new Date(doc.dateCreated) > sevenDaysAgo)
      .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
      .slice(0, 10); // Show max 10 recent items
  };

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'photos':
        return (
          <div className="space-y-4">
            {/* Pick from Device Button */}
            <Button
              onClick={handlePickFiles}
              className="w-full h-12 bg-[#E85C3C] hover:bg-[#D54B2A] active:bg-[#C24B2A] text-white font-semibold rounded-xl transition-all duration-150"
            >
              Pick from Device Gallery
            </Button>
            
            {filteredDeviceFiles.length === 0 ? (
              <EmptyState 
                icon={Upload}
                title="Import from your device" 
                description="Select photos and documents from your device gallery to add them to your receipt collection." 
              />
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {filteredDeviceFiles.map((photo) => {
                  const isSelected = isItemSelected(photo);
                  const selectionNumber = getSelectionNumber(photo);
                  
                  return (
                    <button
                      key={photo.id}
                      onClick={() => handleItemSelect(photo)}
                      className="relative aspect-square bg-[#F2F2F7] rounded-xl overflow-hidden hover:bg-[#E5E5EA] active:bg-[#E0E0E0] transition-all duration-150 group"
                    >
                      {/* Thumbnail */}
                      <div className="w-full h-full flex items-center justify-center">
                        {photo.thumbnail ? (
                          <img 
                            src={photo.thumbnail} 
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="w-8 h-8 text-[#6B6B6B] stroke-1" />
                        )}
                      </div>
                      
                      {/* File type badge */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {photo.type}
                      </div>
                      
                      {/* Selection state */}
                      {isSelected ? (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#E85C3C] text-white rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold">{selectionNumber}</span>
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 w-6 h-6 border-2 border-white bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      
      case 'files':
        return documents.length === 0 ? (
          <EmptyState 
            icon={FileText}
            title="No documents yet" 
            description="Documents you capture or import will appear here for re-organization." 
          />
        ) : (
          <div className="space-y-1">
            {documents.slice(0, 20).map((file) => { // Show max 20 documents
              const isSelected = isItemSelected(file);
              const selectionNumber = getSelectionNumber(file);
              
              return (
                <button
                  key={file.id}
                  onClick={() => handleItemSelect(file)}
                  className="w-full p-3 flex items-center gap-3 bg-white border border-[#E5E5EA] rounded-xl hover:bg-[#F9F9F9] active:bg-[#F2F2F7] transition-all duration-150 text-left"
                >
                  {/* File icon */}
                  <div className="w-10 h-10 bg-[#F2F2F7] rounded-lg flex items-center justify-center flex-shrink-0">
                    {file.thumbnail ? (
                      <img 
                        src={file.thumbnail} 
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FileText className="w-5 h-5 text-[#6B6B6B] stroke-1" />
                    )}
                  </div>
                  
                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#1A1A1A] text-sm truncate">{file.name}</h3>
                    <p className="text-[#6B6B6B] text-xs">
                      {file.size} • {new Date(file.dateCreated).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Selection indicator */}
                  {isSelected ? (
                    <div className="w-6 h-6 bg-[#E85C3C] text-white rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold">{selectionNumber}</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-[#E5E5EA] rounded-full flex-shrink-0"></div>
                  )}
                </button>
              );
            })}
            
            {documents.length > 20 && (
              <button
                onClick={handleOpenFullscreen}
                className="w-full p-3 flex items-center gap-3 bg-[#F9F9F9] border border-[#E5E5EA] rounded-xl hover:bg-[#F2F2F7] active:bg-[#E5E5EA] transition-all duration-150 text-left"
              >
                <div className="w-10 h-10 bg-[#E85C3C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-5 h-5 text-[#E85C3C] stroke-1" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[#E85C3C] text-sm">Browse all documents</h3>
                  <p className="text-[#6B6B6B] text-xs">View all {documents.length} documents</p>
                </div>
              </button>
            )}
          </div>
        );
      
      case 'recents':
        const recentDocuments = getRecentDocuments();
        return recentDocuments.length === 0 ? (
          <EmptyState 
            icon={Clock}
            title="No recent imports" 
            description="Documents you've recently imported or captured will appear here for quick access." 
          />
        ) : (
          <div className="space-y-1">
            {recentDocuments.map((item) => {
              const isSelected = isItemSelected(item);
              const selectionNumber = getSelectionNumber(item);
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemSelect(item)}
                  className="w-full p-3 flex items-center gap-3 bg-white border border-[#E5E5EA] rounded-xl hover:bg-[#F9F9F9] active:bg-[#F2F2F7] transition-all duration-150 text-left"
                >
                  {/* Thumbnail or icon */}
                  <div className="w-10 h-10 bg-[#F2F2F7] rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.thumbnail ? (
                      <img 
                        src={item.thumbnail} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <FileText className="w-5 h-5 text-[#6B6B6B] stroke-1" />
                    )}
                  </div>
                  
                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#1A1A1A] text-sm truncate">{item.name}</h3>
                    <p className="text-[#6B6B6B] text-xs">
                      {item.size} • {new Date(item.dateCreated).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Selection indicator */}
                  {isSelected ? (
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
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Hidden file input for device file selection */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal container - 80% height bottom sheet */}
      <div className="relative w-full max-w-md h-[80%] bg-white rounded-t-xl flex flex-col animate-in slide-in-from-bottom duration-250 ease-out">
        {/* Top drag handle and header */}
        <div className="flex-shrink-0 px-4 pt-3 pb-4">
          {/* Drag handle */}
          <div className="w-12 h-1 bg-[#E5E5EA] rounded-full mx-auto mb-4"></div>
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#1A1A1A] text-xl tracking-[0.1em] uppercase">Upload</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 bg-transparent text-[#6B6B6B] hover:bg-[#F2F2F7] rounded-full transition-all duration-150"
            >
              <X className="w-5 h-5 stroke-2" />
            </Button>
          </div>
        </div>

        {/* Segmented control tabs */}
        <div className="flex-shrink-0 px-4 pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#F2F2F7] rounded-xl p-1">
              <TabsTrigger 
                value="photos" 
                className="rounded-xl text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-sm text-[#6B6B6B] transition-all"
              >
                Photos
              </TabsTrigger>
              <TabsTrigger 
                value="files"
                className="rounded-xl text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-sm text-[#6B6B6B] transition-all"
              >
                Files
              </TabsTrigger>
              <TabsTrigger 
                value="recents"
                className="rounded-xl text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1A1A1A] data-[state=active]:shadow-sm text-[#6B6B6B] transition-all"
              >
                Recents
              </TabsTrigger>
            </TabsList>

            {/* Filter chips for Photos tab */}
            {activeTab === 'photos' && (
              <div className="flex gap-2 mt-4">
                {['all', 'images', 'pdfs'].map((filterType) => (
                  <Button
                    key={filterType}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 h-8 rounded-full text-xs tracking-wider uppercase font-medium transition-all ${
                      filter === filterType
                        ? 'bg-[#E85C3C] text-white hover:bg-[#D54B2A]'
                        : 'bg-[#F2F2F7] text-[#6B6B6B] hover:bg-[#E5E5EA]'
                    }`}
                  >
                    {filterType === 'all' ? 'All' : filterType === 'images' ? 'Images' : 'PDFs'}
                  </Button>
                ))}
              </div>
            )}

            {/* Content area */}
            <div className="flex-1 mt-4 overflow-y-auto max-h-96">
              {getCurrentContent()}
            </div>
          </Tabs>
        </div>

        {/* Sticky bottom bar */}
        <div className="flex-shrink-0 p-4 border-t border-[#E5E5EA] bg-white">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onClose}
              className="px-6 py-3 h-12 text-[#6B6B6B] font-medium bg-transparent hover:bg-[#F2F2F7] active:bg-[#E5E5EA] rounded-xl transition-all duration-150"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleImport}
              disabled={selectedItems.length === 0}
              className={`px-6 py-3 h-12 font-semibold rounded-xl transition-all duration-150 ${
                selectedItems.length === 0
                  ? 'bg-[#F2F2F7] text-[#6B6B6B] cursor-not-allowed'
                  : 'bg-[#E85C3C] text-white hover:bg-[#D54B2A] active:bg-[#C24B2A]'
              }`}
            >
              Import ({selectedItems.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}