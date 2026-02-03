'use client';

import { forwardRef, useEffect, useRef } from 'react';
import { CheckboxProps } from '@/lib/types/components';

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      indeterminate = false,
      checkboxSize = 'md',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const innerRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const sizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    const labelSizeStyles = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return (
      <div className={`flex items-center ${className}`}>
        <input
          ref={(node) => {
            // Handle both refs
            (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          type="checkbox"
          id={checkboxId}
          className={`${sizeStyles[checkboxSize]} rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 focus:ring-2 focus:ring-offset-0 dark:bg-gray-800 dark:checked:bg-indigo-600 transition-colors cursor-pointer`}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className={`ml-2 ${labelSizeStyles[checkboxSize]} text-gray-700 dark:text-gray-300 cursor-pointer select-none`}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
