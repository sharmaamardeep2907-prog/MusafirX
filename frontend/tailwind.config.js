/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}','./features/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0B2341', 50: '#E8EDF5', 100: '#C5D1E5', 200: '#9DB3CF', 300: '#7595B9', 400: '#4D77A3', 500: '#0B2341', 600: '#091D36', 700: '#07172B', 800: '#051120', 900: '#030B15' },
        saffron: { DEFAULT: '#FF8A00', 50: '#FFF3E0', 100: '#FFE0B2', 200: '#FFCC80', 300: '#FFB74D', 400: '#FFA726', 500: '#FF8A00', 600: '#FB8C00', 700: '#F57C00', 800: '#EF6C00', 900: '#E65100' },
        emerald: { DEFAULT: '#138A4B', 50: '#E8F5E9', 100: '#C8E6C9', 200: '#A5D6A7', 300: '#81C784', 400: '#66BB6A', 500: '#138A4B', 600: '#0F733E', 700: '#0B5C31', 800: '#074524', 900: '#032E17' },
        ivory: '#F8F8F5', charcoal: '#1F2937', softgray: '#EAECEF',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], display: ['Manrope', 'system-ui', 'sans-serif'] },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out', 'slide-up': 'slideUp 0.5s ease-out', 'slide-down': 'slideDown 0.3s ease-out', 'scale-in': 'scaleIn 0.3s ease-out', 'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
      },
    },
  },
  plugins: [],
};
