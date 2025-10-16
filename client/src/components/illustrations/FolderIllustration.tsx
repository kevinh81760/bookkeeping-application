export function FolderIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back folder */}
      <rect 
        x="16" 
        y="32" 
        width="64" 
        height="44" 
        rx="8" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Back folder tab */}
      <path 
        d="M16 32L16 26C16 21.6 19.6 18 24 18H36L42 24H72C76.4 24 80 27.6 80 32" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Front folder */}
      <rect 
        x="12" 
        y="40" 
        width="64" 
        height="40" 
        rx="8" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Front folder tab */}
      <path 
        d="M12 40L12 34C12 29.6 15.6 26 20 26H32L38 32H68C72.4 32 76 35.6 76 40" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Accent dot on front folder */}
      <circle 
        cx="24" 
        cy="60" 
        r="3" 
        fill="#E85C3C"
      />
    </svg>
  );
}