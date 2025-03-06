/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        custom: {
          "primary": "#a64ac9",
          "secondary": "#fccd04",
          "accent": "#ffb48f",
          "neutral": "#f5e6cc",
          "base-100": "#222222",
          "info": "#17e9e0",
          },
        },
      ],
    },
  plugins: [require("daisyui")],
}

