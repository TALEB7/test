import type { Config } from 'tailwindcss';

// Token colour with Tailwind opacity support (bg-brand-500/15 etc.)
const c = (token: string) => `color-mix(in srgb, var(${token}) calc(<alpha-value> * 100%), transparent)`;

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: 'var(--gutter)',
      screens: {
        '2xl': '1320px', // = --container (media queries can't read CSS variables)
      },
    },
    extend: {
      // All values come from src/styles/tokens.css
      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
        serif: ['var(--font-accent)'],
        mono: ['var(--font-code)'],
        heading: ['var(--font-display)'],
        title: ['var(--font-display)'],
      },
      fontSize: {
        display: ['var(--text-display)', { lineHeight: '0.98', letterSpacing: 'var(--tracking-tight)' }],
        h1: ['var(--text-h1)', { lineHeight: '1.04', letterSpacing: 'var(--tracking-tight)' }],
        h2: ['var(--text-h2)', { lineHeight: '1.08', letterSpacing: 'var(--tracking-tight)' }],
        h3: ['var(--text-h3)', { lineHeight: '1.25', letterSpacing: 'var(--tracking-snug)' }],
        lead: ['var(--text-lead)', { lineHeight: '1.65' }],
      },
      maxWidth: {
        container: 'var(--container)',
        narrow: 'var(--container-narrow)',
      },
      spacing: {
        section: 'var(--space-section)',
        block: 'var(--space-block)',
        gutter: 'var(--gutter)',
        nav: 'var(--nav-height)',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Brand red scale (logo red = 500) and warm neutrals
        brand: {
          50: c('--red-50'), 100: c('--red-100'), 200: c('--red-200'), 300: c('--red-300'),
          400: c('--red-400'), 500: c('--red-500'), 600: c('--red-600'), 700: c('--red-700'),
          800: c('--red-800'), 900: c('--red-900'), 950: c('--red-950'),
          DEFAULT: c('--red-500'),
        },
        sand: {
          0: c('--sand-0'), 25: c('--sand-25'), 50: c('--sand-50'), 100: c('--sand-100'),
          200: c('--sand-200'), 300: c('--sand-300'), 400: c('--sand-400'), 500: c('--sand-500'),
          600: c('--sand-600'), 700: c('--sand-700'), 800: c('--sand-800'), 900: c('--sand-900'),
          950: c('--sand-950'),
        },
        success: { 50: c('--success-50'), DEFAULT: c('--success-600'), 600: c('--success-600') },
        warning: { 50: c('--warning-50'), DEFAULT: c('--warning-600'), 600: c('--warning-600') },
        info: { 50: c('--info-50'), DEFAULT: c('--info-600'), 600: c('--info-600') },
        violet: { 50: c('--violet-50'), DEFAULT: c('--violet-600'), 600: c('--violet-600') },
        line: { DEFAULT: c('--line'), strong: c('--line-strong') },
        // Legacy names (ygo-*, communium-*) kept for existing classes, mapped to tokens
        ygo: {
          navy: c('--sand-900'),
          'navy-light': c('--sand-800'),
          'navy-dark': c('--sand-950'),
          blue: c('--sand-900'),
          'blue-light': c('--sand-700'),
          gold: c('--red-500'),
          'gold-light': c('--red-400'),
          'gold-bright': c('--red-400'),
          'gold-dark': c('--red-700'),
          'gold-primary': c('--red-500'),
          silver: c('--sand-400'),
          'silver-light': c('--sand-300'),
          cream: c('--sand-25'),
          parchment: c('--sand-50'),
        },
        communium: {
          50: c('--red-50'), 100: c('--red-100'), 200: c('--red-200'), 300: c('--red-300'),
          400: c('--red-400'), 500: c('--red-500'), 600: c('--red-600'), 700: c('--red-700'),
          800: c('--red-800'), 900: c('--red-900'), 950: c('--red-950'),
        },
        morocco: {
          red: '#C1272D',
          green: '#006233',
          gold: '#FFD700',
        },
        gem: {
          ruby: c('--red-500'),
          emerald: c('--success-600'),
          sapphire: c('--info-600'),
          teal: c('--sand-500'),
          amethyst: c('--sand-600'),
        },
        fantasy: {
          parchment: c('--sand-50'),
          scroll: c('--sand-25'),
          ink: c('--sand-900'),
          bark: c('--sand-700'),
        },
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
        drawer: 'cubic-bezier(0.32, 0.72, 0, 1)',
        land: 'cubic-bezier(.34, 1.45, .64, 1)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'token-xs': 'var(--radius-xs)',
        'token-sm': 'var(--radius-sm)',
        'token-md': 'var(--radius-md)',
        'token-lg': 'var(--radius-lg)',
        'token-xl': 'var(--radius-xl)',
        'token-2xl': 'var(--radius-2xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        'token-xs': 'var(--shadow-xs)',
        'token-sm': 'var(--shadow-sm)',
        'token-md': 'var(--shadow-md)',
        'token-lg': 'var(--shadow-lg)',
        'token-xl': 'var(--shadow-xl)',
        red: 'var(--shadow-red)',
        'red-lg': 'var(--shadow-red-lg)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'card-reveal': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
        'accordion-up': 'accordion-up 0.18s cubic-bezier(0.23, 1, 0.32, 1)',
        'card-reveal': 'card-reveal 0.42s cubic-bezier(0.23, 1, 0.32, 1) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
