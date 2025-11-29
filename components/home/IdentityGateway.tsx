import React from 'react';
import { Link } from 'react-router-dom';

export const IdentityGateway: React.FC = () => {
  const identities = [
    {
      id: 'professional',
      title: '專業',
      subtitle: 'Professional',
      tagline: '在陪伴中看見韌性，\n在對話中探索可能',
      description: '心理諮商實務、學術研究探索、專業訓練歷程',
      path: '/about',
    },
    {
      id: 'creative',
      title: '創意',
      subtitle: 'Creative',
      tagline: '在音樂與科技之間，\n敘說故事表達自我',
      description: '音樂創作、程式開發、跨領域探索',
      path: '/projects',
    },
  ];

  return (
    <section
      id="identity"
      className="relative py-32 md:py-40
                 bg-warmCream-50 dark:bg-charcoal-950
                 transition-colors duration-500 subtle-texture"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header - Centered */}
        <div className="text-center mb-20 md:mb-32">
          <div className="space-y-6">
            <p className="font-body text-xs tracking-widest uppercase
                          text-charcoal-600 dark:text-warmCream-400">
              多面向
            </p>

            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold
                           text-charcoal-900 dark:text-warmCream-50
                           tracking-tight">
              在專業與創意之間
            </h2>

            <div className="flex justify-center">
              <div className="h-px w-24 bg-ochre-500 dark:bg-ochre-400"></div>
            </div>

            <p className="font-body text-lg md:text-xl
                          text-charcoal-600 dark:text-warmCream-400
                          max-w-2xl mx-auto leading-relaxed">
              我的投入與熱情。<br />
              在專業領域和興趣之間，探索世界的廣與深。
            </p>
          </div>
        </div>

        {/* Identity Cards - Split Layout */}
        <div className="grid md:grid-cols-2 gap-px bg-border-light dark:bg-border-dark">
          {identities.map((identity, index) => (
            <Link
              key={identity.id}
              to={identity.path}
              className="group relative bg-warmCream-100 dark:bg-charcoal-900
                         transition-all duration-500 ease-out-expo
                         hover:bg-warmCream-50 dark:hover:bg-charcoal-800
                         opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Content */}
              <div className="p-12 md:p-16 lg:p-20 min-h-[500px] md:min-h-[600px]
                              flex flex-col justify-between">

                {/* Top Section */}
                <div className="space-y-8">
                  {/* Number Indicator */}
                  <div className="font-body text-xs tracking-widest uppercase
                                  text-charcoal-600 dark:text-warmCream-400">
                    0{index + 1}
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <h3 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold
                                   text-charcoal-900 dark:text-warmCream-50
                                   tracking-tighter optical-align
                                   transition-all duration-500
                                   group-hover:text-ochre-500 dark:group-hover:text-ochre-400">
                      {identity.title}
                    </h3>
                    <p className="font-accent italic text-2xl md:text-3xl
                                  text-charcoal-600 dark:text-warmCream-300">
                      {identity.subtitle}
                    </p>
                  </div>

                  {/* Tagline */}
                  <div className="pt-8 border-t border-fine border-border-light dark:border-border-dark">
                    <p className="font-display text-2xl md:text-3xl
                                  text-charcoal-800 dark:text-warmCream-200
                                  leading-relaxed whitespace-pre-line">
                      {identity.tagline}
                    </p>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="space-y-6">
                  {/* Description */}
                  <p className="font-body text-base
                                text-charcoal-600 dark:text-warmCream-400
                                leading-relaxed">
                    {identity.description}
                  </p>

                  {/* Call to Action */}
                  <div className="flex items-center gap-3
                                  font-body text-sm tracking-wide uppercase
                                  text-ochre-500 dark:text-ochre-400
                                  transition-all duration-400
                                  group-hover:gap-5">
                    <span className="editorial-underline">探索更多</span>
                    <div className="h-px w-8 bg-ochre-500 dark:bg-ochre-400
                                    transition-all duration-400
                                    group-hover:w-16"></div>
                  </div>
                </div>
              </div>

              {/* Hover Effect - Subtle Border Highlight */}
              <div className="absolute inset-0 border border-fine border-transparent
                              group-hover:border-ochre-500 dark:group-hover:border-ochre-400
                              transition-colors duration-500 pointer-events-none"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
