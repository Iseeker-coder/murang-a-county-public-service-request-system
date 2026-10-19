import React from 'react';

interface MurangaOfficialCrestProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MurangaOfficialCrest: React.FC<MurangaOfficialCrestProps> = ({
  className = '',
  size = 'md',
}) => {
  const dimensions = {
    sm: 'w-14 h-20',
    md: 'w-20 h-28',
    lg: 'w-28 h-40',
    xl: 'w-36 h-52',
  }[size];

  return (
    <div className={`relative shrink-0 select-none ${dimensions} ${className}`}>
      <svg
        viewBox="0 0 240 340"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Crossed Traditional Maasai Spears */}
        <g stroke="#1F2937" strokeWidth="4" strokeLinecap="round">
          {/* Left spear passing down to right */}
          <line x1="36" y1="36" x2="204" y2="250" />
          {/* Right spear passing down to left */}
          <line x1="204" y1="36" x2="36" y2="250" />
        </g>
        {/* Spear Heads (Silver metallic blades) */}
        <polygon points="36,20 48,36 36,46 24,36" fill="#E5E7EB" stroke="#1F2937" strokeWidth="2" />
        <polygon points="204,20 216,36 204,46 192,36" fill="#E5E7EB" stroke="#1F2937" strokeWidth="2" />

        {/* Top Green Banner with swallowtail ribbon */}
        <g>
          {/* Folded ribbon background ends */}
          <path d="M 12 40 L 32 30 L 32 54 L 12 48 Z" fill="#005A2B" />
          <path d="M 228 40 L 208 30 L 208 54 L 228 48 Z" fill="#005A2B" />

          {/* Main Top Curved Banner */}
          <path
            d="M 22 44 Q 120 18 218 44 L 214 62 Q 120 36 26 62 Z"
            fill="#007A3D"
            stroke="#004D25"
            strokeWidth="2"
          />
          {/* Top Banner White Border Lines */}
          <path d="M 26 48 Q 120 23 214 48" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
          <path d="M 28 58 Q 120 32 212 58" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />

          {/* Banner Text: MURANG'A COUNTY GOVERNMENT */}
          <path id="crestTopBannerPath" d="M 24 54 Q 120 28 216 54" fill="none" />
          <text fill="#FFFFFF" fontSize="10.5" fontWeight="900" letterSpacing="0.8" textAnchor="middle">
            <textPath href="#crestTopBannerPath" startOffset="50%">
              MURANG'A COUNTY GOVERNMENT
            </textPath>
          </text>
        </g>

        {/* Heraldic Shield Base (Black background with traditional oval contours) */}
        <ellipse cx="120" cy="150" rx="68" ry="86" fill="#111827" stroke="#1F2937" strokeWidth="3" />

        {/* Green Inner Core with white fimbriation border */}
        <path
          d="M 76 86 C 120 74, 120 74, 164 86 C 178 140, 168 200, 120 226 C 72 200, 62 140, 76 86 Z"
          fill="#007A3D"
          stroke="#FFFFFF"
          strokeWidth="3.5"
        />

        {/* 1. Dairy Cow Head (White & Black Friesian) */}
        <g transform="translate(100, 56) scale(0.48)">
          <path
            d="M 22 28 Q 42 12 62 28 Q 58 48 42 54 Q 26 48 22 28 Z"
            fill="#FFFFFF"
            stroke="#111827"
            strokeWidth="3"
          />
          {/* Cow Horns */}
          <path d="M 18 24 Q 8 14 14 6" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M 66 24 Q 76 14 70 6" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Cow Ears */}
          <path d="M 16 32 Q 4 36 10 44 Z" fill="#FFFFFF" />
          <path d="M 68 32 Q 80 36 74 44 Z" fill="#FFFFFF" />
          {/* Black patches on cow */}
          <path d="M 46 22 Q 58 24 52 38 Q 42 32 46 22 Z" fill="#111827" />
          <path d="M 26 36 Q 34 38 30 46 Q 24 44 26 36 Z" fill="#111827" />
          {/* Eyes & muzzle */}
          <circle cx="32" cy="34" r="2.5" fill="#111827" />
          <circle cx="52" cy="34" r="2.5" fill="#111827" />
          <ellipse cx="42" cy="48" rx="8" ry="4" fill="#E5E7EB" />
          <circle cx="39" cy="48" r="1.2" fill="#111827" />
          <circle cx="45" cy="48" r="1.2" fill="#111827" />
        </g>

        {/* 2. Central Traditional Mortar (Ndĩrĩ) and Two Wooden Pestles */}
        {/* Pestles poking out */}
        <line x1="106" y1="110" x2="100" y2="82" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
        <line x1="134" y1="110" x2="140" y2="82" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />

        {/* Wooden Mortar (Gold/Ochre woven texture) */}
        <path
          d="M 104 105 C 104 100, 136 100, 136 105 L 138 155 C 134 165, 106 165, 102 155 Z"
          fill="#D97706"
          stroke="#78350F"
          strokeWidth="2"
        />
        {/* Texture lines on Ndĩrĩ */}
        <line x1="108" y1="112" x2="132" y2="112" stroke="#92400E" strokeWidth="1.5" />
        <line x1="107" y1="122" x2="133" y2="122" stroke="#92400E" strokeWidth="1.5" />
        <line x1="106" y1="132" x2="134" y2="132" stroke="#92400E" strokeWidth="1.5" />
        <line x1="106" y1="142" x2="134" y2="142" stroke="#92400E" strokeWidth="1.5" />
        <line x1="108" y1="152" x2="132" y2="152" stroke="#92400E" strokeWidth="1.5" />

        {/* 3. Community Hands Lifting the Mortar Together (White arms reaching upward) */}
        <g fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="0.8">
          {/* Center arm & hand */}
          <path d="M 116 195 L 117 160 L 114 152 L 120 152 L 123 160 L 124 195 Z" />
          {/* Left arm & hand */}
          <path d="M 102 188 L 108 162 L 105 154 L 112 156 L 114 165 L 108 190 Z" />
          {/* Far left arm */}
          <path d="M 94 178 L 102 165 L 100 158 L 106 160 L 106 169 L 98 182 Z" />
          {/* Right arm & hand */}
          <path d="M 138 188 L 132 162 L 135 154 L 128 156 L 126 165 L 132 190 Z" />
          {/* Far right arm */}
          <path d="M 146 178 L 138 165 L 140 158 L 134 160 L 134 169 L 142 182 Z" />
        </g>

        {/* 4. Left Flank: Lush Green Tea Bush Sprig */}
        <g transform="translate(64, 120)">
          <path d="M 12 18 Q 18 10 14 0 Q 6 12 12 18" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
          <path d="M 8 26 Q 0 16 6 8 Q 14 18 8 26" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
          <path d="M 14 34 Q 22 24 16 16 Q 8 26 14 34" fill="#15803D" stroke="#166534" strokeWidth="1" />
          <path d="M 10 38 Q 12 28 12 4" stroke="#14532D" strokeWidth="1.5" fill="none" />
        </g>

        {/* 5. Right Flank: Rich Coffee Branch with Red Berries */}
        <g transform="translate(154, 120)">
          <path d="M 4 38 Q 6 24 4 4" stroke="#78350F" strokeWidth="1.5" fill="none" />
          <path d="M 4 10 Q 14 6 16 16 Q 6 18 4 10" fill="#15803D" stroke="#166534" strokeWidth="1" />
          <path d="M 4 26 Q -4 20 -2 12 Q 6 16 4 26" fill="#16A34A" stroke="#166534" strokeWidth="1" />
          {/* Red Coffee Cherries */}
          <circle cx="4" cy="18" r="4.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
          <circle cx="10" cy="22" r="4.5" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1" />
          <circle cx="2" cy="26" r="4" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
        </g>

        {/* 6. Base Land & Blue Rivers */}
        <g>
          {/* Fertile soil base / mountain foothills */}
          <path
            d="M 40 220 C 70 200, 100 240, 120 220 C 140 240, 170 200, 200 220 L 204 250 C 160 265, 80 265, 36 250 Z"
            fill="#1F2937"
          />
          {/* Blue Meandering River Streams */}
          <path
            d="M 68 226 Q 80 236 74 248 L 79 248 Q 85 236 73 226 Z"
            fill="#0284C7"
          />
          <path
            d="M 162 226 Q 150 236 156 248 L 151 248 Q 145 236 157 226 Z"
            fill="#0284C7"
          />
        </g>

        {/* 7. Agricultural Produce at the Base (Mango, Bananas, Maize, Tomato) */}
        <g>
          {/* Mango (Left - Yellow/Orange) */}
          <g transform="translate(36, 226)">
            <ellipse cx="12" cy="14" rx="9" ry="7" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" transform="rotate(-20, 12, 14)" />
            <path d="M 15 8 Q 18 4 16 2" stroke="#15803D" strokeWidth="1.5" fill="none" />
          </g>

          {/* Bananas (Bunch of 3 yellow bananas) */}
          <g transform="translate(74, 230)">
            <path d="M 4 14 Q 14 20 24 16 Q 14 17 4 14" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.2" />
            <path d="M 6 10 Q 16 16 26 12 Q 16 13 6 10" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.2" />
            <path d="M 8 6 Q 18 12 28 8 Q 18 9 8 6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2" />
          </g>

          {/* Maize Cob (Center - Green husk with yellow kernels) */}
          <g transform="translate(122, 226)">
            <ellipse cx="12" cy="14" rx="5" ry="11" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
            {/* Green Husk leaves */}
            <path d="M 6 22 Q 4 10 10 6 Q 8 16 10 22" fill="#16A34A" />
            <path d="M 18 22 Q 20 10 14 6 Q 16 16 14 22" fill="#15803D" />
          </g>

          {/* Ripe Red Tomato (Right) */}
          <g transform="translate(182, 228)">
            <circle cx="12" cy="12" r="9" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
            {/* Calyx / green leaves */}
            <polygon points="12,3 10,7 6,5 9,8 7,12 11,9 15,12 13,8 16,5 12,7" fill="#15803D" />
          </g>
        </g>

        {/* 8. Bottom Golden Motto Banner (KAMŨINGĨ KOYAGA NDĨRĨ) */}
        <g>
          {/* Ribbon Ends */}
          <path d="M 24 286 L 8 280 L 16 268 L 30 274 Z" fill="#B45309" />
          <path d="M 216 286 L 232 280 L 224 268 L 210 274 Z" fill="#B45309" />

          {/* Main Gold Ribbon */}
          <path
            d="M 22 272 Q 120 252 218 272 L 212 296 Q 120 274 28 296 Z"
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth="2"
          />
          {/* Inner banner borders */}
          <path d="M 26 276 Q 120 256 214 276" stroke="#78350F" strokeWidth="0.8" fill="none" />
          <path d="M 30 292 Q 120 270 210 292" stroke="#78350F" strokeWidth="0.8" fill="none" />

          {/* Official Motto: KAMŨINGĨ KOYAGA NDĨRĨ */}
          <path id="crestBottomMottoPath" d="M 26 287 Q 120 266 214 287" fill="none" />
          <text fill="#1F2937" fontSize="11" fontWeight="900" letterSpacing="0.9" textAnchor="middle">
            <textPath href="#crestBottomMottoPath" startOffset="50%">
              KAMŨINGĨ KOYAGA NDĨRĨ
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
};
