import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../constants';
import { formatDate, isPostPublished } from '../../utils/featured';
import { MarkdownRenderer } from '../shared/MarkdownRenderer';

const BlogPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [readPosts, setReadPosts] = useState<Set<string>>(new Set());

  // 從 localStorage 讀取已讀文章
  useEffect(() => {
    const stored = localStorage.getItem('readBlogPosts');
    if (stored) {
      try {
        const parsedSet = new Set<string>(JSON.parse(stored));
        setReadPosts(parsedSet);
      } catch (e) {
        console.error('Failed to parse read posts:', e);
      }
    }
  }, []);

  // 標記當前文章為已讀
  useEffect(() => {
    if (postId) {
      // 從 localStorage 讀取最新的已讀列表
      const stored = localStorage.getItem('readBlogPosts');
      let currentReadPosts = new Set<string>();

      if (stored) {
        try {
          currentReadPosts = new Set<string>(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse read posts:', e);
        }
      }

      // 添加當前文章
      currentReadPosts.add(postId);

      // 更新狀態和 localStorage
      setReadPosts(currentReadPosts);
      localStorage.setItem('readBlogPosts', JSON.stringify(Array.from(currentReadPosts)));
    }
  }, [postId]);

  // 標記文章為已讀的函數
  const markAsRead = (id: string) => {
    // 從 localStorage 讀取最新的已讀列表
    const stored = localStorage.getItem('readBlogPosts');
    let currentReadPosts = new Set<string>();

    if (stored) {
      try {
        currentReadPosts = new Set<string>(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse read posts:', e);
      }
    }

    // 添加新文章
    currentReadPosts.add(id);

    // 更新狀態和 localStorage
    setReadPosts(currentReadPosts);
    localStorage.setItem('readBlogPosts', JSON.stringify(Array.from(currentReadPosts)));
  };

  const post = BLOG_POSTS.find(p => p.id === postId);

  // 檢查文章是否存在且已發布（日期早於或等於今天）
  if (!post || !isPostPublished(post.date)) {
    return (
      <div className="min-h-screen bg-warmCream-50 dark:bg-darkMode-bg
                      flex items-center justify-center transition-colors duration-500">
        <div className="text-center space-y-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold
                         text-charcoal-900 dark:text-darkMode-text">
            找不到此文章
          </h1>
          <Link
            to="/blog"
            className="inline-block font-body text-sm tracking-wide uppercase
                       text-ochre-500 dark:text-darkMode-ochre
                       editorial-underline">
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  // Get related posts (same category, excluding current, only published)
  const relatedPosts = BLOG_POSTS
    .filter(p => p.category === post.category && p.id !== post.id && isPostPublished(p.date))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-warmCream-50 dark:bg-darkMode-bg transition-colors duration-500">

      {/* Hero Section */}
      <article className="relative pt-40 pb-20 md:pt-48 md:pb-32
                          bg-warmCream-100 dark:bg-darkMode-bgElevated
                          transition-colors duration-500 subtle-texture">

        <div className="max-w-4xl mx-auto px-6 md:px-12">

          {/* Breadcrumb */}
          <div className="mb-12 opacity-0 animate-fade-in">
            <Link
              to="/blog"
              className="font-body text-xs tracking-widest uppercase
                         text-charcoal-600 dark:text-darkMode-textMuted
                         editorial-underline">
              ← 返回文章列表
            </Link>
          </div>

          {/* Post Header */}
          <header className="space-y-8 md:space-y-12">

            {/* Category */}
            <div className="opacity-0 animate-fade-in-up stagger-1">
              <p className="font-body text-xs tracking-widest uppercase
                            text-charcoal-600 dark:text-darkMode-textMuted">
                {post.category === 'professional' ? '專業分享' :
                 post.category === 'creative' ? '創意探索' :
                 '心情隨筆'}
              </p>
            </div>

            {/* Title */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                             text-charcoal-900 dark:text-darkMode-text
                             tracking-tight leading-tight optical-align">
                {post.title}
              </h1>

              <div className="h-px w-24 bg-ochre-500 dark:bg-darkMode-ochre mt-8"></div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 opacity-0 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-3">
                <span className="font-body text-sm
                                text-charcoal-500 dark:text-darkMode-textFaint">
                  {formatDate(post.date)}
                </span>
              </div>
              {post.readTime && (
                <>
                  <div className="h-4 w-px bg-border-light dark:bg-darkMode-border"></div>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm
                                    text-charcoal-500 dark:text-darkMode-textFaint">
                      {post.readTime} 分鐘閱讀
                    </span>
                  </div>
                </>
              )}
              {post.featured && (
                <>
                  <div className="h-4 w-px bg-border-light dark:bg-darkMode-border"></div>
                  <div className="inline-block px-3 py-1 border border-fine
                                  border-ochre-500 dark:border-darkMode-ochre
                                  font-body text-xs tracking-wide
                                  text-ochre-500 dark:text-darkMode-ochre">
                    精選文章
                  </div>
                </>
              )}
            </div>

            {/* Summary */}
            {post.summary && (
              <div className="opacity-0 animate-fade-in-up stagger-4">
                <p className="font-body text-lg md:text-xl
                              text-charcoal-700 dark:text-darkMode-textMuted
                              leading-relaxed border-l border-fine
                              border-ochre-500 dark:border-darkMode-ochre pl-6 py-2">
                  {post.summary}
                </p>
              </div>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 opacity-0 animate-fade-in-up stagger-5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-body text-xs tracking-wide
                               text-charcoal-600 dark:text-darkMode-textMuted
                               px-3 py-1 border border-fine
                               border-border-light dark:border-darkMode-border">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
        </div>
      </article>

      {/* Post Content */}
      <article className="relative py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12">

          {/* Article Content - Editorial Typography */}
          <div className="prose-custom opacity-0 animate-fade-in-up stagger-6">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="relative py-20 md:py-32
                            bg-warmCream-100 dark:bg-darkMode-bgElevated
                            transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-6 md:px-12">

            <div className="space-y-12">
              <div className="h-px w-full bg-border-light dark:bg-darkMode-border"></div>

              <div>
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 dark:text-darkMode-textMuted mb-8">
                  延伸閱讀
                </p>

                <div className="space-y-1 bg-border-light dark:bg-darkMode-border">
                  {relatedPosts.map((relatedPost, index) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      onClick={() => markAsRead(relatedPost.id)}
                      className="group block bg-warmCream-50 dark:bg-darkMode-bg
                                 p-8 md:p-12
                                 transition-all duration-500 ease-out-expo
                                 hover:bg-warmCream-200 dark:hover:bg-darkMode-bgElevated">
                      <div className="grid md:grid-cols-12 gap-6">
                        <div className="md:col-span-3 space-y-3">
                          <p className="font-body text-xs tracking-wide
                                        text-charcoal-500 dark:text-darkMode-textFaint">
                            {formatDate(relatedPost.date)}
                          </p>

                          {/* Read Badge */}
                          {readPosts.has(relatedPost.id) && (
                            <div className="inline-block px-3 py-1 border border-fine
                                            border-charcoal-300 dark:border-darkMode-border
                                            font-body text-xs tracking-wide
                                            text-charcoal-500 dark:text-darkMode-textMuted
                                            bg-charcoal-50 dark:bg-darkMode-bgElevated">
                              已閱讀
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-9 space-y-3">
                          <h3 className="font-display text-2xl md:text-3xl font-bold
                                         text-charcoal-900 dark:text-darkMode-text
                                         transition-colors duration-500
                                         group-hover:text-ochre-500 dark:group-hover:text-darkMode-ochre">
                            {relatedPost.title}
                          </h3>
                          <p className="font-body text-sm
                                        text-charcoal-600 dark:text-darkMode-textMuted">
                            {relatedPost.summary}
                          </p>
                          <div className="h-px w-0 bg-ochre-500 dark:bg-darkMode-ochre
                                          transition-all duration-500 ease-out-expo
                                          group-hover:w-full"></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-border-light dark:bg-darkMode-border"></div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;
