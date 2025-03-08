import { heroui } from '@heroui/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E86C6E',
          50: '#fdf3f3',
          100: '#fbe5e5',
          200: '#f9cfd0',
          300: '#f4adae',
          400: '#e86c6e',
          500: '#de5557',
          600: '#ca383a',
          700: '#aa2b2d',
          800: '#8d2729',
          900: '#752728',
          950: '#3f1011'
        }
      }
    }
  },
  darkMode: 'class',
  plugins: [heroui()]
}
