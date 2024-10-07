const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        "pt-serif": ["PT Serif", "serif"],
      },
      colors: {
        mainColor: "#C01D2E",
        "light-grey": "#F2F2F2",
        "text-color": "#191919",
        "button-hover": "#FF8787",
      },
      fontSize: {
        14: "14px",
        18: "18px",
        24: "24px",
        32: "32px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      keyframes: {
        "text-animation": {
          "0%": { color: "blue" },
          "50%": { color: "red" },
          "100%": { color: "blue" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        slideOut: {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(100%)", opacity: 0 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: 0 },
          "50%": { transform: "scale(1.05)", opacity: 0.8 },
          "70%": { transform: "scale(0.9)", opacity: 0.9 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      animation: {
        "text-animation": "text-animation 2s infinite",
        slideIn: "slideIn 0.4s ease-out",
        slideOut: "slideOut 0.4s ease-in",
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },
  daisyui: {
    themes: ["light"],
  },
  darkMode: "class",
  plugins: [],
});
