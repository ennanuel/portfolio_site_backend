module.exports = {
  content: ['./views/index.ejs', "./views/**/*.{html,ejs,js}"],
  theme: {
    extend: {
      colors: {
        highlight: {
          100: "#fbf5e6",
          200: "#f7ebcd",
          300: "#f4e2b5",
          400: "#f0d89c",
          500: "#ecce83",
          600: "#bda569",
          700: "#8e7c4f",
          800: "#5e5234",
          900: "#2f291a"
        }
      }
    },
  },
  plugins: [],
}