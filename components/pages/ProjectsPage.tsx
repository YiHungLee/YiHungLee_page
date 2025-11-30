import React from 'react';
import { Link } from 'react-router-dom';
import { PORTFOLIO_ITEMS } from '../../constants';
import { ProjectCategory } from '../../types';

const categoryLabels: Record<ProjectCategory, string> = {
  academic: '學術研究',
  coding: '程式開發',
  music: '音樂創作',
};

const ProjectsPage: React.FC = () => {
  const categories: Array<{ key: ProjectCategory | 'all'; label: string; path: string }> = [
    { key: 'all', label: '全部作品', path: '/projects' },
    { key: 'academic', label: '學術研究', path: '/projects/academic' },
    { key: 'coding', label: '程式開發', path: '/projects/coding' },
    { key: 'music', label: '音樂創作', path: '/projects/music' },
  ];

  return (
    <div className="min-h-screen bg-warmCream-50 transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 md:pt-48 md:pb-40
                          bg-warmCream-100
                          transition-colors duration-500 subtle-texture">

        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Title Group */}
          <div className="space-y-8 md:space-y-12">

            {/* Subtitle */}
            <div className="opacity-0 animate-fade-in-up">
              <p className="font-body text-xs tracking-widest uppercase
                            text-charcoal-600">
                Portfolio
              </p>
            </div>

            {/* Main Title */}
            <div className="opacity-0 animate-fade-in-up stagger-1">
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold
                             text-charcoal-900
                             tracking-tight leading-none optical-align">
                作品集
              </h1>

              <div className="h-px w-24 md:w-32 bg-ochre-500 mt-8"></div>
            </div>

            {/* Description */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <p className="font-body text-lg md:text-xl lg:text-2xl
                            text-charcoal-700
                            leading-relaxed max-w-3xl">
                多面向的實踐與探索<br className="hidden md:block" />
                從學術研究到程式開發，從音樂創作到助人專業
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="sticky top-20 z-40 bg-warmCream-50/95
                          backdrop-blur-md border-b border-fine
                          border-border-light
                          transition-colors duration-500">

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-wrap gap-4 md:gap-6">

            {categories.map((category) => (
              <Link
                key={category.key}
                to={category.path}
                className="relative font-body text-sm md:text-base tracking-wide
                           text-charcoal-600 hover:text-ochre-500
                           transition-all duration-300 pb-2"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Projects Grid */}
          <div className="space-y-1 bg-border-light">
            {PORTFOLIO_ITEMS.map((project, index) => (
              <Link
                key={project.id}
                to={`/projects/${project.category}/${project.id}`}
                className="group bg-warmCream-100
                           transition-all duration-500 ease-out-expo
                           hover:bg-warmCream-50:bg-charcoal-800
                           opacity-0 animate-fade-in-up cursor-pointer block"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="grid md:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 lg:p-16">

                  {/* Left: Meta Information */}
                  <div className="md:col-span-3 space-y-6">

                    {/* Index Number */}
                    <div className="font-display text-6xl md:text-7xl font-bold
                                    text-charcoal-900
                                    opacity-20">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Category Label */}
                    <div className="space-y-2">
                      <div className="h-px w-12 bg-border-light"></div>
                      <p className="font-body text-xs tracking-widest uppercase
                                    text-charcoal-600">
                        {categoryLabels[project.category]}
                      </p>
                    </div>

                    {/* Year & Type */}
                    <div className="space-y-2">
                      <p className="font-body text-sm
                                    text-charcoal-500">
                        {project.year}
                      </p>
                      <p className="font-body text-xs tracking-wide
                                    text-charcoal-600">
                        {project.type === 'research' && '研究'}
                        {project.type === 'tool' && '工具開發'}
                        {project.type === 'composition' && '音樂創作'}
                      </p>
                    </div>

                    {/* Award Badge */}
                    {project.award && (
                      <div className="inline-block px-3 py-1 border border-fine
                                      border-ochre-500
                                      font-body text-xs tracking-wide
                                      text-ochre-500">
                        獲獎作品
                      </div>
                    )}
                  </div>

                  {/* Right: Content */}
                  <div className="md:col-span-9 space-y-6">

                    {/* Title */}
                    <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                                   text-charcoal-900
                                   tracking-tight leading-tight
                                   transition-colors duration-500
                                   group-hover:text-ochre-500">
                      {project.title}
                    </h3>

                    {/* Award Detail */}
                    {project.award && (
                      <p className="font-accent italic text-lg
                                    text-ochre-600">
                        {project.award}
                      </p>
                    )}

                    {/* Venue */}
                    {project.venue && (
                      <p className="font-body text-base
                                    text-charcoal-600">
                        {project.venue}
                      </p>
                    )}

                    {/* Description */}
                    <p className="font-body text-base md:text-lg
                                  text-charcoal-700
                                  leading-relaxed max-w-3xl">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="pt-4">
                        <p className="font-body text-xs tracking-wide uppercase
                                      text-charcoal-600 mb-3">
                          技術棧
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="font-body text-xs tracking-wide
                                         text-charcoal-700
                                         px-3 py-1 border border-fine
                                         border-border-light
                                         transition-colors duration-300
                                         group-hover:border-ochre-500">
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
                                      text-charcoal-600 mb-3">
                          製作工具
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {project.tools.map((tool) => (
                            <span
                              key={tool}
                              className="font-body text-xs tracking-wide
                                         text-charcoal-700
                                         px-3 py-1 border border-fine
                                         border-border-light
                                         transition-colors duration-300
                                         group-hover:border-ochre-500">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Audio Duration */}
                    {project.duration && (
                      <p className="font-body text-sm
                                    text-charcoal-600">
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
                                       text-charcoal-600
                                       px-3 py-1 border border-fine
                                       border-border-light
                                       transition-colors duration-300
                                       group-hover:border-ochre-500">
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
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          className="font-body text-sm tracking-wide uppercase
                                     text-charcoal-700
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
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          className="font-body text-sm tracking-wide uppercase
                                     text-charcoal-700
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
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          className="font-body text-sm tracking-wide uppercase
                                     text-charcoal-700
                                     editorial-underline
                                     transition-opacity duration-300 hover:opacity-60">
                          試聽音樂
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Indicator Line */}
                <div className="h-px w-0 bg-ochre-500
                                transition-all duration-500 ease-out-expo
                                group-hover:w-full"></div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Bottom Quote */}
      <section className="relative py-20 md:py-32
                          bg-warmCream-100
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="h-px w-full bg-border-light"></div>
            <p className="font-display text-2xl md:text-3xl lg:text-4xl italic
                          text-charcoal-800
                          leading-relaxed px-8">
              每一個作品，<br className="hidden md:block" />
              都是一次對話與探索的紀錄
            </p>
            <div className="h-px w-full bg-border-light"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
