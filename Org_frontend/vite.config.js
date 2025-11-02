import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import daisyui from 'daisyui' // ✅ Use ESM import

export default defineConfig({
  base: '/', 
  plugins: [
    react(),
    tailwindcss({
      theme: {
        extend: {
          colors: {
            ice: {
              50: '#f0fdf4',
              100: '#dcfce7',
              200: '#bbf7d0',
              300: '#86efac',
              400: '#4ade80',
              500: '#22d3ee',
              600: '#06b6d4',
              700: '#0891b2',
              800: '#0e7490',
              900: '#164e63',
            },
          },
          animation: {
            blob: 'blob 7s infinite',
            float: 'float 3s ease-in-out infinite',
            'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'bounce-slow': 'bounce 2s infinite',
            glow: 'glow 2s ease-in-out infinite alternate',
          },
          keyframes: {
            blob: {
              '0%': { transform: 'translate(0px, 0px) scale(1)' },
              '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
              '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
              '100%': { transform: 'translate(0px, 0px) scale(1)' },
            },
            float: {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' },
            },
            glow: {
              '0%': {
                boxShadow:
                  '0 0 5px rgba(6, 182, 212, 0.2), 0 0 10px rgba(6, 182, 212, 0.2), 0 0 15px rgba(6, 182, 212, 0.2)',
              },
              '100%': {
                boxShadow:
                  '0 0 10px rgba(6, 182, 212, 0.4), 0 0 20px rgba(6, 182, 212, 0.4), 0 0 30px rgba(6, 182, 212, 0.4)',
              },
            },
          },
          backdropBlur: {
            xs: '2px',
          },
          backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'gradient-conic':
              'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            'ice-gradient':
              'linear-gradient(135deg, #0891b2 0%, #06b6d4 25%, #22d3ee 50%, #67e8f9 75%, #a5f3fc 100%)',
          },
          boxShadow: {
            glow: '0 0 20px rgba(6, 182, 212, 0.3)',
            'glow-lg': '0 0 40px rgba(6, 182, 212, 0.3)',
            ice: '0 4px 20px rgba(6, 182, 212, 0.15)',
            'ice-lg': '0 8px 40px rgba(6, 182, 212, 0.2)',
          },
        },
      },
      plugins: [daisyui], // ✅ fixed here
      daisyui: {
        themes: [
          {
            ice: {
              primary: '#06b6d4',
              secondary: '#22d3ee',
              accent: '#67e8f9',
              neutral: '#1f2937',
              'base-100': '#0f172a',
              info: '#0ea5e9',
              success: '#10b981',
              warning: '#f59e0b',
              error: '#ef4444',
            },
          },
        ],
      },
    }),
  ],
})
