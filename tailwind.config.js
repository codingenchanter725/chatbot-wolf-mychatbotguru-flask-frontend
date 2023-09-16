/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{js,html}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F79052',
        secondary: "#2584C6",
        'progress-bar': "#F5F5F5",
        green: "#4CAF50",
        label: "#231F20",
        border: "#E6E7E8",
        bg: ""
      },
      boxShadow: {
        message: "7px 7px 10px 0px #231F201C",
      },
      backgroundImage: {
        'bg-primary': "linear-gradient(to top, #F1F4F7, #EDEFF8)",
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require('tailwind-scrollbar')({ nocompatible: true })
  ],
}

