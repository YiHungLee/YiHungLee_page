import React from 'react';
import { useTheme } from './layout/ThemeContext';

export const PowerSwitchToggle: React.FC = () => {
  const { mode, setMode } = useTheme();
  const isDark = mode === 'dark';

  const handleToggle = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  return (
    <div className="power-switch-wrapper">
      <div className="power-switch">
        <input
          type="checkbox"
          checked={isDark}
          onChange={handleToggle}
          aria-label="Toggle dark mode"
        />
        <div className="button">
          <svg className="power-off" viewBox="0 0 150 150">
            <use xlinkHref="#power-line" className="line" />
            <use xlinkHref="#power-circle" className="circle" />
          </svg>
          <svg className="power-on" viewBox="0 0 150 150">
            <use xlinkHref="#power-line" className="line" />
            <use xlinkHref="#power-circle" className="circle" />
          </svg>
        </div>
      </div>

      {/* SVG Symbol Definitions - Hidden */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" id="power-line">
          <line x1="75" y1="34" x2="75" y2="58" />
        </symbol>
        <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" id="power-circle">
          <circle cx="75" cy="80" r="35" />
        </symbol>
      </svg>

      <style>{`
        .power-switch-wrapper {
          --switch-size: 40px;
        }

        .power-switch {
          --color-invert: currentColor;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: var(--switch-size);
          height: var(--switch-size);
        }

        .power-switch .button {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .power-switch .button::after {
          content: "";
          width: 100%;
          height: 100%;
          position: absolute;
          background: radial-gradient(circle closest-side, var(--color-invert), transparent);
          filter: blur(8px);
          opacity: 0;
          transition: opacity 1s ease, transform 1s ease;
          transform: perspective(1px) translateZ(0);
          backface-visibility: hidden;
        }

        .power-switch .power-on,
        .power-switch .power-off {
          height: 100%;
          width: 100%;
          position: absolute;
          z-index: 1;
          fill: none;
          stroke: var(--color-invert);
          stroke-width: 8px;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .power-switch .power-on .line,
        .power-switch .power-off .line {
          opacity: 0.2;
        }

        .power-switch .power-on .circle,
        .power-switch .power-off .circle {
          opacity: 0.2;
          transform: rotate(-58deg);
          transform-origin: center 80px;
          stroke-dasharray: 220;
          stroke-dashoffset: 40;
        }

        .power-switch .power-on {
          filter: drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.6));
        }

        .power-switch .power-on .line {
          opacity: 0;
          transition: opacity 0.3s ease 1s;
        }

        .power-switch .power-on .circle {
          opacity: 1;
          stroke-dashoffset: 220;
          transition: transform 0s ease, stroke-dashoffset 1s ease 0s;
        }

        .power-switch input {
          position: absolute;
          height: 100%;
          width: 100%;
          z-index: 2;
          cursor: pointer;
          opacity: 0;
        }

        .power-switch input:checked + .button::after {
          opacity: 0.15;
          transform: scale(2) perspective(1px) translateZ(0);
          backface-visibility: hidden;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .power-switch input:checked + .button .power-on,
        .power-switch input:checked + .button .power-off {
          animation: click-animation 0.3s ease forwards;
          transform: scale(1);
        }

        .power-switch input:checked + .button .power-on .line,
        .power-switch input:checked + .button .power-off .line {
          animation: line-animation 0.8s ease-in forwards;
        }

        .power-switch input:checked + .button .power-on .circle,
        .power-switch input:checked + .button .power-off .circle {
          transform: rotate(302deg);
        }

        .power-switch input:checked + .button .power-on .line {
          opacity: 1;
          transition: opacity 0.05s ease-in 0.55s;
        }

        .power-switch input:checked + .button .power-on .circle {
          transform: rotate(302deg);
          stroke-dashoffset: 40;
          transition: transform 0.4s ease 0.2s, stroke-dashoffset 0.4s ease 0.2s;
        }

        @keyframes line-animation {
          0% { transform: translateY(0); }
          10% { transform: translateY(4px); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-10px); }
          85% { transform: translateY(4px); }
          100% { transform: translateY(0px); }
        }

        @keyframes click-animation {
          0% { transform: scale(1); }
          50% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
