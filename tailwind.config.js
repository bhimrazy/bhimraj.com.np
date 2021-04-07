const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        mono: ["Menlo", ...defaultTheme.fontFamily.mono],
        source: ["Source Sans Pro", ...defaultTheme.fontFamily.sans],
        "ubuntu-mono": ["Ubuntu Mono", ...defaultTheme.fontFamily.mono],
        system: defaultTheme.fontFamily.sans,
        flow: "Flow",
      },
      colors: {
        gray: colors.trueGray,
        red: colors.red,
        blue: colors.lightBlue,
        yellow: colors.amber,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
