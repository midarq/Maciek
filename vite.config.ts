import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    {
      name: 'local-contact-endpoint',
      configureServer(server) {
        server.middlewares.use('/kontakt/wyslij.php', (_req, res) => {
          res.statusCode = 501
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, fallback: true }))
        })
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    fs: {
      deny: ['**/archiwum/**', '**/.git/**', '**/.env*', '**/*.{crt,pem}', '**/.aws/**', '**/.codex/**', '**/.agents/**'],
    },
  },
  preview: { host: '127.0.0.1' },
  build: { target: 'es2022' },
})
