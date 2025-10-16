export function CameraIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Camera body */}
      <rect 
        x="12" 
        y="28" 
        width="72" 
        height="48" 
        rx="8" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Camera top section */}
      <path 
        d="M24 28L28 20H68L72 28" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Lens outer ring */}
      <circle 
        cx="48" 
        cy="52" 
        r="16" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Lens inner circle */}
      <circle 
        cx="48" 
        cy="52" 
        r="10" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Viewfinder */}
      <rect 
        x="64" 
        y="32" 
        width="8" 
        height="6" 
        rx="2" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Flash - accent dot */}
      <circle 
        cx="68" 
        cy="42" 
        r="3" 
        fill="#E85C3C"
      />
    </svg>
  );
}