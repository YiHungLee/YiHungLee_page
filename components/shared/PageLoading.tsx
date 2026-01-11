import React from 'react';

export const PageLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-warmCream-50 dark:bg-darkMode-bg
                    transition-colors duration-500">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-ochre-500 dark:border-darkMode-ochre
                        border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-body text-sm text-charcoal-600 dark:text-darkMode-textMuted">
          載入中...
        </p>
      </div>
    </div>
  );
};
