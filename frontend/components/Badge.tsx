interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export default function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  const variants = {
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    secondary: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full border
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </span>
  );
}
