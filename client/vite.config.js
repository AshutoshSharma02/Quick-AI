import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    // Dev proxy: used only during local development to forward `/api` calls
    // to the backend. Production builds use `import.meta.env.VITE_BASE_URL` directly.
    server: {
      proxy: {
        '/api': {
          // Fallback to localhost for convenience when VITE_BASE_URL is not set
          target: env.VITE_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  })
}
