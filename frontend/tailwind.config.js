/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                // for Vite
    "./src/**/*.{js,jsx,ts,tsx}",  // for React files
  ],
  theme: {
    extend: {
        colors: {
        'dark-bg': '#1a1a1a',
        'wood-accent': '#8B5A2B',
        'text-light': '#E0E0E0',
      },
    },
  },
  plugins: [],
}
