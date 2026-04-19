/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './utils/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Refined Minimal Palette
        charcoal: {
          950: '#0a0a0a',
          900: '#1a1a1a',
          800: '#2a2a2a',
          700: '#3a3a3a',
          600: '#4a4a4a',
        },
        warmCream: {
          50: '#fdfcfa',
          100: '#faf8f5',
          200: '#f5f2ed',
          300: '#f0ebe4',
          400: '#e8e5e0',
        },
        ochre: {
          300: '#d4a574',
          400: '#c4885f',
          500: '#b47a52',
          600: '#a06847',
          700: '#8a5a3d',
        },
        sage: {
          300: '#9dab8e',
          400: '#8a9a77',
          500: '#758762',
          600: '#627550',
        },
        rust: {
          300: '#c89178',
          400: '#b87d66',
          500: '#a86d57',
          600: '#945f4b',
        },
        // Neutral borders and accents
        border: {
          light: '#e8e5e0',
          DEFAULT: '#d0ccc5',
          dark: '#333333',
        },
        // Dark Mode Theme - 不飽和、柔和的配色
        darkMode: {
          bg: '#2a2826',
          bgElevated: '#35322f',
          bgHover: '#3d3936',
          bgSubtle: '#252320',
          text: '#e8e3db',
          textMuted: '#b8b0a6',
          textFaint: '#918a80',
          border: '#44413d',
          borderLight: '#38352f',
          ochre: '#c7a378',
          ochreDim: '#a88f6f',
          sage: '#9aaa8e',
          sageDim: '#869780',
          rust: '#b88a76',
          rustDim: '#a07765',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Noto Serif TC', 'serif'],
        body: ['Manrope', 'Noto Sans TC', 'sans-serif'],
        accent: ['Libre Baskerville', 'Noto Serif TC', 'serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.7' }],
        'lg': ['1.125rem', { lineHeight: '1.8' }],
        'xl': ['1.25rem', { lineHeight: '1.8' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.05' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      letterSpacing: {
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'normal': '0',
        'wide': '0.01em',
        'wider': '0.02em',
        'widest': '0.08em',
      },
      animation: {
        'fade-in': 'fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'draw-line': 'drawLine 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gentle-float': 'gentleFloat 8s ease-in-out infinite',
        'gentle-bounce': 'gentleBounce 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        drawLine: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gentleBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(0.95)' },
          '75%': { transform: 'scale(1.02)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
    },
  },
  plugins: [],
};
