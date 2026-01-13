import React, { useEffect, useRef } from 'react';

const EmailOctopusForm: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 載入 Email Octopus 表單 script
    const script = document.createElement('script');
    script.src = 'https://eomail5.com/form/d7f37e16-efd6-11f0-b180-6f840b8f1b1b.js';
    script.async = true;
    script.setAttribute('data-form', 'd7f37e16-efd6-11f0-b180-6f840b8f1b1b');

    // 將 script 添加到容器中
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // 清理函數
    return () => {
      if (containerRef.current && script.parentNode === containerRef.current) {
        containerRef.current.removeChild(script);
      }
    };
  }, []);

  return <div ref={containerRef} className="email-octopus-form-container" />;
};

export default EmailOctopusForm;
