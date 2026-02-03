'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  // Fixed pixel sizes for each variant
  const sizeConfig = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  const textSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const iconSize = sizeConfig[size];

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      style={{ maxHeight: '48px' }}
    >
      {/* Logo Icon - HARD CODED SIZE */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          minWidth: iconSize,
          maxWidth: iconSize,
          minHeight: iconSize,
          maxHeight: iconSize,
          flexShrink: 0,
        }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: iconSize,
            height: iconSize,
            display: 'block',
          }}
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
          <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M12 20L17 25L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={`${textSize[size]} font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap`}>
          TaskFlow
        </span>
      )}
    </div>
  );
}

// Compact version for sidebar/navigation
export function LogoCompact({ className = '' }: { className?: string }) {
  return (
    <div
      style={{ width: 32, height: 32, minWidth: 32, maxWidth: 32, flexShrink: 0 }}
      className={className}
    >
      <svg
        width={32}
        height={32}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: 32, height: 32, display: 'block' }}
      >
        <defs>
          <linearGradient id="logoGradientCompact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#logoGradientCompact)" />
        <path d="M12 20L17 25L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}
