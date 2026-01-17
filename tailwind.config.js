/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9fc',
          100: '#edf3f5',
          200: '#d4e7ec',
          300: '#b8dce5',
          400: '#9dd1de',
          500: '#81c6d7',
          600: '#57bcd9',
          700: '#3da8c9',
          800: '#2e8199',
          900: '#1f5a69',
        },
      },
      fontFamily: {
        sans: ['ALK Rounded Mtav Med', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
