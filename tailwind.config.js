/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    animation: {
      pulse: "pulse 1s ease-in-out infinite",
      spin: "spin 1s linear infinite",
      "fade-in": "fadeIn 1s ease-out",
      "roll-out": "rollOut .4s ease-out",
      "roll-in": "rollIn .4s ease-out",
    },
    extend: {
      colors: {
        "rust-gray": "#47585C",
        "willow-gray": "#C8D5BB",
      },
    },
  },
  plugins: [],
};
