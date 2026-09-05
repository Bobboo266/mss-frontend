# إنشاء مجلد components
New-Item -ItemType Directory -Force -Path "src\components"

# حذف الملفات القديمة
Remove-Item -Force -Path "src\App.css" -ErrorAction SilentlyContinue
Remove-Item -Force -Path "src\index.css" -ErrorAction SilentlyContinue

# إنشاء index.css
@'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #0a0a0a;
  color: #ffffff;
  overflow-x: hidden;
}

.gold-gradient {
  background: linear-gradient(135deg, #D4AF37 0%, #F4E5C2 50%, #D4AF37 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gold-border {
  border: 1px solid #D4AF37;
}

.gold-bg {
  background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
}

.bg-dark {
  background: #0a0a0a;
}

.bg-card {
  background: #111111;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
  color: #0a0a0a;
  border: none;
  padding: 12px 32px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-gold:hover {
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 1px solid #D4AF37;
  color: #D4AF37;
  padding: 12px 32px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: rgba(212, 175, 55, 0.1);
}
'@ | Out-File -FilePath "src\index.css" -Encoding UTF8

# إنشاء Logo.jsx
@'
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
'@ | Out-File -FilePath "src\components\Logo.jsx" -Encoding UTF8

Write-Host "✅ Files created! Now copying App.jsx..." -ForegroundColor Green