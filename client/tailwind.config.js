/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust if needed
  ],
  theme: {
    extend: {
      colors: {
        text: {
          DEFAULT: '#e5e5f0',
          50: '#efeff6',
          100: '#dfdfec',
          200: '#bebeda',
          300: '#9e9ec7',
          400: '#7d7db5',
          500: '#5d5da2',
          600: '#4a4a82',
          700: '#383861',
          800: '#252541',
          900: '#131320',
          950: '#090910',
        },
        background: {
          DEFAULT: '#0d0d16',
          50: '#efeff6',
          100: '#dfdfec',
          200: '#bfbfd9',
          300: '#9f9fc6',
          400: '#7e7eb4',
          500: '#5e5ea1',
          600: '#4b4b81',
          700: '#393960',
          800: '#262640',
          900: '#131320',
          950: '#090910',
        },
        primary: {
          DEFAULT: '#a2a2c8',
          50: '#efeff6',
          100: '#dfdfec',
          200: '#bfbfd9',
          300: '#9f9fc6',
          400: '#7e7eb4',
          500: '#5e5ea1',
          600: '#4b4b81',
          700: '#393960',
          800: '#262640',
          900: '#131320',
          950: '#090910',
        },
        secondary: {
          DEFAULT: '#503a64',
          50: '#f2eff6',
          100: '#e6dfec',
          200: '#ccbeda',
          300: '#b39ec7',
          400: '#9a7db5',
          500: '#815da2',
          600: '#674a82',
          700: '#4d3861',
          800: '#332541',
          900: '#1a1320',
          950: '#0d0910',
        },
        accent: {
          DEFAULT: '#9f78b0',
          50: '#f4eff6',
          100: '#e8dfec',
          200: '#d1bfd9',
          300: '#ba9fc6',
          400: '#a47eb4',
          500: '#8d5ea1',
          600: '#714b81',
          700: '#543960',
          800: '#382640',
          900: '#1c1320',
          950: '#0e0910',
        },
      },
    },
  },
  plugins: [],
};
