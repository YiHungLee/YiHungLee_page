import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * 處理 Utterances OAuth 回調
 * 當用戶從 GitHub OAuth 登入後返回首頁時，
 * 此元件會將 utterances 參數重新導向到原本的文章頁面
 */
export const UtterancesCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const utterancesToken = params.get('utterances');

    if (utterancesToken && location.pathname === '/') {
      // 從 localStorage 取得之前訪問的文章頁面
      const lastBlogPath = sessionStorage.getItem('utterances-return-path');

      if (lastBlogPath) {
        // 帶著 utterances 參數導向回原本的文章
        navigate(`${lastBlogPath}?utterances=${utterancesToken}`, { replace: true });
        sessionStorage.removeItem('utterances-return-path');
      }
    }
  }, [location, navigate]);

  return null;
};
