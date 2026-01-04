import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Envelope, LinkedinLogo, Sun, Moon, User, Briefcase, ArrowRight, Article } from '@phosphor-icons/react';
import { useTheme } from '../layout/ThemeContext';
import { getLatestPosts } from '../../utils/featured';
import { PROFILE } from '../../constants';

// Decorative SVG Components
const CornerDecoration: React.FC<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; className?: string }> = ({ position, className = '' }) => {
  const rotations = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90'
  };

  return (
    <svg
      className={`absolute w-20 h-20 ${rotations[position]} ${className}`}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 0 L32 0 M0 0 L0 32"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-ochre-300/40 dark:text-darkMode-ochre/20"
      />
      <path
        d="M0 6 L18 6 M6 0 L6 18"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-ochre-400/25 dark:text-darkMode-ochre/15"
      />
      <circle
        cx="0"
        cy="0"
        r="2"
        className="fill-ochre-400/50 dark:fill-darkMode-ochre/30"
      />
    </svg>
  );
};

const LinksPage: React.FC = () => {
  const { mode, setMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);

  const latestPost = getLatestPosts(1)[0];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAvatarClick = () => {
    if (isSmiling) return;
    setIsSmiling(true);
    setTimeout(() => setIsSmiling(false), 2000);
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const socialLinks = [
    { label: 'Email', href: `mailto:${PROFILE.email}`, icon: Envelope },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yi-hung-lee', icon: LinkedinLogo },
  ];

  const gridCards = [
    { label: '關於我', path: '/about', icon: User },
    { label: '作品集', path: '/projects', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden
                    bg-warmCream-50 dark:bg-darkMode-bg
                    transition-colors duration-500">

      {/* Keyframes for animations */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.3; transform: scaleX(0.95); }
          50% { opacity: 0.5; transform: scaleX(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-breathe { animation: breathe 4s ease-in-out infinite; }
        .animate-float-slow { animation: float 5s ease-in-out infinite; }
      `}</style>

      {/* Corner Decorations */}
      <CornerDecoration
        position="top-left"
        className={`top-3 left-3 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />
      <CornerDecoration
        position="top-right"
        className={`top-3 right-3 transition-opacity duration-1000 delay-75 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />
      <CornerDecoration
        position="bottom-left"
        className={`bottom-3 left-3 transition-opacity duration-1000 delay-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />
      <CornerDecoration
        position="bottom-right"
        className={`bottom-3 right-3 transition-opacity duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Floating decorative lines */}
      <div className="absolute top-1/4 left-0 w-24 h-px bg-gradient-to-r from-ochre-300/40 to-transparent dark:from-darkMode-ochre/20 animate-breathe" />
      <div className="absolute top-1/3 right-0 w-20 h-px bg-gradient-to-l from-ochre-300/40 to-transparent dark:from-darkMode-ochre/20 animate-breathe" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 left-0 w-16 h-px bg-gradient-to-r from-sage-300/30 to-transparent dark:from-darkMode-sage/15 animate-breathe" style={{ animationDelay: '2s' }} />

      {/* Header */}
      <header className={`flex items-center justify-end px-6 py-4 relative z-10
                         transition-all duration-700 ease-out
                         ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5
                     rounded-full
                     bg-charcoal-900 dark:bg-warmCream-50
                     text-warmCream-50 dark:text-charcoal-900
                     font-body text-xs font-medium
                     transition-all duration-300
                     hover:scale-105"
          aria-label={mode === 'light' ? '切換至深色模式' : '切換至淺色模式'}
        >
          {mode === 'light' ? (
            <Moon className="w-3.5 h-3.5" weight="fill" />
          ) : (
            <Sun className="w-3.5 h-3.5" weight="fill" />
          )}
          <span>{mode === 'light' ? '深色' : '淺色'}</span>
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-6 py-4 relative z-10">
        <div className="w-full max-w-sm space-y-5">

          {/* Avatar Section with Editorial Frame */}
          <div className={`relative flex flex-col items-center
                          transition-all duration-1000 ease-out
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

            {/* Decorative frame around avatar area */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none">
              <svg viewBox="0 0 160 160" className="w-full h-full">
                {/* Outer decorative corners */}
                <path
                  d="M16 0 L0 0 L0 16 M144 0 L160 0 L160 16 M0 144 L0 160 L16 160 M160 144 L160 160 L144 160"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  fill="none"
                  className="text-ochre-400/40 dark:text-darkMode-ochre/30"
                />
                {/* Inner subtle circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                  className="text-ochre-300/20 dark:text-darkMode-ochre/15"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>

            {/* Interactive Avatar */}
            <button
              onClick={handleAvatarClick}
              className="relative w-28 h-28 rounded-full overflow-hidden
                         border-2 border-ochre-300/50 dark:border-darkMode-ochre/35
                         bg-warmCream-100 dark:bg-darkMode-bgElevated
                         shadow-lg transition-all duration-300
                         hover:scale-105 hover:border-ochre-400/70 dark:hover:border-darkMode-ochre/50
                         hover:shadow-xl
                         focus:outline-none focus:ring-2 focus:ring-ochre-400 focus:ring-offset-2
                         dark:focus:ring-offset-darkMode-bg
                         animate-float-slow"
              aria-label="李奕宏 Q版頭像"
            >
              <img
                src={isSmiling ? "/assets/yihung_smile_transparent.webp" : "/assets/yihung_transparent.webp"}
                alt="李奕宏 Q版頭像"
                className={`w-full h-full object-contain ${isSmiling ? 'animate-gentle-bounce' : ''}`}
              />
            </button>

            {/* Editorial name treatment */}
            <div className="mt-5 text-center space-y-2">
              {/* Small label above name */}
              <span className="inline-block font-body text-[10px] tracking-[0.25em] uppercase
                               text-ochre-500/80 dark:text-darkMode-ochre/70">
                Psychology | Technology
              </span>

              {/* Name with decorative lines */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-px bg-gradient-to-r from-transparent to-ochre-400/50 dark:to-darkMode-ochre/35" />
                <h1 className="font-display text-2xl font-bold tracking-tight
                               text-charcoal-900 dark:text-darkMode-text">
                  {PROFILE.name}
                </h1>
                <div className="w-6 h-px bg-gradient-to-l from-transparent to-ochre-400/50 dark:to-darkMode-ochre/35" />
              </div>

              {/* Title tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1
                              border border-charcoal-200/50 dark:border-darkMode-border/70
                              rounded-full">
                <div className="w-1 h-1 rounded-full bg-ochre-500 dark:bg-darkMode-ochre" />
                <span className="font-body text-xs text-charcoal-600 dark:text-darkMode-textMuted">
                  {PROFILE.title}
                </span>
              </div>
            </div>

            {/* Self introduction */}
            <p className="mt-4 font-body text-center text-sm leading-relaxed
                          text-charcoal-500 dark:text-darkMode-textMuted
                          max-w-xs px-2">
              我是奕宏，喜歡探索科技、創作音樂。在學術與助人工作中發展。
            </p>
          </div>

          {/* Social Icons */}
          <div className={`flex justify-center gap-4
                          transition-all duration-700 delay-100 ease-out
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="group relative flex items-center justify-center
                           w-11 h-11 rounded-full
                           border border-charcoal-200 dark:border-darkMode-border
                           text-charcoal-600 dark:text-darkMode-textMuted
                           transition-all duration-300
                           hover:bg-charcoal-900 dark:hover:bg-darkMode-text
                           hover:border-charcoal-900 dark:hover:border-darkMode-text
                           hover:text-warmCream-50 dark:hover:text-darkMode-bg
                           hover:scale-110 hover:shadow-lg"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" weight="regular" />
                {/* Decorative ring on hover */}
                <div className="absolute inset-0 rounded-full border border-ochre-400/0
                                group-hover:border-ochre-400/40 dark:group-hover:border-darkMode-ochre/30
                                group-hover:scale-125 transition-all duration-300 pointer-events-none" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className={`h-px bg-gradient-to-r from-transparent via-charcoal-200/60 to-transparent
                          dark:via-darkMode-border/60
                          transition-all duration-700 delay-150 ease-out
                          ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

          {/* Grid Cards - 2 columns */}
          <div className={`grid grid-cols-2 gap-3
                          transition-all duration-700 delay-150 ease-out
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {gridCards.map((card) => (
              <Link
                key={card.path}
                to={card.path}
                className="group relative flex flex-col p-4
                           bg-warmCream-100/70 dark:bg-darkMode-bgElevated/70
                           backdrop-blur-sm
                           border border-charcoal-100 dark:border-darkMode-border
                           rounded-xl
                           transition-all duration-300
                           hover:border-ochre-300/70 dark:hover:border-darkMode-ochre/40
                           hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg
                                  bg-warmCream-200/70 dark:bg-darkMode-bg/70
                                  border border-charcoal-100/50 dark:border-darkMode-border/50
                                  flex items-center justify-center
                                  transition-all duration-300
                                  group-hover:bg-ochre-100/70 dark:group-hover:bg-darkMode-ochre/10
                                  group-hover:border-ochre-200/70 dark:group-hover:border-darkMode-ochre/25">
                    <card.icon className="w-4 h-4 text-charcoal-500 dark:text-darkMode-textMuted
                                          group-hover:text-ochre-600 dark:group-hover:text-darkMode-ochre
                                          transition-colors duration-300" weight="regular" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-charcoal-300 dark:text-darkMode-textMuted
                                         transform transition-all duration-300
                                         group-hover:text-ochre-500 dark:group-hover:text-darkMode-ochre
                                         group-hover:translate-x-1" weight="bold" />
                </div>
                <span className="font-body text-sm font-medium
                                 text-charcoal-800 dark:text-darkMode-text">
                  {card.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Featured Blog Post - Editorial Card */}
          {latestPost && (
            <Link
              to={`/blog/${latestPost.id}`}
              className={`group relative block
                         transition-all duration-700 delay-200 ease-out
                         ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              {/* Editorial border frame */}
              <div className="absolute inset-0 rounded-xl border border-ochre-200/50 dark:border-darkMode-ochre/25
                              group-hover:border-ochre-400/70 dark:group-hover:border-darkMode-ochre/50
                              transition-colors duration-300" />

              {/* Inner content with offset */}
              <div className="relative m-[1px] p-4 rounded-[11px]
                              bg-gradient-to-br from-warmCream-50 to-warmCream-100/80
                              dark:from-darkMode-bg dark:to-darkMode-bgElevated/80">

                {/* Corner accent */}
                <div className="absolute top-2 right-2 w-5 h-5">
                  <svg viewBox="0 0 20 20" className="w-full h-full">
                    <path
                      d="M20 0 L20 6 M14 0 L20 0"
                      stroke="currentColor"
                      strokeWidth="0.75"
                      className="text-ochre-400/50 dark:text-darkMode-ochre/35"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-0.5 h-3 bg-ochre-500 dark:bg-darkMode-ochre rounded-full" />
                      <span className="font-body text-xs font-medium tracking-wide uppercase
                                       text-ochre-600 dark:text-darkMode-ochre">
                        最新文章
                      </span>
                    </div>
                    <p className="font-body text-sm font-medium truncate
                                  text-charcoal-800 dark:text-darkMode-text
                                  group-hover:text-charcoal-900 dark:group-hover:text-white
                                  transition-colors duration-300">
                      {latestPost.title}
                    </p>
                  </div>

                  <div className="flex-shrink-0 px-4 py-2
                                  bg-charcoal-900 dark:bg-darkMode-text
                                  text-warmCream-50 dark:text-darkMode-bg
                                  rounded-lg font-body text-xs font-medium
                                  transition-all duration-300
                                  group-hover:bg-ochre-600 dark:group-hover:bg-ochre-500
                                  group-hover:scale-105 group-hover:shadow-md">
                    閱讀
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Blog Button - Full Width */}
          <Link
            to="/blog"
            className={`group flex items-center justify-center gap-2 w-full py-3.5
                       bg-warmCream-100/70 dark:bg-darkMode-bgElevated/70
                       backdrop-blur-sm
                       border border-charcoal-100 dark:border-darkMode-border
                       rounded-xl
                       font-body text-sm font-medium
                       text-charcoal-700 dark:text-darkMode-text
                       transition-all duration-700 delay-250 ease-out
                       hover:border-charcoal-300 dark:hover:border-darkMode-textMuted
                       hover:shadow-md hover:-translate-y-0.5
                       ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Article className="w-4 h-4 group-hover:text-ochre-500 dark:group-hover:text-darkMode-ochre transition-colors" weight="regular" />
            <span>瀏覽所有文章</span>
          </Link>

          {/* Section divider */}
          <div className={`h-px bg-gradient-to-r from-transparent via-charcoal-200/60 to-transparent
                          dark:via-darkMode-border/60
                          transition-all duration-700 delay-300 ease-out
                          ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

          {/* Contact Button - Primary CTA */}
          <Link
            to="/contact#contact-form"
            className={`group flex items-center justify-center gap-2 w-full py-4
                       bg-charcoal-900 dark:bg-darkMode-text
                       rounded-xl
                       font-body text-sm font-medium
                       text-warmCream-50 dark:text-darkMode-bg
                       transition-all duration-700 delay-350 ease-out
                       hover:bg-ochre-600 dark:hover:bg-ochre-500
                       hover:shadow-xl hover:-translate-y-0.5
                       ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Envelope className="w-4 h-4" weight="regular" />
            <span>取得聯繫</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-5 text-center relative z-10
                         transition-all duration-700 delay-400 ease-out
                         ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5
                     font-body text-xs tracking-wide
                     text-charcoal-400 dark:text-darkMode-textMuted
                     hover:text-ochre-500 dark:hover:text-darkMode-ochre
                     transition-colors duration-300"
        >
          <span>瀏覽完整網站</span>
          <ArrowRight className="w-3 h-3" weight="bold" />
        </Link>
      </footer>
    </div>
  );
};

export default LinksPage;
