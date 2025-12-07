import React, { useState } from 'react';

interface InteractiveAvatarProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  size = 'medium',
  className = ''
}) => {
  const [isSmiling, setIsSmiling] = useState(false);

  const sizeClasses = {
    small: 'w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48',
    medium: 'w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56',
    large: 'w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64'
  };

  const handleClick = () => {
    if (isSmiling) return; // 防止重複點擊

    setIsSmiling(true);
    setTimeout(() => {
      setIsSmiling(false);
    }, 2000); // 2秒後恢復原始頭像
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} rounded-full overflow-hidden
                  border-4 border-warmCream-200 dark:border-darkMode-border
                  bg-warmCream-50 dark:bg-charcoal-600
                  shadow-xl transition-all duration-500
                  hover:scale-105 cursor-pointer ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="李奕宏 Q版頭像"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <img
        src={isSmiling ? "/assets/yihung_smile_transparent.webp" : "/assets/yihung_transparent.webp"}
        alt="李奕宏 Q版頭像"
        className={`w-full h-full object-contain transition-opacity duration-300
                   ${isSmiling ? 'animate-gentle-bounce' : ''}`}
      />
    </div>
  );
};

export default InteractiveAvatar;
