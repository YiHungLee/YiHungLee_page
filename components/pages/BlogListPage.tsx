import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../constants';
import { formatDate } from '../../utils/featured';

type BlogCategory = 'all' | 'professional' | 'creative';

const categoryLabels: Record<BlogCategory, string> = {
  all: '全部文章',
  professional: '專業分享',
  creative: '創意探索',
};

const BlogListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('all');

  const filteredPosts = selectedCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(post => post.category === selectedCategory);

  const categories: BlogCategory[] = ['all', 'professional', 'creative'];

  // 處理分類變更並滾動到頂部
  const handleCategoryChange = (category: BlogCategory) => {
    setSelectedCategory(category);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // 使用平滑滾動效果
    });
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
                Blog
              </p>
            </div>

            {/* Main Title */}
            <div className="opacity-0 animate-fade-in-up stagger-1">
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold
                             text-charcoal-900 dark:text-warmCream-50
                             tracking-tight leading-none optical-align">
                文章
              </h1>

              <div className="h-px w-24 md:w-32 bg-ochre-500 dark:bg-ochre-400 mt-8"></div>
            </div>

            {/* Description */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <p className="font-body text-lg md:text-xl lg:text-2xl
                            text-charcoal-700 dark:text-warmCream-300
                            leading-relaxed max-w-3xl">
                專業思考與創意分享<br className="hidden md:block" />
                記錄成長路上的點點滴滴
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
                {categoryLabels[category]}

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

      {/* Posts List */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="space-y-1 bg-border-light dark:bg-border-dark">
            {filteredPosts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group block bg-warmCream-100 dark:bg-charcoal-900
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

                    {/* Featured Badge */}
                    {post.featured && (
                      <div className="inline-block px-3 py-1 border border-fine
                                      border-ochre-500 dark:border-ochre-400
                                      font-body text-xs tracking-wide
                                      text-ochre-500 dark:text-ochre-400">
                        精選文章
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
                        {post.tags.slice(0, 5).map((tag) => (
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

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="font-body text-lg text-charcoal-600 dark:text-warmCream-400">
                此分類暫無文章
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
              語言是一種理解世界的方式；<br className="hidden md:block" />
              文字則讓人理解彼此
            </p>
            <div className="h-px w-full bg-border-light dark:bg-border-dark"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogListPage;
