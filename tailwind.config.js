/** @type {import('tailwindcss').Config} */
module.exports = {
  /*content: [`./views/*.html`],*/
  content:[`./views/**/*.ejs`], //all .ejs files
  daisyui: {
    themes: ['fantasy'],
  },
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

