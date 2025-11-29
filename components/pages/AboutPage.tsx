import React from 'react';
import { PROFILE, EXPERIENCE, EDUCATION, AWARDS, TRAININGS, OTHER_SKILLS } from '../../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-warmCream-50 dark:bg-charcoal-950 transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 md:pt-48 md:pb-40
                          bg-warmCream-100 dark:bg-charcoal-900
                          transition-colors duration-500 subtle-texture">

        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Title Group */}
          <div className="space-y-8 md:space-y-12">

            {/* Subtitle */}
            <div className="opacity-0 animate-fade-in-up">
              <p className="font-body text-xs tracking-widest uppercase
                            text-charcoal-600 dark:text-warmCream-400">
                About
              </p>
            </div>

            {/* Main Title */}
            <div className="opacity-0 animate-fade-in-up stagger-1">
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold
                             text-charcoal-900 dark:text-warmCream-50
                             tracking-tight leading-none optical-align">
                {PROFILE.name}
              </h1>

              <div className="h-px w-24 md:w-32 bg-ochre-500 dark:bg-ochre-400 mt-8"></div>
            </div>

            {/* Current Role */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <p className="font-body text-lg md:text-xl lg:text-2xl
                            text-charcoal-700 dark:text-warmCream-300
                            leading-relaxed max-w-3xl">
                {PROFILE.currentRole}
              </p>
              <p className="font-body text-base md:text-lg
                            text-charcoal-600 dark:text-warmCream-400
                            mt-4">
                {PROFILE.school}
              </p>
            </div>

            {/* Philosophy */}
            <div className="opacity-0 animate-fade-in-up stagger-3">
              <blockquote className="font-display text-2xl md:text-3xl italic
                                     text-charcoal-800 dark:text-warmCream-200
                                     border-l border-fine border-ochre-500 dark:border-ochre-400
                                     pl-6 py-2 max-w-3xl">
                {PROFILE.philosophy}
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-16 md:mb-20">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                           text-charcoal-900 dark:text-warmCream-50
                           tracking-tight mb-6">
              學歷
            </h2>
            <div className="h-px w-16 bg-ochre-500 dark:bg-ochre-400"></div>
          </div>

          <div className="space-y-1 bg-border-light dark:bg-border-dark">
            {EDUCATION.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-100 dark:bg-charcoal-900 p-8 md:p-12
                           transition-colors duration-500">
                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-warmCream-500">
                      {item.year}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl md:text-3xl font-bold
                                   text-charcoal-900 dark:text-warmCream-50">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-body text-base
                                    text-charcoal-700 dark:text-warmCream-300 mt-3">
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
                          bg-warmCream-100 dark:bg-charcoal-900
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-16 md:mb-20">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                           text-charcoal-900 dark:text-warmCream-50
                           tracking-tight mb-6">
              獲獎紀錄
            </h2>
            <div className="h-px w-16 bg-ochre-500 dark:bg-ochre-400"></div>
          </div>

          <div className="space-y-1 bg-border-light dark:bg-border-dark">
            {AWARDS.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-50 dark:bg-charcoal-950 p-8 md:p-12
                           transition-colors duration-500">
                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-warmCream-500">
                      {item.year}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl md:text-3xl font-bold
                                   text-ochre-500 dark:text-ochre-400">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-body text-base
                                    text-charcoal-700 dark:text-warmCream-300 mt-3">
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
                           text-charcoal-900 dark:text-warmCream-50
                           tracking-tight mb-6">
              經歷
            </h2>
            <div className="h-px w-16 bg-ochre-500 dark:bg-ochre-400"></div>
          </div>

          <div className="space-y-1 bg-border-light dark:bg-border-dark">
            {EXPERIENCE.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-100 dark:bg-charcoal-900 p-8 md:p-12
                           transition-colors duration-500">
                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-warmCream-500">
                      {item.year}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl md:text-3xl font-bold
                                   text-charcoal-900 dark:text-warmCream-50">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-body text-base
                                    text-charcoal-700 dark:text-warmCream-300 mt-3">
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
                          bg-warmCream-100 dark:bg-charcoal-900
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-16 md:mb-20">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                           text-charcoal-900 dark:text-warmCream-50
                           tracking-tight mb-6">
              專業訓練
            </h2>
            <div className="h-px w-16 bg-ochre-500 dark:bg-ochre-400"></div>
          </div>

          <div className="space-y-1 bg-border-light dark:bg-border-dark">
            {TRAININGS.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-50 dark:bg-charcoal-950 p-8 md:p-12
                           transition-colors duration-500">
                <div className="grid md:grid-cols-12 gap-6">
                  <div className="md:col-span-9">
                    <h3 className="font-display text-xl md:text-2xl font-semibold
                                   text-charcoal-900 dark:text-warmCream-50">
                      {item.title}
                    </h3>
                    {item.details && (
                      <p className="font-body text-sm
                                    text-charcoal-600 dark:text-warmCream-400 mt-2">
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
                             text-charcoal-900 dark:text-warmCream-50
                             tracking-tight mb-6">
                其他專長
              </h2>
              <div className="h-px w-16 bg-ochre-500 dark:bg-ochre-400"></div>
            </div>

            <div className="space-y-1 bg-border-light dark:bg-border-dark">
              {OTHER_SKILLS.map((item, index) => (
                <div
                  key={index}
                  className="bg-warmCream-100 dark:bg-charcoal-900 p-8 md:p-12
                             transition-colors duration-500">
                  <div className="grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-3">
                      <h3 className="font-display text-xl md:text-2xl font-semibold
                                     text-charcoal-900 dark:text-warmCream-50">
                        {item.category}
                      </h3>
                    </div>
                    <div className="md:col-span-9">
                      <ul className="space-y-2">
                        {item.skills.map((skill, skillIndex) => (
                          <li
                            key={skillIndex}
                            className="font-body text-base
                                       text-charcoal-700 dark:text-warmCream-300
                                       flex items-start">
                            <span className="mr-3 text-ochre-500 dark:text-ochre-400">•</span>
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

      {/* Bottom Quote */}
      <section className="relative py-20 md:py-32
                          bg-warmCream-100 dark:bg-charcoal-900
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="h-px w-full bg-border-light dark:bg-border-dark"></div>
            <p className="font-display text-2xl md:text-3xl lg:text-4xl italic
                          text-charcoal-800 dark:text-warmCream-200
                          leading-relaxed px-8">
              在專業與創意之間<br className="hidden md:block" />
              探索人性的深度與廣度
            </p>
            <div className="h-px w-full bg-border-light dark:bg-border-dark"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
