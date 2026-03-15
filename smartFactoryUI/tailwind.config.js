/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'factory-bg':     '#0a0f1e',
        'factory-surface':'#0d1428',
        'factory-card':   '#111827',
        'factory-border': '#1e2d45',
        'factory-dark':   '#e2e8f0',
        'factory-muted':  '#64748b',
        'neon-cyan':      '#22d3ee',
        'neon-green':     '#10b981',
        'neon-amber':     '#f59e0b',
        'neon-red':       '#ef4444',
        'neon-purple':    '#a78bfa',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Exo 2"', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan':  '0 0 20px rgba(34,211,238,0.25)',
        'glow-green': '0 0 20px rgba(16,185,129,0.25)',
        'glow-red':   '0 0 20px rgba(239,68,68,0.35)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      keyframes: {
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%':      { opacity: 0.3 },
        },
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(239,68,68,0)' },
        },
      },
      animation: {
        scanline:   'scanline 8s linear infinite',
        blink:      'blink 1.2s ease-in-out infinite',
        'pulse-red':'pulse-red 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};