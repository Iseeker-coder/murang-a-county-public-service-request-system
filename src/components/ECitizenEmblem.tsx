import React from 'react';

interface ECitizenEmblemProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const ECitizenEmblem: React.FC<ECitizenEmblemProps> = ({
  className = '',
  variant = 'light',
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Republic of Kenya National Crest Miniature */}
      <div className="w-8 h-8 relative shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          {/* Kenya Shield: Black, Red, Green with white fimbriation */}
          <ellipse cx="50" cy="50" rx="30" ry="38" fill="#B91C1C" stroke="#1F2937" strokeWidth="2" />
          <path d="M 22 25 L 78 25 L 75 42 L 25 42 Z" fill="#111827" />
          <path d="M 25 58 L 75 58 L 70 82 L 30 82 Z" fill="#007A3D" />
          <line x1="23" y1="42" x2="77" y2="42" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="25" y1="58" x2="75" y2="58" stroke="#FFFFFF" strokeWidth="2" />
          {/* White Cockerel holding axe */}
          <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          {/* Crossed Spears */}
          <line x1="15" y1="15" x2="85" y2="85" stroke="#4B5563" strokeWidth="2" />
          <line x1="85" y1="15" x2="15" y2="85" stroke="#4B5563" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
          Republic of Kenya
        </span>
        <span className="text-slate-300">|</span>
        <div className="flex items-center gap-0.5">
          <span className="text-emerald-600 font-bold text-lg">e</span>
          <span className={`font-extrabold text-lg tracking-tight font-display ${variant === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Citizen
          </span>
        </div>
      </div>
    </div>
  );
};
