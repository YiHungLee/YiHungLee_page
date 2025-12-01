import React from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProjects } from '../../utils/featured';
import { ProjectCategory } from '../../types';

const categoryLabels: Record<ProjectCategory, string> = {
  academic: '學術研究',
  coding: '程式開發',
  music: '音樂創作',
};

export const FeaturedProjects: React.FC = () => {
  const projects = getFeaturedProjects(3);

  return (
    <section className="relative py-32 md:py-40
                        bg-warmCream-100 dark:bg-darkMode-bg
                        transition-colors duration-500 subtle-texture">

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="mb-20 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">

            {/* Left: Title */}
            <div className="space-y-6">
              <p className="font-body text-xs tracking-widest uppercase
                            text-charcoal-600 dark:text-darkMode-textMuted">
                Featured Works
              </p>

              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold
                             text-charcoal-900 dark:text-darkMode-text
                             tracking-tight">
                精選作品
              </h2>

              <div className="h-px w-24 bg-ochre-500 dark:bg-darkMode-ochre"></div>

              <p className="font-body text-lg
                            text-charcoal-600 dark:text-darkMode-textMuted
                            max-w-xl leading-relaxed">
                多面向的實踐與探索從學術研究到程式開發，從音樂創作到助人專業
              </p>
            </div>

            {/* Right: View All Link */}
            <Link
              to="/projects"
              className="font-body text-sm tracking-wide uppercase
                         text-ochre-500 dark:text-darkMode-ochre
                         editorial-underline
                         transition-opacity duration-300 hover:opacity-60">
              查看全部作品
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-1 bg-border-light dark:bg-darkMode-border">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.category}`}
              className="group block bg-warmCream-50 dark:bg-darkMode-bgElevated
                         transition-all duration-500 ease-out-expo
                         hover:bg-warmCream-100 dark:hover:bg-darkMode-bg
                         opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="grid md:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12">

                {/* Left: Index & Category */}
                <div className="md:col-span-3 space-y-4">
                  {/* Index */}
                  <div className="font-display text-6xl md:text-7xl font-bold
                                  text-charcoal-900 dark:text-darkMode-text
                                  opacity-20">
                    0{index + 1}
                  </div>

                  {/* Category Label */}
                  <div className="space-y-2">
                    <div className="h-px w-12 bg-border-light dark:bg-darkMode-border"></div>
                    <p className="font-body text-xs tracking-widest uppercase
                                  text-charcoal-600 dark:text-darkMode-textMuted">
                      {categoryLabels[project.category]}
                    </p>
                  </div>

                  {/* Year */}
                  <p className="font-body text-sm
                                text-charcoal-500 dark:text-darkMode-textFaint">
                    {project.year}
                  </p>

                  {/* Award Badge */}
                  {project.award && (
                    <div className="inline-block px-3 py-1 border border-fine
                                    border-ochre-500 dark:border-darkMode-ochre
                                    font-body text-xs tracking-wide
                                    text-ochre-500 dark:text-darkMode-ochre">
                      獲獎作品
                    </div>
                  )}
                </div>

                {/* Right: Content */}
                <div className="md:col-span-9 space-y-6">

                  {/* Title */}
                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                                 text-charcoal-900 dark:text-darkMode-text
                                 tracking-tight leading-tight
                                 transition-colors duration-500
                                 group-hover:text-ochre-500 dark:group-hover:text-darkMode-ochre">
                    {project.title}
                  </h3>

                  {/* Award Detail */}
                  {project.award && (
                    <p className="font-accent italic text-lg
                                  text-ochre-600 dark:text-darkMode-ochre">
                      {project.award}
                    </p>
                  )}

                  {/* Description */}
                  <p className="font-body text-base md:text-lg
                                text-charcoal-700 dark:text-darkMode-textMuted
                                leading-relaxed max-w-3xl">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-body text-xs tracking-wide
                                     text-charcoal-600 dark:text-darkMode-textMuted
                                     px-3 py-1 border border-fine
                                     border-border-light dark:border-darkMode-border
                                     transition-colors duration-300
                                     group-hover:border-ochre-500 dark:group-hover:border-darkMode-ochre">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* External Links */}
                  {(project.githubUrl || project.liveUrl) && (
                    <div className="flex gap-6 pt-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-body text-sm tracking-wide uppercase
                                     text-charcoal-700 dark:text-darkMode-textMuted
                                     editorial-underline
                                     transition-opacity duration-300 hover:opacity-60">
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-body text-sm tracking-wide uppercase
                                     text-charcoal-700 dark:text-darkMode-textMuted
                                     editorial-underline
                                     transition-opacity duration-300 hover:opacity-60">
                          Live Demo
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Indicator Line */}
              <div className="h-px w-0 bg-ochre-500 dark:bg-darkMode-ochre
                              transition-all duration-500 ease-out-expo
                              group-hover:w-full"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
