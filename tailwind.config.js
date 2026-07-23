/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FBF6EE',
          50: '#FFFDFA',
          100: '#FBF6EE',
          200: '#F5ECDA',
          300: '#EEE0C4',
        },
        beige: {
          DEFAULT: '#E8DCC8',
          100: '#F1E8D8',
          200: '#E8DCC8',
          300: '#D9C7A8',
          400: '#C7AF88',
        },
        cocoa: {
          DEFAULT: '#3B2A22',
          50: '#F4EEE9',
          100: '#E3D2C4',
          200: '#C6A588',
          300: '#A97B5C',
          400: '#7A5640',
          500: '#5A3D2C',
          600: '#3B2A22',
          700: '#2E211A',
          800: '#211712',
          900: '#160F0B',
        },
        gold: {
          DEFAULT: '#C9A24B',
          100: '#F0E3C2',
          300: '#DCC086',
          500: '#C9A24B',
          700: '#9A7A34',
        },
        berry: {
          DEFAULT: '#C4586B',
        },
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.75rem',
        blob: '42% 58% 65% 35% / 45% 45% 55% 55%',
      },
      boxShadow: {
        soft: '0 8px 30px -10px rgba(59, 42, 34, 0.25)',
        lift: '0 20px 45px -15px rgba(59, 42, 34, 0.35)',
        glow: '0 0 0 1px rgba(201, 162, 75, 0.25), 0 20px 45px -15px rgba(201, 162, 75, 0.35)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(2deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        floatSlow: 'floatSlow 8s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [],
};
