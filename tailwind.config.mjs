/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      // iOS-inspired rounded corners
      borderRadius: {
        'xl': '1rem',   // 16px
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem',  // 24px
      },
      // Subtle shadows for elevation
      boxShadow: {
        'hairline': '0 0 0 0.5px rgba(0, 0, 0, 0.08)',
        'hairline-light': '0 0 0 0.5px rgba(255, 255, 255, 0.08)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'soft-dark': '0 2px 8px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.2)',
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'elevated-dark': '0 4px 16px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      // Backdrop blur
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      // iOS-like easing curves
      transitionTimingFunction: {
        'ios': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'ios-spring': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      transitionDuration: {
        'ios': '220ms',
        'ios-fast': '150ms',
        'ios-slow': '320ms',
      },
      // Fluid typography with clamp()
      fontSize: {
        'xs': ['clamp(0.7rem, 0.68rem + 0.15vw, 0.75rem)', { lineHeight: '1.5' }],
        'sm': ['clamp(0.85rem, 0.82rem + 0.2vw, 0.9rem)', { lineHeight: '1.5' }],
        'base': ['clamp(0.95rem, 0.9rem + 0.3vw, 1rem)', { lineHeight: '1.6' }],
        'lg': ['clamp(1.1rem, 1rem + 0.5vw, 1.25rem)', { lineHeight: '1.45' }],
        'xl': ['clamp(1.3rem, 1.15rem + 0.7vw, 1.5rem)', { lineHeight: '1.35' }],
        '2xl': ['clamp(1.6rem, 1.35rem + 1vw, 2rem)', { lineHeight: '1.25' }],
        '3xl': ['clamp(2rem, 1.6rem + 1.5vw, 2.5rem)', { lineHeight: '1.15' }],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
