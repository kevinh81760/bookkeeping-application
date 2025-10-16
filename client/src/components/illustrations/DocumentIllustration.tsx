export function DocumentIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document outline */}
      <path 
        d="M28 12H56L76 32V84C76 88.4 72.4 92 68 92H28C23.6 92 20 88.4 20 84V20C20 15.6 23.6 12 28 12Z" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Folded corner */}
      <path 
        d="M56 12V28C56 30.2 57.8 32 60 32H76" 
        stroke="#D1D5DB" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Text lines */}
      <line 
        x1="32" 
        y1="44" 
        x2="64" 
        y2="44" 
        stroke="#D1D5DB" 
        strokeWidth="2"
      />
      
      <line 
        x1="32" 
        y1="52" 
        x2="60" 
        y2="52" 
        stroke="#D1D5DB" 
        strokeWidth="2"
      />
      
      <line 
        x1="32" 
        y1="60" 
        x2="64" 
        y2="60" 
        stroke="#D1D5DB" 
        strokeWidth="2"
      />
      
      <line 
        x1="32" 
        y1="68" 
        x2="56" 
        y2="68" 
        stroke="#D1D5DB" 
        strokeWidth="2"
      />
      
      {/* Accent dot - like a status indicator */}
      <circle 
        cx="64" 
        cy="76" 
        r="3" 
        fill="#E85C3C"
      />
    </svg>
  );
}