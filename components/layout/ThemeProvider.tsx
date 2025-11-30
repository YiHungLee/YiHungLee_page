import React from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemeMode, PageType } from '../../types';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const mode: ThemeMode = 'light';
  const pageType: PageType = 'professional';
  const setMode = () => {}; // 保留相容性的空函數

  return (
    <ThemeContext.Provider value={{ mode, pageType, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
