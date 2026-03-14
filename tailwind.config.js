/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['var(--font-fredoka)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        eurovision: {
          pink: '#E91E8C',
          purple: '#7B2FBE',
          blue: '#1B3F8B',
          gold: '#FFD700',
          dark: '#0A0A1A',
        },
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.8)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(233, 30, 140, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(233, 30, 140, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
