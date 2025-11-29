import React from 'react';
import { Link } from 'react-router-dom';
import { PROFILE } from '../../constants';

const ContactPage: React.FC = () => {
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
                Contact
              </p>
            </div>

            {/* Main Title */}
            <div className="opacity-0 animate-fade-in-up stagger-1">
              <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold
                             text-charcoal-900 dark:text-warmCream-50
                             tracking-tight leading-none optical-align">
                聯絡
              </h1>

              <div className="h-px w-24 md:w-32 bg-ochre-500 dark:bg-ochre-400 mt-8"></div>
            </div>

            {/* Description */}
            <div className="opacity-0 animate-fade-in-up stagger-2">
              <p className="font-body text-lg md:text-xl lg:text-2xl
                            text-charcoal-700 dark:text-warmCream-300
                            leading-relaxed max-w-3xl">
                期待與您開啟對話<br className="hidden md:block" />
                無論是專業合作、諮詢服務，或是單純的想法交流
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="relative py-32 md:py-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          <div className="grid md:grid-cols-2 gap-16 md:gap-24">

            {/* Left: Contact Details */}
            <div className="space-y-12 opacity-0 animate-fade-in-up stagger-3">

              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold
                               text-charcoal-900 dark:text-warmCream-50
                               tracking-tight mb-8">
                  聯絡方式
                </h2>
                <div className="h-px w-16 bg-ochre-500 dark:bg-ochre-400"></div>
              </div>

              {/* Email */}
              <div className="space-y-4">
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 dark:text-warmCream-400">
                  Email
                </p>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="group inline-block">
                  <p className="font-display text-2xl md:text-3xl font-semibold
                                text-charcoal-900 dark:text-warmCream-50
                                transition-colors duration-300
                                group-hover:text-ochre-500 dark:group-hover:text-ochre-400">
                    {PROFILE.email}
                  </p>
                  <div className="h-px w-0 bg-ochre-500 dark:bg-ochre-400
                                  transition-all duration-500 ease-out-expo
                                  group-hover:w-full mt-2"></div>
                </a>
              </div>

              {/* Current Position */}
              <div className="space-y-4 pt-8">
                <p className="font-body text-xs tracking-widest uppercase
                              text-charcoal-600 dark:text-warmCream-400">
                  目前服務單位
                </p>
                <p className="font-body text-lg
                              text-charcoal-700 dark:text-warmCream-300
                              leading-relaxed">
                  {PROFILE.currentRole}
                </p>
                <p className="font-body text-base
                              text-charcoal-600 dark:text-warmCream-400">
                  {PROFILE.school}
                </p>
              </div>
            </div>

            {/* Right: Quick Links */}
            <div className="space-y-12 opacity-0 animate-fade-in-up stagger-4">

              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold
                               text-charcoal-900 dark:text-warmCream-50
                               tracking-tight mb-8">
                  探索更多
                </h2>
                <div className="h-px w-16 bg-ochre-500 dark:bg-ochre-400"></div>
              </div>

              <div className="space-y-1 bg-border-light dark:bg-border-dark">

                <Link
                  to="/about"
                  className="group block bg-warmCream-100 dark:bg-charcoal-900
                             p-8
                             transition-all duration-500 ease-out-expo
                             hover:bg-warmCream-200 dark:hover:bg-charcoal-800">
                  <div className="space-y-3">
                    <h3 className="font-display text-2xl md:text-3xl font-bold
                                   text-charcoal-900 dark:text-warmCream-50
                                   transition-colors duration-500
                                   group-hover:text-ochre-500 dark:group-hover:text-ochre-400">
                      關於我
                    </h3>
                    <p className="font-body text-sm
                                  text-charcoal-600 dark:text-warmCream-400">
                      了解我的專業背景與訓練經歷
                    </p>
                    <div className="h-px w-0 bg-ochre-500 dark:bg-ochre-400
                                    transition-all duration-500 ease-out-expo
                                    group-hover:w-full"></div>
                  </div>
                </Link>

                <Link
                  to="/projects"
                  className="group block bg-warmCream-100 dark:bg-charcoal-900
                             p-8
                             transition-all duration-500 ease-out-expo
                             hover:bg-warmCream-200 dark:hover:bg-charcoal-800">
                  <div className="space-y-3">
                    <h3 className="font-display text-2xl md:text-3xl font-bold
                                   text-charcoal-900 dark:text-warmCream-50
                                   transition-colors duration-500
                                   group-hover:text-ochre-500 dark:group-hover:text-ochre-400">
                      作品集
                    </h3>
                    <p className="font-body text-sm
                                  text-charcoal-600 dark:text-warmCream-400">
                      我的研究、開發與創作成果
                    </p>
                    <div className="h-px w-0 bg-ochre-500 dark:bg-ochre-400
                                    transition-all duration-500 ease-out-expo
                                    group-hover:w-full"></div>
                  </div>
                </Link>

                <Link
                  to="/blog"
                  className="group block bg-warmCream-100 dark:bg-charcoal-900
                             p-8
                             transition-all duration-500 ease-out-expo
                             hover:bg-warmCream-200 dark:hover:bg-charcoal-800">
                  <div className="space-y-3">
                    <h3 className="font-display text-2xl md:text-3xl font-bold
                                   text-charcoal-900 dark:text-warmCream-50
                                   transition-colors duration-500
                                   group-hover:text-ochre-500 dark:group-hover:text-ochre-400">
                      文章
                    </h3>
                    <p className="font-body text-sm
                                  text-charcoal-600 dark:text-warmCream-400">
                      一同分享專業與探索創意
                    </p>
                    <div className="h-px w-0 bg-ochre-500 dark:bg-ochre-400
                                    transition-all duration-500 ease-out-expo
                                    group-hover:w-full"></div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default ContactPage;
