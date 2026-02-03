'use client';

import { forwardRef, useRef, useEffect } from 'react';
import { TextareaProps } from '@/lib/types/components';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      autoResize = false,
      className = '',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const innerRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      if (autoResize && innerRef.current) {
        const textarea = innerRef.current;
        const adjustHeight = () => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        };
        adjustHeight();
        textarea.addEventListener('input', adjustHeight);
        return () => textarea.removeEventListener('input', adjustHeight);
      }
    }, [autoResize]);

    const baseStyles =
      'w-full bg-white dark:bg-gray-800 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-none';

    const stateStyles = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400'
      : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 dark:focus:border-indigo-400';

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={(node) => {
            (innerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          id={textareaId}
          rows={rows}
          className={`${baseStyles} ${stateStyles} px-4 py-2.5 text-base`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
