/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        accent2: 'var(--accent-2)',
        positive: 'var(--positive)',
        negative: 'var(--negative)'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(5, 8, 20, 0.15)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: []
}
