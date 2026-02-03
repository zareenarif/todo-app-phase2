'use client';

import { FeaturesProps } from '@/lib/types/components';

export function Features({
  headline,
  subheadline,
  features,
  columns = 3,
}: FeaturesProps) {
  const columnStyles = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-20 px-4" id="features">
      <div className="max-w-7xl mx-auto">
        {(headline || subheadline) && (
          <div className="text-center mb-16">
            {headline && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up">
                {headline}
              </h2>
            )}
            {subheadline && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {subheadline}
              </p>
            )}
          </div>
        )}

        <div className={`grid grid-cols-1 ${columnStyles[columns]} gap-8`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-3 shadow-md">
                <span className="text-lg">{feature.icon}</span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
