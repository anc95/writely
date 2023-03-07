/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        swaying: {
          '0%, 100%': { transform: 'translateX(-20px)' },
          '50%': { transform: 'translateX(20px)' },
        },
      },
      animation: {
        swaying: 'swaying 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
