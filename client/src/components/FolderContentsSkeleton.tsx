import { useState, useEffect } from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { SkeletonRow } from './SkeletonRow';

interface FolderContentsSkeletonProps {
  onNavigate: (screen: string) => void;
  folderName?: string;
  reduceMotion?: boolean;
}

export function FolderContentsSkeleton({ onNavigate, folderName = 'Folder', reduceMotion = false }: FolderContentsSkeletonProps) {
  // Auto-transition to populated state after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('folder-contents');
    }, 1000); // 800-1200ms range

    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="w-full h-full min-h-screen bg-[#F9F9F9] max-w-[393px] mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5EA] px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('files-grid')}
              className="w-11 h-11 mr-3 hover:bg-[#F2F2F7] rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] tracking-[0.1em]">{folderName.toUpperCase()}</h1>
              <p className="text-[#6B6B6B] text-sm">Loading documents...</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-11 h-11 hover:bg-[#F2F2F7] rounded-xl"
          >
            <MoreHorizontal className="w-5 h-5 text-[#1A1A1A]" />
          </Button>
        </div>
      </div>

      {/* Skeleton Content */}
      <div className="flex-1 bg-[#F9F9F9]">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonRow key={i} reduceMotion={reduceMotion} />
        ))}
      </div>
    </div>
  );
}