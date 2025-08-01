/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand': {
          'light': '#F3F4F6', // Lighter Gray
          'DEFAULT': '#4F46E5', // Indigo 600
          'dark': '#111827',  // Dark Gray for sidebars
          'darker': '#0F172A' // Slate 900
        },
        'primary': '#4F46E5',
        'secondary': '#10B981',
        'danger': '#EF4444',
        'warning': '#F59E0B',
        'info': '#3B82F6',
      },
    }
  },
  plugins: [],
} 