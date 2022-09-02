/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "#1CD391",
      secondary: "#1AE034",
      white: "#FFFFFF",
      "white-dim": "#f3f3f3",
      black: {
        100: "#010B07",
        75: "#414845",
        50: "#808583",
        25: "#bfc2c1",
        10: "#e6e7e7"
      },
      error: "#c93e3e"
    },
    fontSize: {
      h1: ['6.375rem', '7.7625rem'],
      h2: ['4.5rem', '5.48125rem'],
      h3: ['3.1875rem', '3.88125rem'],
      h4: ['2.25rem', '2.7375rem'],
      h5: ['1.5625rem', '1.9rem'],
      body: ['1.125rem', '1.36875rem'],
    },
    extend: {
      fontFamily: {
        'sans': ['Proxima Nova', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}
