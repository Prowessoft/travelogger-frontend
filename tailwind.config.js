/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f1',
          100: '#ffdfdf',
          200: '#ffc5c5',
          300: '#ff9c9c',
          400: '#ff6464',
          500: '#ff0000', // YouTube Red
          600: '#e60000',
          700: '#cc0000',
          800: '#a60000',
          900: '#800000',
        },
      },
    },
  },
  plugins: [],
};