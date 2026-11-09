import React from 'react';
import { PSI_MOOD_LABELS, type PsiMood } from '../../utils/blogCategories';
import {
  PSI_ACTION_SPRITES,
  PSI_MOOD_SPRITES,
  type PsiAction,
  type PsiSprite,
} from './psiSprites';

// 小賽（Psi）：13 × 12 格的像素方塊身體＋Ψ 天線，眼睛是挖空的格子。
// SVG 的框只包住身體；表情符號、揮手、跳躍會超出框外（overflow: visible），
// 所以換表情、換動作時版面不會跳動。
const WIDTH = 13;
const HEIGHT = 12;
// 眼睛上半格的位置（預設表情眨眼時用身體色蓋住）
const EYE_ROW = 6;
const EYE_COLS = [3, 8];

// 每種字元的顏色；'#' 沒有 class，沿用 SVG 的 currentColor
const PIXEL_CLASSES: Record<string, string | undefined> = {
  '*': 'fill-ochre-500 dark:fill-darkMode-ochre',
  o: 'fill-psi-lampOff dark:fill-darkMode-psiLampOff',
  '=': 'fill-psi-tool dark:fill-darkMode-psiTool',
  _: 'fill-psi-ink dark:fill-darkMode-psiInk',
  b: 'fill-psi-blush dark:fill-darkMode-psiBlush',
  t: 'fill-psi-tear dark:fill-darkMode-psiTear',
  p: 'fill-psi-paper dark:fill-darkMode-psiPaper',
};

// 像素圖是固定的，轉好的 rect 存起來重複用
const rectCache = new WeakMap<PsiSprite, React.ReactElement[]>();

function spriteRects(sprite: PsiSprite): React.ReactElement[] {
  const cached = rectCache.get(sprite);
  if (cached) return cached;

  const rects: React.ReactElement[] = [];
  sprite.rows.forEach((row, r) => {
    // 同一列連續、同色的格子合併成一個 rect，減少節點數
    let start = -1;
    for (let c = 0; c <= row.length; c++) {
      const char = row[c];
      if (start >= 0 && char !== row[start]) {
        const x = start + sprite.x;
        const y = r + sprite.y;
        rects.push(
          <rect
            key={`${x},${y}`}
            x={x}
            y={y}
            width={c - start}
            height={1}
            className={PIXEL_CLASSES[row[start]]}
          />
        );
        start = -1;
      }
      if (start < 0 && char !== undefined && char !== '.') start = c;
    }
  });
  rectCache.set(sprite, rects);
  return rects;
}

interface PsiBotProps {
  /** 寬度（px），高度依比例計算；用 13 的整數倍邊緣最清楚 */
  size?: number;
  /** 表情，預設為「預設」 */
  mood?: PsiMood;
  /** 循環動作；有給就播動作，不看 mood */
  action?: PsiAction;
  /** 是否播放動畫（預設表情會眨眼、動作會逐格切換）；false 時動作停在第一格 */
  animated?: boolean;
  className?: string;
  /** 純裝飾時設為 true，螢幕閱讀器會略過 */
  decorative?: boolean;
}

export const PsiBot: React.FC<PsiBotProps> = ({
  size = 39,
  mood: moodProp,
  action,
  animated = true,
  className = '',
  decorative = false,
}) => {
  const mood: PsiMood = moodProp ?? 'default';
  const height = (size * HEIGHT) / WIDTH;
  const actionSprite = action ? PSI_ACTION_SPRITES[action] : undefined;
  const frames = actionSprite
    ? animated
      ? actionSprite.frames
      : actionSprite.frames.slice(0, 1)
    : [PSI_MOOD_SPRITES[mood]];
  const frameCount = frames.length;
  const stateLabel = actionSprite ? actionSprite.label : mood === 'default' ? '' : PSI_MOOD_LABELS[mood];
  const blinks = animated && !actionSprite && mood === 'default';

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
      style={
        frameCount > 1
          ? ({ '--psi-duration': `${actionSprite!.seconds}s` } as React.CSSProperties)
          : undefined
      }
      {...(decorative
        ? { 'aria-hidden': true }
        : { role: 'img', 'aria-label': `AI 小編小賽${stateLabel ? `・${stateLabel}` : ''}` })}
    >
      {frames.map((frame, i) => (
        <g
          key={i}
          className={frameCount > 1 ? `psi-frame psi-frame-${frameCount}-${i + 1}` : undefined}
        >
          {spriteRects(frame)}
        </g>
      ))}
      {blinks &&
        EYE_COLS.map((x) => (
          <rect key={`lid-${x}`} x={x} y={EYE_ROW} width={2} height={1} className="psi-bot-eyelid" />
        ))}
    </svg>
  );
};

export default PsiBot;
