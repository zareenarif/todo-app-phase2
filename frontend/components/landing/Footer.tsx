'use client';

import Link from 'next/link';
import { FooterProps } from '@/lib/types/components';

export function Footer({
  logo,
  description,
  links,
  social,
  copyright,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} All rights reserved.`;

  return (
    <footer className="bg-gray-900 text-gray-400 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            {logo ? (
              <div className="mb-4">{logo}</div>
            ) : (
              <h3 className="text-xl font-bold text-white mb-4">Brand</h3>
            )}
            {description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {description}
              </p>
            )}
            {social && social.length > 0 && (
              <div className="flex gap-4">
                {social.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    aria-label={item.label}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Columns */}
          {links &&
            links.map((column, index) => (
              <div key={index}>
                <h4 className="text-white font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.items.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {copyright || defaultCopyright}
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
