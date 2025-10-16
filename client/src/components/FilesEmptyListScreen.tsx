import { Search, Grid3X3, List } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { FolderIllustration } from './illustrations/FolderIllustration';
import { SegmentedControl } from './SegmentedControl';

interface FilesEmptyListScreenProps {
  onNavigate: (screen: string) => void;
  onOpenUpload: () => void;
  onCreateFolder: () => void;
  isSearchEmpty?: boolean;
  onClearSearch?: () => void;
}

export function FilesEmptyListScreen({ 
  onNavigate, 
  onOpenUpload, 
  onCreateFolder,
  isSearchEmpty = false,
  onClearSearch
}: FilesEmptyListScreenProps) {
  const handleViewChange = (view: string) => {
    if (view === 'grid') {
      onNavigate('files-empty-grid');
    }
  };

  if (isSearchEmpty) {
    return (
      <div className="flex flex-col h-full bg-[#F9F9F9]">
        {/* Header */}
        <div className="bg-white border-b border-[#E5E5EA] px-4 pt-12 pb-4 safe-area-top">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[24px] font-bold text-[#1A1A1A] tracking-[0.1em] uppercase">
              FILES
            </h1>
            <Search className="w-6 h-6 text-[#6B7280]" />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[14px] font-medium text-[#6B7280]">
              Search results
            </div>
            <SegmentedControl
              options={[
                { label: <Grid3X3 className="w-4 h-4" />, value: 'grid' },
                { label: <List className="w-4 h-4" />, value: 'list' }
              ]}
              value="list"
              onChange={handleViewChange}
            />
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1">
          <EmptyState
            title="No results"
            body="Try a different keyword or clear filters."
            secondaryCTA={{
              label: "Clear filters",
              onClick: onClearSearch || (() => {}),
              variant: 'ghost'
            }}
            variant="centered"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#F9F9F9]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5EA] px-4 pt-12 pb-4 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[24px] font-bold text-[#1A1A1A] tracking-[0.1em] uppercase">
            FILES
          </h1>
          <Search className="w-6 h-6 text-[#6B7280]" />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[14px] font-medium text-[#6B7280]">
            0 folders
          </div>
          <SegmentedControl
            options={[
              { label: <Grid3X3 className="w-4 h-4" />, value: 'grid' },
              { label: <List className="w-4 h-4" />, value: 'list' }
            ]}
            value="list"
            onChange={handleViewChange}
          />
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1">
        <EmptyState
          icon={<FolderIllustration />}
          title="No folders yet"
          body="Create a folder or import receipts to get started."
          primaryCTA={{
            label: "New Folder",
            onClick: onCreateFolder
          }}
          secondaryCTA={{
            label: "Import",
            onClick: onOpenUpload,
            variant: 'outline'
          }}
          variant="centered"
        />
      </div>
    </div>
  );
}