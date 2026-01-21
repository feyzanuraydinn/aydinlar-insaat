/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'flip': 'flip 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'scroll-bounce': 'scroll-bounce 2s infinite',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        'scroll-bounce': {
          '0%': {
            opacity: '0',
            transform: 'translateY(0)'
          },
          '50%': {
            opacity: '1',
            transform: 'translateY(-0.5em)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-1em)'
          },
        }
      }
    },
  },
  plugins: [],
}