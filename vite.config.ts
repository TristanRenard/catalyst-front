import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    allowedHosts: ["*", "local.tristan-renard.com"],
    proxy: {
      '/api': {
        target: process.env.API_URL,
        changeOrigin: process.env.API_CHANGE_ORIGIN,
        secure: process.env.API_SECURE,
        ws: process.env.API_WS,
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
        target: process.env.WS_URL,
        changeOrigin: process.env.WS_CHANGE_ORIGIN,
        secure: process.env.WS_SECURE,
        ws: process.env.WS_WS,
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
})