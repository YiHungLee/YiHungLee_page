import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { PsiMood } from '../../utils/blogCategories';
import { PsiBot } from './PsiBot';
import type { PsiAction } from './psiSprites';

export type PsiPose = { mood: PsiMood } | { action: PsiAction };

/** 一個表情或動作，維持 ms 毫秒 */
export interface PsiStep {
  pose: PsiPose;
  ms: number;
}

/** 外部提示：key 改變時依序播放 steps，播完回到休息的表情 */
export interface PsiCue {
  key: string | number;
  steps: PsiStep[];
}

const GREETING: PsiStep[] = [{ pose: { action: 'wave' }, ms: 1800 }];
const WAKE_UP: PsiStep[] = [{ pose: { mood: 'surprised' }, ms: 1000 }];

// 閒著沒事時隨機做的小動作
const FIDGETS: PsiStep[][] = [
  [{ pose: { mood: 'wink' }, ms: 1200 }],
  [{ pose: { mood: 'sparkle' }, ms: 1400 }],
  [{ pose: { action: 'wave' }, ms: 1200 }],
  [{ pose: { action: 'reading' }, ms: 3200 }],
  [{ pose: { action: 'writing' }, ms: 3600 }],
  // 想一想，然後靈光一閃
  [
    { pose: { action: 'loading' }, ms: 1800 },
    { pose: { action: 'idea' }, ms: 2800 },
  ],
];

// 被戳時輪流出現的反應
const POKE_REACTIONS: PsiStep[][] = [
  [{ pose: { action: 'hop' }, ms: 1400 }],
  [{ pose: { mood: 'shy' }, ms: 1600 }],
  [{ pose: { mood: 'happy' }, ms: 1400 }],
  [{ pose: { mood: 'love' }, ms: 1600 }],
  [{ pose: { action: 'cheer' }, ms: 2400 }],
];
const DIZZY: PsiStep[] = [{ pose: { mood: 'dizzy' }, ms: 2400 }];
const ANGRY: PsiStep[] = [{ pose: { mood: 'angry' }, ms: 1800 }];

const TICK_MS = 1000;
const DOZE_AFTER_MS = 45_000; // 這麼久沒有任何操作就打瞌睡
const FIDGET_MIN_MS = 8_000;
const FIDGET_MAX_MS = 16_000;
const POKE_WINDOW_MS = 3_000; // 這段時間內連戳幾下會暈、會生氣
const DIZZY_POKES = 6;
const ANGRY_POKES = 10;
const WOKE_GRACE_MS = 400; // 叫醒它的那次點擊不再算一次戳

const ACTIVITY_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const pickOne = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** 深夜 1–6 點，沒有指定表情時小賽會想睡 */
function isLateNight(): boolean {
  const hour = new Date().getHours();
  return hour >= 1 && hour < 6;
}

function isOnScreen(el: Element | null): boolean {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
}

interface PsiBuddyProps {
  /** 寬度（px），用 13 的整數倍邊緣最清楚 */
  size?: number;
  /** 沒在做事時的表情 */
  restMood?: PsiMood;
  /** 出現時先揮手打招呼 */
  greet?: boolean;
  /** 外部提示，例如搜尋結果出來時翻書、開心或難過 */
  cue?: PsiCue | null;
  className?: string;
}

/**
 * 會互動的小賽：出現時揮手、閒著會自己找事做、太久沒人理就打瞌睡，
 * 被戳會跳、會害羞，連戳太多下會暈、會生氣。
 * 使用者設定「減少動態」時，只保留點擊反應（動作停在第一格）。
 */
export const PsiBuddy: React.FC<PsiBuddyProps> = ({
  size = 39,
  restMood: restMoodProp,
  greet = true,
  cue = null,
  className = '',
}) => {
  // pose 為 null 時顯示休息的表情；id 讓每次換姿勢都重新播放動畫
  const [shown, setShown] = useState<{ pose: PsiPose | null; id: number }>({ pose: null, id: 0 });
  const [dozing, setDozing] = useState(false);
  const [lateNight] = useState(isLateNight);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);
  const busy = useRef(false);
  const dozingRef = useRef(false);
  const lastActivity = useRef(Date.now());
  const nextFidgetAt = useRef(Date.now() + randomBetween(FIDGET_MIN_MS, FIDGET_MAX_MS));
  const pokes = useRef<number[]>([]);
  const pokeCount = useRef(0);
  const wokeAt = useRef(0);
  const reducedMotion = useRef(prefersReducedMotion());

  const showPose = useCallback((pose: PsiPose | null) => {
    setShown((prev) => ({ pose, id: prev.id + 1 }));
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const play = useCallback(
    (steps: PsiStep[]) => {
      clearTimers();
      busy.current = true;
      let elapsed = 0;
      steps.forEach(({ pose, ms }) => {
        if (elapsed === 0) showPose(pose);
        else timers.current.push(window.setTimeout(() => showPose(pose), elapsed));
        elapsed += ms;
      });
      timers.current.push(
        window.setTimeout(() => {
          busy.current = false;
          showPose(null);
          nextFidgetAt.current = Date.now() + randomBetween(FIDGET_MIN_MS, FIDGET_MAX_MS);
        }, elapsed)
      );
    },
    [clearTimers, showPose]
  );

  const setDoze = useCallback((value: boolean) => {
    dozingRef.current = value;
    setDozing(value);
  }, []);

  // 出現時打招呼；離開頁面時清掉計時器
  useEffect(() => {
    if (greet && !reducedMotion.current) play(GREETING);
    return clearTimers;
    // 只在掛載時打一次招呼
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 外部提示：只在 key 改變時播放，第一次掛載不播
  const cueKey = cue?.key;
  const lastCueKey = useRef(cueKey);
  useEffect(() => {
    if (cueKey === lastCueKey.current) return;
    lastCueKey.current = cueKey;
    if (!cue) return;
    setDoze(false);
    play(cue.steps);
    // cue.steps 跟著 key 一起變，只看 key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cueKey]);

  // 閒置小動作、打瞌睡、被吵醒
  useEffect(() => {
    if (reducedMotion.current) return;

    const onActivity = () => {
      lastActivity.current = Date.now();
      if (dozingRef.current) {
        setDoze(false);
        wokeAt.current = Date.now();
        play(WAKE_UP);
      }
    };
    ACTIVITY_EVENTS.forEach((type) => window.addEventListener(type, onActivity, { passive: true }));

    const tick = window.setInterval(() => {
      if (document.hidden || busy.current || dozingRef.current) return;
      const now = Date.now();
      if (now - lastActivity.current > DOZE_AFTER_MS) {
        setDoze(true);
        return;
      }
      if (now < nextFidgetAt.current) return;
      nextFidgetAt.current = now + randomBetween(FIDGET_MIN_MS, FIDGET_MAX_MS);
      if (isOnScreen(buttonRef.current)) play(pickOne(FIDGETS));
    }, TICK_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((type) => window.removeEventListener(type, onActivity));
      window.clearInterval(tick);
    };
  }, [play, setDoze]);

  const handlePoke = () => {
    const now = Date.now();
    lastActivity.current = now;
    if (now - wokeAt.current < WOKE_GRACE_MS) return;
    if (dozingRef.current) {
      setDoze(false);
      play(WAKE_UP);
      return;
    }

    pokes.current = pokes.current.filter((t) => now - t < POKE_WINDOW_MS);
    pokes.current.push(now);
    if (pokes.current.length >= ANGRY_POKES) {
      play(ANGRY);
    } else if (pokes.current.length >= DIZZY_POKES) {
      play(DIZZY);
    } else {
      play(POKE_REACTIONS[pokeCount.current % POKE_REACTIONS.length]);
      pokeCount.current += 1;
    }
  };

  const restMood: PsiMood = restMoodProp ?? 'default';
  const restingMood: PsiMood = restMood === 'default' && lateNight ? 'sleepy' : restMood;
  const restPose: PsiPose = dozing ? { action: 'doze' } : { mood: restingMood };
  const pose = shown.pose ?? restPose;

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handlePoke}
      aria-label="戳一下小賽"
      title="戳一下小賽"
      className={`psi-buddy inline-flex shrink-0 -m-1 p-1 cursor-pointer bg-transparent
                  focus:outline-none focus-visible:outline focus-visible:outline-1
                  focus-visible:outline-offset-4 focus-visible:outline-ochre-500
                  dark:focus-visible:outline-darkMode-ochre
                  ${className}`}
    >
      <PsiBot
        key={shown.id}
        size={size}
        {...('action' in pose ? { action: pose.action } : { mood: pose.mood })}
        decorative
      />
    </button>
  );
};

export default PsiBuddy;
