import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { ThemeMode, PageType } from '../../types';

// 路由主題映射表
const ROUTE_THEME_MAP: Record<string, ThemeMode> = {
  '/': 'light',
  '/about': 'light',
  '/contact': 'light',
  '/blog': 'light',
  '/projects': 'light',
  '/projects/academic': 'light',
  '/projects/coding': 'dark',
  '/projects/music': 'dark',
};

// 根據路由路徑判斷主題
function getThemeByPath(pathname: string): ThemeMode {
  // 精確匹配
  if (ROUTE_THEME_MAP[pathname]) {
    return ROUTE_THEME_MAP[pathname];
  }

  // 模糊匹配（用於 /blog/:postId）
  if (pathname.startsWith('/blog')) return 'light';
  if (pathname.startsWith('/projects/coding')) return 'dark';
  if (pathname.startsWith('/projects/music')) return 'dark';

  // 默認淺色
  return 'light';
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const location = useLocation();
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const newMode = getThemeByPath(location.pathname);

    if (newMode !== mode) {
      // 添加過渡動畫 class
      document.documentElement.classList.add('theme-transitioning');
      setMode(newMode);

      // 500ms 後移除過渡 class
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 500);
    }
  }, [location.pathname, mode]);

  useEffect(() => {
    // 更新 HTML class
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const pageType: PageType = mode === 'dark' ? 'creative' : 'professional';

  return (
    <ThemeContext.Provider value={{ mode, pageType, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
