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
  },
  plugins: [],
}
