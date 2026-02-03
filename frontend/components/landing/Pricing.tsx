'use client';

import Link from 'next/link';
import { PricingProps } from '@/lib/types/components';

export function Pricing({ headline, tiers }: PricingProps) {
  return (
    <section className="py-20 px-4" id="pricing">
      <div className="max-w-7xl mx-auto">
        {headline && (
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white animate-fade-in-up">
              {headline}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 animate-fade-in-up ${
                tier.highlighted
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl scale-105 z-10'
                  : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-white/50 dark:border-gray-700/50'
              }`}
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}

              <h3
                className={`text-xl font-bold mb-2 ${
                  tier.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}
              >
                {tier.name}
              </h3>

              {tier.description && (
                <p
                  className={`text-sm mb-4 ${
                    tier.highlighted ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {tier.description}
                </p>
              )}

              <div className="mb-6">
                <span
                  className={`text-4xl font-extrabold ${
                    tier.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {tier.price}
                </span>
                {tier.period && (
                  <span
                    className={`text-sm ${
                      tier.highlighted ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    /{tier.period}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${
                        tier.highlighted ? 'text-indigo-200' : 'text-green-500'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className={
                        tier.highlighted ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.cta.href}
                className={`block w-full text-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {tier.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
