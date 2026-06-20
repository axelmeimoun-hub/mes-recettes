import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette éditoriale chaleureuse, pilotée par tokens CSS (cf. index.css)
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        terracotta: 'rgb(var(--c-terracotta) / <alpha-value>)',
        olive: 'rgb(var(--c-olive) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
} satisfies Config
