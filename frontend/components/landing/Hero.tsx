'use client';

import Link from 'next/link';
import { HeroProps } from '@/lib/types/components';

export function Hero({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  image,
  variant = 'centered',
}: HeroProps) {
  const renderContent = () => (
    <div className={`${variant === 'centered' ? 'text-center' : ''}`}>
      <h1
        id="hero-heading"
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-6 animate-fade-in-up"
      >
        {headline}
      </h1>
      {subheadline && (
        <p
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          {subheadline}
        </p>
      )}
      <div
        className={`flex gap-4 ${variant === 'centered' ? 'justify-center' : ''} animate-fade-in-up`}
        style={{ animationDelay: '0.2s' }}
      >
        {primaryCta && (
          <Link
            href={primaryCta.href}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {primaryCta.label}
          </Link>
        )}
        {secondaryCta && (
          <Link
            href={secondaryCta.href}
            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300"
          >
            {secondaryCta.label}
          </Link>
        )}
      </div>
    </div>
  );

  if (variant === 'centered') {
    return (
      <section className="py-20 px-4" aria-labelledby="hero-heading">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {renderContent()}
          {image && (
            <div className="mt-12 animate-scale-in" style={{ animationDelay: '0.3s' }} aria-hidden="true">
              {image}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === 'split' || variant === 'image-right') {
    return (
      <section className="py-20 px-4" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto">
          <div className={`flex flex-col lg:flex-row items-center gap-12 ${variant === 'image-right' ? '' : 'lg:flex-row-reverse'}`}>
            <div className="flex-1">{renderContent()}</div>
            {image && (
              <div className="flex-1 animate-slide-in-right" aria-hidden="true">
                {image}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return null;
}
