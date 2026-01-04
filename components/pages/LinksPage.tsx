import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Envelope, LinkedinLogo, Sun, Moon, User, Briefcase, ArrowRight, Article } from '@phosphor-icons/react';
import { useTheme } from '../layout/ThemeContext';
import { getLatestPosts } from '../../utils/featured';
import { PROFILE } from '../../constants';

const LinksPage: React.FC = () => {
  const { mode, setMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);

  // Get dynamic content
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

  // Social links
  const socialLinks = [
    {
      label: 'Email',
      href: `mailto:${PROFILE.email}`,
      icon: Envelope,
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/yi-hung-lee',
      icon: LinkedinLogo,
    },
  ];

  // Grid cards (2 columns)
  const gridCards = [
    {
      label: '關於我',
      path: '/about',
      icon: User,
    },
    {
      label: '作品集',
      path: '/projects',
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col
                    bg-warmCream-50 dark:bg-darkMode-bg
                    transition-colors duration-500">

      {/* Header */}
      <header className={`flex items-center justify-end px-6 py-4
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
      <main className="flex-1 flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-sm space-y-6">

          {/* Avatar Section */}
          <div className={`flex flex-col items-center space-y-3
                          transition-all duration-700 ease-out
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

            {/* Interactive Avatar */}
            <button
              onClick={handleAvatarClick}
              className="relative w-24 h-24 rounded-full overflow-hidden
                         border-4 border-ochre-200/50 dark:border-darkMode-ochre/30
                         bg-warmCream-100 dark:bg-darkMode-bgElevated
                         shadow-lg transition-all duration-300
                         hover:scale-105 hover:border-ochre-300 dark:hover:border-darkMode-ochre/50
                         focus:outline-none focus:ring-2 focus:ring-ochre-400 focus:ring-offset-2
                         dark:focus:ring-offset-darkMode-bg"
              aria-label="李奕宏 Q版頭像"
            >
              <img
                src={isSmiling ? "/assets/yihung_smile_transparent.webp" : "/assets/yihung_transparent.webp"}
                alt="李奕宏 Q版頭像"
                className={`w-full h-full object-contain
                           ${isSmiling ? 'animate-gentle-bounce' : ''}`}
              />
            </button>

            {/* Name */}
            <h1 className="font-display text-2xl font-bold tracking-tight
                           text-charcoal-900 dark:text-darkMode-text">
              {PROFILE.name}
            </h1>

            {/* Short bio */}
            <p className="font-body text-center text-sm leading-relaxed
                          text-charcoal-500 dark:text-darkMode-textMuted
                          max-w-xs">
              {PROFILE.philosophy}
            </p>
          </div>

          {/* Social Icons */}
          <div className={`flex justify-center gap-3
                          transition-all duration-700 delay-100 ease-out
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="flex items-center justify-center
                           w-10 h-10 rounded-full
                           border border-charcoal-200 dark:border-darkMode-border
                           text-charcoal-600 dark:text-darkMode-textMuted
                           transition-all duration-200
                           hover:bg-charcoal-900 dark:hover:bg-darkMode-text
                           hover:border-charcoal-900 dark:hover:border-darkMode-text
                           hover:text-warmCream-50 dark:hover:text-darkMode-bg
                           hover:scale-110"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" weight="regular" />
              </a>
            ))}
          </div>

          {/* Grid Cards - 2 columns */}
          <div className={`grid grid-cols-2 gap-3
                          transition-all duration-700 delay-150 ease-out
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {gridCards.map((card, index) => (
              <Link
                key={card.path}
                to={card.path}
                className="group relative flex flex-col p-4
                           bg-warmCream-100 dark:bg-darkMode-bgElevated
                           border border-charcoal-100 dark:border-darkMode-border
                           rounded-xl
                           transition-all duration-200
                           hover:border-charcoal-300 dark:hover:border-darkMode-textMuted
                           hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Icon and Arrow row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg
                                  bg-warmCream-200 dark:bg-darkMode-bg
                                  flex items-center justify-center">
                    <card.icon className="w-4 h-4 text-charcoal-600 dark:text-darkMode-textMuted" weight="regular" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-charcoal-400 dark:text-darkMode-textMuted
                                         transform transition-transform duration-200
                                         group-hover:translate-x-0.5" weight="bold" />
                </div>

                {/* Label */}
                <span className="font-body text-sm font-medium
                                 text-charcoal-800 dark:text-darkMode-text">
                  {card.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Featured Blog Post - Highlighted Card */}
          {latestPost && (
            <Link
              to={`/blog/${latestPost.id}`}
              className={`group relative block p-4
                         bg-warmCream-100 dark:bg-darkMode-bgElevated
                         border border-charcoal-100 dark:border-darkMode-border
                         rounded-xl
                         transition-all duration-700 delay-200 ease-out
                         hover:border-charcoal-300 dark:hover:border-darkMode-textMuted
                         hover:shadow-md hover:-translate-y-0.5
                         ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <span className="font-body text-xs font-medium tracking-wide
                                   text-ochre-600 dark:text-darkMode-ochre mb-1 block">
                    最新文章
                  </span>
                  <p className="font-body text-sm font-medium truncate
                                text-charcoal-800 dark:text-darkMode-text">
                    {latestPost.title}
                  </p>
                </div>

                <div className="flex-shrink-0 px-4 py-2
                                bg-charcoal-900 dark:bg-darkMode-text
                                text-warmCream-50 dark:text-darkMode-bg
                                rounded-lg font-body text-xs font-medium
                                transition-transform duration-200
                                group-hover:scale-105">
                  閱讀
                </div>
              </div>
            </Link>
          )}

          {/* Blog Button - Full Width */}
          <Link
            to="/blog"
            className={`group flex items-center justify-center gap-2 w-full py-3.5
                       bg-warmCream-100 dark:bg-darkMode-bgElevated
                       border border-charcoal-100 dark:border-darkMode-border
                       rounded-xl
                       font-body text-sm font-medium
                       text-charcoal-700 dark:text-darkMode-text
                       transition-all duration-700 delay-250 ease-out
                       hover:border-charcoal-300 dark:hover:border-darkMode-textMuted
                       hover:shadow-md hover:-translate-y-0.5
                       ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Article className="w-4 h-4" weight="regular" />
            <span>瀏覽所有文章</span>
          </Link>

          {/* Divider with label */}
          <div className={`flex items-center gap-3
                          transition-all duration-700 delay-300 ease-out
                          ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex-1 h-px bg-charcoal-200 dark:bg-darkMode-border" />
            <span className="font-body text-xs tracking-widest uppercase
                             text-charcoal-400 dark:text-darkMode-textMuted">
              聯繫
            </span>
            <div className="flex-1 h-px bg-charcoal-200 dark:bg-darkMode-border" />
          </div>

          {/* Contact Button - Primary CTA */}
          <Link
            to="/contact#contact-form"
            className={`group flex items-center justify-center gap-2 w-full py-4
                       bg-charcoal-900 dark:bg-darkMode-text
                       rounded-xl
                       font-body text-sm font-medium
                       text-warmCream-50 dark:text-darkMode-bg
                       transition-all duration-700 delay-350 ease-out
                       hover:bg-charcoal-800 dark:hover:bg-warmCream-200
                       hover:shadow-lg hover:-translate-y-0.5
                       ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Envelope className="w-4 h-4" weight="regular" />
            <span>取得聯繫</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-6 text-center
                         transition-all duration-700 delay-400 ease-out
                         ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5
                     font-body text-xs tracking-wide
                     text-charcoal-400 dark:text-darkMode-textMuted
                     hover:text-charcoal-600 dark:hover:text-darkMode-text
                     transition-colors duration-200"
        >
          <span>瀏覽完整網站</span>
          <ArrowRight className="w-3 h-3" weight="bold" />
        </Link>
      </footer>
    </div>
  );
};

export default LinksPage;
