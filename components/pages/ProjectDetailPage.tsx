import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { PORTFOLIO_ITEMS } from '../../constants';
import { ProjectCategory } from '../../types';
import MusicPlayer from '../music/MusicPlayer';
import { MarkdownRenderer } from '../shared/MarkdownRenderer';

const categoryLabels: Record<ProjectCategory, string> = {
  academic: '學術研究',
  coding: '程式開發',
  music: '音樂創作',
};

const ProjectDetailPage: React.FC = () => {
  const { category, projectId } = useParams<{ category: string; projectId: string }>();

  // Find the project
  const project = PORTFOLIO_ITEMS.find(
    (item) => item.category === category && item.id === projectId
  );

  // Handle not found
  if (!project) {
    return (
      <div className="min-h-screen bg-warmCream-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal-900">
            找不到此作品
          </h1>
          <Link
            to="/projects"
            className="inline-block font-body text-sm tracking-wide uppercase
                       text-ochre-500 editorial-underline">
            返回作品集
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warmCream-50 transition-colors duration-500">

      {/* Hero Section */}
      <article className="relative pt-40 pb-20 md:pt-48 md:pb-32
                          bg-warmCream-100 transition-colors duration-500 subtle-texture">
        <div className="max-w-4xl mx-auto px-6 md:px-12">

          {/* Breadcrumb */}
          <div className="mb-12 opacity-0 animate-fade-in">
            <Link
              to={`/projects/${category}`}
              className="font-body text-xs tracking-widest uppercase
                         text-charcoal-600 editorial-underline">
              ← 返回 {categoryLabels[category as ProjectCategory]}
            </Link>
          </div>

          {/* Project Header */}
          <header className="space-y-8 md:space-y-12">

            {/* Category & Year */}
            <div className="flex flex-wrap items-center gap-4 opacity-0 animate-fade-in-up stagger-1">
              <p className="font-body text-xs tracking-widest uppercase text-charcoal-600">
                {categoryLabels[category as ProjectCategory]}
              </p>
              <div className="h-4 w-px bg-border-light"></div>
              <p className="font-body text-sm text-charcoal-500">{project.year}</p>
              {project.award && (
                <>
                  <div className="h-4 w-px bg-border-light"></div>
                  <div className="inline-block px-3 py-1 border border-fine
                                  border-ochre-500 font-body text-xs tracking-wide
                                  text-ochre-500">
                    獲獎作品
                  </div>
                </>
              )}
            </div>

            {/* Title */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                             text-charcoal-900 tracking-tight leading-tight optical-align">
                {project.title}
              </h1>
              <div className="h-px w-24 bg-ochre-500 mt-8"></div>
            </div>

            {/* Award Detail */}
            {project.award && (
              <div className="opacity-0 animate-fade-in-up stagger-3">
                <p className="font-accent italic text-lg text-ochre-600">
                  {project.award}
                </p>
              </div>
            )}

            {/* Venue */}
            {project.venue && (
              <div className="opacity-0 animate-fade-in-up stagger-4">
                <p className="font-body text-base text-charcoal-600">
                  {project.venue}
                </p>
              </div>
            )}
          </header>
        </div>
      </article>

      {/* Project Content */}
      <article className="relative py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          {/* Music Player Section */}
          {(project.tracks && project.tracks.length > 0) || project.audioUrl ? (
            <div className="mb-12 opacity-0 animate-fade-in-up stagger-8">
              <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-6">
                {project.tracks && project.tracks.length > 1 ? '專輯曲目' : '音樂試聽'}
              </h2>
              <MusicPlayer
                tracks={project.tracks || [{
                  id: project.id,
                  title: project.title,
                  audioUrl: project.audioUrl!,
                  duration: project.duration || '0:00',
                }]}
                initialTrackIndex={0}
                albumTitle={project.title}
                albumCover={project.albumCover || project.imageUrl}
                showPlaylist={true}
              />
            </div>
          ) : null}
          {/* Markdown Content */}
          {project.content && (
            <div className="prose-custom opacity-0 animate-fade-in-up stagger-5 mb-12">
              <MarkdownRenderer content={project.content} />
            </div>
          )}

          {/* Image if available */}
          {project.imageUrl && (
            <div className="mb-12 opacity-0 animate-fade-in-up stagger-6">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="mb-12 opacity-0 animate-fade-in-up stagger-7">
              <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-6">
                技術棧
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="font-body text-sm tracking-wide text-charcoal-700
                               px-4 py-2 border border-fine border-border-light
                               hover:border-ochre-500 transition-colors duration-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Music Tools */}
          {project.tools && project.tools.length > 0 && (
            <div className="mb-12 opacity-0 animate-fade-in-up stagger-7">
              <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-6">
                製作工具
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="font-body text-sm tracking-wide text-charcoal-700
                               px-4 py-2 border border-fine border-border-light
                               hover:border-ochre-500 transition-colors duration-300">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          

          {/* External Links */}
          {(project.githubUrl || project.liveUrl) && (
            <div className="mb-12 opacity-0 animate-fade-in-up stagger-9">
              <h2 className="font-display text-2xl font-bold text-charcoal-900 mb-6">
                相關連結
              </h2>
              <div className="flex flex-wrap gap-6">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm tracking-wide uppercase
                               text-charcoal-700 editorial-underline
                               transition-opacity duration-300 hover:opacity-60">
                    GitHub Repository →
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm tracking-wide uppercase
                               text-charcoal-700 editorial-underline
                               transition-opacity duration-300 hover:opacity-60">
                    Live Demo →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="opacity-0 animate-fade-in-up stagger-10">
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-body text-xs tracking-wide text-charcoal-600
                               px-3 py-1 border border-fine border-border-light">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Back Navigation */}
      <section className="relative py-20 md:py-32 bg-warmCream-100">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <Link
            to={`/projects/${category}`}
            className="inline-block font-body text-sm tracking-wide uppercase
                       text-ochre-500 editorial-underline">
            ← 返回 {categoryLabels[category as ProjectCategory]}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailPage;
