'use client';

import { forwardRef } from 'react';
import { CardProps, CardHeaderProps, CardFooterProps } from '@/lib/types/components';

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      padding = 'md',
      interactive = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-2xl transition-all duration-300';

    const variantStyles = {
      elevated:
        'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-white/50 dark:border-gray-700/50',
      outlined:
        'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
      filled:
        'bg-gray-100 dark:bg-gray-800',
    };

    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
    };

    const interactiveStyles = interactive
      ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
      : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = ({ title, subtitle, action }: CardHeaderProps) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
};

CardHeader.displayName = 'CardHeader';

const CardFooter = ({ children, align = 'right' }: CardFooterProps) => {
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${alignStyles[align]}`}
    >
      {children}
    </div>
  );
};

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter };
