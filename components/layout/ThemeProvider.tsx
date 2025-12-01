import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemeMode, PageType } from '../../types';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从 localStorage 读取初始主题，默认 'light'
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode');
      return (saved === 'dark' || saved === 'light') ? saved : 'light';
    }
    return 'light';
  });

  const pageType: PageType = 'professional';

  // 应用主题到 document.documentElement
  useEffect(() => {
    const root = document.documentElement;

    // 添加过渡类
    root.classList.add('theme-transitioning');

    // 切换 dark class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 保存到 localStorage
    localStorage.setItem('theme-mode', mode);

    // 400ms 后移除过渡类
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 400);

    return () => clearTimeout(timer);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, pageType, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
