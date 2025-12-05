import React, { useState } from 'react';
import { PROFILE, EXPERIENCE, EDUCATION, AWARDS, TRAININGS, OTHER_SKILLS, MUSIC_EXPERIENCES } from '../../constants';
import InteractiveAvatar from '../InteractiveAvatar';

// Lightbox Component for photo viewing
const Lightbox: React.FC<{
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  if (images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/95 dark:bg-darkMode-bg/95"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-warmCream-50 dark:text-darkMode-text
                   font-body text-sm tracking-widest uppercase
                   hover:text-ochre-400 dark:hover:text-darkMode-ochre
                   transition-colors duration-300"
        aria-label="關閉"
      >
        關閉
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2
                       text-warmCream-50 dark:text-darkMode-text
                       font-display text-4xl
                       hover:text-ochre-400 dark:hover:text-darkMode-ochre
                       transition-colors duration-300"
            aria-label="上一張"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2
                       text-warmCream-50 dark:text-darkMode-text
                       font-display text-4xl
                       hover:text-ochre-400 dark:hover:text-darkMode-ochre
                       transition-colors duration-300"
            aria-label="下一張"
          >
            ›
          </button>
        </>
      )}

      <img
        src={`/${images[currentIndex]}`}
        alt="音樂活動照片"
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2
                        font-body text-sm text-warmCream-200 dark:text-darkMode-textMuted">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

const AboutPage: React.FC = () => {
  const [experienceTab, setExperienceTab] = useState<'work' | 'music'>('work');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index: number = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  // Collect all music images for gallery navigation
  const allMusicImages = MUSIC_EXPERIENCES.flatMap(exp => exp.images);

  return (
    <div className="min-h-screen bg-warmCream-50 dark:bg-darkMode-bg transition-colors duration-500">

      {/* ========== HERO SECTION ========== */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40
                          bg-warmCream-100 dark:bg-darkMode-bgElevated
                          transition-colors duration-500 subtle-texture">

        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 lg:gap-20 items-center">

            {/* Left Column - Content */}
            <div className="md:col-span-7 space-y-6 md:space-y-8">

              {/* Subtitle */}
              <div className="opacity-0 animate-fade-in-up">
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 dark:text-darkMode-textMuted">
                  About
                </p>
              </div>

              {/* Main Title */}
              <div className="opacity-0 animate-fade-in-up stagger-1">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold
                               text-charcoal-900 dark:text-darkMode-text
                               tracking-tight leading-none optical-align">
                  {PROFILE.name}
                </h1>

                <div className="h-px w-20 md:w-24 bg-ochre-500 dark:bg-darkMode-ochre mt-6"></div>
              </div>

              {/* Current Role */}
              <div className="opacity-0 animate-fade-in-up stagger-2 space-y-3">
                <p className="font-body text-lg md:text-xl
                              text-charcoal-800 dark:text-darkMode-text
                              leading-relaxed">
                  {PROFILE.currentRole}
                </p>
                <p className="font-body text-base md:text-lg
                              text-charcoal-600 dark:text-darkMode-textMuted">
                  {PROFILE.school}
                </p>
              </div>

              {/* Tagline */}
              <div className="opacity-0 animate-fade-in-up stagger-3">
                <p className="font-body text-base md:text-lg
                              text-charcoal-700 dark:text-darkMode-textMuted
                              leading-relaxed max-w-xl">
                  {PROFILE.heroTagline}
                </p>
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

      {/* ========== EDUCATION SECTION ========== */}
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                           text-charcoal-900 dark:text-darkMode-text
                           tracking-tight mb-4">
              學歷
            </h2>
            <div className="h-px w-12 bg-ochre-500 dark:bg-darkMode-ochre"></div>
          </div>

          <div className="space-y-px bg-border-light dark:bg-darkMode-border">
            {EDUCATION.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-50 dark:bg-darkMode-bg p-6 md:p-8 lg:p-10
                           transition-colors duration-500">
                <div className="grid md:grid-cols-12 gap-4 md:gap-6">
                  <div className="md:col-span-3">
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-darkMode-textFaint">
                      {item.year}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-xl md:text-2xl font-semibold
                                   text-charcoal-900 dark:text-darkMode-text">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-body text-base
                                    text-charcoal-600 dark:text-darkMode-textMuted mt-2">
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

      {/* ========== AWARDS SECTION ========== */}
      <section className="relative py-16 md:py-24 lg:py-32
                          bg-warmCream-100 dark:bg-darkMode-bgElevated
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                           text-charcoal-900 dark:text-darkMode-text
                           tracking-tight mb-4">
              獲獎紀錄
            </h2>
            <div className="h-px w-12 bg-ochre-500 dark:bg-darkMode-ochre"></div>
          </div>

          <div className="space-y-px bg-border-light dark:bg-darkMode-border">
            {AWARDS.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-50 dark:bg-darkMode-bg p-6 md:p-8 lg:p-10
                           transition-colors duration-500">
                <div className="grid md:grid-cols-12 gap-4 md:gap-6">
                  <div className="md:col-span-3">
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-darkMode-textFaint">
                      {item.year}
                    </p>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-xl md:text-2xl font-semibold
                                   text-ochre-600 dark:text-darkMode-ochre">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-body text-base
                                    text-charcoal-600 dark:text-darkMode-textMuted mt-2">
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

      {/* ========== EXPERIENCE SECTION (TABBED) ========== */}
      <section className="relative py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                           text-charcoal-900 dark:text-darkMode-text
                           tracking-tight mb-4">
              經歷
            </h2>
            <div className="h-px w-12 bg-ochre-500 dark:bg-darkMode-ochre"></div>

            {/* Tab Buttons */}
            <div className="flex gap-8 mt-8">
              <button
                onClick={() => setExperienceTab('work')}
                className={`font-body text-sm tracking-wide uppercase pb-2 border-b-2 transition-all duration-300
                           ${experienceTab === 'work'
                             ? 'text-charcoal-900 dark:text-darkMode-text border-ochre-500 dark:border-darkMode-ochre'
                             : 'text-charcoal-500 dark:text-darkMode-textFaint border-transparent hover:text-charcoal-700 dark:hover:text-darkMode-textMuted'
                           }`}
              >
                工作經歷
              </button>
              <button
                onClick={() => setExperienceTab('music')}
                className={`font-body text-sm tracking-wide uppercase pb-2 border-b-2 transition-all duration-300
                           ${experienceTab === 'music'
                             ? 'text-charcoal-900 dark:text-darkMode-text border-ochre-500 dark:border-darkMode-ochre'
                             : 'text-charcoal-500 dark:text-darkMode-textFaint border-transparent hover:text-charcoal-700 dark:hover:text-darkMode-textMuted'
                           }`}
              >
                音樂經歷
              </button>
            </div>
          </div>

          {/* Work Experience Tab */}
          <div className={`transition-opacity duration-300 ${experienceTab === 'work' ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <div className="space-y-px bg-border-light dark:bg-darkMode-border">
              {EXPERIENCE.map((item, index) => (
                <div
                  key={index}
                  className="bg-warmCream-100 dark:bg-darkMode-bgElevated p-6 md:p-8 lg:p-10
                             transition-colors duration-500">
                  <div className="grid md:grid-cols-12 gap-4 md:gap-6">
                    <div className="md:col-span-3">
                      <p className="font-body text-sm
                                    text-charcoal-500 dark:text-darkMode-textFaint">
                        {item.year}
                      </p>
                    </div>
                    <div className="md:col-span-9">
                      <h3 className="font-display text-xl md:text-2xl font-semibold
                                     text-charcoal-900 dark:text-darkMode-text">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="font-body text-base
                                      text-charcoal-600 dark:text-darkMode-textMuted mt-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Music Experience Tab */}
          <div className={`transition-opacity duration-300 ${experienceTab === 'music' ? 'opacity-100' : 'opacity-0 hidden'}`}>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-[calc(25%-1px)] top-0 bottom-0 w-px
                              bg-border-light dark:bg-darkMode-border hidden md:block"></div>

              <div className="space-y-8 md:space-y-0">
                {MUSIC_EXPERIENCES.map((item, index) => (
                  <div
                    key={index}
                    className="relative md:grid md:grid-cols-12 md:gap-6 pb-8 md:pb-12
                               last:pb-0"
                  >
                    {/* Date Column */}
                    <div className="md:col-span-3 mb-3 md:mb-0 md:text-right md:pr-8">
                      <p className="font-body text-sm
                                    text-charcoal-500 dark:text-darkMode-textFaint">
                        {item.date}
                      </p>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-[-4px] md:left-[calc(25%-4px)] top-1 w-2 h-2 rounded-full
                                    bg-ochre-500 dark:bg-darkMode-ochre hidden md:block"></div>

                    {/* Content Column */}
                    <div className="md:col-span-9 md:pl-8">
                      <h3 className="font-display text-lg md:text-xl font-semibold
                                     text-charcoal-900 dark:text-darkMode-text mb-3">
                        {item.title}
                      </h3>

                      {/* Photo Thumbnails */}
                      {item.images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-3">
                          {item.images.map((image, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={() => openLightbox(allMusicImages, allMusicImages.indexOf(image))}
                              className="group relative w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden
                                         border border-border-light dark:border-darkMode-border
                                         transition-all duration-300
                                         hover:border-ochre-500 dark:hover:border-darkMode-ochre
                                         hover:shadow-lg"
                            >
                              <img
                                src={`/${image}`}
                                alt={item.title}
                                className="w-full h-full object-cover
                                           transition-transform duration-500
                                           group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/20
                                              transition-colors duration-300"></div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TRAINING SECTION ========== */}
      <section className="relative py-16 md:py-24 lg:py-32
                          bg-warmCream-100 dark:bg-darkMode-bgElevated
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                           text-charcoal-900 dark:text-darkMode-text
                           tracking-tight mb-4">
              專業訓練
            </h2>
            <div className="h-px w-12 bg-ochre-500 dark:bg-darkMode-ochre"></div>
          </div>

          <div className="space-y-px bg-border-light dark:bg-darkMode-border">
            {TRAININGS.map((item, index) => (
              <div
                key={index}
                className="bg-warmCream-50 dark:bg-darkMode-bg p-6 md:p-8
                           transition-colors duration-500">
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
                  <h3 className="font-display text-lg md:text-xl font-semibold
                                 text-charcoal-900 dark:text-darkMode-text">
                    {item.title}
                  </h3>
                  {item.details && (
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-darkMode-textFaint mt-1 md:mt-0">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== OTHER SKILLS SECTION ========== */}
      {OTHER_SKILLS.length > 0 && (
        <section className="relative py-16 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12">

            <div className="mb-12 md:mb-16">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                             text-charcoal-900 dark:text-darkMode-text
                             tracking-tight mb-4">
                其他專長
              </h2>
              <div className="h-px w-12 bg-ochre-500 dark:bg-darkMode-ochre"></div>
            </div>

            <div className="space-y-px bg-border-light dark:bg-darkMode-border">
              {OTHER_SKILLS.map((item, index) => (
                <div
                  key={index}
                  className="bg-warmCream-100 dark:bg-darkMode-bgElevated p-6 md:p-8 lg:p-10
                             transition-colors duration-500">
                  <div className="grid md:grid-cols-12 gap-4 md:gap-6">
                    <div className="md:col-span-3">
                      <h3 className="font-display text-lg md:text-xl font-semibold
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
                            <span className="mr-3 text-ochre-500 dark:text-darkMode-ochre
                                           select-none">·</span>
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

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
};

export default AboutPage;
