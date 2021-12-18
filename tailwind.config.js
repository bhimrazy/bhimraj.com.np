const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  // darkMode: false, // or 'media' or 'class'
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
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
      },
      animation: {
        blob: "blob 7s infinite"
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px,0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px,-50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px,20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px,0px) scale(1)",
          },
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
