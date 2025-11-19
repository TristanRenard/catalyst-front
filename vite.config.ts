import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
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
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
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