import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f2b5b',
          dark: '#091d3e',
          light: '#1a45a0',
        },
        accent: {
          DEFAULT: '#e8540a',
          light: '#ff6b2b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f2b5b 0%, #1a45a0 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
