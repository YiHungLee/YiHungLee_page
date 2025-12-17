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
  const utterancesLoaded = useRef(false);
  const { mode } = useTheme();
  const location = useLocation();

  // 儲存當前頁面路徑，以便 OAuth 回調後能返回
  useEffect(() => {
    sessionStorage.setItem('utterances-return-path', location.pathname);
  }, [location.pathname]);

  // Initial load - only once
  useEffect(() => {
    if (!containerRef.current || utterancesLoaded.current) return;

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', repo);
    script.setAttribute('issue-term', issueTerm);
    script.setAttribute('label', label);
    script.setAttribute('theme', UTTERANCES_THEMES[mode]);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    containerRef.current.appendChild(script);
    utterancesLoaded.current = true;
  }, [repo, issueTerm, label]); // mode not included - only load once

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
