/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#C9A84C',
        'gold-dark': '#b8942e',
        'dark-blue': '#1a3a4a',
        'dark-blue-deep': '#0e2430',
        cream: '#FAF6EF',
        'cream-dark': '#f0e8d8',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
