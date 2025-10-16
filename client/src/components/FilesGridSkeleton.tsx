import { useState, useEffect } from 'react';
import { Search, Grid3X3, List, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { SegmentedControl } from './SegmentedControl';
import { SortFilterChips } from './SortFilterChips';
import { SkeletonCard } from './SkeletonCard';

interface Folder {
  id: string;
  name: string;
  itemCount: number;
}

interface FilesGridSkeletonProps {
  onNavigate: (screen: string) => void;
  onCreateFolder: () => void;
  reduceMotion?: boolean;
  folders?: Folder[];
}

export function FilesGridSkeleton({ onNavigate, onCreateFolder, reduceMotion = false, folders = [] }: FilesGridSkeletonProps) {
  const [selectedView, setSelectedView] = useState('grid');

  // Auto-transition to populated state after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('files-grid');
    }, 1000); // 800-1200ms range

    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="w-full h-full min-h-screen bg-[#F9F9F9] max-w-[393px] mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E5EA] px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-[0.1em] mb-1">FILES</h1>
            <p className="text-[#6B6B6B] text-sm">Organize your documents</p>
          </div>
          <Button
            onClick={onCreateFolder}
            variant="ghost"
            size="icon"
            className="w-11 h-11 rounded-full bg-[#E85C3C] hover:bg-[#E85C3C]/90 text-white"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
          <input
            type="text"
            placeholder="Search files and folders"
            className="w-full h-11 pl-10 pr-4 bg-[#F2F2F7] rounded-xl text-[#1A1A1A] placeholder-[#6B6B6B] border-none focus:outline-none focus:ring-2 focus:ring-[#E85C3C]/20"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <SegmentedControl
            options={[
              { id: 'grid', label: 'Grid', icon: Grid3X3 },
              { id: 'list', label: 'List', icon: List }
            ]}
            selected={selectedView}
            onSelect={(id) => {
              setSelectedView(id);
              if (id === 'list') {
                onNavigate('files-list');
              }
            }}
          />
        </div>

        {/* Sort/Filter Chips */}
        <SortFilterChips />
      </div>

      {/* Skeleton Grid */}
      <div className="flex-1 bg-[#F9F9F9] p-5">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} reduceMotion={reduceMotion} />
          ))}
        </div>
      </div>
    </div>
  );
}