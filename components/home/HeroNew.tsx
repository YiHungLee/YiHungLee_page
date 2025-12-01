import React, { useEffect, useState } from 'react';
import { PROFILE } from '../../constants';
import InteractiveAvatar from '../InteractiveAvatar';

export const HeroNew: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center
                        bg-warmCream-100 dark:bg-darkMode-bg
                        transition-colors duration-500 subtle-texture overflow-hidden">

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-32 md:py-40">

        {/* Large Name Display - Editorial Typography */}
        <div className="mb-20 md:mb-32 relative">
          <div className="flex items-center gap-8 md:gap-12 lg:gap-16">
            <h1 className={`font-display font-bold tracking-tighter
                           text-charcoal-900 dark:text-darkMode-text
                           transition-all duration-1200 ease-out-expo
                           ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                           text-6xl sm:text-7xl md:text-8xl lg:text-9xl
                           leading-none optical-align`}>
              {PROFILE.name}
            </h1>

            {/* Avatar - next to name */}
            <div className="hidden md:block opacity-0 animate-fade-in stagger-2">
              <InteractiveAvatar size="small" />
            </div>
          </div>

          {/* English Name with Fine Line */}
          <div className={`flex items-center gap-6 mt-8 transition-all duration-1200 ease-out-expo
                          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
                          stagger-3`}>
            <div className="h-px w-12 md:w-20 bg-charcoal-900 dark:bg-darkMode-text"></div>
            <p className="font-accent italic text-2xl md:text-4xl
                          text-charcoal-700 dark:text-darkMode-textMuted">
              {PROFILE.nameEn}
            </p>
          </div>
        </div>

        {/* Two Column Layout - Asymmetric */}
        <div className="grid md:grid-cols-12 gap-12 md:gap-20">

          {/* Left Column - Title & Tagline */}
          <div className={`md:col-span-7 space-y-12 transition-all duration-1200 ease-out-expo
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                          stagger-3`}>

            {/* Professional Title */}
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 border border-fine border-border-light dark:border-darkMode-border
                              rounded-full bg-warmCream-50/50 dark:bg-darkMode-bgElevated backdrop-blur-sm">
                <span className="font-body text-sm tracking-wide
                                 text-charcoal-700 dark:text-darkMode-textMuted">
                  {PROFILE.title}
                </span>
              </div>

              <h2 className="font-body text-lg md:text-xl
                             text-charcoal-600 dark:text-darkMode-textMuted
                             leading-relaxed max-w-xl">
                {PROFILE.school}
              </h2>
            </div>

            {/* Tagline - Large Editorial Text */}
            <div className="relative pl-5 py-1 border-1 border-fine border-ochre-500 dark:border-darkMode-ochre">
              <p className="font-display text-2xl md:text-3xl lg:text-4xl
                            text-charcoal-800 dark:text-darkMode-text
                            leading-relaxed italic">
                {PROFILE.heroTagline}
              </p>
            </div>

            {/* Call to Action */}
            <div className="flex flex-wrap gap-6 pt-8">
              <a
                href="#identity"
                className="group inline-block px-8 py-4 border border-fine
                           border-charcoal-900 dark:border-darkMode-text
                           text-charcoal-900 dark:text-darkMode-text
                           font-body text-sm tracking-wide uppercase
                           transition-all duration-400 ease-out-expo
                           hover:bg-charcoal-900 dark:hover:bg-darkMode-text
                           hover:text-warmCream-50 dark:hover:text-darkMode-bg">
                探索更多
              </a>

              <a
                href="#/contact"
                className="inline-block px-8 py-4
                           text-ochre-500 dark:text-darkMode-ochre
                           font-body text-sm tracking-wide uppercase
                           editorial-underline
                           transition-all duration-400">
                聯絡我
              </a>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className={`md:col-span-5 space-y-8 transition-all duration-1200 ease-out-expo
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                          stagger-4`}>

            {/* Current Role */}
            <div className="space-y-3">
              <div className="h-px w-12 bg-border-light dark:bg-darkMode-border"></div>
              <div className="space-y-2">
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 dark:text-darkMode-textMuted">
                  目前
                </p>
                <p className="font-body text-base
                              text-charcoal-800 dark:text-darkMode-text">
                  {PROFILE.currentRole}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="h-px w-12 bg-border-light dark:bg-darkMode-border"></div>
              <div className="space-y-2">
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 dark:text-darkMode-textMuted">
                  聯絡
                </p>
                <div className="space-y-1 font-body text-sm
                                text-charcoal-700 dark:text-darkMode-textMuted">
                  <p className="editorial-underline">
                    <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Location Tags */}
            <div className="space-y-3">
              <div className="h-px w-12 bg-border-light dark:bg-darkMode-border"></div>
              <div className="space-y-2">
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 dark:text-darkMode-textMuted">
                  地點
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 border border-fine border-border-light dark:border-darkMode-border
                                   font-body text-xs text-charcoal-700 dark:text-darkMode-textMuted">
                    台北市
                  </span>
                  <span className="px-3 py-1 border border-fine border-border-light dark:border-darkMode-border
                                   font-body text-xs text-charcoal-700 dark:text-darkMode-textMuted">
                    臺北市立大學
                  </span>
                  <span className="px-3 py-1 border border-fine border-border-light dark:border-darkMode-border
                                   font-body text-xs text-charcoal-700 dark:text-darkMode-textMuted">
                    世新大學
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Minimal */}
      <div className="absolute bottom-5 left-6 md:left-12 flex items-center gap-3
                      opacity-0 animate-fade-in stagger-5">
        <div className="w-px h-16 bg-charcoal-900 dark:bg-darkMode-text animate-gentle-float"></div>
        <span className="font-body text-xs tracking-widest uppercase
                         text-charcoal-600 dark:text-darkMode-textMuted
                         -rotate-90 origin-left ">
          Scroll
        </span>
      </div>

      {/* Decorative Element - Asymmetric Line */}
      <div className="absolute top-1/3 right-0 w-1/3 h-px
                      bg-border-light dark:bg-darkMode-border
                      opacity-0 animate-draw-line stagger-6"></div>
    </section>
  );
};
