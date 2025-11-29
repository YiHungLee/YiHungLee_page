import React from 'react';
import { Link } from 'react-router-dom';
import { getLatestPosts, formatDate } from '../../utils/featured';

export const LatestPosts: React.FC = () => {
  const posts = getLatestPosts(2);

  return (
    <section className="relative py-32 md:py-40
                        bg-warmCream-50 dark:bg-charcoal-950
                        transition-colors duration-500 subtle-texture">

      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="mb-20 md:mb-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">

            {/* Left: Title */}
            <div className="space-y-6">
              <p className="font-body text-xs tracking-widest uppercase
                            text-charcoal-600 dark:text-warmCream-400">
                Latest Stories
              </p>

              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold
                             text-charcoal-900 dark:text-warmCream-50
                             tracking-tight">
                最新文章
              </h2>

              <div className="h-px w-24 bg-ochre-500 dark:bg-ochre-400"></div>

              <p className="font-body text-lg
                            text-charcoal-600 dark:text-warmCream-400
                            max-w-xl leading-relaxed">
                專業思考與創意分享，記錄成長路上的點點滴滴
              </p>
            </div>

            {/* Right: View All Link */}
            <Link
              to="/blog"
              className="font-body text-sm tracking-wide uppercase
                         text-ochre-500 dark:text-ochre-400
                         editorial-underline
                         transition-opacity duration-300 hover:opacity-60">
              查看所有文章
            </Link>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-1 bg-border-light dark:bg-border-dark">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group block bg-warmCream-100 dark:bg-charcoal-900
                         transition-all duration-500 ease-out-expo
                         hover:bg-warmCream-50 dark:hover:bg-charcoal-800
                         opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="grid md:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 lg:p-16">

                {/* Left: Meta Information */}
                <div className="md:col-span-3 space-y-6">

                  {/* Index Number */}
                  <div className="font-display text-6xl md:text-7xl font-bold
                                  text-charcoal-900 dark:text-warmCream-50
                                  opacity-20">
                    0{index + 1}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <div className="h-px w-12 bg-border-light dark:bg-border-dark"></div>
                    <p className="font-body text-xs tracking-widest uppercase
                                  text-charcoal-600 dark:text-warmCream-400">
                      {post.category === 'professional' ? '專業分享' : '創意探索'}
                    </p>
                  </div>

                  {/* Date & Reading Time */}
                  <div className="space-y-2">
                    <p className="font-body text-sm
                                  text-charcoal-500 dark:text-warmCream-500">
                      {formatDate(post.date)}
                    </p>
                    {post.readTime && (
                      <p className="font-body text-xs tracking-wide
                                    text-charcoal-600 dark:text-warmCream-400">
                        {post.readTime} 分鐘閱讀
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Content */}
                <div className="md:col-span-9 space-y-6">

                  {/* Title */}
                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold
                                 text-charcoal-900 dark:text-warmCream-50
                                 tracking-tight leading-tight
                                 transition-colors duration-500
                                 group-hover:text-ochre-500 dark:group-hover:text-ochre-400">
                    {post.title}
                  </h3>

                  {/* Summary */}
                  <p className="font-body text-base md:text-lg
                                text-charcoal-700 dark:text-warmCream-300
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

                  {/* Read More Link */}
                  <div className="pt-4">
                    <span className="font-body text-sm tracking-wide uppercase
                                     text-ochre-500 dark:text-ochre-400
                                     editorial-underline">
                      閱讀全文
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Indicator Line */}
              <div className="h-px w-0 bg-ochre-500 dark:bg-ochre-400
                              transition-all duration-500 ease-out-expo
                              group-hover:w-full"></div>
            </Link>
          ))}
        </div>

        {/* Quote Section */}
        <div className="mt-20 md:mt-32 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="h-px w-full bg-border-light dark:bg-border-dark"></div>
            <p className="font-display text-2xl md:text-3xl lg:text-4xl italic
                          text-charcoal-800 dark:text-warmCream-200
                          leading-relaxed px-8">
              語言是一種理解世界的方式；<br className="hidden md:block" />
              文字則讓人理解彼此
            </p>
            <div className="h-px w-full bg-border-light dark:bg-border-dark"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
