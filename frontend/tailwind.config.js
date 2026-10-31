/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fastor: {
          orange: '#F9501B',
          'orange-hover': '#E04414',
          'orange-light': '#FFF0EB',
          'orange-muted': '#FFE4DB',
          blue: '#4E6DC2',
          'blue-light': '#EFF3FC',
          dark: '#1E222B',
          gray: '#828282',
          lightGray: '#F7F8FA',
          border: '#E8ECF2',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'button': '0 8px 20px -4px rgba(249, 80, 27, 0.35)',
        'float': '0 12px 30px -6px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
