/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- NEURAL SAAS PALETTE ---
        'news-white':   '#FFFFFF',
        'news-silver':  '#C0C0C0',
        'news-pearl':   '#F8F9FA',
        'news-black':   '#121212',
        'news-charcoal':'#444444',
        'news-blue':    '#005689',
        'news-light':   '#F5F5F5',
        'news-border':  '#E0E0E0',
      },
      fontFamily: {
        // ── TOI-Style Editorial Fonts ──────────────────────────
        'garamond':    ['"EB Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        'merriweather': ['"Merriweather"', 'Georgia', 'serif'],
        'ptsans':      ['"PT Sans"', 'system-ui', 'sans-serif'],
        // ── Existing Design System ──────────────────────────────
        'playfair':    ['"Playfair Display"', 'Georgia', 'serif'],
        'lora':        ['"Lora"', 'Georgia', 'serif'],
        'inter':       ['"Inter"', 'system-ui', 'sans-serif'],
        'montserrat':  ['"Montserrat"', 'system-ui', 'sans-serif'],
        'jetbrains':   ['"JetBrains Mono"', 'monospace'],
        // ── Semantic Aliases (used across the site) ─────────────
        'sans':        ['"PT Sans"', 'system-ui', 'sans-serif'],
        'serif':       ['"Merriweather"', 'Georgia', 'serif'],
        'heading':     ['"EB Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        'nav':         ['"PT Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee':    'marquee 40s linear infinite',
        'float':      'float 6s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.33%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
