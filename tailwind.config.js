import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './inertia/**/*.{js,jsx,ts,tsx}',
    './resources/**/*.edge',
    './resources/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    colors: {
      'black': '#000000',
      'white': '#ffffff',

      'gray-1000': '#1E2022',
      'gray-800': '#333333',
      'gray-600': '#555555',
      'gray-400': '#CCCCCC',
      'gray-200': '#E6E6E6',
      'gray-100': '#EEEEEE',

      'blue-1000': '#0B3051',
      'blue-800': '#0F406C',
      'blue-700': '#27537A',
      'blue-600': '#0B6395',
      'blue-400': '#00A6D5',
      'blue-300': '#00ABF4',
      'blue-200': '#6AE4FF',

      'green-700': '#00813E',
      'green-300': '#8EDA55',

      'red-600': '#BB1818',

      'cyan-600': '#689EBD',
      'cyan-500': '#79BFE8',
      'cyan-100': '#E8F0FE',
    },
    fontFamily: {
      ubuntu: ['"Ubuntu Condensed"'],
      fira: ['"Fira Sans"'],
      fira_condensed: ['"Fira Sans Condensed"', '"Fira Sans"'],
    },
    extend: {
      screens: {
        main: '1292px',
      },
    },
  },
  plugins: [typography],
}
