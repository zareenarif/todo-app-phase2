'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: { icon: 'h-6 w-6', text: 'text-sm' },
  md: { icon: 'h-8 w-8', text: 'text-lg' },
  lg: { icon: 'h-10 w-10', text: 'text-xl' },
};

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { icon, text } = sizeClasses[size];

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`${icon} shrink-0`}>
        <svg
          className="block h-full w-full"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
      {showText && (
        <span className={`${text} font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap`}>
          TaskFlow
        </span>
      )}
    </div>
  );
}

export function LogoCompact({ className = '' }: { className?: string }) {
  return (
    <div className={`h-8 w-8 shrink-0 ${className}`}>
      <svg
        className="block h-full w-full"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
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
