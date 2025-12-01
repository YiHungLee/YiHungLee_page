import React from 'react';
import { PROFILE, EXPERIENCE, EDUCATION, AWARDS, TRAININGS, OTHER_SKILLS } from '../../constants';
import InteractiveAvatar from '../InteractiveAvatar';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-warmCream-50 dark:bg-darkMode-bg transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 md:pt-48 md:pb-40
                          bg-warmCream-100 dark:bg-darkMode-bgElevated
                          transition-colors duration-500 subtle-texture">

        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Subtitle */}
          <div className="opacity-0 animate-fade-in-up mb-8 md:mb-12">
            <p className="font-body text-xs tracking-widest uppercase
                          text-charcoal-600 dark:text-darkMode-textMuted">
              About 關於我
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 lg:gap-20">

            {/* Left Column - Content */}
            <div className="md:col-span-7 space-y-8 md:space-y-12">

              {/* Main Title */}
              <div className="opacity-0 animate-fade-in-up stagger-1">
                <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold
                               text-charcoal-900 dark:text-darkMode-text
                               tracking-tight leading-none optical-align">
                  {PROFILE.name}
                </h1>

                <div className="h-px w-24 md:w-32 bg-ochre-500 dark:bg-darkMode-ochre mt-8"></div>
              </div>

              {/* Current Role */}
              <div className="opacity-0 animate-fade-in-up stagger-2">
                <p className="font-body text-lg md:text-xl lg:text-2xl
                              text-charcoal-700 dark:text-darkMode-textMuted
                              leading-relaxed">
                  {PROFILE.currentRole}
                </p>
                <p className="font-body text-base md:text-lg
                              text-charcoal-600 dark:text-darkMode-textMuted
                              mt-4">
                  {PROFILE.school}
                </p>
              </div>

              {/* Philosophy */}
              <div className="opacity-0 animate-fade-in-up stagger-3">
                <blockquote className="font-display text-2xl md:text-3xl italic
                                       text-charcoal-800 dark:text-darkMode-text
                                       border-l border-fine border-ochre-500 dark:border-darkMode-ochre
                                       pl-6 py-2">
                  {PROFILE.philosophy}
                </blockquote>
              </div>
            </div>

            {/* Right Column - Avatar */}
            <div className="md:col-span-5 flex items-center justify-center md:justify-end">
              <div className="opacity-0 animate-fade-in-up stagger-2">
                <InteractiveAvatar size="large" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-16 md:mb-20">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                           text-charcoal-900 dark:text-darkMode-text
                           tracking-tight mb-6">
              學歷
            </h2>
            <div className="h-px w-16 bg-ochre-500 dark:bg-darkMode-ochre"></div>
          </div>

          <div className="space-y-1 bg-border-light dark:bg-darkMode-border">
            {EDUCATION.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-100 dark:bg-darkMode-bgElevated p-8 md:p-12
                           transition-colors duration-500">
                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-darkMode-textFaint">
                      {item.year}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl md:text-3xl font-bold
                                   text-charcoal-900 dark:text-darkMode-text">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-body text-base
                                    text-charcoal-700 dark:text-darkMode-textMuted mt-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="relative py-20 md:py-32
                          bg-warmCream-100 dark:bg-darkMode-bgElevated
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-16 md:mb-20">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                           text-charcoal-900 dark:text-darkMode-text
                           tracking-tight mb-6">
              獲獎紀錄
            </h2>
            <div className="h-px w-16 bg-ochre-500 dark:bg-darkMode-ochre"></div>
          </div>

          <div className="space-y-1 bg-border-light dark:bg-darkMode-border">
            {AWARDS.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-50 dark:bg-darkMode-bg p-8 md:p-12
                           transition-colors duration-500">
                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-darkMode-textFaint">
                      {item.year}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl md:text-3xl font-bold
                                   text-ochre-500 dark:text-darkMode-ochre">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-body text-base
                                    text-charcoal-700 dark:text-darkMode-textMuted mt-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-16 md:mb-20">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                           text-charcoal-900 dark:text-darkMode-text
                           tracking-tight mb-6">
              經歷
            </h2>
            <div className="h-px w-16 bg-ochre-500 dark:bg-darkMode-ochre"></div>
          </div>

          <div className="space-y-1 bg-border-light dark:bg-darkMode-border">
            {EXPERIENCE.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-100 dark:bg-darkMode-bgElevated p-8 md:p-12
                           transition-colors duration-500">
                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-darkMode-textFaint">
                      {item.year}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl md:text-3xl font-bold
                                   text-charcoal-900 dark:text-darkMode-text">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-body text-base
                                    text-charcoal-700 dark:text-darkMode-textMuted mt-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Section */}
      <section className="relative py-20 md:py-32
                          bg-warmCream-100 dark:bg-darkMode-bgElevated
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-16 md:mb-20">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                           text-charcoal-900 dark:text-darkMode-text
                           tracking-tight mb-6">
              專業訓練
            </h2>
            <div className="h-px w-16 bg-ochre-500 dark:bg-darkMode-ochre"></div>
          </div>

          <div className="space-y-1 bg-border-light dark:bg-darkMode-border">
            {TRAININGS.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-50 dark:bg-darkMode-bg p-8 md:p-12
                           transition-colors duration-500">
                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-9">
                    <h3 className="font-display text-xl md:text-2xl font-semibold
                                   text-charcoal-900 dark:text-darkMode-text">
                      {item.title}
                    </h3>
                    {item.details && (
                      <p className="font-body text-sm
                                    text-charcoal-600 dark:text-darkMode-textMuted mt-2">
                        {item.details}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Skills Section */}
      {OTHER_SKILLS.length > 0 && (
        <section className="relative py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12">

            <div className="mb-16 md:mb-20">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                             text-charcoal-900 dark:text-darkMode-text
                             tracking-tight mb-6">
                其他專長
              </h2>
              <div className="h-px w-16 bg-ochre-500 dark:bg-darkMode-ochre"></div>
            </div>

            <div className="space-y-1 bg-border-light dark:bg-darkMode-border">
              {OTHER_SKILLS.map((item, index) => (
                <div
                  key={index}
                  className="bg-warmCream-100 dark:bg-darkMode-bgElevated p-8 md:p-12
                             transition-colors duration-500">
                  <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-3">
                      <h3 className="font-display text-xl md:text-2xl font-semibold
                                     text-charcoal-900 dark:text-darkMode-text">
                        {item.category}
                      </h3>
                    </div>
                    <div className="md:col-span-9">
                      <ul className="space-y-2">
                        {item.skills.map((skill, skillIndex) => (
                          <li
                            key={skillIndex}
                            className="font-body text-base
                                       text-charcoal-700 dark:text-darkMode-textMuted
                                       flex items-start">
                            <span className="mr-3 text-ochre-500 dark:text-darkMode-ochre">•</span>
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      
    </div>
  );
};

export default AboutPage;
