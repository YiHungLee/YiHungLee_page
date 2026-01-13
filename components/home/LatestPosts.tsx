import React from 'react';
import { Link } from 'react-router-dom';
import { getLatestPosts, getPublishedPosts, formatDate } from '../../utils/featured';
import { BLOG_POSTS } from '../../constants';

export const LatestPosts: React.FC = () => {
  const posts = getLatestPosts(2);
  const totalPostsCount = getPublishedPosts(BLOG_POSTS).length;

  return (
    <section className="relative py-32 md:py-40
                        bg-warmCream-50 dark:bg-darkMode-bgElevated
                        transition-colors duration-500 subtle-texture">

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="mb-20 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">

            {/* Left: Title */}
            <div className="space-y-6">
              <p className="font-body text-xs tracking-widest uppercase
                            text-charcoal-600 dark:text-darkMode-textMuted">
                Latest Stories
              </p>

              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold
                             text-charcoal-900 dark:text-darkMode-text
                             tracking-tight">
                最新文章
              </h2>

              <div className="h-px w-24 bg-ochre-500 dark:bg-darkMode-ochre"></div>

              <p className="font-body text-lg
                            text-charcoal-600 dark:text-darkMode-textMuted
                            max-w-xl leading-relaxed">
                專業思考與創意分享，記錄成長路上的點點滴滴
              </p>
            </div>

            {/* Right: View All Link */}
            <Link
              to="/blog"
              className="font-body text-sm tracking-wide uppercase
                         text-ochre-500 dark:text-darkMode-ochre
                         editorial-underline
                         transition-opacity duration-300 hover:opacity-60">
              查看所有文章 ({totalPostsCount})
            </Link>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-1 bg-border-light dark:bg-darkMode-border">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group block bg-warmCream-100 dark:bg-darkMode-bg
                         transition-all duration-500 ease-out-expo
                         hover:bg-warmCream-50 dark:hover:bg-darkMode-bgElevated
                         opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="grid md:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 lg:p-16">

                {/* Left: Meta Information */}
                <div className="md:col-span-3 space-y-6">

                  {/* Index Number */}
                  <div className="font-display text-6xl md:text-7xl font-bold
                                  text-charcoal-900 dark:text-darkMode-text
                                  opacity-20">
                    0{index + 1}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <div className="h-px w-12 bg-border-light dark:bg-darkMode-border"></div>
                    <p className="font-body text-xs tracking-widest uppercase
                                  text-charcoal-600 dark:text-darkMode-textMuted">
                      {post.category === 'professional' ? '專業分享' : '創意探索'}
                    </p>
                  </div>

                  {/* Date & Reading Time */}
                  <div className="space-y-2">
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-darkMode-textFaint">
                      {formatDate(post.date)}
                    </p>
                    {post.readTime && (
                      <p className="font-body text-xs tracking-wide
                                    text-charcoal-600 dark:text-darkMode-textMuted">
                        {post.readTime} 分鐘閱讀
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Content */}
                <div className="md:col-span-9 space-y-6">

                  {/* Title */}
                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                                 text-charcoal-900 dark:text-darkMode-text
                                 tracking-tight leading-tight
                                 transition-colors duration-500
                                 group-hover:text-ochre-500 dark:group-hover:text-darkMode-ochre">
                    {post.title}
                  </h3>

                  {/* Summary */}
                  <p className="font-body text-base md:text-lg
                                text-charcoal-700 dark:text-darkMode-textMuted
                                leading-relaxed max-w-3xl">
                    {post.summary}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-4">
                      {post.tags.slice(0, 4).map((tag) => (
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

                  {/* Read More Link */}
                  <div className="pt-4">
                    <span className="font-body text-sm tracking-wide uppercase
                                     text-ochre-500 dark:text-darkMode-ochre
                                     editorial-underline">
                      閱讀全文
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Indicator Line */}
              <div className="h-px w-0 bg-ochre-500 dark:bg-darkMode-ochre
                              transition-all duration-500 ease-out-expo
                              group-hover:w-full"></div>
            </Link>
          ))}
        </div>

        {/* Quote Section */}
        <div className="mt-20 md:mt-32 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="h-px w-full bg-border-light dark:bg-darkMode-border"></div>
            <p className="font-display text-2xl md:text-3xl lg:text-4xl italic
                          text-charcoal-800 dark:text-darkMode-text
                          leading-relaxed px-8">
              語言是一種理解世界的方式；<br className="hidden md:block" />
              文字則讓人理解彼此
            </p>
            <div className="h-px w-full bg-border-light dark:bg-darkMode-border"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
