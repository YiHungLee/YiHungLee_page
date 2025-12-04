/* * Original design and code by Jhey Tompkins (@jh3y)
 * Source: https://codepen.io/jh3y/pen/MYgaaem
 * Licensed under MIT License
 */

import React, { useRef, useEffect } from 'react';

interface ScrollTextSectionProps {
  supportsNative: boolean;
  gsapReady: boolean;
}

const VERBS = [
  '探索', '研究', '玩樂', '創作', '學習',
  '投入', '寫作', '傾聽', '支持', '連結',
  '關懷', '成長', '欣賞', '享受', '聯絡我'
];

declare global {
  interface Window {
    gsap?: any;
    ScrollTrigger?: any;
  }
}

const ScrollTextSection: React.FC<ScrollTextSectionProps> = ({
  supportsNative,
  gsapReady
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Only setup GSAP if native CSS animations are not supported
    if (!supportsNative && gsapReady && window.gsap && window.ScrollTrigger) {
      const ctx = window.gsap.context(() => {
        setupGSAPFallback();
      }, sectionRef.current);

      return () => ctx.revert();
    }
  }, [supportsNative, gsapReady]);

  const setupGSAPFallback = () => {
    if (!listRef.current || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    const items = Array.from(listRef.current.querySelectorAll('.verb-item'));

    // Initialize items with first one visible
    gsap.set(items, {
      opacity: (i) => (i === 0 ? 1 : 0.2),
      force3D: true  // GPU acceleration
    });

    // Create ScrollTrigger for each item
    items.forEach((item, index) => {
      const isLast = index === items.length - 1;

      gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'center center+=100',  // Corresponds to CSS calc(50% - 1lh)
          end: 'center center-=100',    // Corresponds to CSS calc(50% + 1lh)
          scrub: 0.2,  // Increased from 0.2 for smoother transitions on mobile
        }
      })
      .to(item, {
        opacity: 1,
        // Removed brightness filter to prevent visual 'jump' on mobile
        ease: 'power1.inOut'  // Smoother easing instead of 'none'
      }, 0)
      .to(item, {
        opacity: isLast ? 1 : 0.2,
        ease: 'power1.inOut'
      });
    });
  };

  return (
    <section
      ref={sectionRef}
      className="scroll-text-section"
      data-animate={supportsNative}
    >
      <h2 className="sticky-text">
        <span aria-hidden="true">你可以&nbsp;</span>
        <span className="sr-only">
          你可以{VERBS.join('、')}。
        </span>
      </h2>
      <ul
        ref={listRef}
        aria-hidden="true"
        style={{ '--count': VERBS.length } as React.CSSProperties}
      >
        {VERBS.map((verb, i) => (
          <li
            key={verb}
            style={{ '--i': i } as React.CSSProperties}
            className="verb-item"
          >
            {verb}。
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ScrollTextSection;
