/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF7',
          100: '#FFF9E9',
          200: '#FFF3D6',
          300: '#FFE9B8',
          400: '#FFDB8A',
          500: '#FFD066',
        },
        parchment: {
          50: '#FFFBF0',
          100: '#FFF7E6',
          200: '#FFF0CC',
          300: '#FFE4B3',
          400: '#FFD999',
          500: '#FFCC80',
        },
        leather: {
          50: '#F5F0E5',
          100: '#E6D5B8',
          200: '#D4B78C',
          300: '#C19B66',
          400: '#A67B44',
          500: '#8C5E2E',
          600: '#724C25',
          700: '#593B1D',
          800: '#412B15',
          900: '#2C1D0E',
        },
        forest: {
          50: '#F3F5F3',
          100: '#DCE4DD',
          200: '#B8CDB9',
          300: '#93B595',
          400: '#6F9D72',
          500: '#4B854F',
          600: '#3C6B3F',
          700: '#2D512F',
          800: '#1F3720',
          900: '#111D11',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        'book': '1px 1px 5px rgba(0, 0, 0, 0.1), 2px 2px 20px rgba(0, 0, 0, 0.1)',
        'page': 'inset -20px 0 20px -20px rgba(0, 0, 0, 0.3)',
        'paper': 'inset 0 0 30px rgba(0, 0, 0, 0.1)',
        'paper-soft': '0 0 15px rgba(0, 0, 0, 0.05)',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-delay': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '30%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'mascot-blink': {
          '0%, 96%, 100%': { opacity: '1' },
          '97%, 99%': { opacity: '0' },
        },
        'mascot-blink-reverse': {
          '0%, 96%, 100%': { opacity: '0' },
          '97%, 99%': { opacity: '1' },
        },
        'page-curl': {
          '0%': { transform: 'perspective(1500px) rotateY(0deg)' },
          '100%': { transform: 'perspective(1500px) rotateY(-3deg)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-in-delay': 'fade-in-delay 1.5s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.6s ease-out forwards',
        'mascot-blink': 'mascot-blink 4s ease-in-out infinite',
        'mascot-blink-reverse': 'mascot-blink-reverse 4s ease-in-out infinite',
        'page-curl': 'page-curl 0.6s ease-out',
      },
      backgroundImage: {
        'paper-texture': "url('/assets/papertexture.png')",
        'leather-texture': "linear-gradient(to right bottom, rgba(114, 76, 37, 0.8), rgba(65, 43, 21, 0.9))",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-paper': 'linear-gradient(to right bottom, rgba(255, 253, 247, 0.9), rgba(255, 249, 233, 0.95))',
      },
    },
  },
  plugins: [],
} 