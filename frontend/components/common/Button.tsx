'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  ariaLabel?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  loading = false,
  className = '',
  ariaLabel,
}: ButtonProps) {
  // Variant styles
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-200 dark:focus:ring-indigo-800',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-200 dark:focus:ring-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 dark:focus:ring-red-800',
    ghost: 'bg-transparent text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-100 dark:focus:ring-gray-800',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Base styles (always applied)
  const baseStyles = `
    rounded-lg font-medium
    inline-flex items-center justify-center gap-2
    transition-colors duration-150
    focus:outline-none focus:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Hover styles (only when not disabled/loading)
  const hoverStyles = '';

  // Full width
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${hoverStyles}
        ${widthStyles}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {loading && (
        <span className="animate-spin" role="status" aria-label="Loading">
          ⏳
        </span>
      )}
      {children}
    </button>
  );
}
