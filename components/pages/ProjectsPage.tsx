import React, { useState, useRef } from 'react';
import { PORTFOLIO_ITEMS } from '../../constants';
import { ProjectCategory } from '../../types';

const categoryLabels: Record<ProjectCategory, string> = {
  academic: '學術研究',
  coding: '程式開發',
  music: '音樂創作',
};

const categoryDescriptions: Record<ProjectCategory, string> = {
  academic: '好奇轉化為知識探究',
  coding: '技術實踐與工具開發',
  music: '聲音敘事與情感表達',
};

const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const projectsListRef = useRef<HTMLElement>(null);

  const filteredProjects = selectedCategory === 'all'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter(item => item.category === selectedCategory);

  const categories: Array<ProjectCategory | 'all'> = ['all', 'academic', 'coding', 'music'];

  // 處理分類變更並滾動到 Projects List
  const handleCategoryChange = (category: ProjectCategory | 'all') => {
    setSelectedCategory(category);

    setTimeout(() => {
      if (projectsListRef.current) {
        const headerOffset = 80; // sticky header 的高度 (top-20 = 5rem = 80px)
        const elementPosition = projectsListRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 0);
  };

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
                Portfolio
              </p>
            </div>

            {/* Main Title */}
            <div className="opacity-0 animate-fade-in-up stagger-1">
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold
                             text-charcoal-900 dark:text-warmCream-50
                             tracking-tight leading-none optical-align">
                作品集
              </h1>

              <div className="h-px w-24 md:w-32 bg-ochre-500 dark:bg-ochre-400 mt-8"></div>
            </div>

            {/* Description */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <p className="font-body text-lg md:text-xl lg:text-2xl
                            text-charcoal-700 dark:text-warmCream-300
                            leading-relaxed max-w-3xl">
                多面向的實踐與探索<br className="hidden md:block" />
                從學術研究到程式開發，從音樂創作到助人專業
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-20 z-40 bg-warmCream-50/95 dark:bg-charcoal-950/95
                          backdrop-blur-md border-b border-fine
                          border-border-light dark:border-border-dark
                          transition-colors duration-500">

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-wrap gap-4 md:gap-6">

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`relative font-body text-sm md:text-base tracking-wide
                           transition-all duration-300 pb-2
                           ${selectedCategory === category
                             ? 'text-ochre-500 dark:text-ochre-400'
                             : 'text-charcoal-600 dark:text-warmCream-400 hover:text-ochre-500 dark:hover:text-ochre-400'
                           }`}
              >
                {category === 'all' ? '全部作品' : categoryLabels[category as ProjectCategory]}

                {/* Active Indicator */}
                {selectedCategory === category && (
                  <div className="absolute bottom-0 left-0 w-full h-px
                                  bg-ochre-500 dark:bg-ochre-400"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section ref={projectsListRef} className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Category Description */}
          {selectedCategory !== 'all' && (
            <div className="mb-16 md:mb-24 opacity-0 animate-fade-in">
              <p className="font-display text-2xl md:text-3xl italic
                            text-charcoal-700 dark:text-warmCream-300">
                {categoryDescriptions[selectedCategory as ProjectCategory]}
              </p>
            </div>
          )}

          {/* Projects Grid */}
          <div className="space-y-1 bg-border-light dark:bg-border-dark">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group bg-warmCream-100 dark:bg-charcoal-900
                           transition-all duration-500 ease-out-expo
                           hover:bg-warmCream-50 dark:hover:bg-charcoal-800
                           opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="grid md:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 lg:p-16">

                  {/* Left: Meta Information */}
                  <div className="md:col-span-3 space-y-6">

                    {/* Index Number */}
                    <div className="font-display text-6xl md:text-7xl font-bold
                                    text-charcoal-900 dark:text-warmCream-50
                                    opacity-20">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Category Label */}
                    <div className="space-y-2">
                      <div className="h-px w-12 bg-border-light dark:bg-border-dark"></div>
                      <p className="font-body text-xs tracking-widest uppercase
                                    text-charcoal-600 dark:text-warmCream-400">
                        {categoryLabels[project.category]}
                      </p>
                    </div>

                    {/* Year & Type */}
                    <div className="space-y-2">
                      <p className="font-body text-sm
                                    text-charcoal-500 dark:text-warmCream-500">
                        {project.year}
                      </p>
                      <p className="font-body text-xs tracking-wide
                                    text-charcoal-600 dark:text-warmCream-400">
                        {project.type === 'research' && '研究'}
                        {project.type === 'tool' && '工具開發'}
                        {project.type === 'composition' && '音樂創作'}
                      </p>
                    </div>

                    {/* Award Badge */}
                    {project.award && (
                      <div className="inline-block px-3 py-1 border border-fine
                                      border-ochre-500 dark:border-ochre-400
                                      font-body text-xs tracking-wide
                                      text-ochre-500 dark:text-ochre-400">
                        獲獎作品
                      </div>
                    )}
                  </div>

                  {/* Right: Content */}
                  <div className="md:col-span-9 space-y-6">

                    {/* Title */}
                    <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                                   text-charcoal-900 dark:text-warmCream-50
                                   tracking-tight leading-tight
                                   transition-colors duration-500
                                   group-hover:text-ochre-500 dark:group-hover:text-ochre-400">
                      {project.title}
                    </h3>

                    {/* Award Detail */}
                    {project.award && (
                      <p className="font-accent italic text-lg
                                    text-ochre-600 dark:text-ochre-400">
                        {project.award}
                      </p>
                    )}

                    {/* Venue */}
                    {project.venue && (
                      <p className="font-body text-base
                                    text-charcoal-600 dark:text-warmCream-400">
                        {project.venue}
                      </p>
                    )}

                    {/* Description */}
                    <p className="font-body text-base md:text-lg
                                  text-charcoal-700 dark:text-warmCream-300
                                  leading-relaxed max-w-3xl">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="pt-4">
                        <p className="font-body text-xs tracking-wide uppercase
                                      text-charcoal-600 dark:text-warmCream-400 mb-3">
                          技術棧
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="font-body text-xs tracking-wide
                                         text-charcoal-700 dark:text-warmCream-300
                                         px-3 py-1 border border-fine
                                         border-border-light dark:border-border-dark
                                         transition-colors duration-300
                                         group-hover:border-ochre-500 dark:group-hover:border-ochre-400">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Music Tools */}
                    {project.tools && project.tools.length > 0 && (
                      <div className="pt-4">
                        <p className="font-body text-xs tracking-wide uppercase
                                      text-charcoal-600 dark:text-warmCream-400 mb-3">
                          製作工具
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {project.tools.map((tool) => (
                            <span
                              key={tool}
                              className="font-body text-xs tracking-wide
                                         text-charcoal-700 dark:text-warmCream-300
                                         px-3 py-1 border border-fine
                                         border-border-light dark:border-border-dark
                                         transition-colors duration-300
                                         group-hover:border-ochre-500 dark:group-hover:border-ochre-400">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Audio Duration */}
                    {project.duration && (
                      <p className="font-body text-sm
                                    text-charcoal-600 dark:text-warmCream-400">
                        時長：{project.duration}
                      </p>
                    )}

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3 pt-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-body text-xs tracking-wide
                                       text-charcoal-600 dark:text-warmCream-400
                                       px-3 py-1 border border-fine
                                       border-border-light dark:border-border-dark
                                       transition-colors duration-300
                                       group-hover:border-ochre-500 dark:group-hover:border-ochre-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* External Links */}
                    <div className="flex flex-wrap gap-6 pt-6">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-sm tracking-wide uppercase
                                     text-charcoal-700 dark:text-warmCream-300
                                     editorial-underline
                                     transition-opacity duration-300 hover:opacity-60">
                          GitHub Repository
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-sm tracking-wide uppercase
                                     text-charcoal-700 dark:text-warmCream-300
                                     editorial-underline
                                     transition-opacity duration-300 hover:opacity-60">
                          Live Demo
                        </a>
                      )}
                      {project.audioUrl && (
                        <a
                          href={project.audioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-sm tracking-wide uppercase
                                     text-charcoal-700 dark:text-warmCream-300
                                     editorial-underline
                                     transition-opacity duration-300 hover:opacity-60">
                          試聽音樂
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Indicator Line */}
                <div className="h-px w-0 bg-ochre-500 dark:bg-ochre-400
                                transition-all duration-500 ease-out-expo
                                group-hover:w-full"></div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-lg text-charcoal-600 dark:text-warmCream-400">
                此分類暫無作品
              </p>
            </div>
          )}
        </div>
      </section>

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
              每一個作品，<br className="hidden md:block" />
              都是一次對話與探索的紀錄
            </p>
            <div className="h-px w-full bg-border-light dark:bg-border-dark"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
