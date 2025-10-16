import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface SortFilterChipsProps {
  selectedSort: 'name' | 'updated' | 'items';
  sortDirection: 'asc' | 'desc';
  selectedFilter: 'all' | 'synced' | 'processing' | 'error';
  onSortChange: (sort: 'name' | 'updated' | 'items', direction: 'asc' | 'desc') => void;
  onFilterChange: (filter: 'all' | 'synced' | 'processing' | 'error') => void;
}

export function SortFilterChips({
  selectedSort,
  sortDirection,
  selectedFilter,
  onSortChange,
  onFilterChange,
}: SortFilterChipsProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'updated', label: 'Updated' },
    { value: 'items', label: 'Items' },
  ] as const;

  const sortDirections = [
    { value: 'asc', label: { name: 'A–Z', updated: 'Oldest', items: 'Low' } },
    { value: 'desc', label: { name: 'Z–A', updated: 'Newest', items: 'High' } },
  ] as const;

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'synced', label: 'Synced' },
    { value: 'processing', label: 'Processing' },
    { value: 'error', label: 'Error' },
  ] as const;

  const SortChip = ({ option }: { option: typeof sortOptions[0] }) => (
    <Popover open={sortOpen && selectedSort === option.value} onOpenChange={(open) => setSortOpen(open)}>
      <PopoverTrigger asChild>
        <button
          onClick={() => setSortOpen(selectedSort === option.value ? !sortOpen : true)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
            selectedSort === option.value
              ? 'bg-white border border-[#E85C3C] text-[#E85C3C]'
              : 'bg-[#F2F2F7] text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-white'
          }`}
        >
          {option.label}
          <ChevronDown className="w-3 h-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-1" align="start">
        {sortDirections.map((direction) => (
          <button
            key={direction.value}
            onClick={() => {
              onSortChange(option.value, direction.value);
              setSortOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-[#F2F2F7] transition-colors"
          >
            <span>{direction.label[option.value]}</span>
            {selectedSort === option.value && sortDirection === direction.value && (
              <Check className="w-3 h-3 text-[#E85C3C]" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="flex items-center gap-2 px-5 py-2">
      <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-[0.1em]">Sort:</span>
      
      {sortOptions.map((option) => (
        <SortChip key={option.value} option={option} />
      ))}

      <span className="text-xs font-medium text-[#6B6B6B] uppercase tracking-[0.1em] ml-3">Filter:</span>
      
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <button
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
              selectedFilter !== 'all'
                ? 'bg-white border border-[#E85C3C] text-[#E85C3C]'
                : 'bg-[#F2F2F7] text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-white'
            }`}
          >
            Status
            <ChevronDown className="w-3 h-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-36 p-1" align="start">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onFilterChange(option.value);
                setFilterOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-[#F2F2F7] transition-colors"
            >
              <span>{option.label}</span>
              {selectedFilter === option.value && (
                <Check className="w-3 h-3 text-[#E85C3C]" />
              )}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}