import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  optimizeDeps: {
    include: [
      'reactflow',
      '@reactflow/core',
      '@reactflow/background',
      '@reactflow/controls',
      '@reactflow/minimap',
      '@reactflow/node-toolbar',
      '@reactflow/node-resizer',
    ],
  },
})