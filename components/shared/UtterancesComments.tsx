import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../layout/ThemeContext';

interface UtterancesCommentsProps {
  repo?: string;
  issueTerm?: 'pathname' | 'url' | 'title' | 'og:title';
  label?: string;
}

const UTTERANCES_THEMES = {
  light: 'github-light',
  dark: 'github-dark',
} as const;

const UtterancesComments: React.FC<UtterancesCommentsProps> = ({
  repo = 'YiHungLee/YiHungLee_page',
  issueTerm = 'pathname',
  label = 'blog-comment',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mode } = useTheme();
  const location = useLocation();

  // 儲存當前頁面路徑，以便 OAuth 回調後能返回
  useEffect(() => {
    sessionStorage.setItem('utterances-return-path', location.pathname);
  }, [location.pathname]);

  // 當路徑變化時重新載入 Utterances
  useEffect(() => {
    if (!containerRef.current) return;

    // 清除現有內容
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', repo);
    script.setAttribute('issue-term', issueTerm);
    script.setAttribute('label', label);
    script.setAttribute('theme', UTTERANCES_THEMES[mode]);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    containerRef.current.appendChild(script);
  }, [repo, issueTerm, label, location.pathname]); // 加入 location.pathname 作為依賴

  // Update theme via postMessage when mode changes (without reloading)
  useEffect(() => {
    const frame = document.querySelector<HTMLIFrameElement>('.utterances-frame');
    if (frame?.contentWindow) {
      frame.contentWindow.postMessage(
        { type: 'set-theme', theme: UTTERANCES_THEMES[mode] },
        'https://utteranc.es'
      );
    }
  }, [mode]);

  return (
    <div
      ref={containerRef}
      className="utterances-container min-h-[250px]"
    />
  );
};

export default UtterancesComments;
