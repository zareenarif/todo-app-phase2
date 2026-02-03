'use client';

import React from 'react';

interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'number';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  maxLength?: number;
  autoComplete?: string;
  className?: string;
}

export default function Input({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  helperText,
  maxLength,
  autoComplete,
  className = '',
}: InputProps) {
  const baseStyles = `
    w-full px-3 py-3
    border-2 rounded-lg
    text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
    bg-white dark:bg-gray-700
    transition-all duration-200
    min-h-[48px]
    focus:outline-none focus:ring-4
    disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-75
  `;

  const stateStyles = error
    ? 'border-red-500 focus:ring-red-100 dark:focus:ring-red-900 focus:border-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 dark:focus:border-indigo-400';

  return (
    <div className={`${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`${baseStyles} ${stateStyles}`.trim().replace(/\s+/g, ' ')}
      />

      {/* Helper text or error message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}

      {!error && helperText && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}

      {/* Character counter */}
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {value.length}/{maxLength} characters
        </p>
      )}
    </div>
  );
}
