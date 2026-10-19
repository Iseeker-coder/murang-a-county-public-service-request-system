import React from 'react';

interface MurangaEmblemProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const MurangaEmblem: React.FC<MurangaEmblemProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-xs' },
    md: { icon: 'w-12 h-12', text: 'text-sm' },
    lg: { icon: 'w-16 h-16', text: 'text-base' },
    xl: { icon: 'w-20 h-20', text: 'text-lg' },
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Murang'a County Shield Emblem SVG */}
      <div className={`relative shrink-0 ${sizeMap[size].icon}`}>
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Arc Banner */}
          <path
            d="M 20 28 C 80 12, 80 12, 140 28 L 136 38 C 80 24, 80 24, 24 38 Z"
            fill="#007A3D"
          />
          <text
            x="80"
            y="28"
            fill="#FFFFFF"
            fontSize="7"
            fontWeight="bold"
            letterSpacing="0.8"
            textAnchor="middle"
          >
            MURANG'A COUNTY GOVERNMENT
          </text>

          {/* Crossed Spears behind Shield */}
          <line x1="24" y1="20" x2="136" y2="140" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          <line x1="136" y1="20" x2="24" y2="140" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          {/* Spear heads */}
          <polygon points="20,15 28,18 24,25" fill="#E5E7EB" stroke="#1F2937" strokeWidth="1" />
          <polygon points="140,15 132,18 136,25" fill="#E5E7EB" stroke="#1F2937" strokeWidth="1" />

          {/* Traditional Kenyan Heraldic Oval/Shield Base */}
          <ellipse cx="80" cy="80" rx="42" ry="48" fill="#111827" stroke="#1F2937" strokeWidth="2" />

          {/* Inner Central Green Core */}
          <path
            d="M 52 42 C 80 38, 80 38, 108 42 C 114 74, 110 110, 80 124 C 50 110, 46 74, 52 42 Z"
            fill="#007A3D"
            stroke="#D4AF37"
            strokeWidth="2"
          />

          {/* Cow Head Emblem (Livestock symbol) at top of shield */}
          <path
            d="M 72 50 Q 80 46 88 50 Q 86 60 80 62 Q 74 60 72 50 Z"
            fill="#FFFFFF"
          />
          <path d="M 69 48 L 65 44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M 91 48 L 95 44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

          {/* Central Maize Cob / Grain Stalk (Gold) */}
          <path
            d="M 74 66 C 74 64, 86 64, 86 66 L 87 92 C 84 96, 76 96, 73 92 Z"
            fill="#EAB308"
            stroke="#CA8A04"
            strokeWidth="1"
          />
          {/* Grains texture */}
          <line x1="77" y1="70" x2="83" y2="70" stroke="#854D0E" strokeWidth="1" />
          <line x1="77" y1="75" x2="83" y2="75" stroke="#854D0E" strokeWidth="1" />
          <line x1="77" y1="80" x2="83" y2="80" stroke="#854D0E" strokeWidth="1" />
          <line x1="77" y1="85" x2="83" y2="85" stroke="#854D0E" strokeWidth="1" />

          {/* Hands upholding prosperity (white) */}
          <path
            d="M 68 96 C 72 90, 76 96, 80 94 C 84 96, 88 90, 92 96 C 88 106, 72 106, 68 96 Z"
            fill="#F9FAFB"
          />

          {/* Left: Tea Branch with green leaves */}
          <path d="M 42 74 Q 46 80 40 86 Q 36 78 42 74" fill="#22C55E" />
          <path d="M 40 64 Q 44 70 38 76 Q 34 68 40 64" fill="#16A34A" />

          {/* Right: Coffee Cherries with red berries */}
          <circle cx="118" cy="74" r="3" fill="#DC2626" />
          <circle cx="121" cy="80" r="3" fill="#DC2626" />
          <path d="M 116 66 Q 120 72 114 78 Q 110 70 116 66" fill="#15803D" />

          {/* Base Motto Banner (Gold/Yellow) */}
          <path
            d="M 18 132 C 40 126, 120 126, 142 132 L 138 144 C 116 138, 44 138, 22 144 Z"
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth="1.5"
          />
          {/* Motto: "KIRINYAGA NG'ENI" */}
          <text
            x="80"
            y="139"
            fill="#111827"
            fontSize="6.5"
            fontWeight="bold"
            letterSpacing="0.6"
            textAnchor="middle"
          >
            KIRINYAGA NG'ENI
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-slate-900 uppercase font-display leading-tight text-sm md:text-base">
            MURANG'A COUNTY
          </span>
          <span className="font-semibold tracking-wider text-emerald-800 uppercase text-xs md:text-sm">
            GOVERNMENT
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            County Code: 021 · Public Service Portal
          </span>
        </div>
      )}
    </div>
  );
};
