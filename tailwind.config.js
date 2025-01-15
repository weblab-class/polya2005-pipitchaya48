/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mit-red": {
          50: "#fff0f3",
          100: "#ffdde3",
          200: "#ffc1cc",
          300: "#ff96a8",
          400: "#ff5a76",
          500: "#ff274c",
          600: "#fb0731",
          700: "#d40125",
          800: "#ae0623",
          900: "#900c23",
          950: "#750014",
          DEFAULT: "#750014",
        },
        "silver-gray": {
          50: "#f8f9fa",
          100: "#f2f4f5",
          200: "#e8ebec",
          300: "#d5dadd",
          400: "#bdc4c8",
          500: "#a1aab1",
          600: "#8b959e",
          DEFAULT: "#8b959e",
          700: "#77818a",
          800: "#646b73",
          900: "#53595f",
          950: "#363b3f",
        },
        "bright-red": {
          50: "#fff0f1",
          100: "#ffdddf",
          200: "#ffc0c4",
          300: "#ff949b",
          400: "#ff5762",
          500: "#ff2331",
          600: "#ff1423",
          DEFAULT: "#ff1423",
          700: "#d7000e",
          800: "#b1030e",
          900: "#920a13",
          950: "#500005",
        },
      },
      spacing: {
        "xs": "4px",
        "s": "8px",
        "m": "16px",
        "l": "24px",
      }
    },
  },
  plugins: [],
};
