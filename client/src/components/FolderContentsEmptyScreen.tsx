import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { DocumentIllustration } from './illustrations/DocumentIllustration';

interface FolderContentsEmptyScreenProps {
  onNavigate: (screen: string) => void;
  onOpenUpload: () => void;
  folderName: string;
  onShowHelpTooltip?: () => void;
}

export function FolderContentsEmptyScreen({ 
  onNavigate, 
  onOpenUpload, 
  folderName,
  onShowHelpTooltip
}: FolderContentsEmptyScreenProps) {
  const handleBack = () => {
    onNavigate('files-list');
  };

  const handleOpenCamera = () => {
    onNavigate('camera');
  };

  return (
    <div className="flex flex-col h-full bg-[#F9F9F9]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5EA] px-4 pt-12 pb-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F2F2F7] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
            </button>
            <h1 className="text-[20px] font-bold text-[#1A1A1A] tracking-[0.1em] uppercase">
              {folderName}
            </h1>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F2F2F7] transition-colors">
            <MoreHorizontal className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <div className="mt-4">
          <div className="text-[14px] font-medium text-[#6B7280]">
            0 items
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1">
        <EmptyState
          icon={<DocumentIllustration />}
          title="This folder is empty"
          body="Upload files or snap a receipt."
          primaryCTA={{
            label: "Upload files",
            onClick: onOpenUpload
          }}
          secondaryCTA={{
            label: "Open Camera",
            onClick: handleOpenCamera,
            variant: 'outline'
          }}
          helpLink={onShowHelpTooltip ? {
            label: "How organizing works",
            onClick: onShowHelpTooltip
          } : undefined}
          variant="with-help-link"
        />
      </div>
    </div>
  );
}