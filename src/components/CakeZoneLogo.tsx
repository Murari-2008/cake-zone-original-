import React from 'react';

interface CakeZoneLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function CakeZoneLogo({ className = '', size = '100%', showText = false, onClick }: CakeZoneLogoProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center justify-center ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        style={{ width: size, height: size }}
        className="overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gorgeous gold metallic linear gradient matching the uploaded logo */}
          <linearGradient id="cakeZoneGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5C173" />
            <stop offset="50%" stopColor="#C59A49" />
            <stop offset="100%" stopColor="#967029" />
          </linearGradient>
        </defs>

        {/* Black circular background container */}
        <circle cx="50" cy="50" r="48" fill="#000000" />

        {/* Gold Dot at the top center */}
        <circle cx="50" cy="15" r="4.5" fill="url(#cakeZoneGold)" />

        {/* Stylized White Z */}
        <path
          d="M 28 25 
             H 72 
             L 36 71 
             C 45 71, 70 71, 78 71
             C 84 71, 86 69, 87 64
             C 86 73, 80 75, 75 75
             H 32 
             L 68 29 
             H 28 
             C 24 29, 23 31, 23 34
             C 24 27, 26 25, 28 25 Z"
          fill="#FFFFFF"
        />

        {/* Intersecting Gold C */}
        <path
          d="M 62 31 
             C 45 22, 22 28, 16 48
             C 10 68, 25 80, 48 78
             C 55 77.5, 60 74, 63 68"
          stroke="url(#cakeZoneGold)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {showText && (
        <span className="text-[10px] tracking-[0.25em] font-serif font-bold text-white mt-1.5 uppercase block">
          Cake Zone
        </span>
      )}
    </div>
  );
}
