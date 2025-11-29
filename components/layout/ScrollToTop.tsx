import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 當路由改變時，自動滾動到頁面頂端
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 滾動到頁面頂端
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // 使用 instant 以獲得即時效果
    });
  }, [pathname]);

  return null;
};
