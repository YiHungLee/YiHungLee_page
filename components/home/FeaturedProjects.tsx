import React from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProjects } from '../../utils/featured';
import { ProjectCategory, PortfolioItem } from '../../types';

const categoryConfig = {
  academic: {
    label: '學術研究',
    subtitle: 'Academic Research',
    color: 'ochre',
    description: '心理學研究與學術發表',
  },
  coding: {
    label: '程式開發',
    subtitle: 'Software Development',
    color: 'sage',
    description: '技術專案與工具開發',
  },
  music: {
    label: '音樂創作',
    subtitle: 'Music Composition',
    color: 'rust',
    description: '聲響藝術與創作實踐',
  },
} as const;

export const FeaturedProjects: React.FC = () => {
  const allProjects = getFeaturedProjects(12);

  // Group projects by category
  const projectsByCategory: Record<ProjectCategory, PortfolioItem[]> = {
    academic: allProjects.filter(p => p.category === 'academic'),
    coding: allProjects.filter(p => p.category === 'coding'),
    music: allProjects.filter(p => p.category === 'music'),
  };

  return (
    <section className="relative py-32 md:py-40
                        bg-warmCream-50 dark:bg-darkMode-bgElevated
                        transition-colors duration-500">

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="mb-24 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">

            {/* Left: Title */}
            <div className="space-y-6">
              <p className="font-body text-xs tracking-[0.2em] uppercase
                            text-charcoal-500 dark:text-darkMode-textMuted">
                Featured Works
              </p>

              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold
                             text-charcoal-900 dark:text-darkMode-text
                             tracking-tight leading-[0.95]">
                精選作品
              </h2>

              <div className="flex gap-2">
                <div className="h-1 w-16 bg-ochre-500 dark:bg-darkMode-ochre"></div>
                <div className="h-1 w-8 bg-sage-500 dark:bg-darkMode-sage"></div>
                <div className="h-1 w-4 bg-rust-500 dark:bg-darkMode-rust"></div>
              </div>

              <p className="font-body text-lg md:text-xl
                            text-charcoal-600 dark:text-darkMode-textMuted
                            max-w-xl leading-relaxed">
                跨越學術、技術與藝術的多維度實踐
              </p>
            </div>

            {/* Right: View All Link */}
            <Link
              to="/projects"
              className="group font-body text-sm tracking-wide uppercase
                         text-charcoal-700 dark:text-darkMode-textMuted
                         flex items-center gap-3
                         transition-all duration-300 hover:text-ochre-500 dark:hover:text-darkMode-ochre">
              <span className="editorial-underline">查看全部作品</span>
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-24 md:space-y-32">
          {(Object.keys(categoryConfig) as ProjectCategory[]).map((category, categoryIndex) => {
            const config = categoryConfig[category];
            const projects = projectsByCategory[category].slice(0, 1);

            if (projects.length === 0) return null;

            return (
              <div
                key={category}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 0.2}s` }}
              >
                {/* Category Header */}
                <div className="mb-12 md:mb-16">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

                    <div className="space-y-4">
                      {/* Category Number */}
                      <div className={`font-display text-sm tracking-[0.2em] uppercase
                                      ${category === 'academic' ? 'text-ochre-500 dark:text-darkMode-ochre' : ''}
                                      ${category === 'coding' ? 'text-sage-500 dark:text-darkMode-sage' : ''}
                                      ${category === 'music' ? 'text-rust-500 dark:text-darkMode-rust' : ''}`}>
                        0{categoryIndex + 1}
                      </div>

                      {/* Category Title */}
                      <div>
                        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                                       text-charcoal-900 dark:text-darkMode-text
                                       tracking-tight mb-2">
                          {config.label}
                        </h3>
                        <p className="font-body text-sm tracking-[0.15em] uppercase
                                      text-charcoal-500 dark:text-darkMode-textMuted">
                          {config.subtitle}
                        </p>
                      </div>

                      {/* Category Description */}
                      <p className="font-body text-base
                                    text-charcoal-600 dark:text-darkMode-textMuted
                                    max-w-md">
                        {config.description}
                      </p>
                    </div>

                    {/* View Category Link */}
                    <Link
                      to={`/projects/${category}`}
                      className={`group font-body text-xs tracking-[0.15em] uppercase
                                 transition-opacity duration-300 hover:opacity-60
                                 ${category === 'academic' ? 'text-ochre-500 dark:text-darkMode-ochre' : ''}
                                 ${category === 'coding' ? 'text-sage-500 dark:text-darkMode-sage' : ''}
                                 ${category === 'music' ? 'text-rust-500 dark:text-darkMode-rust' : ''}
                                 flex items-center gap-2`}>
                      <span className="editorial-underline">更多{config.label}</span>
                      <span className="transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>

                  {/* Category Divider */}
                  <div className="mt-8 h-px bg-border-light dark:bg-darkMode-border"></div>
                </div>

                {/* Project Card */}
                <div className="bg-border-light dark:bg-darkMode-border">
                  {projects.map((project, projectIndex) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.category}/${project.id}`}
                      className="group relative bg-warmCream-50 dark:bg-darkMode-bg
                                 transition-all duration-500 ease-out
                                 hover:bg-warmCream-100 dark:hover:bg-darkMode-bgElevated
                                 opacity-0 animate-fade-in-up overflow-hidden"
                      style={{ animationDelay: `${categoryIndex * 0.2 + projectIndex * 0.15 + 0.3}s` }}
                    >
                      <div className="grid md:grid-cols-[1fr_280px] gap-0">

                        {/* Left: Content */}
                        <div className="p-8 md:p-10 lg:p-12 space-y-6">

                          {/* Project Header */}
                          <div className="flex items-start justify-between gap-4">
                            {/* Year & Award */}
                            <div className="space-y-2">
                              <p className="font-body text-sm
                                            text-charcoal-500 dark:text-darkMode-textFaint">
                                {project.year}
                              </p>

                              {project.award && (
                                <div className={`inline-flex px-2.5 py-1
                                                border border-fine
                                                font-body text-xs tracking-wide
                                                ${category === 'academic' ? 'border-ochre-500 dark:border-darkMode-ochre text-ochre-500 dark:text-darkMode-ochre' : ''}
                                                ${category === 'coding' ? 'border-sage-500 dark:border-darkMode-sage text-sage-500 dark:text-darkMode-sage' : ''}
                                                ${category === 'music' ? 'border-rust-500 dark:border-darkMode-rust text-rust-500 dark:text-darkMode-rust' : ''}`}>
                                  獲獎
                                </div>
                              )}
                            </div>

                            {/* Hover Arrow - Only on mobile when no image */}
                            <div className={`md:hidden transform transition-all duration-300
                                            opacity-0 -translate-y-2
                                            group-hover:opacity-100 group-hover:translate-y-0
                                            ${category === 'academic' ? 'text-ochre-500 dark:text-darkMode-ochre' : ''}
                                            ${category === 'coding' ? 'text-sage-500 dark:text-darkMode-sage' : ''}
                                            ${category === 'music' ? 'text-rust-500 dark:text-darkMode-rust' : ''}`}>
                              ↗
                            </div>
                          </div>

                          {/* Project Title */}
                          <h4 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold
                                         text-charcoal-900 dark:text-darkMode-text
                                         tracking-tight leading-tight
                                         transition-colors duration-300
                                         group-hover:text-charcoal-700 dark:group-hover:text-darkMode-textMuted">
                            {project.title}
                          </h4>

                          {/* Award Detail */}
                          {project.award && (
                            <p className={`font-accent italic text-base
                                          ${category === 'academic' ? 'text-ochre-600 dark:text-darkMode-ochre' : ''}
                                          ${category === 'coding' ? 'text-sage-600 dark:text-darkMode-sage' : ''}
                                          ${category === 'music' ? 'text-rust-600 dark:text-darkMode-rust' : ''}`}>
                              {project.award}
                            </p>
                          )}

                          {/* Description */}
                          <p className="font-body text-base
                                        text-charcoal-700 dark:text-darkMode-textMuted
                                        leading-relaxed">
                            {project.description}
                          </p>

                          {/* Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {project.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="font-body text-xs tracking-wide
                                             text-charcoal-600 dark:text-darkMode-textMuted
                                             px-2.5 py-1
                                             bg-warmCream-100 dark:bg-darkMode-bgElevated
                                             border border-fine border-border-light dark:border-darkMode-border
                                             transition-all duration-300
                                             group-hover:border-charcoal-400 dark:group-hover:border-darkMode-border">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right: Image (Hidden on mobile) */}
                        {project.imageUrl && (
                          <div className="hidden md:block relative w-[280px] h-full">
                            <div className="absolute inset-0 overflow-hidden rounded-sm">
                              <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-cover
                                           transition-all duration-700 ease-out
                                           group-hover:scale-105"
                              />

                              {/* Image Overlay */}
                              <div className={`absolute inset-0
                                              transition-opacity duration-500
                                              ${category === 'academic' ? 'bg-ochre-500/10 dark:bg-darkMode-ochre/10' : ''}
                                              ${category === 'coding' ? 'bg-sage-500/10 dark:bg-darkMode-sage/10' : ''}
                                              ${category === 'music' ? 'bg-rust-500/10 dark:bg-darkMode-rust/10' : ''}
                                              group-hover:opacity-0`}>
                              </div>

                              {/* Hover Arrow on Image */}
                              <div className={`absolute top-6 right-6
                                              transform transition-all duration-300
                                              opacity-0 -translate-y-2
                                              group-hover:opacity-100 group-hover:translate-y-0
                                              text-3xl font-light
                                              ${category === 'academic' ? 'text-ochre-500 dark:text-darkMode-ochre' : ''}
                                              ${category === 'coding' ? 'text-sage-500 dark:text-darkMode-sage' : ''}
                                              ${category === 'music' ? 'text-rust-500 dark:text-darkMode-rust' : ''}`}>
                                ↗
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Accent Line */}
                      <div className={`absolute bottom-0 left-0 h-0.5 w-0
                                      transition-all duration-500 ease-out
                                      group-hover:w-full
                                      ${category === 'academic' ? 'bg-ochre-500 dark:bg-darkMode-ochre' : ''}
                                      ${category === 'coding' ? 'bg-sage-500 dark:bg-darkMode-sage' : ''}
                                      ${category === 'music' ? 'bg-rust-500 dark:bg-darkMode-rust' : ''}`}>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
