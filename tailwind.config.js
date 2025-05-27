/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'binance-yellow': '#F0B90B',
        'dark-bg': '#0B0E11',
        'card-bg': '#1E2329',
        'card-border': '#2A2F36',
        'text-primary': '#FFFFFF',
        'text-secondary': '#848E9C',
        'text-tertiary': '#5E6673',
        'positive': '#03A66D',
        'negative': '#CF304A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}