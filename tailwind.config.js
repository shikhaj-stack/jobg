/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif:  ['"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono:   ['"JetBrains Mono"', 'monospace'],
        hindi:  ['"Noto Sans Devanagari"', 'serif'],
      },
      colors: {
        classic: {
          950: '#0f172a',
          900: '#1e293b',
          850: '#334155',
          800: '#475569',
          700: '#64748b',
          600: '#94a3b8',
          500: '#cbd5e1',
          400: '#e2e8f0',
          300: '#f1f5f9',
          200: '#f8fafc',
          100: '#ffffff',
        },
        gold: {
          300: '#fde68a',
          400: '#fcd34d',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        copper: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        family: {
          primary:        '#1e40af',
          light:          '#3b82f6',
          accent:         '#f97316',
          'accent-light': '#fed7aa',
          bg:             '#f8fafc',
          surface:        '#1e293b',
          success:        '#22c55e',
          warning:        '#eab308',
          error:          '#ef4444',
          muted:          '#94a3b8',
        },
      },
      animation: {
        'pulse-warm':    'pulseWarm 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up':    'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'flicker-flame': 'flickerFlame 2.2s ease-in-out infinite',
        'mic-pulse':     'micPulse 1.5s ease-in-out infinite',
        'wave-bar':      'waveBar 0.8s ease-in-out infinite alternate',
        'spin-slow':     'spin 2s linear infinite',
      },
      keyframes: {
        pulseWarm: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(1.05)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        flickerFlame: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '25%':      { transform: 'scale(1.06) rotate(-2deg)' },
          '50%':      { transform: 'scale(0.97) rotate(1deg)' },
          '75%':      { transform: 'scale(1.03) rotate(-1deg)' },
        },
        micPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249,115,22,0.4)' },
          '50%':      { boxShadow: '0 0 0 16px rgba(249,115,22,0)' },
        },
        waveBar: {
          from: { transform: 'scaleY(0.3)' },
          to:   { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
};