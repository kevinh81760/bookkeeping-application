import { useState, useCallback, useMemo, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { CameraScreen } from './components/CameraScreen';
import { PhotoConfirmScreen } from './components/PhotoConfirmScreen';
import { CaptureReviewScreen } from './components/CaptureReviewScreen';
import { CaptureReviewAutocropOffScreen } from './components/CaptureReviewAutocropOffScreen';
import { CaptureReviewLowConfidenceScreen } from './components/CaptureReviewLowConfidenceScreen';
import { CaptureReviewMultipageScreen } from './components/CaptureReviewMultipageScreen';
import { FilesScreen } from './components/FilesScreen';
import { FilesGridScreen } from './components/FilesGridScreen';
import { FilesListScreen } from './components/FilesListScreen';
import { FilesEmptyGridScreen } from './components/FilesEmptyGridScreen';
import { FilesEmptyListScreen } from './components/FilesEmptyListScreen';
import { FilesGridSkeleton } from './components/FilesGridSkeleton';
import { FilesListSkeleton } from './components/FilesListSkeleton';
import { FolderContentsScreen } from './components/FolderContentsScreen';
import { FolderContentsEmptyScreen } from './components/FolderContentsEmptyScreen';
import { FolderContentsSkeleton } from './components/FolderContentsSkeleton';
import { FileDetailScreen } from './components/FileDetailScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { OnboardingScreen1 } from './components/OnboardingScreen1';
import { OnboardingScreen2 } from './components/OnboardingScreen2';
import { OnboardingScreen3 } from './components/OnboardingScreen3';
import { PermissionsCameraScreen } from './components/PermissionsCameraScreen';
import { PermissionsPhotosScreen } from './components/PermissionsPhotosScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { UploadModal } from './components/UploadModal';
import { UploadPermissions } from './components/UploadPermissions';
import { UploadUploading } from './components/UploadUploading';
import { UploadSuccess } from './components/UploadSuccess';
import { UploadError } from './components/UploadError';
import { UploadFullscreen } from './components/UploadFullscreen';
import { CreateFolderModal } from './components/CreateFolderModal';
import { FolderSelectionModal } from './components/FolderSelectionModal';
import { ToastManager, useToasts } from './components/ToastManager';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { ToastBottom } from './components/ToastBottom';
import { MoveToModal } from './components/MoveToModal';
import { SetupCategoriesScreen } from './components/SetupCategoriesScreen';

// iPhone 16 optimized mobile app (393×852px)
// Hybrid iOS × Swiss design language implementation

type ScreenType = 'onboarding-1' | 'onboarding-2' | 'onboarding-3' | 'login' | 'camera' | 'photo-confirm' | 'capture-review' | 'capture-review-autocrop-off' | 'capture-review-low-confidence' | 'capture-review-multipage' | 'files' | 'files-grid' | 'files-list' | 'files-empty-grid' | 'files-empty-list' | 'files-grid-skeleton' | 'files-list-skeleton' | 'folder-contents' | 'folder-contents-empty' | 'folder-contents-skeleton' | 'file-detail' | 'profile' | 'setup-categories';
type UploadStateType = 'modal' | 'permissions' | 'uploading' | 'success' | 'error' | 'fullscreen';
type CreateFolderStateType = 'modal' | 'creating' | 'error';
type PermissionStateType = 'none' | 'camera' | 'photos' | 'complete';

interface Column {
  id: string;
  name: string;
  type: 'Text' | 'Number' | 'Date' | 'Currency' | 'Enum';
  required: boolean;
  showAdvanced: boolean;
  parseFrom?: string;
  validation?: string;
}

interface Document {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document';
  size: string;
  dateCreated: string;
  folderId: string | null; // null = not in any folder
  status: 'synced' | 'processing' | 'error';
  processingProgress?: number;
  thumbnail?: string; // for image previews
}

interface Folder {
  id: string;
  name: string;
  description?: string;
  itemCount: number;
  documentIds: string[]; // track which documents belong here
  dateCreated: string;
  lastUpdated: string;
  columns?: Column[]; // schema definition
  autoParse?: boolean; // auto-parse photos
  exportEnabled?: boolean; // export to Google Sheets
  schemaActive?: boolean; // whether schema is configured
}

export default function App() {
  // App state management
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('onboarding-1'); // Start with onboarding
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('files-list');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadState, setUploadState] = useState<UploadStateType>('modal');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false); // Reduce motion preference
  const [showDevAnnotations, setShowDevAnnotations] = useState(false); // Development annotations toggle

  // Toast system
  const { toasts, dismissToast, showSuccess, showError, showInfo } = useToasts();

  // First-run and permissions state
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [permissionState, setPermissionState] = useState<PermissionStateType>('none');
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Folder creation state
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [createFolderState, setCreateFolderState] = useState<CreateFolderStateType>('modal');
  const [createFolderError, setCreateFolderError] = useState<string | null>(null);

  // Folder selection state
  const [folderSelectionModalOpen, setFolderSelectionModalOpen] = useState(false);

  // Move functionality state
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [fileToMove, setFileToMove] = useState<string | null>(null);
  const [moveSuccessToast, setMoveSuccessToast] = useState<{
    show: boolean;
    folderName: string;
    itemCount: number;
  }>({ show: false, folderName: '', itemCount: 0 });

  // Document and folder management
  const [existingFolders, setExistingFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  // LocalStorage utilities - make them stable to avoid infinite loops
  const saveToLocalStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, []);

  const loadFromLocalStorage = useCallback((key: string, defaultValue: any) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }, []);

  // Load data from localStorage on app initialization - run only once
  useEffect(() => {
    const savedFolders = loadFromLocalStorage('existingFolders', []);
    const savedDocuments = loadFromLocalStorage('documents', []);
    const savedIsFirstRun = loadFromLocalStorage('isFirstRun', true);
    
    setExistingFolders(savedFolders);
    setDocuments(savedDocuments);
    setIsFirstRun(savedIsFirstRun);
    
    // If user has completed onboarding before, start on camera
    if (!savedIsFirstRun) {
      setCurrentScreen('camera');
    }
  }, []); // Empty dependency array - run only on mount

  // Save folders to localStorage whenever they change - avoid initial save
  useEffect(() => {
    // Skip saving on initial load when existingFolders is empty
    if (existingFolders.length > 0) {
      saveToLocalStorage('existingFolders', existingFolders);
    }
  }, [existingFolders]);

  // Save documents to localStorage whenever they change - avoid initial save
  useEffect(() => {
    // Skip saving on initial load when documents is empty
    if (documents.length > 0) {
      saveToLocalStorage('documents', documents);
    }
  }, [documents]);

  // Save onboarding state to localStorage
  useEffect(() => {
    saveToLocalStorage('isFirstRun', isFirstRun);
  }, [isFirstRun]);

  // Utility function to generate document name
  const generateDocumentName = useCallback((type: 'image' | 'pdf' | 'document' = 'image') => {
    const now = new Date();
    const timestamp = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).replace(/,/g, '');
    
    const typeMap = {
      image: 'Receipt',
      pdf: 'Document', 
      document: 'Document'
    };
    
    return `${typeMap[type]} ${timestamp}`;
  }, []);

  // Utility function to update folder counts
  const updateFolderCounts = useCallback(() => {
    setExistingFolders(prevFolders => 
      prevFolders.map(folder => ({
        ...folder,
        itemCount: folder.documentIds.length,
        lastUpdated: new Date().toISOString()
      }))
    );
  }, []);

  // Logic to determine which files screen to show based on folder and document count
  const getFilesScreen = useCallback((requestedScreen: string) => {
    if (existingFolders.length === 0 && documents.length === 0) {
      return requestedScreen.includes('grid') ? 'files-empty-grid' : 'files-empty-list';
    }
    return requestedScreen;
  }, [existingFolders.length, documents.length]);

  // Memoized callbacks to prevent unnecessary re-renders
  const handleNavigate = useCallback((screen: ScreenType, id?: string) => {
    setPreviousScreen(currentScreen);

    // Define main tab screens for each tab
    const cameraTabScreens = ['camera'];
    const filesTabScreens = ['files-grid', 'files-list', 'files-empty-grid', 'files-empty-list'];
    const profileTabScreens = ['profile'];
    const allMainTabScreens = [...cameraTabScreens, ...filesTabScreens, ...profileTabScreens];

    // Define capture/photo workflow screens that shouldn't trigger skeleton loading
    const captureWorkflowScreens = ['capture-review', 'capture-review-autocrop-off', 'capture-review-low-confidence', 'capture-review-multipage', 'photo-confirm'];

    // Detect view switching within files screens
    const isFilesViewSwitch = (currentScreen === 'files-grid' && screen === 'files-list') || 
                             (currentScreen === 'files-list' && screen === 'files-grid') ||
                             (currentScreen === 'files-empty-grid' && screen === 'files-empty-list') ||
                             (currentScreen === 'files-empty-list' && screen === 'files-empty-grid');
    
    // Detect tab switching between main navigation tabs
    const isTabSwitch = allMainTabScreens.includes(currentScreen) && allMainTabScreens.includes(screen);
    
    // Detect navigation from capture workflow (should skip skeleton)
    const isFromCaptureWorkflow = captureWorkflowScreens.includes(currentScreen);
    
    // Skip skeleton loading for view switches, tab switches, and capture workflow
    if (!isFilesViewSwitch && !isTabSwitch && !isFromCaptureWorkflow) {
      if (screen === 'files-grid' && !currentScreen.includes('files')) {
        setCurrentScreen('files-grid-skeleton');
        return;
      }
      if (screen === 'files-list' && !currentScreen.includes('files')) {
        setCurrentScreen('files-list-skeleton');
        return;
      }
      if (screen === 'folder-contents' && currentScreen !== 'folder-contents-skeleton') {
        setCurrentScreen('folder-contents-skeleton');
        if (id) setSelectedFolderId(id);
        return;
      }
    }

    // Use the dynamic screen logic for files screens
    if (screen === 'files-grid' || screen === 'files-list') {
      const actualScreen = getFilesScreen(screen);
      setCurrentScreen(actualScreen as ScreenType);
    } else {
      setCurrentScreen(screen);
    }
    
    if (screen === 'file-detail') {
      setSelectedFileId(id || null);
    } else if (screen === 'folder-contents') {
      setSelectedFolderId(id || null);
    }
  }, [currentScreen, getFilesScreen]);

  const handleCapturePhoto = useCallback(() => {
    setCurrentScreen('capture-review');
  }, []);

  const handleSavePhoto = useCallback((photoData: any, targetFolderId?: string) => {
    console.log('Saving photo:', photoData);
    
    // Generate unique document
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    // Randomly create processing documents for demo purposes (30% chance)
    const isProcessing = Math.random() < 0.3;
    
    const newDocument: Document = {
      id: documentId,
      name: generateDocumentName('image'),
      type: 'image',
      size: '2.4 MB', // Mock file size
      dateCreated: now.toISOString(),
      folderId: targetFolderId || null,
      status: isProcessing ? 'processing' : 'synced',
      processingProgress: isProcessing ? Math.floor(Math.random() * 75) + 15 : 100, // 15-90% for processing
      thumbnail: photoData?.thumbnail || null
    };
    
    // Add document to documents array
    setDocuments(prev => [...prev, newDocument]);
    
    // Update folder if document is being saved to a specific folder
    if (targetFolderId) {
      setExistingFolders(prevFolders => 
        prevFolders.map(folder => 
          folder.id === targetFolderId 
            ? {
                ...folder,
                documentIds: [...folder.documentIds, documentId],
                itemCount: folder.documentIds.length + 1,
                lastUpdated: now.toISOString()
              }
            : folder
        )
      );
      
      const targetFolder = existingFolders.find(f => f.id === targetFolderId);
      showSuccess(`Document saved to "${targetFolder?.name || 'folder'}"`);
    } else {
      showSuccess('Document saved successfully');
    }
    
    // If document is processing, simulate progress updates
    if (isProcessing) {
      let currentProgress = newDocument.processingProgress || 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 15) + 5; // Increment by 5-20%
        
        if (currentProgress >= 100) {
          currentProgress = 100;
          
          // Update document to completed state
          setDocuments(prevDocs => 
            prevDocs.map(doc => 
              doc.id === documentId 
                ? { ...doc, status: 'synced' as const, processingProgress: 100 }
                : doc
            )
          );
          
          clearInterval(progressInterval);
        } else {
          // Update progress
          setDocuments(prevDocs => 
            prevDocs.map(doc => 
              doc.id === documentId 
                ? { ...doc, processingProgress: currentProgress }
                : doc
            )
          );
        }
      }, 1000); // Update every second
    }
    
    setCapturedImage(null);
    
    // Navigate to files screen to show the saved document
    handleNavigate('files-grid');
  }, [generateDocumentName, existingFolders, showSuccess, handleNavigate]);

  const handleOpenUpload = useCallback(() => {
    setUploadModalOpen(true);
    setUploadState('modal');
  }, []);

  const handleCloseUpload = useCallback(() => {
    setUploadModalOpen(false);
    setSelectedItems([]);
    setUploadState('modal');
  }, []);

  const handleUploadStateChange = useCallback((state: UploadStateType) => {
    setUploadState(state);
  }, []);

  const handleCreateFolder = useCallback(() => {
    setCreateFolderModalOpen(true);
    setCreateFolderState('modal');
    setCreateFolderError(null);
  }, []);

  const handleCloseCreateFolder = useCallback(() => {
    setCreateFolderModalOpen(false);
    setCreateFolderError(null);
  }, []);

  const handleCreateFolderStateChange = useCallback((state: CreateFolderStateType) => {
    setCreateFolderState(state);
  }, []);

  const handleFolderCreated = useCallback((folderId: string, folderName: string) => {
    const newFolder: Folder = { 
      id: folderId, 
      name: folderName, 
      description: '',
      itemCount: 0, 
      documentIds: [], 
      dateCreated: new Date().toISOString(), 
      lastUpdated: new Date().toISOString(),
      columns: [],
      autoParse: true,
      exportEnabled: false,
      schemaActive: false
    };
    setExistingFolders(prev => [...prev, newFolder]);
    setCreateFolderModalOpen(false);
    // Navigate to setup categories instead of folder contents
    setSelectedFolderId(folderId);
    handleNavigate('setup-categories');
  }, [handleNavigate]);

  const handleOpenFolderSelection = useCallback(() => {
    setFolderSelectionModalOpen(true);
  }, []);

  const handleCloseFolderSelection = useCallback(() => {
    setFolderSelectionModalOpen(false);
  }, []);

  const handleSelectFolder = useCallback((folderId: string) => {
    handleNavigate('folder-contents', folderId);
    setFolderSelectionModalOpen(false);
  }, [handleNavigate]);

  // Move functionality handlers
  const handleMoveFile = useCallback((fileId: string) => {
    setFileToMove(fileId);
    setMoveModalOpen(true);
  }, []);

  const handleCloseMoveModal = useCallback(() => {
    setMoveModalOpen(false);
    setFileToMove(null);
  }, []);

  const handleMoveDocument = useCallback((targetFolderId: string | null, rememberDestination?: boolean) => {
    if (!fileToMove) return;

    const document = documents.find(doc => doc.id === fileToMove);
    if (!document) return;

    const currentFolderId = document.folderId;
    
    // Update document's folder assignment
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === fileToMove 
          ? { ...doc, folderId: targetFolderId }
          : doc
      )
    );

    // Update folder counts
    setExistingFolders(prevFolders => 
      prevFolders.map(folder => {
        const now = new Date().toISOString();
        
        // Remove from current folder
        if (folder.id === currentFolderId) {
          return {
            ...folder,
            documentIds: folder.documentIds.filter(id => id !== fileToMove),
            itemCount: folder.documentIds.filter(id => id !== fileToMove).length,
            lastUpdated: now
          };
        }
        
        // Add to target folder
        if (folder.id === targetFolderId) {
          return {
            ...folder,
            documentIds: [...folder.documentIds, fileToMove],
            itemCount: folder.documentIds.length + 1,
            lastUpdated: now
          };
        }
        
        return folder;
      })
    );

    // Show success toast
    const targetFolder = existingFolders.find(f => f.id === targetFolderId);
    const folderName = targetFolderId ? (targetFolder?.name || 'folder') : 'Files';
    
    setMoveSuccessToast({
      show: true,
      folderName,
      itemCount: 1
    });

    // Close modal
    handleCloseMoveModal();
  }, [fileToMove, documents, existingFolders, handleCloseMoveModal]);

  const handleCloseMoveSuccessToast = useCallback(() => {
    setMoveSuccessToast(prev => ({ ...prev, show: false }));
  }, []);

  const handleMoveSuccessAction = useCallback(() => {
    // Open move modal again
    setMoveSuccessToast(prev => ({ ...prev, show: false }));
    if (fileToMove) {
      setMoveModalOpen(true);
    }
  }, [fileToMove]);

  // Schema setup handler
  const handleSaveSchema = useCallback((folderId: string, schemaData: {
    name: string;
    description: string;
    columns: Column[];
    autoParse: boolean;
    exportEnabled: boolean;
  }) => {
    // Update folder with schema data
    setExistingFolders(prevFolders => 
      prevFolders.map(folder => 
        folder.id === folderId 
          ? {
              ...folder,
              name: schemaData.name,
              description: schemaData.description,
              columns: schemaData.columns,
              autoParse: schemaData.autoParse,
              exportEnabled: schemaData.exportEnabled,
              schemaActive: true,
              lastUpdated: new Date().toISOString()
            }
          : folder
      )
    );
    
    showSuccess('Schema saved successfully');
    
    // Navigate to folder contents
    handleNavigate('folder-contents', folderId);
  }, [handleNavigate, showSuccess]);

  // Onboarding handlers
  const handleOnboardingNext = useCallback(() => {
    if (currentScreen === 'onboarding-1') {
      setCurrentScreen('onboarding-2');
    } else if (currentScreen === 'onboarding-2') {
      setCurrentScreen('onboarding-3');
    }
  }, [currentScreen]);

  const handleOnboardingSkip = useCallback(() => {
    setIsFirstRun(false);
    setCurrentScreen('camera');
  }, []);

  const handleGetStarted = useCallback(() => {
    setShowPermissionModal(true);
    setPermissionState('camera');
  }, []);

  // Permission handlers
  const handleCameraPermissionAllow = useCallback(() => {
    setPermissionState('photos');
  }, []);

  const handleCameraPermissionDeny = useCallback(() => {
    setShowPermissionModal(false);
    setIsFirstRun(false);
    setCurrentScreen('files-empty-grid');
  }, []);

  const handlePhotosPermissionAllow = useCallback(() => {
    setPermissionState('complete');
    setShowPermissionModal(false);
    setIsFirstRun(false);
    setCurrentScreen('camera');
  }, []);

  const handlePhotosPermissionDeny = useCallback(() => {
    setShowPermissionModal(false);
    setIsFirstRun(false);
    setCurrentScreen('files-empty-grid');
  }, []);

  // Upload success handler with toast
  const handleUploadSuccess = useCallback((count: number) => {
    showSuccess(`Imported ${count} item${count !== 1 ? 's' : ''}`, 2000);
    // Show skeleton briefly before showing populated content
    setTimeout(() => {
      handleNavigate('files-grid-skeleton');
    }, 600);
  }, [showSuccess, handleNavigate]);

  // Handle upload completion and create real documents
  const handleUploadComplete = useCallback((uploadedItems: any[]) => {
    const now = new Date();
    const newDocuments: Document[] = [];
    
    uploadedItems.forEach((item) => {
      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Determine document type based on file type/extension
      let docType: 'image' | 'pdf' | 'document' = 'document';
      if (item.type && ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'].includes(item.type.toUpperCase())) {
        docType = 'image';
      } else if (item.type && item.type.toUpperCase() === 'PDF') {
        docType = 'pdf';
      }
      
      const newDocument: Document = {
        id: documentId,
        name: item.name || generateDocumentName(docType),
        type: docType,
        size: item.size || '1.2 MB',
        dateCreated: now.toISOString(),
        folderId: null, // Initially not in any folder
        status: 'synced',
        thumbnail: item.thumbnail || null
      };
      
      newDocuments.push(newDocument);
    });
    
    // Add all new documents to the state
    setDocuments(prev => [...prev, ...newDocuments]);
    
    // Show success message
    showSuccess(`Imported ${newDocuments.length} item${newDocuments.length !== 1 ? 's' : ''}`, 2000);
    
    // Clear selected items for next use
    setSelectedItems([]);
    
    // Navigate to files screen after a short delay
    setTimeout(() => {
      handleNavigate('files-grid');
    }, 1000);
  }, [generateDocumentName, showSuccess, handleNavigate]);

  // Error handling with toast
  const handleProcessingError = useCallback(() => {
    showError('Extraction failed. Retry?', 'Retry', () => {
      // Simulate retry process
      setTimeout(() => {
        showSuccess('Processing completed successfully');
      }, 1500);
    }, 3000);
  }, [showError, showSuccess]);

  // Logic to determine folder contents screen
  const getFolderContentsScreen = useCallback((folderId: string | null) => {
    if (folderId) {
      const folder = existingFolders.find(f => f.id === folderId);
      if (folder && folder.itemCount > 0) {
        return 'folder-contents';
      } else {
        return 'folder-contents-empty';
      }
    }
    return 'folder-contents-empty';
  }, [existingFolders]);

  // Memoized checks for when to show bottom navigation
  const showBottomNavigation = useMemo(() => {
    return !uploadModalOpen && 
           !createFolderModalOpen && 
           !folderSelectionModalOpen && 
           uploadState !== 'fullscreen' &&
           !['login', 'photo-confirm', 'capture-review', 'capture-review-autocrop-off', 'capture-review-low-confidence', 'capture-review-multipage', 'folder-contents', 'folder-contents-skeleton', 'file-detail', 'setup-categories'].includes(currentScreen);
  }, [uploadModalOpen, createFolderModalOpen, folderSelectionModalOpen, uploadState, currentScreen]);

  // Check if dimmed scrim should be shown
  const showDimmedScrim = useMemo(() => {
    return uploadModalOpen || createFolderModalOpen || folderSelectionModalOpen;
  }, [uploadModalOpen, createFolderModalOpen, folderSelectionModalOpen]);

  // Render current screen component
  const renderCurrentScreen = useMemo(() => {
    switch (currentScreen) {
      case 'onboarding-1':
        return <OnboardingScreen1 onNext={handleOnboardingNext} onSkip={handleOnboardingSkip} />;
      case 'onboarding-2':
        return <OnboardingScreen2 onNext={handleOnboardingNext} onSkip={handleOnboardingSkip} />;
      case 'onboarding-3':
        return <OnboardingScreen3 onGetStarted={handleGetStarted} onSkip={handleOnboardingSkip} />;
      case 'login':
        return <LoginScreen onNavigate={handleNavigate} />;
      case 'camera':
        return (
          <CameraScreen 
            onNavigate={handleNavigate} 
            onOpenUpload={handleOpenUpload} 
            onCapturePhoto={handleCapturePhoto}
            onOpenFolderSelection={handleOpenFolderSelection}
            showDevAnnotations={showDevAnnotations}
          />
        );
      case 'photo-confirm':
        return (
          <PhotoConfirmScreen 
            onNavigate={handleNavigate} 
            onSavePhoto={handleSavePhoto} 
            capturedImage={capturedImage} 
          />
        );
      case 'capture-review':
        return (
          <CaptureReviewScreen 
            onNavigate={handleNavigate} 
            onSavePhoto={handleSavePhoto} 
            capturedImage={capturedImage}
            showDevAnnotations={showDevAnnotations}
          />
        );
      case 'capture-review-autocrop-off':
        return (
          <CaptureReviewAutocropOffScreen 
            onNavigate={handleNavigate} 
            onSavePhoto={handleSavePhoto} 
            capturedImage={capturedImage} 
          />
        );
      case 'capture-review-low-confidence':
        return (
          <CaptureReviewLowConfidenceScreen 
            onNavigate={handleNavigate} 
            onSavePhoto={handleSavePhoto} 
            capturedImage={capturedImage} 
          />
        );
      case 'capture-review-multipage':
        return (
          <CaptureReviewMultipageScreen 
            onNavigate={handleNavigate} 
            onSavePhoto={handleSavePhoto} 
            capturedImage={capturedImage} 
          />
        );
      case 'files':
        return <FilesScreen onNavigate={handleNavigate} onOpenUpload={handleOpenUpload} />;
      case 'files-grid':
        return (
          <FilesGridScreen 
            onNavigate={handleNavigate} 
            onOpenUpload={handleOpenUpload} 
            onCreateFolder={handleCreateFolder} 
            folders={existingFolders}
          />
        );
      case 'files-grid-skeleton':
        return (
          <FilesGridSkeleton 
            onNavigate={handleNavigate} 
            onCreateFolder={handleCreateFolder}
            reduceMotion={reduceMotion}
            folders={existingFolders}
          />
        );
      case 'files-list':
        return (
          <FilesListScreen 
            onNavigate={handleNavigate} 
            onOpenUpload={handleOpenUpload} 
            onCreateFolder={handleCreateFolder} 
            folders={existingFolders}
          />
        );
      case 'files-list-skeleton':
        return (
          <FilesListSkeleton 
            onNavigate={handleNavigate} 
            onCreateFolder={handleCreateFolder}
            reduceMotion={reduceMotion}
            folders={existingFolders}
          />
        );
      case 'files-empty-grid':
        return (
          <FilesEmptyGridScreen 
            onNavigate={handleNavigate} 
            onOpenUpload={handleOpenUpload} 
            onCreateFolder={handleCreateFolder} 
          />
        );
      case 'files-empty-list':
        return (
          <FilesEmptyListScreen 
            onNavigate={handleNavigate} 
            onOpenUpload={handleOpenUpload} 
            onCreateFolder={handleCreateFolder} 
          />
        );
      case 'folder-contents':
        const selectedFolder = existingFolders.find(f => f.id === selectedFolderId);
        const folderDocuments = documents.filter(doc => doc.folderId === selectedFolderId);
        return (
          <FolderContentsScreen 
            onNavigate={handleNavigate} 
            folderId={selectedFolderId} 
            folderName={selectedFolder?.name || 'Folder'}
            previousScreen={previousScreen}
            documents={folderDocuments}
          />
        );
      case 'folder-contents-skeleton':
        const skeletonFolder = existingFolders.find(f => f.id === selectedFolderId);
        return (
          <FolderContentsSkeleton 
            onNavigate={handleNavigate} 
            folderName={skeletonFolder?.name || 'Folder'}
            reduceMotion={reduceMotion}
          />
        );
      case 'folder-contents-empty':
        const selectedEmptyFolder = existingFolders.find(f => f.id === selectedFolderId);
        return (
          <FolderContentsEmptyScreen 
            onNavigate={handleNavigate} 
            onOpenUpload={handleOpenUpload}
            folderName={selectedEmptyFolder?.name || 'Folder'}
          />
        );
      case 'file-detail':
        return <FileDetailScreen onNavigate={handleNavigate} fileId={selectedFileId} documents={documents} onMoveFile={handleMoveFile} />; // Add onMoveFile to FileDetailScreen
      case 'setup-categories':
        const setupFolder = existingFolders.find(f => f.id === selectedFolderId);
        return (
          <SetupCategoriesScreen
            folderId={selectedFolderId || ''}
            folderName={setupFolder?.name || 'Folder'}
            onNavigate={handleNavigate}
            onSaveSchema={handleSaveSchema}
          />
        );
      case 'profile':
        return <ProfileScreen onNavigate={handleNavigate} />;
      default:
        return null;
    }
  }, [
    currentScreen, 
    handleNavigate, 
    handleOpenUpload, 
    handleCapturePhoto, 
    handleOpenFolderSelection, 
    handleSavePhoto, 
    handleCreateFolder, 
    handleOnboardingNext,
    handleOnboardingSkip,
    handleGetStarted,
    handleSaveSchema,
    capturedImage, 
    selectedFolderId, 
    selectedFileId, 
    previousScreen,
    existingFolders,
    documents,
    reduceMotion,
    showDevAnnotations,
    handleMoveFile
  ]);

  return (
    <div className="w-full h-full min-h-screen bg-[#F9F9F9] overflow-hidden max-w-[393px] mx-auto">
      <div className="w-full h-full min-h-screen relative pb-20">
        {renderCurrentScreen}

        {/* Bottom Navigation - only show on main screens */}
        {showBottomNavigation && (
          <div className={`${showDimmedScrim ? 'opacity-50' : ''} transition-opacity duration-250`}>
            <BottomNavigation 
              currentScreen={currentScreen}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* Upload Modal System */}
        {uploadState === 'fullscreen' ? (
          <UploadFullscreen
            onClose={handleCloseUpload}
            onBack={() => setUploadState('modal')}
            selectedItems={selectedItems}
            onSelectedItemsChange={setSelectedItems}
          />
        ) : uploadModalOpen && (
          <>
            {uploadState === 'modal' && (
              <UploadModal
                onClose={handleCloseUpload}
                onStateChange={handleUploadStateChange}
                selectedItems={selectedItems}
                onSelectedItemsChange={setSelectedItems}
                documents={documents}
              />
            )}
            {uploadState === 'permissions' && (
              <UploadPermissions
                onClose={handleCloseUpload}
                onStateChange={handleUploadStateChange}
              />
            )}
            {uploadState === 'uploading' && (
              <UploadUploading
                onClose={handleCloseUpload}
                onStateChange={handleUploadStateChange}
                selectedItems={selectedItems}
                onNavigate={handleNavigate}
                onUploadComplete={handleUploadComplete}
              />
            )}
            {uploadState === 'success' && (
              <UploadSuccess
                onClose={handleCloseUpload}
                onNavigate={handleNavigate}
                importedCount={selectedItems.length}
              />
            )}
            {uploadState === 'error' && (
              <UploadError
                onClose={handleCloseUpload}
                onStateChange={handleUploadStateChange}
                selectedItems={selectedItems}
              />
            )}
          </>
        )}

        {/* Folder Selection Modal */}
        {folderSelectionModalOpen && (
          <FolderSelectionModal
            onClose={handleCloseFolderSelection}
            onSelectFolder={handleSelectFolder}
            folders={existingFolders}
          />
        )}

        {/* Create Folder Modal System */}
        {createFolderModalOpen && (
          <CreateFolderModal
            onClose={handleCloseCreateFolder}
            onStateChange={handleCreateFolderStateChange}
            onFolderCreated={handleFolderCreated}
            existingFolders={existingFolders}
            currentState={createFolderState}
            error={createFolderError}
          />
        )}

        {/* Permission Modals */}
        {showPermissionModal && permissionState === 'camera' && (
          <PermissionsCameraScreen
            onAllow={handleCameraPermissionAllow}
            onNotNow={handleCameraPermissionDeny}
          />
        )}
        
        {showPermissionModal && permissionState === 'photos' && (
          <PermissionsPhotosScreen
            onAllow={handlePhotosPermissionAllow}
            onNotNow={handlePhotosPermissionDeny}
          />
        )}

        <Toaster />

        {/* Toast Manager */}
        <ToastManager toasts={toasts} onDismiss={dismissToast} />

        {/* Move To Modal */}
        {moveModalOpen && fileToMove && (
          <MoveToModal
            folders={existingFolders}
            currentFolderId={documents.find(doc => doc.id === fileToMove)?.folderId || null}
            onMove={handleMoveDocument}
            onClose={handleCloseMoveModal}
          />
        )}

        {/* Move Success Toast */}
        {moveSuccessToast.show && (
          <ToastBottom
            message={`Saved to ${moveSuccessToast.folderName} • ${moveSuccessToast.itemCount} item`}
            variant="success"
            actionLabel="Move"
            onAction={handleMoveSuccessAction}
            onClose={handleCloseMoveSuccessToast}
            duration={3000}
          />
        )}
      </div>
    </div>
  );
}