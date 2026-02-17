/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // Added /src/ if you are using the src directory
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use the CSS variable we defined in layout.tsx: --font-ms-madi
        msMadi: ['var(--font-ms-madi)', "cursive"],
      },
    },
  },
  plugins: [],
};