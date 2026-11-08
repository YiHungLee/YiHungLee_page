import React from 'react';

// 小賽（Psi）：接近正方形的像素方塊身體＋Ψ 天線，眼睛是挖空的格子
// '#' = 身體色、'*' = 點綴色（天線頂端）、'.' = 空白（含眼睛）
const ANTENNA = [
  '....*.*.*....',
  '....#####....',
  '......#......',
];
const BODY = [
  '.###########.',
  '#############',
  '#############',
  '###..###..###',
  '###..###..###',
  '#############',
  '#############',
  '.###########.',
];
const LEGS = ['..##.....##..'];

const WIDTH = BODY[0].length;
const HEIGHT = ANTENNA.length + BODY.length + LEGS.length;
// 眼睛位置（眨眼時用身體色蓋住大半格）
const EYE_ROW = ANTENNA.length + 3;
const EYE_COLS = [3, 8];

function toRects(rows: string[], rowOffset: number, char: string, className?: string) {
  const rects: React.ReactElement[] = [];
  rows.forEach((row, r) => {
    // 同一列連續的格子合併成一個 rect，減少節點數
    let start = -1;
    for (let c = 0; c <= row.length; c++) {
      const on = row[c] === char;
      if (on && start < 0) start = c;
      if (!on && start >= 0) {
        rects.push(
          <rect
            key={`${char}-${r + rowOffset}-${start}`}
            x={start}
            y={r + rowOffset}
            width={c - start}
            height={1}
            className={className}
          />
        );
        start = -1;
      }
    }
  });
  return rects;
}

interface PsiBotProps {
  /** 寬度（px），高度依比例計算 */
  size?: number;
  /** 是否播放晃動、眨眼、天線閃爍 */
  animated?: boolean;
  className?: string;
  /** 純裝飾時設為 true，螢幕閱讀器會略過 */
  decorative?: boolean;
}

export const PsiBot: React.FC<PsiBotProps> = ({
  size = 48,
  animated = true,
  className = '',
  decorative = false,
}) => {
  const height = (size * HEIGHT) / WIDTH;

  return (
    <svg
      width={size}
      height={height}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      shapeRendering="crispEdges"
      fill="currentColor"
      className={`psi-bot inline-block shrink-0 overflow-visible
                  text-sage-500 dark:text-darkMode-sage
                  ${animated ? 'psi-bot-animated' : ''} ${className}`}
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': 'AI 小編小賽' })}
    >
      <g className="psi-bot-body">
        {toRects(ANTENNA, 0, '#')}
        {toRects(ANTENNA, 0, '*', 'psi-bot-antenna fill-ochre-500 dark:fill-darkMode-ochre')}
        {toRects(BODY, ANTENNA.length, '#')}
        {EYE_COLS.map((x) => (
          <rect
            key={`lid-${x}`}
            x={x}
            y={EYE_ROW}
            width={2}
            height={1.6}
            className="psi-bot-eyelid"
          />
        ))}
      </g>
      {toRects(LEGS, ANTENNA.length + BODY.length, '#')}
    </svg>
  );
};

export default PsiBot;
