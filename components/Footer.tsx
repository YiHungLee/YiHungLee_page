import React from 'react';
import { Link } from 'react-router-dom';
import { PROFILE } from '../constants';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: '首頁', path: '/' },
    { label: '關於', path: '/about' },
    { label: '作品', path: '/projects' },
    { label: 'Blog', path: '/blog' },
    { label: '聯絡', path: '/contact' },
  ];

  return (
    <footer className="relative bg-warmCream-100
                       border-t border-fine border-border-light
                       transition-colors duration-500">

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-32">

        {/* Main Grid */}
        <div className="grid md:grid-cols-12 gap-12 md:gap-20 mb-20">

          {/* Left: Branding & Philosophy */}
          <div className="md:col-span-7 space-y-8">

            {/* Name */}
            <div>
              <h3 className="font-display text-4xl md:text-5xl font-bold
                             text-charcoal-900
                             tracking-tight mb-2">
                {PROFILE.name}
              </h3>
              <p className="font-accent italic text-xl
                            text-charcoal-600">
                {PROFILE.nameEn}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px w-24 bg-ochre-500"></div>

            {/* Philosophy Quote */}
            <blockquote className="font-display text-xl md:text-2xl italic
                                   text-charcoal-700
                                   leading-relaxed max-w-2xl
                                   border-l border-fine border-ochre-500
                                   pl-3.5 py-2">
              {PROFILE.philosophy.split('.')[0]}。
            </blockquote>

            {/* Title & Institution */}
            <div className="space-y-2 text-charcoal-600
                            font-body text-sm">
              <p>{PROFILE.title}</p>
              <p>{PROFILE.school}</p>
            </div>
          </div>

          {/* Right: Navigation & Contact */}
          <div className="md:col-span-5 space-y-12">

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-body text-xs tracking-widest uppercase
                             text-charcoal-600">
                
              </h4>

              <nav className="space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block font-body text-base
                               text-charcoal-700
                               editorial-underline
                               transition-opacity duration-300 hover:opacity-60">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h4 className="font-body text-xs tracking-widest uppercase
                             text-charcoal-600">
                聯絡方式
              </h4>

              <div className="space-y-3 font-body text-sm
                              text-charcoal-700">
                <div>
                  <p className="text-xs text-charcoal-600
                                tracking-wide mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="editorial-underline
                               transition-opacity duration-300 hover:opacity-60">
                    {PROFILE.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-6">

          {/* Divider */}
          <div className="h-px w-full bg-border-light"></div>

          {/* Copyright & Credits */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between
                          gap-4 font-body text-xs
                          text-charcoal-600">

            <p>
              © {currentYear} {PROFILE.name}. All Rights Reserved.
            </p>

            <p className="italic">
              Website Designed by Yi-Hung Lee
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
