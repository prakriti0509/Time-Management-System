/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",   // ok to keep
    "./src/**/*.{ts,tsx,js,jsx}",     // ok to keep
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
