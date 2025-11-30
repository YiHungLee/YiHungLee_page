import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../constants';
import { formatDate } from '../../utils/featured';
import { MarkdownRenderer } from '../shared/MarkdownRenderer';

const BlogPostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();

  const post = BLOG_POSTS.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-warmCream-50
                      flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold
                         text-charcoal-900">
            找不到此文章
          </h1>
          <Link
            to="/blog"
            className="inline-block font-body text-sm tracking-wide uppercase
                       text-ochre-500
                       editorial-underline">
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = BLOG_POSTS
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-warmCream-50 transition-colors duration-500">

      {/* Hero Section */}
      <article className="relative pt-40 pb-20 md:pt-48 md:pb-32
                          bg-warmCream-100
                          transition-colors duration-500 subtle-texture">

        <div className="max-w-4xl mx-auto px-6 md:px-12">

          {/* Breadcrumb */}
          <div className="mb-12 opacity-0 animate-fade-in">
            <Link
              to="/blog"
              className="font-body text-xs tracking-widest uppercase
                         text-charcoal-600
                         editorial-underline">
              ← 返回文章列表
            </Link>
          </div>

          {/* Post Header */}
          <header className="space-y-8 md:space-y-12">

            {/* Category */}
            <div className="opacity-0 animate-fade-in-up stagger-1">
              <p className="font-body text-xs tracking-widest uppercase
                            text-charcoal-600">
                {post.category === 'professional' ? '專業分享' : '創意探索'}
              </p>
            </div>

            {/* Title */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold
                             text-charcoal-900
                             tracking-tight leading-tight optical-align">
                {post.title}
              </h1>

              <div className="h-px w-24 bg-ochre-500 mt-8"></div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 opacity-0 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-3">
                <span className="font-body text-sm
                                text-charcoal-500">
                  {formatDate(post.date)}
                </span>
              </div>
              {post.readTime && (
                <>
                  <div className="h-4 w-px bg-border-light"></div>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm
                                    text-charcoal-500">
                      {post.readTime} 分鐘閱讀
                    </span>
                  </div>
                </>
              )}
              {post.featured && (
                <>
                  <div className="h-4 w-px bg-border-light"></div>
                  <div className="inline-block px-3 py-1 border border-fine
                                  border-ochre-500
                                  font-body text-xs tracking-wide
                                  text-ochre-500">
                    精選文章
                  </div>
                </>
              )}
            </div>

            {/* Summary */}
            {post.summary && (
              <div className="opacity-0 animate-fade-in-up stagger-4">
                <p className="font-body text-lg md:text-xl
                              text-charcoal-700
                              leading-relaxed border-l border-fine
                              border-ochre-500 pl-6 py-2">
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
                               text-charcoal-600
                               px-3 py-1 border border-fine
                               border-border-light">
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
                            bg-warmCream-100
                            transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-6 md:px-12">

            <div className="space-y-12">
              <div className="h-px w-full bg-border-light"></div>

              <div>
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 mb-8">
                  延伸閱讀
                </p>

                <div className="space-y-1 bg-border-light">
                  {relatedPosts.map((relatedPost, index) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="group block bg-warmCream-50
                                 p-8 md:p-12
                                 transition-all duration-500 ease-out-expo
                                 hover:bg-warmCream-200:bg-charcoal-800">
                      <div className="grid md:grid-cols-12 gap-6">
                        <div className="md:col-span-3">
                          <p className="font-body text-xs tracking-wide
                                        text-charcoal-500">
                            {formatDate(relatedPost.date)}
                          </p>
                        </div>
                        <div className="md:col-span-9 space-y-3">
                          <h3 className="font-display text-2xl md:text-3xl font-bold
                                         text-charcoal-900
                                         transition-colors duration-500
                                         group-hover:text-ochre-500:text-ochre-400">
                            {relatedPost.title}
                          </h3>
                          <p className="font-body text-sm
                                        text-charcoal-600">
                            {relatedPost.summary}
                          </p>
                          <div className="h-px w-0 bg-ochre-500
                                          transition-all duration-500 ease-out-expo
                                          group-hover:w-full"></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-border-light"></div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;
