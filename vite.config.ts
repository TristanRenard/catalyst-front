import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')

  console.log('🔧 [Vite Config] Loading environment variables:')
  console.log('  API_URL:', env.API_URL)
  console.log('  WS_URL:', env.WS_URL)

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      origin: "https://local.tristan-renard.com",
      allowedHosts: ["*", "local.tristan-renard.com"],
      proxy: {
        '/api': {
          target: env.API_URL,
          changeOrigin: env.API_CHANGE_ORIGIN === 'true',
          secure: env.API_SECURE === 'true',
          ws: env.API_WS === 'true',
          configure: (proxy) => {
            proxy.on('error', (err, req) => {
              console.log('❌ Proxy error:', err)
            })
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('🔄 Proxying:', req.method, req.url)
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('✅ Proxy response:', proxyRes.statusCode, req.url)
            })
          },
        },
        '/ws': {
          target: env.WS_URL,
          changeOrigin: env.WS_CHANGE_ORIGIN === 'true',
          secure: env.WS_SECURE === 'true',
          ws: env.WS_WS === 'true',
          configure: (proxy) => {
            proxy.on('error', (err, req) => {
              console.log('❌ WebSocket proxy error:', err)
            })
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('🔌 WebSocket proxying:', req.method, req.url)
            })
          },
        },
      },
    },
  }
})
