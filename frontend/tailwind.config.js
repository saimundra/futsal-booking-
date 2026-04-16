/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'rgba(45, 90, 39, 0.15)',
        input: 'rgb(245, 247, 245)',
        ring: 'rgb(45, 90, 39)',
        background: 'rgb(250, 251, 250)',
        foreground: 'rgb(26, 26, 26)',
        primary: {
          DEFAULT: 'rgb(45, 90, 39)',
          foreground: 'rgb(255, 255, 255)',
        },
        secondary: {
          DEFAULT: 'rgb(74, 124, 89)',
          foreground: 'rgb(255, 255, 255)',
        },
        destructive: {
          DEFAULT: 'rgb(220, 38, 38)',
          foreground: 'rgb(255, 255, 255)',
        },
        muted: {
          DEFAULT: 'rgb(245, 247, 245)',
          foreground: 'rgb(74, 90, 74)',
        },
        accent: {
          DEFAULT: 'rgb(255, 107, 53)',
          foreground: 'rgb(255, 255, 255)',
        },
        popover: {
          DEFAULT: 'rgb(255, 255, 255)',
          foreground: 'rgb(26, 26, 26)',
        },
        card: {
          DEFAULT: 'rgb(245, 247, 245)',
          foreground: 'rgb(42, 42, 42)',
        },
        success: {
          DEFAULT: 'rgb(34, 197, 94)',
          foreground: 'rgb(255, 255, 255)',
        },
        warning: {
          DEFAULT: 'rgb(245, 158, 11)',
          foreground: 'rgb(26, 26, 26)',
        },
        error: {
          DEFAULT: 'rgb(220, 38, 38)',
          foreground: 'rgb(255, 255, 255)',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['Source Sans 3', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
