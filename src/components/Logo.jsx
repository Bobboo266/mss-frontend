import React from 'react';

const Logo = ({ size = 'large' }) => {
  const sizes = {
    large: { width: 400, height: 300 },
    medium: { width: 200, height: 150 },
    small: { width: 120, height: 90 }
  };

  const { width, height } = sizes[size];

  return (
    <div style={{ 
      width, 
      height, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg width={width} height={height} viewBox="0 0 400 300">
        <path 
          d="M200 20 L220 50 L240 30 L260 60 L280 40 L280 80 L120 80 L120 40 L140 60 L160 30 L180 50 Z" 
          fill="#D4AF37"
        />
        <path 
          d="M200 80 L200 200 M180 120 L220 120 M180 140 L220 140 M180 160 L220 160" 
          stroke="#D4AF37" 
          strokeWidth="8"
          fill="none"
        />
        <text x="140" y="240" fontSize="80" fontWeight="bold" fill="#D4AF37" fontFamily="serif">M</text>
        <text x="220" y="240" fontSize="80" fontWeight="bold" fill="#D4AF37" fontFamily="serif">SS</text>
        <text x="200" y="270" fontSize="16" fontWeight="500" fill="#D4AF37" textAnchor="middle">MOHAMED SALAH SOLIMAN</text>
      </svg>
    </div>
  );
};

export default Logo;
