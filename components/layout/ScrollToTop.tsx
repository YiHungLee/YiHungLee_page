import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 當路由改變時，自動滾動到頁面頂端
 * 如果有 hash，則滾動到對應的元素
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // 有 hash 時，等待 DOM 渲染完成後滾動到對應元素
      const scrollToHash = () => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      // 延遲執行以確保目標元素已渲染
      const timer = setTimeout(scrollToHash, 100);
      return () => clearTimeout(timer);
    } else {
      // 沒有 hash 時，滾動到頁面頂端
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname, hash]);

  return null;
};
