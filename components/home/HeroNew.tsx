import React, { useEffect, useState } from 'react';
import { PROFILE } from '../../constants';

export const HeroNew: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center
                        bg-warmCream-100 dark:bg-charcoal-900
                        transition-colors duration-500 subtle-texture overflow-hidden">

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-32 md:py-40">

        {/* Large Name Display - Editorial Typography */}
        <div className="mb-20 md:mb-32">
          <h1 className={`font-display font-bold tracking-tighter
                         text-charcoal-900 dark:text-warmCream-50
                         transition-all duration-1200 ease-out-expo
                         ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                         text-6xl sm:text-7xl md:text-8xl lg:text-9xl
                         leading-none optical-align`}>
            {PROFILE.name}
          </h1>

          {/* English Name with Fine Line */}
          <div className={`flex items-center gap-6 mt-8 transition-all duration-1200 ease-out-expo
                          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
                          stagger-2`}>
            <div className="h-px w-12 md:w-20 bg-charcoal-900 dark:bg-warmCream-50"></div>
            <p className="font-accent italic text-2xl md:text-4xl
                          text-charcoal-700 dark:text-warmCream-300">
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
              <div className="inline-block px-4 py-2 border border-fine border-border-light dark:border-border-dark
                              rounded-full bg-warmCream-50/50 dark:bg-charcoal-800/50 backdrop-blur-sm">
                <span className="font-body text-sm tracking-wide
                                 text-charcoal-700 dark:text-warmCream-300">
                  {PROFILE.title}
                </span>
              </div>

              <h2 className="font-body text-lg md:text-xl
                             text-charcoal-600 dark:text-warmCream-400
                             leading-relaxed max-w-xl">
                {PROFILE.school}
              </h2>
            </div>

            {/* Tagline - Large Editorial Text */}
            <div className="relative pl-5 py-1 border-1 border-fine border-ochre-500 dark:border-ochre-400">
              <p className="font-display text-2xl md:text-3xl lg:text-4xl
                            text-charcoal-800 dark:text-warmCream-200
                            leading-relaxed italic">
                {PROFILE.heroTagline}
              </p>
            </div>

            {/* Call to Action */}
            <div className="flex flex-wrap gap-6 pt-8">
              <a
                href="#identity"
                className="group inline-block px-8 py-4 border border-fine
                           border-charcoal-900 dark:border-warmCream-50
                           text-charcoal-900 dark:text-warmCream-50
                           font-body text-sm tracking-wide uppercase
                           transition-all duration-400 ease-out-expo
                           hover:bg-charcoal-900 dark:hover:bg-warmCream-50
                           hover:text-warmCream-50 dark:hover:text-charcoal-900">
                探索更多
              </a>

              <a
                href="#/contact"
                className="inline-block px-8 py-4
                           text-ochre-500 dark:text-ochre-400
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
              <div className="h-px w-12 bg-border-light dark:bg-border-dark"></div>
              <div className="space-y-2">
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 dark:text-warmCream-400">
                  目前
                </p>
                <p className="font-body text-base
                              text-charcoal-800 dark:text-warmCream-200">
                  {PROFILE.currentRole}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="h-px w-12 bg-border-light dark:bg-border-dark"></div>
              <div className="space-y-2">
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 dark:text-warmCream-400">
                  聯絡
                </p>
                <div className="space-y-1 font-body text-sm
                                text-charcoal-700 dark:text-warmCream-300">
                  <p className="editorial-underline">
                    <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Location Tags */}
            <div className="space-y-3">
              <div className="h-px w-12 bg-border-light dark:bg-border-dark"></div>
              <div className="space-y-2">
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 dark:text-warmCream-400">
                  地點
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 border border-fine border-border-light dark:border-border-dark
                                   font-body text-xs text-charcoal-700 dark:text-warmCream-300">
                    台北市
                  </span>
                  <span className="px-3 py-1 border border-fine border-border-light dark:border-border-dark
                                   font-body text-xs text-charcoal-700 dark:text-warmCream-300">
                    臺北市立大學
                  </span>
                  <span className="px-3 py-1 border border-fine border-border-light dark:border-border-dark
                                   font-body text-xs text-charcoal-700 dark:text-warmCream-300">
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
        <div className="w-px h-16 bg-charcoal-900 dark:bg-warmCream-50 animate-gentle-float"></div>
        <span className="font-body text-xs tracking-widest uppercase
                         text-charcoal-600 dark:text-warmCream-400
                         -rotate-90 origin-left ">
          Scroll
        </span>
      </div>

      {/* Decorative Element - Asymmetric Line */}
      <div className="absolute top-1/3 right-0 w-1/3 h-px
                      bg-border-light dark:bg-border-dark
                      opacity-0 animate-draw-line stagger-6"></div>
    </section>
  );
};
