import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../constants';
import { formatDate, getPublishedPosts } from '../../utils/featured';
import { Search, ArrowUp } from 'lucide-react';
import { StructuredData } from '../shared/StructuredData';

type BlogCategory = 'all' | 'professional' | 'creative' | 'casual';

const categoryLabels: Record<BlogCategory, string> = {
  all: '全部文章',
  professional: '專業分享',
  creative: '創意探索',
  casual: '心情隨筆',
};

const BlogListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [readPosts, setReadPosts] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const postsListRef = useRef<HTMLElement>(null);

  const POSTS_PER_PAGE = 10;

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

  // 標記文章為已讀
  const markAsRead = (postId: string) => {
    const newReadPosts = new Set(readPosts);
    newReadPosts.add(postId);
    setReadPosts(newReadPosts);
    localStorage.setItem('readBlogPosts', JSON.stringify(Array.from(newReadPosts)));
  };

  // 監聽滾動事件，控制「返回頂部」按鈕的顯示
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 載入電子報訂閱表單
  useEffect(() => {
    const container = document.getElementById('newsletter-form-container');
    if (container && !container.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://eomail5.com/form/086d0148-f063-11f0-bd4f-31a087deddc1.js';
      script.async = true;
      script.setAttribute('data-form', '086d0148-f063-11f0-bd4f-31a087deddc1');
      container.appendChild(script);
    }
  }, []);

  // 先過濾掉未來日期的文章
  const publishedPosts = getPublishedPosts(BLOG_POSTS);

  // 準備結構化資料
  const blogListData = useMemo(() => ({
    name: '文章',
    description: '李奕宏的部落格文章：專業分享、創意探索與心情隨筆',
    url: '/blog',
    items: publishedPosts.map((post) => ({
      id: post.id,
      title: post.title,
      url: `/blog/${post.id}`,
    })),
  }), [publishedPosts]);

  // 計算每個分類的文章數量
  const categoryCounts: Record<BlogCategory, number> = {
    all: publishedPosts.length,
    professional: publishedPosts.filter(p => p.category === 'professional').length,
    creative: publishedPosts.filter(p => p.category === 'creative').length,
    casual: publishedPosts.filter(p => p.category === 'casual').length,
  };

  // 依據分類過濾
  const categoryFilteredPosts = selectedCategory === 'all'
    ? publishedPosts
    : publishedPosts.filter(post => post.category === selectedCategory);

  // 依據搜索關鍵字過濾（搜索標題、摘要、標籤）
  const filteredPosts = categoryFilteredPosts
    .filter(post => {
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(query);
      const summaryMatch = post.summary.toLowerCase().includes(query);
      const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(query));

      return titleMatch || summaryMatch || tagsMatch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 分頁邏輯
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const categories: BlogCategory[] = ['all', 'professional', 'creative', 'casual'];

  // 處理標籤點擊
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setCurrentPage(1);
    // 滾動到文章列表
    setTimeout(() => {
      if (postsListRef.current) {
        const headerOffset = 80;
        const elementPosition = postsListRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  // 處理分類變更並滾動到 Posts List（帶過渡效果）
  const handleCategoryChange = (category: BlogCategory) => {
    setIsTransitioning(true);
    setCurrentPage(1); // 重置到第一頁

    setTimeout(() => {
      setSelectedCategory(category);
      setIsTransitioning(false);

      if (postsListRef.current) {
        const headerOffset = 80;
        const elementPosition = postsListRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  // 處理分頁變更
  const handlePageChange = (page: number) => {
    setIsTransitioning(true);
    setCurrentPage(page);

    setTimeout(() => {
      setIsTransitioning(false);
      if (postsListRef.current) {
        const headerOffset = 80;
        const elementPosition = postsListRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-warmCream-50 dark:bg-darkMode-bg transition-colors duration-500">
      {/* Structured Data */}
      <StructuredData type="blogList" listData={blogListData} />

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 md:pt-48 md:pb-40
                          bg-warmCream-100 dark:bg-darkMode-bgElevated
                          transition-colors duration-500 subtle-texture">

        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Title Group */}
          <div className="space-y-8 md:space-y-12">

            {/* Subtitle */}
            <div className="opacity-0 animate-fade-in-up">
              <p className="font-body text-xs tracking-widest uppercase
                            text-charcoal-600 dark:text-darkMode-textMuted">
                Blog
              </p>
            </div>

            {/* Main Title */}
            <div className="opacity-0 animate-fade-in-up stagger-1">
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold
                             text-charcoal-900 dark:text-darkMode-text
                             tracking-tight leading-none optical-align">
                文章
              </h1>

              <div className="h-px w-24 md:w-32 bg-ochre-500 dark:bg-darkMode-ochre mt-8"></div>
            </div>

            {/* Description */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <p className="font-body text-lg md:text-xl lg:text-2xl
                            text-charcoal-700 dark:text-darkMode-textMuted
                            leading-relaxed max-w-3xl">
                紀錄思考分享創意<br className="hidden md:block" />
                有時僅是心情隨筆
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Category Filter & Search */}
      <section className="sticky top-20 z-30 bg-warmCream-50/95 dark:bg-darkMode-bg/95
                          backdrop-blur-md border-b border-fine
                          border-border-light dark:border-darkMode-borderLight
                          transition-colors duration-500">

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-4 md:gap-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`relative font-body text-sm md:text-base tracking-wide
                             transition-all duration-300 pb-2
                             ${selectedCategory === category
                               ? 'text-ochre-500 dark:text-darkMode-ochre'
                               : 'text-charcoal-600 dark:text-darkMode-textMuted hover:text-ochre-500 dark:hover:text-darkMode-ochre'
                             }`}
                >
                  {categoryLabels[category]}
                  <span className="ml-1.5 opacity-60">({categoryCounts[category]})</span>

                  {/* Active Indicator */}
                  {selectedCategory === category && (
                    <div className="absolute bottom-0 left-0 w-full h-px
                                    bg-ochre-500 dark:bg-darkMode-ochre"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                                text-charcoal-400 dark:text-darkMode-textFaint" />
              <input
                type="text"
                placeholder="搜尋文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2
                          font-body text-sm
                          bg-warmCream-100 dark:bg-darkMode-bgElevated
                          text-charcoal-900 dark:text-darkMode-text
                          placeholder-charcoal-400 dark:placeholder-darkMode-textFaint
                          border border-border-light dark:border-darkMode-border
                          rounded-none
                          transition-colors duration-300
                          focus:outline-none focus:border-ochre-500 dark:focus:border-darkMode-ochre"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts List */}
      <section ref={postsListRef} className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Results Count */}
          {filteredPosts.length > 0 && (
            <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
              <p className="font-body text-sm text-charcoal-600 dark:text-darkMode-textMuted">
                {searchQuery ? (
                  <>找到 <span className="font-bold text-ochre-500 dark:text-darkMode-ochre">{filteredPosts.length}</span> 篇符合「{searchQuery}」的文章</>
                ) : (
                  <>顯示 <span className="font-bold text-ochre-500 dark:text-darkMode-ochre">{filteredPosts.length}</span> 篇文章</>
                )}
              </p>
              {totalPages > 1 && (
                <p className="font-body text-xs text-charcoal-500 dark:text-darkMode-textFaint">
                  第 {currentPage} / {totalPages} 頁
                </p>
              )}
            </div>
          )}

          <div className={`space-y-1 bg-border-light dark:bg-darkMode-border transition-opacity duration-300 ${isTransitioning ? 'opacity-30' : 'opacity-100'}`}>
            {currentPosts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                onClick={() => markAsRead(post.id)}
                className={`group block bg-warmCream-100 dark:bg-darkMode-bgElevated
                           transition-all duration-500 ease-out-expo
                           hover:bg-warmCream-50 dark:hover:bg-darkMode-bg
                           opacity-0 animate-fade-in-up
                           ${readPosts.has(post.id) ? 'relative' : ''}`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="grid md:grid-cols-12 gap-8 md:gap-12 p-8 md:p-12 lg:p-16">

                  {/* Left: Meta Information */}
                  <div className="md:col-span-3 space-y-6">

                    {/* Index Number */}
                    <div className="font-display text-6xl md:text-7xl font-bold
                                    text-charcoal-900 dark:text-darkMode-text
                                    opacity-20">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <div className="h-px w-12 bg-border-light dark:bg-darkMode-border"></div>
                      <p className="font-body text-xs tracking-widest uppercase
                                    text-charcoal-600 dark:text-darkMode-textMuted">
                        {categoryLabels[post.category as BlogCategory]}
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

                    {/* Featured Badge */}
                    {post.featured && (
                      <div className="inline-block px-3 py-1 border border-fine
                                      border-ochre-500 dark:border-darkMode-ochre
                                      font-body text-xs tracking-wide
                                      text-ochre-500 dark:text-darkMode-ochre">
                        精選文章
                      </div>
                    )}

                    {/* Read Badge */}
                    {readPosts.has(post.id) && (
                      <div className="inline-block px-3 py-1 border border-fine
                                      border-charcoal-300 dark:border-darkMode-border
                                      font-body text-xs tracking-wide
                                      text-charcoal-500 dark:text-darkMode-textMuted
                                      bg-charcoal-50 dark:bg-darkMode-bg">
                        已閱讀
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
                        {post.tags.slice(0, 5).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleTagClick(tag);
                            }}
                            className="font-body text-xs tracking-wide
                                       text-charcoal-600 dark:text-darkMode-textMuted
                                       px-3 py-1 border border-fine
                                       border-border-light dark:border-darkMode-border
                                       transition-all duration-300
                                       hover:bg-ochre-500 hover:text-white hover:border-ochre-500
                                       dark:hover:bg-darkMode-ochre dark:hover:text-white dark:hover:border-darkMode-ochre
                                       group-hover:border-ochre-500 dark:group-hover:border-darkMode-ochre">
                            {tag}
                          </button>
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

          {/* Pagination */}
          {totalPages > 1 && filteredPosts.length > 0 && (
            <div className="mt-20 flex items-center justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 font-body text-sm tracking-wide
                           border border-border-light dark:border-darkMode-border
                           transition-all duration-300
                           ${currentPage === 1
                             ? 'opacity-30 cursor-not-allowed'
                             : 'hover:border-ochre-500 hover:text-ochre-500 dark:hover:border-darkMode-ochre dark:hover:text-darkMode-ochre'
                           }`}
              >
                上一頁
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // 顯示邏輯：總是顯示第一頁、最後一頁、當前頁及其前後頁
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1);

                  const showEllipsisBefore = page === currentPage - 1 && currentPage > 3;
                  const showEllipsisAfter = page === currentPage + 1 && currentPage < totalPages - 2;

                  if (!showPage && !showEllipsisBefore && !showEllipsisAfter) {
                    return null;
                  }

                  if (showEllipsisBefore && page === 2) {
                    return (
                      <span key={`ellipsis-before`} className="px-2 py-2 text-charcoal-400 dark:text-darkMode-textFaint">
                        ...
                      </span>
                    );
                  }

                  if (showEllipsisAfter && page === totalPages - 1) {
                    return (
                      <span key={`ellipsis-after`} className="px-2 py-2 text-charcoal-400 dark:text-darkMode-textFaint">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 font-body text-sm
                                 border border-fine
                                 transition-all duration-300
                                 ${currentPage === page
                                   ? 'bg-ochre-500 dark:bg-darkMode-ochre text-white border-ochre-500 dark:border-darkMode-ochre'
                                   : 'border-border-light dark:border-darkMode-border text-charcoal-600 dark:text-darkMode-textMuted hover:border-ochre-500 hover:text-ochre-500 dark:hover:border-darkMode-ochre dark:hover:text-darkMode-ochre'
                                 }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 font-body text-sm tracking-wide
                           border border-border-light dark:border-darkMode-border
                           transition-all duration-300
                           ${currentPage === totalPages
                             ? 'opacity-30 cursor-not-allowed'
                             : 'hover:border-ochre-500 hover:text-ochre-500 dark:hover:border-darkMode-ochre dark:hover:text-darkMode-ochre'
                           }`}
              >
                下一頁
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-32 space-y-8">
              <div className="space-y-4">
                <p className="font-display text-3xl md:text-4xl font-bold
                              text-charcoal-900 dark:text-darkMode-text">
                  {searchQuery ? '找不到相關文章' : '此分類暫無文章'}
                </p>
                <p className="font-body text-base text-charcoal-600 dark:text-darkMode-textMuted max-w-md mx-auto">
                  {searchQuery ? (
                    <>試試搜索其他關鍵字，或查看所有文章</>
                  ) : (
                    <>敬請期待更多精彩內容</>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="font-body text-sm tracking-wide uppercase px-6 py-3
                              text-ochre-500 dark:text-darkMode-ochre
                              border border-ochre-500 dark:border-darkMode-ochre
                              transition-all duration-300
                              hover:bg-ochre-500 hover:text-white dark:hover:bg-darkMode-ochre">
                    清除搜索
                  </button>
                )}
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className="font-body text-sm tracking-wide uppercase px-6 py-3
                              text-charcoal-600 dark:text-darkMode-textMuted
                              border border-border-light dark:border-darkMode-border
                              transition-all duration-300
                              hover:border-ochre-500 hover:text-ochre-500
                              dark:hover:border-darkMode-ochre dark:hover:text-darkMode-ochre">
                    查看所有文章
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section id="subscribe" className="relative py-16 md:py-24
                          bg-warmCream-50 dark:bg-darkMode-bg
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-xl md:text-3xl font-bold
                           text-charcoal-800 dark:text-darkMode-text
                           mb-8">
              訂閱電子週報
            </h2>
            <div id="newsletter-form-container"></div>
          </div>
        </div>
      </section>

      {/* Bottom Quote */}
      <section className="relative py-20 md:py-32
                          bg-warmCream-100 dark:bg-darkMode-bgElevated
                          transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
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
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40
                    w-12 h-12 rounded-full
                    bg-ochre-500 dark:bg-darkMode-ochre
                    text-white
                    shadow-lg
                    transition-all duration-300
                    hover:scale-110 hover:shadow-xl
                    opacity-0 animate-fade-in"
          aria-label="返回頂部"
        >
          <ArrowUp className="w-5 h-5 mx-auto" />
        </button>
      )}
    </div>
  );
};

export default BlogListPage;
