/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#0a192f',
        'surface': '#121317',
        'surface-container': '#1e1f23',
        'surface-container-high': '#292a2d',
        'electric-blue': '#3b82f6',
        'success-cyan': '#22d3ee',
        'on-surface': '#e3e2e7',
        'on-surface-variant': '#c4c6d0',
        'error-red': '#ef4444',
      },
      fontFamily: {
        display: ['"Anybody"', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      keyframes: {
        floating: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
      },
      animation: {
        floating: 'floating 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
