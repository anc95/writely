/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        swaying: {
          '0%, 100%': {
            transform:
              'translateX(-20px); color: red; filter: hue-rotate(0deg);',
          },
          '50%': {
            transform:
              'translateX(20px); color: pink; filter: hue-rotate(360deg);',
          },
        },
      },
      animation: {
        swaying: 'swaying 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
