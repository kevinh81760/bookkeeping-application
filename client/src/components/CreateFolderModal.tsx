import { useState, useEffect, useRef } from 'react';
import { X, FolderPlus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface CreateFolderModalProps {
  onClose: () => void;
  onStateChange: (state: 'modal' | 'creating' | 'error') => void;
  onFolderCreated: (folderId: string, folderName: string) => void;
  existingFolders: { id: string; name: string }[];
  currentState: 'modal' | 'creating' | 'error';
  error?: string | null;
}

export function CreateFolderModal({ 
  onClose, 
  onStateChange, 
  onFolderCreated, 
  existingFolders,
  currentState,
  error 
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (currentState === 'modal' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentState]);

  // Validation function
  const validateFolderName = (name: string): string | null => {
    const trimmedName = name.trim();
    
    if (!trimmedName) return "Folder name is required";
    if (trimmedName.length > 50) return "Name must be 50 characters or less";
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
      return "Use only letters, numbers, spaces, - and _";
    }
    if (existingFolders.some(f => f.name.toLowerCase() === trimmedName.toLowerCase())) {
      return "A folder with this name already exists";
    }
    return null;
  };

  // Handle input change with real-time validation
  const handleInputChange = (value: string) => {
    setFolderName(value);
    if (value.trim()) {
      const error = validateFolderName(value);
      setValidationError(error);
    } else {
      setValidationError(null);
    }
  };

  // Handle form submission
  const handleCreateFolder = async () => {
    const trimmedName = folderName.trim();
    const error = validateFolderName(trimmedName);
    
    if (error) {
      setValidationError(error);
      return;
    }

    // Start creation process
    onStateChange('creating');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      // For now, we'll generate a mock folder ID
      const newFolderId = `folder-${Date.now()}`;
      
      onFolderCreated(newFolderId, trimmedName);
    } catch (err) {
      onStateChange('error');
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !validationError && folderName.trim()) {
      handleCreateFolder();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const isFormValid = folderName.trim() && !validationError;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full bg-white rounded-t-xl p-6 pb-8 animate-in slide-in-from-bottom-full duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-[#1A1A1A] text-lg tracking-[0.1em] uppercase">
            NEW FOLDER
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8 text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F2F2F7] rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content based on state */}
        {currentState === 'modal' && (
          <>
            {/* Input Section */}
            <div className="mb-6">
              <Input
                ref={inputRef}
                value={folderName}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Folder name"
                className="w-full bg-[#F2F2F7] border-0 rounded-xl px-4 py-4 text-base placeholder:text-[#6B6B6B] focus:bg-white focus:border-2 focus:border-[#E85C3C] focus:ring-0 transition-all duration-150"
                maxLength={50}
                disabled={currentState !== 'modal'}
              />
              
              {/* Validation Error */}
              {validationError && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {validationError}
                </p>
              )}
              
              {/* Character Count */}
              <p className="mt-2 text-xs text-[#6B6B6B] text-right">
                {folderName.length}/50
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 bg-white border border-[#E5E5EA] text-[#6B6B6B] hover:bg-[#F9F9F9] hover:border-[#E85C3C] active:bg-[#F2F2F7] rounded-xl font-medium transition-all duration-150"
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleCreateFolder}
                disabled={!isFormValid}
                className="flex-1 h-12 bg-[#E85C3C] hover:bg-[#D54B2A] active:bg-[#C24B2A] disabled:bg-[#E5E5EA] disabled:text-[#6B6B6B] text-white font-semibold rounded-xl transition-all duration-150"
              >
                Create
              </Button>
            </div>
          </>
        )}

        {currentState === 'creating' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4">
              <Loader2 className="w-8 h-8 text-[#E85C3C] animate-spin" />
            </div>
            <h3 className="font-semibold text-[#1A1A1A] text-base mb-2">
              Creating folder...
            </h3>
            <p className="text-[#6B6B6B] text-sm font-medium text-center">
              "{folderName.trim()}" will be ready in a moment
            </p>
          </div>
        )}

        {currentState === 'error' && (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <FolderPlus className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-bold text-[#1A1A1A] text-lg mb-2 tracking-[0.1em] uppercase">
                CREATION FAILED
              </h3>
              <p className="text-[#6B6B6B] text-sm font-medium mb-4">
                {error || "Unable to create folder. Please try again."}
              </p>
            </div>

            {/* Error Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 bg-white border border-[#E5E5EA] text-[#6B6B6B] hover:bg-[#F9F9F9] hover:border-[#E85C3C] active:bg-[#F2F2F7] rounded-xl font-medium transition-all duration-150"
              >
                Cancel
              </Button>
              
              <Button
                onClick={() => onStateChange('modal')}
                className="flex-1 h-12 bg-[#E85C3C] hover:bg-[#D54B2A] active:bg-[#C24B2A] text-white font-semibold rounded-xl transition-all duration-150"
              >
                Try Again
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}