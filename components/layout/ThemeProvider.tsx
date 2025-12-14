import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemeMode, PageType } from '../../types';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// 取得系統主題偏好
const getSystemTheme = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// 取得初始主題
const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    // 檢查使用者是否手動設定過主題
    const hasManuallySet = localStorage.getItem('theme-manually-set') === 'true';
    const savedTheme = localStorage.getItem('theme-mode');

    if (hasManuallySet && (savedTheme === 'dark' || savedTheme === 'light')) {
      // 使用者手動設定過，使用儲存的主題
      return savedTheme;
    }
    // 否則跟隨系統主題
    return getSystemTheme();
  }
  return 'light';
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);

  const pageType: PageType = 'professional';

  // 包裝 setMode，標記使用者手動更改
  const handleSetMode = (newMode: ThemeMode) => {
    localStorage.setItem('theme-manually-set', 'true');
    setMode(newMode);
  };

  // 監聽系統主題變化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // 只有當使用者沒有手動設定過主題時，才跟隨系統
      const hasManuallySet = localStorage.getItem('theme-manually-set') === 'true';
      if (!hasManuallySet) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // 應用主題到 document.documentElement
  useEffect(() => {
    const root = document.documentElement;

    // 添加過渡類
    root.classList.add('theme-transitioning');

    // 切換 dark class
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 儲存到 localStorage
    localStorage.setItem('theme-mode', mode);

    // 400ms 後移除過渡類
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 400);

    return () => clearTimeout(timer);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, pageType, setMode: handleSetMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
