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
        sv: {
          teal: '#0F3D3D',
          night: '#0A2B2B',
          cream: '#FAF7F2',
          parchment: '#F1EBDF',
          gold: '#C9922A',
          'gold-hover': '#D4A24C',
          'gold-text': '#8F6416',
          'gold-light': '#E0B256',
          ink: '#1F2A2A',
          muted: '#4A5654',
          mist: '#D9E3DF',
          sage: '#A9BDB8',
          line: '#E2D8C4',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Figtree', 'system-ui', '-apple-system', 'sans-serif'],
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
