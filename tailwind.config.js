/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          950: '#26060F',
          900: '#380B17',
          850: '#4A1020', // Primary deep burgundy
          800: '#5A1527',
          700: '#731C33',
          600: '#8E2440',
          500: '#AB2F4F',
        },
        charcoal: {
          950: '#171312',
          900: '#211C1B', // Primary charcoal
          850: '#2A2423',
          800: '#362E2C',
          750: '#403734',
          700: '#4D423F',
          600: '#645753',
        },
        cream: {
          50: '#FFFAF3',
          100: '#FFF7E9', // Primary cream text
          200: '#F5EBD7',
          300: '#E6D7BE',
          400: '#D4C0A2',
        },
        gold: {
          300: '#E8C57D',
          400: '#DFB561',
          500: '#D7A64A', // Primary warm gold
          600: '#BE8C34',
          700: '#9E7125',
        },
        warmGold: {
          300: '#E8C57D',
          400: '#DFB561',
          500: '#D7A64A',
          600: '#BE8C34',
          700: '#9E7125',
        },
        emeraldGreen: {
          500: '#10B981',
          600: '#059669',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
