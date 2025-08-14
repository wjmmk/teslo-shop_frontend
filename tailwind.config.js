/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    fontFamily: {
      "montserrat": ["Montserrat", "sans-serif"]
    },
    extend: {
      animation:{
        fadeIn:'fadeIn 0.5s ease-in-out',
        lightRing: 'lightRing 3s linear infinite',
        rotateRing: 'rotateRing 3s linear infinite',
      },
      keyframes:{
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        lightRing: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        rotateRing: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["night"],
  },
  darkMode: 'class', // Enable dark mode
}

