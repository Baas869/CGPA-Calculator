/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        "primary-color": "#001F3F",
        "navy-blue": "#001F3F",
        "primary-text": "#fff",
        "secondary-text": "#333333",
        "btn-primary-color": "#FF851B",
        "btn-hover-color": "#E76A00",
        "link-primary-color":  "#FF851B",
        "link-secondary-color": "#001F3F"
      }
    },
  },
  plugins: [],
}

