import { Camera, FolderOpen, User } from 'lucide-react';
import { Button } from './ui/button';

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: 'camera' | 'files-list' | 'profile') => void;
}

export function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'camera',
      label: 'Camera',
      icon: Camera,
    },
    {
      id: 'files-list',
      label: 'Files',
      icon: FolderOpen,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5EA] z-50">
      <div className="flex items-center justify-around px-5 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id || 
            (item.id === 'files-list' && (currentScreen === 'files-grid' || currentScreen === 'files-list' || currentScreen === 'files'));
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id as 'camera' | 'files-list' | 'profile')}
              className="flex flex-col items-center gap-1 h-auto p-2 hover:bg-transparent"
            >
              <Icon 
                className={`w-6 h-6 ${
                  isActive ? 'text-[#E85C3C]' : 'text-[#6B6B6B]'
                }`} 
                strokeWidth={1.5}
              />
              <span 
                className={`text-xs font-medium ${
                  isActive ? 'text-[#E85C3C]' : 'text-[#6B6B6B]'
                }`}
              >
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}