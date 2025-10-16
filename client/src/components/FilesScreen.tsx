import { Search, Camera, FileText, User, FolderOpen, Upload } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface FilesScreenProps {
  onNavigate: (screen: string, fileId?: string) => void;
  onOpenUpload: () => void;
}

// Mock files for demonstration with more realistic data
const mockFiles = [
  {
    id: 'file-1',
    name: 'Target Receipt',
    date: 'OCT 15, 2024',
    status: 'PROCESSED'
  },
  {
    id: 'file-2',
    name: 'Coffee Shop Receipt',
    date: 'OCT 14, 2024', 
    status: 'PROCESSED'
  },
  {
    id: 'file-3',
    name: 'Gas Station Receipt',
    date: 'OCT 13, 2024',
    status: 'PROCESSING'
  }
];

export function FilesScreen({ onNavigate, onOpenUpload }: FilesScreenProps) {
  const hasFiles = mockFiles.length > 0;

  return (
    <div className="w-full h-full min-h-screen bg-[#F9F9F9] flex flex-col">
      {/* Header with search and upload button */}
      <div className="pt-12 pb-6 px-4 bg-[#F9F9F9]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-bold text-[#1A1A1A] text-xl tracking-[0.1em] uppercase">FILES</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenUpload}
            className="w-10 h-10 bg-transparent text-[#E85C3C] hover:bg-white/50 active:bg-white/80 rounded-full transition-all duration-150"
          >
            <Upload className="w-5 h-5 stroke-2" />
          </Button>
        </div>
        
        <div className="relative">
          <Input
            placeholder="Search files"
            className="w-full bg-white border border-[#E5E5EA] rounded-xl px-4 py-3 pr-12 text-base placeholder:text-[#6B6B6B] focus:border-[#E85C3C] focus:ring-0 transition-colors"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B6B6B] stroke-1" />
        </div>
      </div>

      {/* Files list or empty state */}
      <div className="flex-1 px-4 pb-20 overflow-y-auto">
        {hasFiles ? (
          /* Card-based file list with iOS separators */
          <div className="bg-white rounded-xl overflow-hidden">
            {mockFiles.map((file, index) => (
              <div key={file.id}>
                {index > 0 && <div className="border-t border-[#E5E5EA] ml-4" />}
                
                {/* File Row / Default - tappable frame */}
                <button
                  className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-[#F9F9F9] active:bg-[#F2F2F7] transition-all duration-150 group"
                  onClick={() => onNavigate('file-detail', file.id)}
                >
                  <div className="flex items-start justify-between w-full">
                    {/* File info - mixed case */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-base mb-1">
                        {file.name}
                      </h3>
                      <p className="text-[#6B6B6B] text-sm tracking-wide uppercase font-medium">
                        {file.date}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Status pill with rounded corners */}
                      <span className={`px-3 py-1 text-xs tracking-wider uppercase font-medium rounded-full ${
                        file.status === 'PROCESSED' 
                          ? 'bg-[#E85C3C] text-white' 
                          : 'bg-[#F2F2F7] text-[#6B6B6B]'
                      }`}>
                        {file.status}
                      </span>
                      
                      {/* Right chevron accessory */}
                      <div className="w-2 h-2 border-r-2 border-t-2 border-[#C7C7CC] transform rotate-45 group-active:border-[#6B6B6B] transition-colors duration-150"></div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state - centered */
          <div className="flex-1 flex flex-col items-center justify-center text-center min-h-96">
            <div className="mb-8">
              <FolderOpen className="w-16 h-16 text-[#E5E5EA] stroke-1 mx-auto" />
            </div>
            <h3 className="font-bold text-[#1A1A1A] text-lg mb-4 tracking-[0.1em] uppercase">
              NO FILES UPLOADED YET
            </h3>
            <p className="text-[#1A1A1A] text-sm font-medium">
              Take a photo of a receipt or upload a file
            </p>
          </div>
        )}
      </div>

      {/* iOS-style tab bar with subtle top divider */}
      <div className="bg-white border-t border-[#E5E5EA] px-4 py-3 pb-6">
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            onClick={() => onNavigate('camera')}
            className="flex flex-col items-center gap-1 py-2 bg-transparent text-[#6B6B6B] hover:text-[#E85C3C] active:text-[#D54B2A] hover:bg-transparent active:bg-gray-50 rounded-none transition-all duration-150"
          >
            <Camera className="w-6 h-6 stroke-1 transition-all duration-150" />
            <span className="text-xs font-medium">Camera</span>
          </Button>
          
          {/* Active state with bold text + accent color */}
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 py-2 bg-transparent text-[#E85C3C] rounded-none"
          >
            <FileText className="w-6 h-6 stroke-2" />
            <span className="text-xs font-semibold">Files</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 py-2 bg-transparent text-[#6B6B6B] hover:text-[#E85C3C] active:text-[#D54B2A] hover:bg-transparent active:bg-gray-50 rounded-none transition-all duration-150"
          >
            <User className="w-6 h-6 stroke-1 transition-all duration-150" />
            <span className="text-xs font-medium">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}