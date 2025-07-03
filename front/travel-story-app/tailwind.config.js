/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display : ['Poppins', 'sans-serif'],
    },
    extend: {
      // Colors used in project
      colors: {
        primary: "#05B6D3",
        secondary: "#EF893E",
      },
      backgroundImage: {
        'login-bg-img' : "url('./src/assets/images/OIP.jpg')"
      }
    },
  },
  plugins: [],
}

