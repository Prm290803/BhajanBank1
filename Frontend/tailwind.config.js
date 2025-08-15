module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      color: {
         bhagwa: {
          300: '#FF9933', // Saffron light
          500: '#FF7722', // Saffron medium
          700: '#E56210', // Saffron dark
        },
        pink: {
          300: '#F9A8D4', // Lotus petal light
          400: '#F472B6', // Lotus petal dark
        },
      },
    },
  },
  plugins: [],
}