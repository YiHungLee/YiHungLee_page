import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { PowerSwitchToggle } from './PowerSwitchToggle';

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: '首頁', path: '/' },
    { label: '關於', path: '/about' },
    { label: '作品', path: '/projects' },
    { label: 'Blog', path: '/blog' },
    { label: '聯絡', path: '/contact' },
  ];

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-warmCream-50/95 dark:bg-darkMode-bg/95 backdrop-blur-md py-4 border-b border-fine border-border-light dark:border-darkMode-border nav-glow-dark'
            : 'bg-transparent py-6'
        }`}
      >
        <style>{`
          /* 暗色模式下的微弱崁燈發光效果 */
          .dark .nav-glow-dark::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 0;
            right: 0;
            height: 20px;
            background: linear-gradient(to bottom,
              rgba(232, 227, 219, 0.03) 0%,
              rgba(232, 227, 219, 0.015) 50%,
              transparent 100%);
            pointer-events: none;
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center">

            {/* Logo - Minimalist Typography */}
            <NavLink
              to="/"
              className="group flex flex-col transition-opacity duration-300 hover:opacity-60"
            >
              <span className="font-display text-2xl md:text-3xl font-semibold tracking-tight
                             text-charcoal-900 dark:text-darkMode-text optical-align">
                李奕宏
              </span>
              <span className="font-body text-xs tracking-widest uppercase
                             text-charcoal-600 dark:text-darkMode-textMuted -mt-1">
                Yi-hung Lee
              </span>
            </NavLink>

            {/* Desktop Navigation - Clean Horizontal Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `relative font-body text-sm tracking-wide transition-all duration-300
                     ${isActive
                       ? 'text-ochre-500 dark:text-darkMode-ochre'
                       : 'text-charcoal-700 dark:text-darkMode-textMuted hover:text-ochre-500 dark:hover:text-darkMode-ochre'
                     }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="editorial-underline">{link.label}</span>
                      {/* Active Indicator - Fine Line */}
                      {isActive && (
                        <div className="absolute -bottom-1 left-0 w-full h-px
                                        bg-ochre-500 dark:bg-darkMode-ochre"></div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}

              {/* Theme Toggle - Power Switch */}
              <div className="text-charcoal-700 dark:text-warmCream-50 ml-2">
                <PowerSwitchToggle />
              </div>
            </div>

            {/* Mobile - Theme Toggle & Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <div className="text-charcoal-700 dark:text-warmCream-50">
                <PowerSwitchToggle />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 transition-opacity duration-300 hover:opacity-60
                           text-charcoal-900 dark:text-darkMode-text"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden
                        bg-warmCream-50/98 dark:bg-darkMode-bg/98
                        backdrop-blur-xl animate-fade-in">

          {/* Padding to avoid nav bar */}
          <div className="h-24"></div>

          {/* Menu Content */}
          <div className="px-6 py-12">
            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 mb-16">
              {navLinks.map((link, index) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-4 border-b border-fine border-border-light dark:border-darkMode-border
                     font-display text-3xl transition-all duration-300
                     ${isActive
                       ? 'text-ochre-500 dark:text-darkMode-ochre border-ochre-500 dark:border-darkMode-ochre'
                       : 'text-charcoal-800 dark:text-darkMode-text hover:text-ochre-500 dark:hover:text-darkMode-ochre'
                     } stagger-${index + 1} opacity-0 animate-fade-in-up`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Contact Information */}
            <div className="space-y-4 opacity-0 animate-fade-in-up stagger-6">
              <div className="h-px w-16 bg-border-light dark:bg-darkMode-border"></div>
              <div className="font-body text-sm text-charcoal-600 dark:text-darkMode-textMuted space-y-2">
                <p>lee2952000@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
