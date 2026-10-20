/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0d0d0d',
          900: '#141414',
          850: '#171717',
          800: '#1f1f1f',
          700: '#2a2a2a',
          600: '#3d3d3d',
        },
        cream: {
          50: '#FAF8F4',
          100: '#F7F3EB',
          200: '#EFE8DA',
          300: '#E2D5BE',
        },
        gold: {
          300: '#D4B87C',
          400: '#C9A767',
          500: '#B99558',
          600: '#9B783E',
          700: '#7E6130',
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
