/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.js",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },

  plugins: [
    require('tailwindcss-rtl'),
  ],
}