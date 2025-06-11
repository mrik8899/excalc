/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This tells Tailwind where to scan for classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}