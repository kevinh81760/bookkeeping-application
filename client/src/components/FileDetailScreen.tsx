import { useState } from 'react';
import { ChevronLeft, MoreHorizontal, Eye, Edit, Save, X, RotateCcw, FileEdit, Trash2, Check, AlertCircle, Clock, ZoomIn, RotateCw, Crop, ChevronDown, ChevronUp, FolderOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { StatusPill, StatusType } from './StatusPill';
import { InlineProgress } from './InlineProgress';
import { ProcessingToast } from './ProcessingToast';
import { toast } from 'sonner';

interface FileDetailScreenProps {
  onNavigate: (screen: string) => void;
  fileId: string | null;
  documents: Document[];
  onMoveFile?: (fileId: string) => void; // Add move file handler
}

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

// Mock file data with comprehensive details
const mockFileDetails = {
  'file-1': {
    id: 'file-1',
    name: 'Receipt_2024_001.pdf',
    folderName: 'January',
    uploadDate: 'Uploaded Oct 15, 2024 • 3:41 PM',
    status: 'PROCESSED' as FileStatus,
    processingProgress: 100,
    pageCount: 1,
    currentPage: 1,
    extractedData: {
      vendor: 'Target Corporation',
      date: '2024-10-15',
      amount: '47.82',
      category: 'Shopping',
      notes: 'Household items and groceries for weekly shopping trip'
    },
    bookkeepingData: {
      tax: '3.82',
      tip: '0.00',
      paymentMethod: 'Credit Card',
      glCategory: 'Office Supplies'
    },
    previewUrl: '/api/preview/file-1.jpg'
  },
  'file-2': {
    id: 'file-2', 
    name: 'Coffee_Receipt_BlueBottle.pdf',
    folderName: 'January',
    uploadDate: 'Uploaded Oct 14, 2024 • 8:23 AM',
    status: 'PROCESSED' as FileStatus,
    processingProgress: 100,
    pageCount: 1,
    currentPage: 1,
    extractedData: {
      vendor: 'Blue Bottle Coffee',
      date: '2024-10-14',
      amount: '8.50',
      category: 'Food & Drink', 
      notes: 'Morning coffee and pastry'
    },
    bookkeepingData: {
      tax: '0.68',
      tip: '1.50',
      paymentMethod: 'Cash',
      glCategory: 'Meals & Entertainment'
    },
    previewUrl: '/api/preview/file-2.pdf'
  },
  'file-3': {
    id: 'file-3',
    name: 'Gas_Station_Receipt_Shell.jpg',
    folderName: 'January',
    uploadDate: 'Uploaded Oct 13, 2024 • 2:15 PM', 
    status: 'PENDING' as FileStatus,
    processingProgress: 65,
    pageCount: 1,
    currentPage: 1,
    extractedData: {
      vendor: '',
      date: '',
      amount: '',
      category: '',
      notes: ''
    },
    bookkeepingData: {
      tax: '',
      tip: '',
      paymentMethod: '',
      glCategory: ''
    },
    previewUrl: '/api/preview/file-3.jpg'
  },
  'file-4': {
    id: 'file-4',
    name: 'Restaurant_Bill_Damaged_Photo.jpg',
    folderName: 'January',
    uploadDate: 'Uploaded Oct 12, 2024 • 7:45 PM',
    status: 'ERROR' as FileStatus,
    processingProgress: 0,
    pageCount: 1,
    currentPage: 1,
    extractedData: {
      vendor: '',
      date: '',
      amount: '',
      category: '',
      notes: ''
    },
    bookkeepingData: {
      tax: '',
      tip: '',
      paymentMethod: '',
      glCategory: ''
    },
    previewUrl: '/api/preview/file-4.jpg',
    errorMessage: 'Unable to extract data due to poor image quality. Please retake photo or upload a clearer image.'
  }
};

const categories = [
  'Food & Drink',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Business',
  'Travel',
  'Utilities',
  'Other'
];

const paymentMethods = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Check',
  'Bank Transfer',
  'Digital Wallet',
  'Other'
];

const glCategories = [
  'Office Supplies',
  'Meals & Entertainment',
  'Travel & Transportation',
  'Professional Services',
  'Marketing & Advertising',
  'Utilities',
  'Insurance',
  'Equipment',
  'Other'
];

export function FileDetailScreen({ onNavigate, fileId, documents, onMoveFile }: FileDetailScreenProps) {
  // Find the document in the real documents array
  const document = fileId ? documents.find(doc => doc.id === fileId) : null;
  
  if (!document) {
    return (
      <div className="w-full h-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <p className="text-[#6B6B6B] font-medium">Document not found</p>
      </div>
    );
  }

  // Create a compatible fileDetail object from the real document
  const fileDetail = {
    id: document.id,
    name: document.name,
    folderName: 'Folder', // We'll need to determine this from the folderId if needed
    uploadDate: new Date(document.dateCreated).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    status: document.status === 'synced' ? 'PROCESSED' : document.status === 'processing' ? 'PROCESSING' : 'ERROR',
    processingProgress: document.processingProgress || 100,
    pageCount: 1,
    currentPage: 1,
    extractedData: {
      vendor: 'Target Corporation', // Mock data for demo
      date: new Date(document.dateCreated).toISOString().split('T')[0],
      amount: '47.82', // Mock data for demo
      category: 'Shopping', // Mock data for demo
      notes: 'Receipt processed from camera capture'
    },
    bookkeepingData: {
      tax: '3.82', // Mock data for demo
      tip: '0.00',
      paymentMethod: 'Credit Card',
      glCategory: 'Office Supplies'
    },
    previewUrl: document.thumbnail || '/api/placeholder-receipt.jpg',
    errorMessage: document.status === 'error' ? 'Processing failed. Please try again.' : undefined
  } as const;

  type FileStatus = 'PROCESSED' | 'PENDING' | 'PROCESSING' | 'ERROR';

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState(fileDetail?.extractedData || {});
  const [editedBookkeeping, setEditedBookkeeping] = useState(fileDetail?.bookkeepingData || {});
  const [hasChanges, setHasChanges] = useState(false);
  const [isBookkeepingOpen, setIsBookkeepingOpen] = useState(false);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [reprocessingProgress, setReprocessingProgress] = useState(0);
  const [reprocessingStatus, setReprocessingStatus] = useState<StatusType>('pending');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleEditToggle = () => {
    if (isEditMode) {
      // Cancel edit mode
      setEditedData(fileDetail.extractedData);
      setEditedBookkeeping(fileDetail.bookkeepingData);
      setHasChanges(false);
    }
    setIsEditMode(!isEditMode);
  };

  const handleSaveChanges = () => {
    // In a real app, this would make an API call to save the data
    console.log('Saving changes:', { extractedData: editedData, bookkeepingData: editedBookkeeping });
    setIsEditMode(false);
    setHasChanges(false);
    
    // Show success toast
    setToastType('success');
    setToastMessage('Changes saved successfully');
    setShowToast(true);
    
    // Auto-dismiss after 2s
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleFieldChange = (field: string, value: string, isBookkeeping = false) => {
    if (isBookkeeping) {
      setEditedBookkeeping(prev => ({ ...prev, [field]: value }));
    } else {
      setEditedData(prev => ({ ...prev, [field]: value }));
    }
    setHasChanges(true);
  };

  const simulateProcessingError = Math.random() < 0.3; // 30% chance of error for demo

  const handleReprocess = () => {
    setIsReprocessing(true);
    setReprocessingStatus('processing');
    setReprocessingProgress(0);
    setShowRetryButton(false);
    
    // Simulate processing steps
    const steps = [25, 50, 75, 100];
    let currentStep = 0;
    
    const processStep = () => {
      if (currentStep < steps.length) {
        setReprocessingProgress(steps[currentStep]);
        currentStep++;
        
        // Stop at 75% for error simulation
        if (simulateProcessingError && steps[currentStep - 1] === 75) {
          setTimeout(() => {
            setReprocessingStatus('error');
            setToastType('error');
            setToastMessage('Extraction failed. Try again.');
            setShowToast(true);
            setShowRetryButton(true);
            setIsReprocessing(false);
            
            // Auto-dismiss toast after 2s
            setTimeout(() => setShowToast(false), 2000);
          }, 200);
          return;
        }
        
        if (currentStep < steps.length) {
          setTimeout(processStep, 200);
        } else {
          // Success
          setTimeout(() => {
            setReprocessingStatus('processed');
            setIsReprocessing(false);
            setToastType('success');
            setToastMessage('Processed successfully');
            setShowToast(true);
            
            // Auto-dismiss toast after 2s
            setTimeout(() => setShowToast(false), 2000);
          }, 200);
        }
      }
    };
    
    // Start processing after a small delay
    setTimeout(processStep, 200);
  };

  const handleRetryReprocess = () => {
    setShowRetryButton(false);
    handleReprocess();
  };

  const handleDelete = () => {
    toast.success('File deleted');
    onNavigate('folder-contents');
  };

  // Convert file status to StatusType
  const getStatusType = (status: FileStatus): StatusType => {
    switch (status) {
      case 'PROCESSED': return 'processed';
      case 'PENDING': return 'pending';
      case 'PROCESSING': return 'processing';
      case 'ERROR': return 'error';
      default: return 'pending';
    }
  };

  // Get the current status to display
  const currentStatus = isReprocessing ? reprocessingStatus : getStatusType(fileDetail.status);
  const currentProgress = isReprocessing ? reprocessingProgress : fileDetail.processingProgress;

  const renderField = (label: string, field: string, value: string, type: 'input' | 'select' | 'textarea' | 'date' | 'currency' = 'input', options: string[] = [], isBookkeeping = false) => {
    const currentValue = isBookkeeping ? 
      editedBookkeeping[field as keyof typeof editedBookkeeping] || value :
      editedData[field as keyof typeof editedData] || value;
    
    if (fileDetail.status === 'PENDING' || fileDetail.status === 'PROCESSING') {
      return (
        <div key={field} className="px-4 py-4 border-b border-[#E5E5EA] last:border-b-0">
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B] text-xs tracking-wider uppercase font-medium">{label}</span>
            <div className="w-20 h-4 bg-[#F2F2F7] rounded animate-pulse"></div>
          </div>
        </div>
      );
    }

    if (!isEditMode) {
      return (
        <div key={field} className="px-4 py-4 border-b border-[#E5E5EA] last:border-b-0">
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B] text-xs tracking-wider uppercase font-medium">{label}</span>
            <span className="text-[#1A1A1A] font-medium text-right max-w-[200px] truncate">
              {currentValue || 'Not set'}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div key={field} className="px-4 py-4 border-b border-[#E5E5EA] last:border-b-0">
        <span className="text-[#6B6B6B] text-xs tracking-wider uppercase font-medium block mb-2">{label}</span>
        {type === 'input' && (
          <Input
            value={currentValue}
            onChange={(e) => handleFieldChange(field, e.target.value, isBookkeeping)}
            className="w-full h-11 bg-white border border-[#E5E5EA] rounded-xl px-3 text-[#1A1A1A] font-medium"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
        {type === 'date' && (
          <Input
            type="date"
            value={currentValue}
            onChange={(e) => handleFieldChange(field, e.target.value, isBookkeeping)}
            className="w-full h-11 bg-white border border-[#E5E5EA] rounded-xl px-3 text-[#1A1A1A] font-medium"
          />
        )}
        {type === 'currency' && (
          <Input
            type="number"
            step="0.01"
            value={currentValue}
            onChange={(e) => handleFieldChange(field, e.target.value, isBookkeeping)}
            className="w-full h-11 bg-white border border-[#E5E5EA] rounded-xl px-3 text-[#1A1A1A] font-medium"
            placeholder="0.00"
          />
        )}
        {type === 'select' && (
          <Select value={currentValue} onValueChange={(newValue) => handleFieldChange(field, newValue, isBookkeeping)}>
            <SelectTrigger className="w-full h-11 bg-white border border-[#E5E5EA] rounded-xl px-3">
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {type === 'textarea' && (
          <Textarea
            value={currentValue}
            onChange={(e) => handleFieldChange(field, e.target.value, isBookkeeping)}
            className="w-full min-h-[80px] bg-white border border-[#E5E5EA] rounded-xl px-3 py-2 text-[#1A1A1A] font-medium resize-none"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#F9F9F9] flex flex-col">
      {/* Header */}
      <div className="bg-[#F9F9F9] pt-12 pb-4 px-4 border-b border-[#E5E5EA]">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('folder-contents')}
            className="w-10 h-10 bg-transparent text-[#E85C3C] hover:bg-white/50 active:bg-white/80 rounded-full transition-all duration-150"
          >
            <ChevronLeft className="w-6 h-6 stroke-2" />
          </Button>
          
          <div className="flex-1 mx-4 min-w-0">
            <h1 className="font-bold text-[#1A1A1A] text-lg tracking-[0.05em] truncate text-center">
              {fileDetail.name}
            </h1>
            <p className="text-[#6B6B6B] text-xs font-medium text-center mt-1">
              {fileDetail.folderName}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 bg-transparent text-[#6B6B6B] hover:bg-white/50 active:bg-white/80 rounded-full transition-all duration-150"
              >
                <MoreHorizontal className="w-6 h-6 stroke-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border border-[#E5E5EA] rounded-xl shadow-lg">
              <DropdownMenuItem
                onClick={() => onMoveFile?.(fileDetail.id)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9F9F9] focus:bg-[#F9F9F9] cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-[#6B6B6B] stroke-1" />
                <span className="text-[#1A1A1A] font-medium">Move to…</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Preview Card */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-xl p-4 relative">
          <div className="w-full h-48 bg-[#F2F2F7] rounded-xl flex items-center justify-center overflow-hidden relative group">
            <ImageWithFallback
              src={fileDetail.previewUrl}
              alt={fileDetail.name}
              className="w-full h-full object-cover"
              fallback={<Eye className="w-12 h-12 text-[#6B6B6B] stroke-1" />}
            />
            
            {/* Preview Controls Overlay */}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 rounded-lg"
              >
                <ZoomIn className="w-4 h-4 stroke-2" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 rounded-lg"
              >
                <RotateCw className="w-4 h-4 stroke-2" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 rounded-lg"
              >
                <Crop className="w-4 h-4 stroke-2" />
              </Button>
            </div>
          </div>
          
          {/* Page Navigation */}
          {fileDetail.pageCount > 1 && (
            <div className="flex justify-center mt-3 gap-1">
              {Array.from({ length: fileDetail.pageCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentPage === i + 1 ? 'bg-[#E85C3C]' : 'bg-[#E5e5EA]'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Row */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <StatusPill status={currentStatus} />
          {showRetryButton && currentStatus === 'error' && (
            <Button
              variant="ghost"
              onClick={handleRetryReprocess}
              className="text-[#E85C3C] text-sm font-medium tracking-wider uppercase px-3 py-1 h-auto hover:bg-[#E85C3C]/10 rounded-lg"
            >
              Retry
            </Button>
          )}
          <span className="text-[#6B6B6B] text-sm font-medium">{fileDetail.uploadDate}</span>
        </div>
        
        {/* Inline Progress */}
        <div className="mt-3">
          <InlineProgress
            progress={currentProgress}
            isVisible={currentStatus === 'processing' || (isReprocessing && currentStatus !== 'error')}
          />
        </div>
      </div>

      {/* Content Sections */}
      <div className="flex-1 px-4 pb-4 space-y-4">
        {/* Extracted Fields */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E5EA] bg-[#F9F9F9] flex items-center justify-between">
            <h3 className="font-bold text-[#1A1A1A] text-base tracking-[0.1em] uppercase">
              EXTRACTED FIELDS
            </h3>
            {!isEditMode && fileDetail.status === 'PROCESSED' && (
              <Button
                variant="ghost"
                onClick={handleEditToggle}
                className="text-[#E85C3C] text-sm font-medium tracking-wider uppercase px-3 py-1 h-auto hover:bg-[#E85C3C]/10 rounded-lg"
              >
                Edit
              </Button>
            )}
          </div>
          
          {fileDetail.status === 'ERROR' ? (
            <div className="p-4 text-center">
              <AlertCircle className="w-8 h-8 text-[#FF3B30] mx-auto mb-2" />
              <p className="text-[#FF3B30] font-medium text-sm">
                {fileDetail.errorMessage}
              </p>
            </div>
          ) : (
            <>
              {renderField('Vendor', 'vendor', editedData.vendor)}
              {renderField('Date', 'date', editedData.date, 'date')}
              {renderField('Total Amount', 'amount', editedData.amount, 'currency')}
              {renderField('Category', 'category', editedData.category, 'select', categories)}
              {renderField('Notes', 'notes', editedData.notes, 'textarea')}
            </>
          )}
        </div>

        {/* Bookkeeping Section */}
        {fileDetail.status === 'PROCESSED' && (
          <Collapsible open={isBookkeepingOpen} onOpenChange={setIsBookkeepingOpen}>
            <div className="bg-white rounded-xl overflow-hidden">
              <CollapsibleTrigger asChild>
                <div className="px-4 py-3 border-b border-[#E5E5EA] bg-[#F9F9F9] flex items-center justify-between cursor-pointer hover:bg-[#F2F2F7] transition-colors">
                  <h3 className="font-bold text-[#1A1A1A] text-base tracking-[0.1em] uppercase">
                    BOOKKEEPING
                  </h3>
                  {isBookkeepingOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#6B6B6B]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6B6B6B]" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {renderField('Tax', 'tax', editedBookkeeping.tax, 'currency', [], true)}
                {renderField('Tip', 'tip', editedBookkeeping.tip, 'currency', [], true)}
                {renderField('Payment Method', 'paymentMethod', editedBookkeeping.paymentMethod, 'select', paymentMethods, true)}
                {renderField('GL Category', 'glCategory', editedBookkeeping.glCategory, 'select', glCategories, true)}
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}
      </div>

      {/* Actions - Non-Edit Mode */}
      {!isEditMode && fileDetail.status !== 'PENDING' && fileDetail.status !== 'PROCESSING' && (
        <div className="px-4 pb-8 pt-2">
          {fileDetail.status === 'ERROR' ? (
            <div className="space-y-3">
              <Button
                onClick={handleReprocess}
                disabled={isReprocessing}
                className="w-full h-12 bg-[#E85C3C] hover:bg-[#D54B2A] active:bg-[#C24B2A] text-white font-semibold rounded-xl transition-all duration-150"
              >
                <RotateCcw className="w-4 h-4 mr-2 stroke-2" />
                Reprocess
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => toast.success('Rename functionality would open here')}
                  className="flex-1 h-10 bg-white border border-[#E5E5EA] text-[#1A1A1A] hover:bg-[#F9F9F9] hover:border-[#E85C3C] active:bg-[#F2F2F7] rounded-xl font-medium transition-all duration-150"
                >
                  <FileEdit className="w-4 h-4 mr-2 stroke-1" />
                  Rename
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 h-10 bg-white border border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30]/10 hover:border-[#FF3B30] active:bg-[#FF3B30]/20 rounded-xl font-medium transition-all duration-150"
                    >
                      <Trash2 className="w-4 h-4 mr-2 stroke-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[320px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete file?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The file will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-[#FF3B30] hover:bg-[#FF2D1B] text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReprocess}
                disabled={isReprocessing}
                className="flex-1 h-10 bg-white border border-[#E5E5EA] text-[#1A1A1A] hover:bg-[#F9F9F9] hover:border-[#E85C3C] active:bg-[#F2F2F7] rounded-xl font-medium transition-all duration-150"
              >
                <RotateCcw className="w-4 h-4 mr-2 stroke-1" />
                Reprocess
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success('Rename functionality would open here')}
                className="flex-1 h-10 bg-white border border-[#E5E5EA] text-[#1A1A1A] hover:bg-[#F9F9F9] hover:border-[#E85C3C] active:bg-[#F2F2F7] rounded-xl font-medium transition-all duration-150"
              >
                <FileEdit className="w-4 h-4 mr-2 stroke-1" />
                Rename
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 bg-white border border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30]/10 hover:border-[#FF3B30] active:bg-[#FF3B30]/20 rounded-xl font-medium transition-all duration-150"
                  >
                    <Trash2 className="w-4 h-4 mr-2 stroke-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[320px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete file?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The file will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-[#FF3B30] hover:bg-[#FF2D1B] text-white"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      )}

      {/* Edit Mode Sticky Bottom Bar */}
      {isEditMode && (
        <div className="sticky bottom-0 bg-white border-t border-[#E5E5EA] p-4 flex gap-3">
          <Button
            variant="ghost"
            onClick={handleEditToggle}
            className="text-[#E85C3C] font-medium px-6 py-3 h-auto hover:bg-[#E85C3C]/10 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={!hasChanges}
            className={`flex-1 h-12 font-semibold rounded-xl transition-all duration-150 ${
              hasChanges 
                ? 'bg-[#E85c3C] hover:bg-[#D54B2A] active:bg-[#C24B2A] text-white'
                : 'bg-[#F2F2F7] text-[#6B6B6B] cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4 mr-2 stroke-2" />
            Save Changes
          </Button>
        </div>
      )}

      {/* Processing Toast */}
      <ProcessingToast
        type={toastType}
        message={toastMessage}
        isVisible={showToast}
        onRetry={toastType === 'error' ? handleRetryReprocess : undefined}
        onDismiss={() => setShowToast(false)}
      />
    </div>
  );
}