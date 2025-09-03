import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-funnel-display)', 'system-ui', 'sans-serif'], // Primary
        'funnel-display': ['var(--font-funnel-display)', 'system-ui', 'sans-serif'], // Primary
        'darker-grotesque': ['var(--font-darker-grotesque)', 'system-ui', 'sans-serif'], // Secondary
        'playfair': ['var(--font-playfair-display)', 'serif'], // Tertiary
      },
      colors: {
        lightBlueGray: '#f8f9fa',
        pastelBlueGray: '#b8c5d1',
        mutedBlueGray: '#6c757d',
        'brand-green': '#fbbf24',
        'copper-gold': '#C4A484',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config