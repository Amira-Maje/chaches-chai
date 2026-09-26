import React from 'react';

interface ChacheesLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

export const ChacheesLogo: React.FC<ChacheesLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const isWhite = variant === 'white';
  const textColor = isWhite ? '#FFFFFF' : '#240A03';
  const accentColor = isWhite ? '#F0BBA9' : '#C85A32';
  const goldColor = isWhite ? '#FFDBCF' : '#D9822B';

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Handcrafted Cup Icon SVG matching Image 1 */}
      <svg
        viewBox="0 0 100 95"
        className={`${sizeClasses[size]} w-auto shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Chachees' Chai Logo Icon"
      >
        {/* Steam waves */}
        <path
          d="M48 4C44 11 54 18 50 25C47 29 44 28 43 32"
          stroke={accentColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M58 8C55 14 62 20 59 26"
          stroke={goldColor}
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Cup rim & tea level */}
        <ellipse cx="50" cy="36" rx="26" ry="7" fill={accentColor} fillOpacity="0.2" stroke={textColor} strokeWidth="3.2" />
        <ellipse cx="50" cy="36.5" rx="22" ry="5.2" fill={goldColor} />

        {/* Cup Body */}
        <path
          d="M26 37C26 55 35 63 50 63C65 63 74 55 74 37"
          stroke={textColor}
          strokeWidth="3.8"
          strokeLinecap="round"
        />

        {/* Cup Handle */}
        <path
          d="M72 40C83 40 85 53 71 58"
          stroke={textColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Saucer */}
        <path
          d="M18 56C25 72 75 72 82 56"
          stroke={textColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Tea leaves on cup front */}
        <path
          d="M45 46C42 43 47 41 49 46C49 50 44 51 45 46Z"
          fill={accentColor}
        />
        <path
          d="M55 46C58 43 53 41 51 46C51 50 56 51 55 46Z"
          fill={goldColor}
        />
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-0.5">
          <span
            className="font-serif-display font-black text-xl tracking-tight"
            style={{ color: textColor }}
          >
            Chachees’
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full inline-block mb-2"
            style={{ backgroundColor: accentColor }}
          />
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="h-[1px] w-2.5" style={{ backgroundColor: goldColor }} />
          <span
            className="text-[10px] tracking-[0.22em] font-bold uppercase"
            style={{ color: isWhite ? '#E6E2DC' : '#7D5447' }}
          >
            Chai Cafe
          </span>
          <span className="h-[1px] w-2.5" style={{ backgroundColor: goldColor }} />
        </div>
      </div>
    </div>
  );
};
