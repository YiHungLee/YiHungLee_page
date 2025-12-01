import React from 'react';

const TransitionSection: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center
                        bg-warmCream-50 dark:bg-darkMode-bgElevated
                        px-6 transition-colors duration-500">
      <h2 className="font-display text-6xl md:text-7xl lg:text-8xl
                     font-bold text-charcoal-900 dark:text-darkMode-text
                     tracking-tight text-center mb-8 optical-align">
        取得聯繫
      </h2>
      <p className="font-body text-lg md:text-xl
                    text-charcoal-600 dark:text-darkMode-textMuted
                    text-center max-w-2xl leading-relaxed">
        演講邀約｜課程邀請｜找我家教
      </p>
    </section>
  );
};

export default TransitionSection;
