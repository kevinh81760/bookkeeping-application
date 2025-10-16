import { Camera, FileText, User, Settings, HelpCircle, LogOut, UserCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ProfileScreenProps {
  onNavigate: (screen: string, fileId?: string) => void;
}

const profileOptions = [
  {
    id: 'account',
    label: 'Account',
    icon: UserCircle,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
  {
    id: 'help',
    label: 'Help',
    icon: HelpCircle,
  },
];

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const handleOptionClick = (optionId: string) => {
    if (optionId === 'logout') {
      onNavigate('login');
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#F9F9F9] flex flex-col">
      {/* Profile section with Swiss asymmetry */}
      <div className="pt-12 pb-6 px-4 bg-[#F9F9F9]">
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-start gap-4">
            {/* Profile photo - top left with rounded corners */}
            <div className="w-16 h-16 bg-black rounded-xl flex-shrink-0"></div>
            
            {/* User info - right aligned, mixed case */}
            <div className="flex-1 text-right pt-1">
              <h2 className="font-medium text-[#1A1A1A] text-xl mb-1">John Doe</h2>
              <p className="text-[#6B6B6B] text-sm font-medium">john.doe@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Options as iOS-style table with thin 1px separators */}
      <div className="flex-1 px-4 pb-20">
        <div className="bg-white rounded-xl overflow-hidden">
          {profileOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div key={option.id}>
                {index > 0 && <div className="border-t border-[#E5E5EA] ml-4" />}
                <button
                  className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-[#F9F9F9] active:bg-[#F2F2F7] transition-all duration-150"
                  onClick={() => handleOptionClick(option.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-[#6B6B6B] stroke-1" />
                    <span className="text-black font-medium text-base">
                      {option.label}
                    </span>
                  </div>
                  <div className="w-2 h-2 border-r-2 border-t-2 border-[#C7C7CC] transform rotate-45"></div>
                </button>
              </div>
            );
          })}
          
          {/* Separator before logout */}
          <div className="border-t border-[#E5E5EA] ml-4" />
          
          {/* Logout styled in accent orange */}
          <button
            className="w-full px-4 py-4 flex items-center gap-3 text-left hover:bg-[#F9F9F9] active:bg-[#F2F2F7] transition-all duration-150"
            onClick={() => handleOptionClick('logout')}
          >
            <LogOut className="w-5 h-5 text-[#E85C3C] stroke-1" />
            <span className="text-[#E85C3C] font-medium text-base">
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* iOS-style tab bar with subtle top divider */}
      <div className="bg-white border-t border-[#E5E5EA] px-4 py-3 pb-6">
        <div className="flex items-center justify-around">
          <Button
            variant="ghost"
            onClick={() => onNavigate('camera')}
            className="flex flex-col items-center gap-1 py-2 bg-transparent text-[#6B6B6B] hover:text-[#E85C3C] active:text-[#D54B2A] hover:bg-transparent active:bg-gray-50 rounded-none transition-all duration-150"
          >
            <Camera className="w-6 h-6 stroke-1 transition-all duration-150" />
            <span className="text-xs font-medium">Camera</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => onNavigate('files-grid')}
            className="flex flex-col items-center gap-1 py-2 bg-transparent text-[#6B6B6B] hover:text-[#E85C3C] active:text-[#D54B2A] hover:bg-transparent active:bg-gray-50 rounded-none transition-all duration-150"
          >
            <FileText className="w-6 h-6 stroke-1 transition-all duration-150" />
            <span className="text-xs font-medium">Files</span>
          </Button>
          
          {/* Active state with bold text + accent color */}
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 py-2 bg-transparent text-[#E85C3C] rounded-none"
          >
            <User className="w-6 h-6 stroke-2" />
            <span className="text-xs font-semibold">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}