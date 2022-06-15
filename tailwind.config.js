
module.exports = {
  content: [
	"./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  "./containers/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      transitionProperty:{
        'height': 'height',
      },

      backgroundColor: theme => ({
        ...theme('colors'),
        'black-shape': '#191919',
        'black-light': '#333333'
      }),
    },

    screens:{
      'sm': '640px',
      'md': '768px',
      '2md': '888px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [],
}
