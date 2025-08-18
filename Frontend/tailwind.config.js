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
         peacock: {
          50:  "#E6F7F7",
          100: "#B3EDED",
          200: "#80E3E3",
          300: "#4DD9D9",
          400: "#26BFBF",
          500: "#009999",  // base peacock
          600: "#007A7A",
          700: "#005C5C",
          800: "#003D3D",
          900: "#001F1F",
        },
      },
    },
  },
  plugins: [],
}