const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ["Menlo", ...defaultTheme.fontFamily.mono],
        source: ["Source Sans Pro", ...defaultTheme.fontFamily.sans],
        "ubuntu-mono": ["Ubuntu Mono", ...defaultTheme.fontFamily.mono],
        system: defaultTheme.fontFamily.sans,
        flow: "Flow",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: colors.black,
        white: colors.white,
        teal: colors.teal,
        purple:colors.purple,
        violet:colors.violet,
        fuchsia:colors.fuchsia,
        cyan: colors.cyan,
        gray: colors.coolGray,
        red: colors.red,
        yellow: colors.amber,
        blue: colors.blue,
        pink: colors.pink,
        bluegray: colors.blueGray,
        skyblue: colors.sky,
      },
      animation:{
        blob: "blob 7s infinite"
      },
      keyframes:{
        blob:{
          "0%":{
            transform:"translate(0px,0px) scale(1)",
          },
          "33%":{
            transform:"translate(30px,-50px) scale(1.1)",
          },
          "66%":{
            transform:"translate(-20px,20px) scale(0.9)",
          },
          "100%":{
            transform:"translate(0px,0px) scale(1)",
          },
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
