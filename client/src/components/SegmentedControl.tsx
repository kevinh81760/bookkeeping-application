import { Grid, List } from 'lucide-react';

interface SegmentedControlProps {
  selectedView: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export function SegmentedControl({ selectedView, onViewChange }: SegmentedControlProps) {
  return (
    <div className="inline-flex bg-[#F2F2F7] rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center justify-center w-20 h-8 rounded-md transition-all duration-250 ${
          selectedView === 'grid'
            ? 'bg-white shadow-sm text-[#1A1A1A]'
            : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
        }`}
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center justify-center w-20 h-8 rounded-md transition-all duration-250 ${
          selectedView === 'list'
            ? 'bg-white shadow-sm text-[#1A1A1A]'
            : 'text-[#6B6B6B] hover:text-[#1A1A1A]'
        }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}