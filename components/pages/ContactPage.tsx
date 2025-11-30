import React, { useState, useEffect } from 'react';
import HeroSection from '../contact/HeroSection';
import ScrollTextSection from '../contact/ScrollTextSection';
import TransitionSection from '../contact/TransitionSection';
import ContactForm from '../contact/ContactForm';

declare global {
  interface Window {
    gsap?: any;
    ScrollTrigger?: any;
  }
}

const loadGSAP = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.gsap && window.ScrollTrigger) {
      resolve();
      return;
    }

    // Load GSAP core
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    gsapScript.async = true;

    gsapScript.onload = () => {
      // Load ScrollTrigger plugin
      const stScript = document.createElement('script');
      stScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
      stScript.async = true;

      stScript.onload = () => {
        if (window.gsap && window.ScrollTrigger) {
          window.gsap.registerPlugin(window.ScrollTrigger);
          resolve();
        } else {
          reject(new Error('GSAP failed to load'));
        }
      };

      stScript.onerror = () => reject(new Error('ScrollTrigger load failed'));
      document.head.appendChild(stScript);
    };

    gsapScript.onerror = () => reject(new Error('GSAP load failed'));
    document.head.appendChild(gsapScript);
  });
};

const ContactPage: React.FC = () => {
  const [supportsScrollTimeline, setSupportsScrollTimeline] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  useEffect(() => {
    // Check if browser supports CSS animation-timeline
    const supports = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');
    setSupportsScrollTimeline(supports);

    // If not supported and GSAP not already loaded, load it
    if (!supports && !window.gsap) {
      loadGSAP()
        .then(() => setGsapLoaded(true))
        .catch((error) => console.error('Failed to load GSAP:', error));
    } else if (!supports && window.gsap) {
      // GSAP already loaded (e.g., from another component)
      setGsapLoaded(true);
    }
  }, []);

  // Enable scroll-snap on the root element for this page
  useEffect(() => {
    const root = document.documentElement;
    const originalScrollSnapType = root.style.scrollSnapType;

    // Apply scroll-snap-type to the root scroll container
    root.style.scrollSnapType = 'y proximity';

    // Cleanup: restore original value when component unmounts
    return () => {
      root.style.scrollSnapType = originalScrollSnapType;
    };
  }, []);

  return (
    <div className="min-h-screen bg-warmCream-50 transition-colors duration-500">
      <HeroSection />
      <ScrollTextSection
        supportsNative={supportsScrollTimeline}
        gsapReady={gsapLoaded}
      />
      <TransitionSection />
      <ContactForm />
    </div>
  );
};

export default ContactPage;
