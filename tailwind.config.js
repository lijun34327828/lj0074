/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brand: {
          50: '#F0F7F4',
          100: '#D4E8DD',
          200: '#A8D1BB',
          300: '#7CBA99',
          400: '#50A377',
          500: '#1B4332',
          600: '#163A2B',
          700: '#112F23',
          800: '#0C241B',
          900: '#071914',
        },
        gold: {
          50: '#FDF8ED',
          100: '#F9EDCC',
          200: '#F0D699',
          300: '#E7BF66',
          400: '#D4A843',
          500: '#B8912E',
          600: '#8B6914',
        },
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          400: '#F87171',
          500: '#E63946',
          600: '#C5303C',
        },
      },
    },
  },
  plugins: [],
};
