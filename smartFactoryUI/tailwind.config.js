/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'factory-bg': '#f3f4f6',   // Hafif gri arka plan
        'factory-card': '#ffffff', // Beyaz kartlar
        'factory-dark': '#1f2937', // Koyu metinler
      },
    },
  },
  plugins: [],
}