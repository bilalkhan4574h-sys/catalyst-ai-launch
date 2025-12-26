const CatalystIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 60 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="iconGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0369a1" />
        <stop offset="50%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    
    {/* Arrow */}
    <path
      d="M20 35 L35 8 L40 8 L40 18 L50 18 L35 35 L35 25 L20 35Z"
      fill="url(#iconGradient)"
    />
    
    {/* Hexagons */}
    <polygon
      points="12,40 18,36 24,40 24,48 18,52 12,48"
      fill="#1e3a5f"
    />
    <polygon
      points="26,32 32,28 38,32 38,40 32,44 26,40"
      fill="#0c4a6e"
    />
    <polygon
      points="40,40 46,36 52,40 52,48 46,52 40,48"
      fill="#1e3a5f"
      opacity="0.7"
    />
    
    {/* Connection dots */}
    <circle cx="24" cy="40" r="2" fill="#0ea5e9" />
    <circle cx="38" cy="36" r="2" fill="#0ea5e9" />
    <line x1="24" y1="40" x2="38" y2="36" stroke="#0ea5e9" strokeWidth="1.5" />
  </svg>
);

export default CatalystIcon;
