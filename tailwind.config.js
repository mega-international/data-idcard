module.exports = {
  purge: {
    enable: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.vue',
      './src/**/*.css'
    ]
  },
  theme: {
    extend: {
      fontFamily: {
        montserrat: [ 'Montserrat-Regular', 'sans-serif' ],
        'montserrat-medium': [ 'Montserrat-Medium', 'sans-serif' ],
        'montserrat-semibold': [ 'Montserrat-Semibold', 'sans-serif' ],
        'montserrat-bold': [ 'Montserrat-Bold', 'sans-serif' ],
      },
      colors: {
        'light-grey-100': '#0000000A',
        'light-grey-200': '#F9FAFA',
        'light-grey-300': '#0000001A',
        'light-grey-400': '#A2ACBA',
        'light-grey-500': '#5A6779',
        grey: '#F9FAFA',
        dark: '#343638',
        'dark-blue': '#22354B',
        magenta: '#EE2665',
        green: '#31B672',
        mauve: '#C7D0F880',
        yellow: '#F4D766',
        'light-green': '#14BE9E',
        red: '#F1595A'
      },
      boxShadow: {
        header: '0 4px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        input: '0 20px 25px -1px rgba(199, 208, 248, 0.1), 0 10px 10px 5px rgba(199, 208, 248, 0.06)',
        nprogress: '0 0 10px #31AC6E, 0 0 5px #31AC6E'
      },
      inset: {
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        7: '1.75rem',
        8: '2rem',
        9: '2.25rem',
        10: '2.5rem',
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
        16: '4rem',
        20: '5rem',
        22: '5.25rem',
        24: '6rem',
      }
    },
  },
  variants: {
    height: [ 'responsive', 'hover', 'focus' ],
    padding: [ 'responsive', 'hover', 'first', 'last' ],
    border: [ 'hover', 'first', 'last' ],
    margin: [ 'responsive', 'hover', 'first', 'last' ]
  },
  plugins: [],
};
