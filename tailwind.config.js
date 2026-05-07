/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          depth: {
            dark: 'var(--color-depth-dark)',
            mid: 'var(--color-depth-mid)',
          },
          gray: {
            mid: 'var(--color-gray-mid)',
            light: 'var(--color-gray-light)',
          },
          silver: {
            DEFAULT: 'var(--color-silver)',
            light: 'var(--color-silver-light)',
          },
          text: {
            primary: 'var(--color-text-primary)',
            bright: 'var(--color-text-bright)',
          }
        }
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
}
