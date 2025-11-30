import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PORTFOLIO_ITEMS } from '../../constants';
import { ProjectCategory, MusicTrack } from '../../types';
import MusicPlayer from '../music/MusicPlayer';

const categoryLabels: Record<ProjectCategory, string> = {
  academic: '學術研究',
  coding: '程式開發',
  music: '音樂創作',
};

const categoryDescriptions: Record<ProjectCategory, string> = {
  academic: '理論建構與實證探究',
  coding: '技術實踐與工具開發',
  music: '聲音敘事與情感表達',
};

const categoryIntros: Record<ProjectCategory, string> = {
  academic: '透過嚴謹的研究方法，探索心理學的理論與應用。從量表編製到實證研究，每一步都是對人性理解的深化。',
  coding: '結合心理專業與技術能力，開發服務助人工作者的實用工具。讓科技成為心理工作的助力，而非阻礙。',
  music: '用聲音表達情感，用旋律敘說故事。音樂創作是我探索內在世界的另一種語言，也是與他人連結的橋樑。',
};

const ProjectCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  // Validate category
  const validCategories: ProjectCategory[] = ['academic', 'coding', 'music'];
  const currentCategory = validCategories.includes(category as ProjectCategory)
    ? (category as ProjectCategory)
    : null;

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-warmCream-50
                      flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold
                         text-charcoal-900">
            找不到此分類
          </h1>
          <Link
            to="/projects"
            className="inline-block font-body text-sm tracking-wide uppercase
                       text-ochre-500
                       editorial-underline">
            返回作品集
          </Link>
        </div>
      </div>
    );
  }

  const categoryProjects = PORTFOLIO_ITEMS.filter(
    (item) => item.category === currentCategory
  );

  // Collect all music tracks for global player (music category only)
  const allMusicTracks: MusicTrack[] = currentCategory === 'music'
    ? categoryProjects
        .filter((project) => (project.tracks && project.tracks.length > 0) || project.audioUrl)
        .flatMap((project) => {
          if (project.tracks && project.tracks.length > 0) {
            return project.tracks.map((track) => ({
              ...track,
              albumTitle: project.title,
              albumCover: project.albumCover || project.imageUrl,
            }));
          } else if (project.audioUrl) {
            return [{
              id: project.id,
              title: project.title,
              audioUrl: project.audioUrl,
              duration: project.duration || '0:00',
              albumTitle: project.title,
              albumCover: project.albumCover || project.imageUrl,
            }];
          }
          return [];
        })
    : [];

  return (
    <div className="min-h-screen bg-warmCream-50 transition-colors duration-500">

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 md:pt-48 md:pb-40
                          bg-warmCream-100
                          transition-colors duration-500 subtle-texture">

        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Breadcrumb */}
          <div className="mb-12 opacity-0 animate-fade-in">
            <Link
              to="/projects"
              className="font-body text-xs tracking-widest uppercase
                         text-charcoal-600
                         editorial-underline">
              ← 返回作品集
            </Link>
          </div>

          {/* Title Group */}
          <div className="space-y-8 md:space-y-12">

            {/* Subtitle */}
            <div className="opacity-0 animate-fade-in-up stagger-1">
              <p className="font-body text-xs tracking-widest uppercase
                            text-charcoal-600">
                {categoryDescriptions[currentCategory]}
              </p>
            </div>

            {/* Main Title */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold
                             text-charcoal-900
                             tracking-tight leading-none optical-align">
                {categoryLabels[currentCategory]}
              </h1>

              <div className="h-px w-24 md:w-32 bg-ochre-500 mt-8"></div>
            </div>

            {/* Description */}
            <div className="opacity-0 animate-fade-in-up stagger-3">
              <p className="font-body text-lg md:text-xl lg:text-2xl
                            text-charcoal-700
                            leading-relaxed max-w-3xl">
                {categoryIntros[currentCategory]}
              </p>
            </div>

            {/* Project Count */}
            <div className="opacity-0 animate-fade-in-up stagger-4">
              <div className="inline-flex items-center gap-4">
                <div className="font-display text-5xl md:text-6xl font-bold
                                text-ochre-500">
                  {categoryProjects.length}
                </div>
                <div className="font-body text-sm tracking-wide
                                text-charcoal-600">
                  件作品
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="space-y-1 bg-border-light">
            {categoryProjects.map((project, index) => (
              <Link
                key={project.id}
                to={`/projects/${project.category}/${project.id}`}
                className="group bg-warmCream-100
                           transition-all duration-500 ease-out-expo
                           hover:bg-warmCream-50:bg-charcoal-800
                           opacity-0 animate-fade-in-up cursor-pointer block"
                style={{ animationDelay: `${index * 0.1}s` }}
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

                    {/* Year & Type */}
                    <div className="space-y-2">
                      <div className="h-px w-12 bg-border-light"></div>
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
                                         group-hover:border-ochre-500:border-ochre-400">
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
                                         group-hover:border-ochre-500:border-ochre-400">
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
                                       group-hover:border-ochre-500:border-ochre-400">
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

          {/* Empty State */}
          {categoryProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-lg text-charcoal-600">
                此分類暫無作品
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Global Music Player for Music Category */}
      {currentCategory === 'music' && allMusicTracks.length > 0 && (
        <section className="relative py-20 md:py-32 bg-warmCream-100">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12 opacity-0 animate-fade-in-up">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
                播放全部音樂
              </h2>
              <p className="font-body text-lg text-charcoal-600">
                收錄 {categoryProjects.length} 張專輯，共 {allMusicTracks.length} 首曲目
              </p>
            </div>
            <div className="opacity-0 animate-fade-in-up stagger-1">
              <MusicPlayer
                tracks={allMusicTracks}
                initialTrackIndex={0}
                showPlaylist={true}
              />
            </div>
          </div>
        </section>
      )}

      {/* Navigation to Other Categories */}
      <section className="relative py-20 md:py-32
                          bg-warmCream-100
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="space-y-12">

            <div className="h-px w-full bg-border-light"></div>

            <div>
              <p className="font-body text-xs tracking-widest uppercase
                            text-charcoal-600 mb-8">
                探索其他分類
              </p>

              <div className="grid md:grid-cols-3 gap-1 bg-border-light">
                {validCategories
                  .filter((cat) => cat !== currentCategory)
                  .map((cat) => (
                    <Link
                      key={cat}
                      to={`/projects/${cat}`}
                      className="group bg-warmCream-50
                                 p-8 md:p-12
                                 transition-all duration-500 ease-out-expo
                                 hover:bg-warmCream-200:bg-charcoal-800">
                      <div className="space-y-4">
                        <h3 className="font-display text-2xl md:text-3xl font-bold
                                       text-charcoal-900
                                       transition-colors duration-500
                                       group-hover:text-ochre-500">
                          {categoryLabels[cat]}
                        </h3>
                        <p className="font-body text-sm
                                      text-charcoal-600">
                          {categoryDescriptions[cat]}
                        </p>
                        <div className="h-px w-0 bg-ochre-500
                                        transition-all duration-500 ease-out-expo
                                        group-hover:w-full"></div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="h-px w-full bg-border-light"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectCategoryPage;
