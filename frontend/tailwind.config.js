/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      manrope: ["Manrope", "sans-serif"], // Add Metrophobic font
    },
    extend: {
      screens: {
        "max-940": { max: "940px" },
        "max-860": { max: "860px" },
        "max-400": { max: "400px" },
      },
    },
  },

  plugins: [],
};
